import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Compass
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
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

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `我已经收到您的请求："${messageText}"。这是一个模拟回复。未来这里会接入真实的AI助手，为您提供个性化的旅行建议、航班查询、酒店预订和行程规划等服务。`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Bot className="h-7 w-7 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">智能旅行助手</h1>
            </div>
            <p className="text-muted-foreground">让AI帮您规划完美的旅行体验</p>
          </div>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col overflow-hidden shadow-lg">
            <CardContent className="flex-1 p-0 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                {messages.length === 0 ? (
                  /* Welcome Screen */
                  <div className="h-full flex flex-col items-center justify-center space-y-8">
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-10 w-10 text-primary" />
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
                            className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/10 hover:border-primary/50 transition-all text-left group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
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
                        className={`flex gap-3 ${
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <Avatar className={`w-10 h-10 flex-shrink-0 ${
                          message.role === "assistant" 
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
                        <div className={`flex-1 max-w-[80%] ${
                          message.role === "user" ? "items-end" : "items-start"
                        }`}>
                          <div className={`rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted"
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className={`text-xs text-muted-foreground mt-1 px-2 ${
                            message.role === "user" ? "text-right" : "text-left"
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
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入您的问题或需求..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="flex-shrink-0"
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
      </main>

      <Footer />
    </div>
  );
};

export default TravelAssistant;