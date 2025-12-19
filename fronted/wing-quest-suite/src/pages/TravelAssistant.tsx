import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Bot,
  User,
  Send,
  Plane,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Hotel,
  Compass,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { postAIChat, type AIChatResponse, streamAIChat, type AISuggestion, getOrders, type BackendOrder } from "@/lib/api";
import ChatToolsPanel from "@/components/ChatToolsPanel";
import ConversationList from "@/components/ConversationList";
import { listConversations, createConversation, saveMessages, renameConversation, deleteConversation, togglePin, type Conversation as SavedConversation } from "@/lib/chatStore";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  {
    icon: Plane,
    text: "帮我规划一次北京到成都的旅行",
    category: "规划"
  },
  {
    icon: DollarSign,
    text: "查找最便宜的机票价格",
    category: "价格"
  },
  {
    icon: Hotel,
    text: "推荐适合家庭的酒店",
    category: "住宿"
  },
  {
    icon: MapPin,
    text: "杭州有什么好玩的景点？",
    category: "景点"
  },
  {
    icon: Calendar,
    text: "什么时候去三亚最合适？",
    category: "时间"
  },
  {
    icon: Compass,
    text: "帮我制定3天2夜的旅游攻略",
    category: "攻略"
  },
];

const TravelAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [lastResponse, setLastResponse] = useState<AIChatResponse | null>(null);
  const [pendingSuggestion, setPendingSuggestion] = useState<AISuggestion | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [gridColsStyle, setGridColsStyle] = useState<React.CSSProperties>({ gridTemplateColumns: "20% 1fr 20%" });

  useEffect(() => {
    const list = listConversations();
    if (list.length === 0) {
      const conv = createConversation("新的对话");
      setConversations([conv]);
      setActiveConversationId(conv.id);
      setMessages([]);
    } else {
      setConversations(list);
      setActiveConversationId(list[0].id);
      const m = (list[0].messages || []).map((x) => ({ id: x.id, role: x.role, content: x.content, timestamp: new Date(x.timestamp) }));
      setMessages(m);
    }
  }, []);

  useEffect(() => {
    const style = leftCollapsed && rightCollapsed
      ? { gridTemplateColumns: "1fr" }
      : leftCollapsed && !rightCollapsed
        ? { gridTemplateColumns: "1fr 20%" }
        : !leftCollapsed && rightCollapsed
          ? { gridTemplateColumns: "20% 1fr" }
          : { gridTemplateColumns: "20% 1fr 20%" };
    setGridColsStyle(style);
  }, [leftCollapsed, rightCollapsed]);

  const getConfirmText = (s: AISuggestion | null) => {
    if (!s?.route) return s?.label || "确认执行该操作";
    if (s.route === "/payment") return "确认支付此订单？";
    if (s.route === "/cancel-order") return "确认取消此订单？";
    if (s.route === "/check-in") return "确认进行在线值机？";
    return s.label || "确认执行该操作";
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
      if (viewport) {
        const nearBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 40;
        if (nearBottom) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token") || "";
      const aiId = (Date.now() + 1).toString();
      const aiMsg: Message = { id: aiId, role: "assistant", content: "", timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      let acc = "";
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      // If user requests by order number, try a quick lookup and inject details
      const ordMatch = messageText.match(/\bORD\d{8,}\b/i);
      if (ordMatch && token) {
        try {
          const orders: BackendOrder[] = await getOrders(token, { limit: 100 });
          const found = orders.find(o => o.order_no.toLowerCase() === ordMatch![0].toLowerCase());
          if (found) {
            const first = found.items[0];
            const dep = first?.flight?.route?.departure_airport;
            const arr = first?.flight?.route?.arrival_airport;
            const flightInfo = dep && arr ? `${dep.city} ${dep.airport_code} → ${arr.city} ${arr.airport_code}` : "待确认";
            const msg = `订单 ${found.order_no} 状态：${found.status}/${found.payment_status}\n金额：¥${Number(found.total_amount).toFixed(2)}\n航班：${first?.flight?.flight_number || "待确认"}（${flightInfo}）\n乘机人：${first?.passenger?.name || "-"}`;
            setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, content: msg } : m)));
            setLastResponse({ reply: msg, suggestions: [{ label: "查看订单详情", route: "/my-orders" }], orders: [{ order_id: found.order_id, order_no: found.order_no, status: found.status, payment_status: found.payment_status, total: Number(found.total_amount) }] });
          }
        } catch { /* ignore */ }
      }
      await streamAIChat(
        { message: messageText },
        token,
        {
          onDelta: (t) => {
            acc += t;
            setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, content: m.content + t } : m)));
          },
          onFinal: (data) => {
            setLastResponse({ reply: acc, suggestions: data.suggestions, orders: data.orders });
          },
          onEvent: (evt) => {
            if (evt.type === "tool_plan") {
              const planText = `正在分析并准备调用工具...`;
              setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, content: (m.content || "") } : m)));
            } else if (evt.type === "tool_result") {
              // Optionally surface a brief note when tool returns
              const note = evt.data?.tool === "get_order_by_no" && evt.data?.orders?.length ? `\n已获取订单信息。` : evt.data?.tool === "get_my_orders" ? `\n已汇总个人订单信息。` : undefined;
              if (note) {
                setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, content: (m.content || "") + note } : m)));
              }
            }
          },
        },
        controller.signal
      );
      clearTimeout(timeout);
    } catch (e: unknown) {
      try {
        const token = localStorage.getItem("access_token") || "";
        const resp: AIChatResponse = await postAIChat({ message: messageText }, token);
        const suggestionsText = resp.suggestions?.length
          ? `\n可执行操作：${resp.suggestions.map(s => s.label).join("，")}`
          : "";
        const ordersText = resp.orders?.length
          ? `\n最近订单：${resp.orders.map(o => `${o.order_no}(${o.status}/${o.payment_status}) 金额¥${o.total}`).join("；")}`
          : "";
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `${resp.reply}${suggestionsText}${ordersText}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setLastResponse(resp);
      } catch {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `我已经收到您的请求："${messageText}"。这是一个模拟回复（网关不可用时）。未来这里会接入真实的AI助手。`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setLastResponse(null);
      }
    } finally {
      setIsLoading(false);
      if (activeConversationId) {
        const toSave = messages.concat();
        const last = toSave[toSave.length - 1];
        const saved = toSave.map((m) => ({ id: m.id, role: m.role, content: m.content, timestamp: m.timestamp.toISOString() }));
        saveMessages(activeConversationId, saved);
        setConversations(listConversations());
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleSuggestionClick = (s: AISuggestion) => {
    const writeOps = ["/payment", "/cancel-order", "/check-in"];
    const token = localStorage.getItem("access_token") || "";
    const needsLogin = !token && (s.route ? writeOps.includes(s.route) : false);
    if (needsLogin) {
      toast("请先登录以执行该操作");
      navigate("/auth");
      return;
    }
    if (s.route && writeOps.includes(s.route)) {
      setPendingSuggestion(s);
      setConfirmOpen(true);
      return;
    }
    if (s.route) {
      navigate(s.route, { state: s.params ? s.params : undefined });
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const conv = conversations.find((c) => c.id === id);
    const m = (conv?.messages || []).map((x) => ({ id: x.id, role: x.role, content: x.content, timestamp: new Date(x.timestamp) }));
    setMessages(m);
  };
  const handleNewConversation = () => {
    const conv = createConversation("新的对话");
    setConversations(listConversations());
    setActiveConversationId(conv.id);
    setMessages([]);
  };
  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    const list = listConversations();
    setConversations(list);
    const next = list[0];
    setActiveConversationId(next ? next.id : null);
    setMessages(next ? (next.messages || []).map((x) => ({ id: x.id, role: x.role, content: x.content, timestamp: new Date(x.timestamp) })) : []);
  };
  const handleRenameConversation = (id: string) => {
    const title = window.prompt("重命名对话", "未命名对话");
    if (!title) return;
    renameConversation(id, title);
    setConversations(listConversations());
  };
  const handlePinToggle = (id: string) => {
    togglePin(id);
    setConversations(listConversations());
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">智能旅行助手</h1>
        </div>
        <button
          className="w-9 h-9 rounded-md border hover:bg-muted flex items-center justify-center"
          onClick={() => navigate(-1)}
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid gap-4 h-[calc(100vh-8rem)]" style={gridColsStyle}>
          <div className={leftCollapsed ? "hidden" : "min-h-0"}>
            <ConversationList
              conversations={conversations}
              activeId={activeConversationId}
              onSelect={handleSelectConversation}
              onNew={handleNewConversation}
              onDelete={handleDeleteConversation}
              onRename={handleRenameConversation}
              onPinToggle={handlePinToggle}
              collapsed={leftCollapsed}
              onToggle={() => setLeftCollapsed(!leftCollapsed)}
            />
          </div>
          <div className="flex flex-col min-h-0">

            <Card className="flex-1 flex flex-col overflow-visible border-0 shadow-lg bg-card/90 backdrop-blur min-h-0">
              <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-6 min-h-0" ref={scrollAreaRef}>
                  {messages.length === 0 ? (
                    /* Welcome Screen */
                    <div className="h-full flex flex-col items-center justify-center space-y-8">
                      <div className="text-center space-y-3">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Sparkles className="h-10 w-10 text-primary drop-shadow" />
                        </div>
                        <h2 className="text-2xl font-bold">您好！我是您的旅行助手</h2>
                        <p className="text-muted-foreground max-w-md">
                          我可以帮您规划行程、查找航班、推荐景点、预订酒店等。请告诉我您的需求，让我们开始您的旅程吧！
                        </p>
                      </div>

                      {/* Suggested Questions */}
                      <div className="w-full max-w-2xl">
                        <div className="text-sm font-medium text-muted-foreground mb-3 text-center">
                          试试问我这些问题
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {suggestedQuestions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestedQuestion(question.text)}
                              className="w-full flex items-start gap-3 p-4 rounded-xl border border-border bg-card/80 hover:bg-accent/10 hover:border-primary/50 transition-all text-left group shadow-sm"
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                                <question.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-muted-foreground mb-1">{question.category}</div>
                                <div className="text-sm font-medium">{question.text}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Message List */
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                            }`}
                        >
                          {/* Avatar */}
                          <Avatar className={`w-10 h-10 flex-shrink-0 ${message.role === "assistant"
                            ? "bg-gradient-to-br from-primary to-accent"
                            : "bg-muted"
                            }`}>
                            <AvatarFallback>
                              {message.role === "assistant" ? (
                                <Bot className="h-5 w-5 text-primary-foreground" />
                              ) : (
                                <User className="h-5 w-5" />
                              )}
                            </AvatarFallback>
                          </Avatar>

                          {/* Message Content */}
                          <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"
                            }`}>
                            <div className={`rounded-2xl px-4 py-3 ${message.role === "user"
                              ? "bg-primary text-primary-foreground ml-auto shadow-md"
                              : "bg-muted/80 backdrop-blur border border-border shadow-sm"
                              }`}>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <div className={`text-xs text-muted-foreground mt-1 px-2 ${message.role === "user" ? "text-right" : "text-left"
                              }`}>
                              {message.timestamp.toLocaleTimeString("zh-CN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Loading Indicator */}
                      {isLoading && (
                        <div className="flex gap-3">
                          <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent">
                            <AvatarFallback>
                              <Bot className="h-5 w-5 text-primary-foreground" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted/80 backdrop-blur rounded-2xl px-4 py-3 shadow-sm">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {lastResponse?.suggestions?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {lastResponse.suggestions.map((s, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(s)}
                              className="w-full flex items-start gap-3 p-4 rounded-xl border border-border bg-card/80 hover:bg-accent/10 hover:border-primary/50 transition-all text-left group shadow-sm"
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                <Sparkles className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium">{s.label}</div>
                                {s.params?.orderId && (
                                  <div className="text-xs text-muted-foreground">订单ID: {String(s.params.orderId)}</div>
                                )}
                                {typeof s.params === 'object' && s.params && 'orderData' in s.params && (s.params as { orderData?: { orderId?: number } }).orderData?.orderId && (
                                  <div className="text-xs text-muted-foreground">订单ID: {String((s.params as { orderData?: { orderId?: number } }).orderData?.orderId)}</div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : null}

                      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>请确认操作</AlertDialogTitle>
                            <AlertDialogDescription>
                              {getConfirmText(pendingSuggestion)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setConfirmOpen(false);
                                if (pendingSuggestion?.route) {
                                  navigate(pendingSuggestion.route, { state: pendingSuggestion.params ? pendingSuggestion.params : undefined });
                                }
                                setPendingSuggestion(null);
                              }}
                            >
                              确认
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Recent Orders */}
                      {lastResponse?.orders?.length ? (
                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-medium">最近订单</div>
                          {lastResponse.orders.map((o) => (
                            <div key={o.order_id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <div className="font-mono text-xs">{o.order_no}</div>
                                <div className="text-xs text-muted-foreground">{o.status}/{o.payment_status}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate('/my-orders')}>查看</Button>
                                <Button variant="outline" size="sm" onClick={() => navigate('/check-in', { state: { orderId: o.order_id } })}>值机</Button>
                                <Button size="sm" onClick={() => navigate('/payment', { state: { orderData: { orderId: o.order_id, orderNo: o.order_no, total: o.total } } })}>支付</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="sticky bottom-0 border-t p-4 bg-card/95 backdrop-blur z-10">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入您的问题或需求..."
                      disabled={isLoading}
                      className="flex-1 rounded-xl"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isLoading}
                      size="icon"
                      className="flex-shrink-0 rounded-xl"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    按 Enter 发送消息，Shift + Enter 换行
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className={rightCollapsed ? "hidden" : "min-h-0"}>
            <ChatToolsPanel collapsed={rightCollapsed} onToggle={() => setRightCollapsed(!rightCollapsed)} />
          </div>
        </div>
      </main>

    </div>
  );
};

export default TravelAssistant;
