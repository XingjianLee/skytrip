import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderCard, { Order } from "@/components/OrderCard";
import OrderDetailsDialog from "@/components/OrderDetailsDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt, Clock, CheckCircle2, XCircle, Wallet, ArrowUpDown, Plane, Hotel, Ticket } from "lucide-react";
import { getOrderStats, getOrders, type BackendOrder } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// 后端订单映射工具
const combineDateAndTime = (date: Date, time: string) => {
  const [hh = "0", mm = "0", ss = "0"] = time.split(":");
  const d = new Date(date);
  d.setHours(Number(hh));
  d.setMinutes(Number(mm));
  d.setSeconds(Number(ss));
  d.setMilliseconds(0);
  return d;
};

const mapBackendOrderToOrder = (o: BackendOrder): Order => {
  const createdAt = new Date(o.created_at);
  const paidAt = o.paid_at ? new Date(o.paid_at) : undefined;
  const expiredAt = o.expired_at ? new Date(o.expired_at) : undefined;
  const items: Order["items"] = o.items.map((it) => {
    const depAirport = it.flight?.route?.departure_airport;
    const arrAirport = it.flight?.route?.arrival_airport;
    return {
      type: "flight",
      flightNumber: it.flight?.flight_number || String(it.flight_id),
      airline: it.flight?.airline?.airline_name || "",
      departureAirport: depAirport?.airport_code || "",
      departureCity: depAirport?.city || "",
      arrivalAirport: arrAirport?.airport_code || "",
      arrivalCity: arrAirport?.city || "",
      departureTime: combineDateAndTime(createdAt, it.flight?.scheduled_departure_time || "00:00:00"),
      arrivalTime: combineDateAndTime(createdAt, it.flight?.scheduled_arrival_time || "00:00:00"),
      cabinClass: it.cabin_class,
      passengers: [
        {
          name: it.passenger?.name || "",
          idCard: it.passenger?.id_card || "",
          seatNumber: it.seat_number || undefined,
          checkInStatus: it.check_in_status,
        },
      ],
      originalPrice: it.original_price,
      paidPrice: it.paid_price,
    };
  });
  return {
    orderId: o.order_id,
    orderNo: o.order_no,
    totalAmountOriginal: o.total_amount_original,
    totalAmount: o.total_amount,
    paymentStatus: o.payment_status,
    status: o.status,
    paymentMethod: o.payment_method,
    createdAt,
    paidAt,
    expiredAt,
    items,
  };
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"time" | "amount">("time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [typeFilter, setTypeFilter] = useState<"all" | "flight" | "hotel" | "ticket">("all");

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const [orders, setOrders] = useState<Order[]>([]);

  const filterOrders = (status: string) => {
    let filtered = orders;

    // 按状态筛选
    if (status !== "all") {
      if (status === "unpaid") filtered = filtered.filter(o => o.paymentStatus === "unpaid");
      else if (status === "paid") filtered = filtered.filter(o => o.paymentStatus === "paid" && o.status === "paid");
      else if (status === "completed") filtered = filtered.filter(o => o.status === "completed");
      else if (status === "cancelled") filtered = filtered.filter(o => o.status === "cancelled" || o.paymentStatus === "failed");
    }

    // 按类型筛选
    if (typeFilter !== "all") {
      filtered = filtered.filter(o => o.items.some(item => item.type === typeFilter));
    }

    // 排序
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "time") {
        const timeA = a.createdAt.getTime();
        const timeB = b.createdAt.getTime();
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      } else {
        const amountA = a.totalAmount;
        const amountB = b.totalAmount;
        return sortOrder === "desc" ? amountB - amountA : amountA - amountB;
      }
    });

    return sorted;
  };

  const [stats, setStats] = useState({ total: 0, unpaid: 0, paid: 0, completed: 0, cancelled: 0, totalAmount: 0 });

  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    if (!token) {
      toast({ title: "登录已过期，请重新登录", variant: "destructive" });
      navigate("/auth");
      return;
    }
    (async () => {
      try {
        const s = await getOrderStats(token);
        setStats({
          total: s.total_orders,
          unpaid: s.unpaid_count,
          paid: s.paid_count,
          completed: s.completed_count,
          cancelled: s.cancelled_count,
          totalAmount: s.total_spent,
        });
        const list = await getOrders(token, { limit: 50 });
        setOrders(list.map(mapBackendOrderToOrder));
      } catch (e: any) {
        const msg = String(e?.message || "");
        if (msg.includes("401") || msg.includes("403")) {
          toast({ title: "登录已过期，请重新登录", description: msg, variant: "destructive" });
          navigate("/auth");
        } else if (msg.toLowerCase().includes("abort")) {
          // HMR/路由切换导致的中断，忽略
        } else {
          toast({ title: "加载订单失败", description: msg, variant: "destructive" });
        }
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} />

      <div className="flex-1 pt-20">
        {/* 顶部统计区域 */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">我的订单</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-8 h-8 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <p className="text-xs text-muted-foreground">全部订单</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold">{stats.unpaid}</div>
                      <p className="text-xs text-muted-foreground">待支付</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">{stats.paid}</div>
                      <p className="text-xs text-muted-foreground">已支付</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{stats.completed}</div>
                      <p className="text-xs text-muted-foreground">已完成</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-8 h-8 text-primary" />
                    <div>
                      <div className="text-xl font-bold">¥{stats.totalAmount}</div>
                      <p className="text-xs text-muted-foreground">累计消费</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 订单列表 */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <TabsList className="grid w-full max-w-2xl grid-cols-5">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="unpaid">待支付</TabsTrigger>
                <TabsTrigger value="paid">已支付</TabsTrigger>
                <TabsTrigger value="completed">已完成</TabsTrigger>
                <TabsTrigger value="cancelled">已取消</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                {/* 类型筛选 */}
                <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="订单类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="flight">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4" />
                        <span>机票</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hotel">
                      <div className="flex items-center gap-2">
                        <Hotel className="w-4 h-4" />
                        <span>酒店</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ticket">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4" />
                        <span>景点</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* 排序方式 */}
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">按时间</SelectItem>
                    <SelectItem value="amount">按金额</SelectItem>
                  </SelectContent>
                </Select>

                {/* 排序顺序 */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  title={sortOrder === "asc" ? "升序" : "降序"}
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {["all", "unpaid", "paid", "completed", "cancelled"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {filterOrders(tab).length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <XCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">暂无订单</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filterOrders(tab).map((order) => (
                      <OrderCard
                        key={order.orderNo}
                        order={order}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <Footer />

      <OrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default MyOrders;
