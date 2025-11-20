import { useState } from "react";
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

// Mock 订单数据 - 包含航班、酒店和门票
const mockOrders: Order[] = [
  {
    orderNo: "ORD202510230001",
    totalAmountOriginal: 2400.00,
    totalAmount: 2280.00,
    paymentStatus: "paid",
    status: "paid",
    paymentMethod: "alipay",
    createdAt: new Date(2024, 9, 23, 9, 25),
    paidAt: new Date(2024, 9, 23, 9, 30),
    items: [
      {
        type: "flight",
        flightNumber: "CA1831",
        airline: "中国国际航空",
        departureAirport: "PEK",
        departureCity: "北京",
        arrivalAirport: "CTU",
        arrivalCity: "成都",
        departureTime: new Date(2024, 10, 25, 8, 0),
        arrivalTime: new Date(2024, 10, 25, 10, 30),
        cabinClass: "economy",
        passengers: [
          {
            name: "李行健",
            idCard: "130104200404250000",
            seatNumber: "15C",
            checkInStatus: "checked",
          },
          {
            name: "张伟",
            idCard: "110101199001011234",
            seatNumber: "15D",
            checkInStatus: "checked",
          },
        ],
        originalPrice: 2400.00,
        paidPrice: 2280.00,
      },
    ],
  },
  {
    orderNo: "ORD202510230002",
    totalAmountOriginal: 4800.00,
    totalAmount: 4560.00,
    paymentStatus: "paid",
    status: "completed",
    paymentMethod: "wechat",
    createdAt: new Date(2024, 9, 23, 10, 10),
    paidAt: new Date(2024, 9, 23, 10, 15),
    items: [
      {
        type: "hotel",
        hotelName: "上海外滩华尔道夫酒店",
        address: "上海市黄浦区中山东一路2号",
        city: "上海",
        checkInDate: new Date(2024, 10, 1),
        checkOutDate: new Date(2024, 10, 4),
        nights: 3,
        roomType: "豪华江景套房",
        guests: [
          {
            name: "李娜",
            idCard: "110101198505152345",
            checkInStatus: "not_checked",
          },
          {
            name: "王芳",
            idCard: "110101199212123456",
            checkInStatus: "not_checked",
          },
        ],
        originalPrice: 4800.00,
        paidPrice: 4560.00,
      },
    ],
  },
  {
    orderNo: "ORD202510230003",
    totalAmountOriginal: 890.00,
    totalAmount: 890.00,
    paymentStatus: "unpaid",
    status: "pending",
    paymentMethod: "unionpay",
    createdAt: new Date(2024, 9, 23, 10, 50),
    expiredAt: new Date(2024, 9, 23, 11, 20),
    items: [
      {
        type: "ticket",
        attractionName: "上海迪士尼乐园",
        address: "上海市浦东新区川沙镇黄赵路310号",
        city: "上海",
        visitDate: new Date(2024, 10, 15),
        ticketType: "一日通票",
        quantity: 2,
        visitors: [
          {
            name: "刘强",
            idCard: "110101198811114567",
            checkInStatus: "not_checked",
          },
          {
            name: "刘小雨",
            idCard: "110101201508201234",
            checkInStatus: "not_checked",
          },
        ],
        originalPrice: 890.00,
        paidPrice: 890.00,
      },
    ],
  },
  {
    orderNo: "ORD202510220001",
    totalAmountOriginal: 6200.00,
    totalAmount: 6200.00,
    paymentStatus: "paid",
    status: "completed",
    paymentMethod: "offline",
    createdAt: new Date(2024, 9, 22, 16, 30),
    paidAt: new Date(2024, 9, 22, 16, 40),
    items: [
      {
        type: "flight",
        flightNumber: "CA1298",
        airline: "中国国际航空",
        departureAirport: "URC",
        departureCity: "乌鲁木齐",
        arrivalAirport: "PEK",
        arrivalCity: "北京",
        departureTime: new Date(2024, 9, 26, 10, 0),
        arrivalTime: new Date(2024, 9, 26, 14, 30),
        cabinClass: "business",
        passengers: [
          {
            name: "陈国强",
            idCard: "110101198003035678",
            seatNumber: "3C",
            checkInStatus: "checked",
          },
          {
            name: "张丽",
            idCard: "110101199210108888",
            seatNumber: "3D",
            checkInStatus: "checked",
          },
        ],
        originalPrice: 6200.00,
        paidPrice: 6200.00,
      },
    ],
  },
  {
    orderNo: "ORD202510230005",
    totalAmountOriginal: 2100.00,
    totalAmount: 2100.00,
    paymentStatus: "failed",
    status: "cancelled",
    paymentMethod: "credit_card",
    createdAt: new Date(2024, 9, 23, 11, 30),
    expiredAt: new Date(2024, 9, 23, 12, 0),
    items: [
      {
        type: "flight",
        flightNumber: "MU5302",
        airline: "中国东方航空",
        departureAirport: "PVG",
        departureCity: "上海",
        arrivalAirport: "CAN",
        arrivalCity: "广州",
        departureTime: new Date(2024, 10, 5, 14, 20),
        arrivalTime: new Date(2024, 10, 5, 16, 40),
        cabinClass: "economy",
        passengers: [
          {
            name: "李行健",
            idCard: "130104200404250000",
            checkInStatus: "not_checked",
          },
        ],
        originalPrice: 2100.00,
        paidPrice: 2100.00,
      },
    ],
  },
  {
    orderNo: "ORD202510220002",
    totalAmountOriginal: 3200.00,
    totalAmount: 2880.00,
    paymentStatus: "paid",
    status: "completed",
    paymentMethod: "wechat",
    createdAt: new Date(2024, 9, 20, 14, 20),
    paidAt: new Date(2024, 9, 20, 14, 25),
    items: [
      {
        type: "hotel",
        hotelName: "成都天府丽思卡尔顿酒店",
        address: "成都市武侯区天府大道中段1366号",
        city: "成都",
        checkInDate: new Date(2024, 9, 28),
        checkOutDate: new Date(2024, 9, 30),
        nights: 2,
        roomType: "行政客房",
        guests: [
          {
            name: "张伟",
            idCard: "110101199001011234",
            checkInStatus: "not_checked",
          },
        ],
        originalPrice: 3200.00,
        paidPrice: 2880.00,
      },
    ],
  },
  {
    orderNo: "ORD202510190001",
    totalAmountOriginal: 1560.00,
    totalAmount: 1560.00,
    paymentStatus: "paid",
    status: "completed",
    paymentMethod: "alipay",
    createdAt: new Date(2024, 9, 18, 9, 10),
    paidAt: new Date(2024, 9, 18, 9, 15),
    items: [
      {
        type: "ticket",
        attractionName: "故宫博物院",
        address: "北京市东城区景山前街4号",
        city: "北京",
        visitDate: new Date(2024, 9, 25),
        ticketType: "成人票",
        quantity: 4,
        visitors: [
          {
            name: "陈国强",
            idCard: "110101198003035678",
            checkInStatus: "not_checked",
          },
          {
            name: "张丽",
            idCard: "110101199210108888",
            checkInStatus: "not_checked",
          },
          {
            name: "李行健",
            idCard: "130104200404250000",
            checkInStatus: "not_checked",
          },
          {
            name: "张伟",
            idCard: "110101199001011234",
            checkInStatus: "not_checked",
          },
        ],
        originalPrice: 1560.00,
        paidPrice: 1560.00,
      },
    ],
  },
  {
    orderNo: "ORD202510180001",
    totalAmountOriginal: 5400.00,
    totalAmount: 5400.00,
    paymentStatus: "paid",
    status: "paid",
    paymentMethod: "credit_card",
    createdAt: new Date(2024, 9, 15, 16, 30),
    paidAt: new Date(2024, 9, 15, 16, 35),
    items: [
      {
        type: "hotel",
        hotelName: "杭州西湖国宾馆",
        address: "杭州市西湖区杨公堤18号",
        city: "杭州",
        checkInDate: new Date(2024, 10, 10),
        checkOutDate: new Date(2024, 10, 13),
        nights: 3,
        roomType: "园景套房",
        guests: [
          {
            name: "李娜",
            idCard: "110101198505152345",
            checkInStatus: "not_checked",
          },
        ],
        originalPrice: 5400.00,
        paidPrice: 5400.00,
      },
    ],
  },
];

const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"time" | "amount">("time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [typeFilter, setTypeFilter] = useState<"all" | "flight" | "hotel" | "ticket">("all");

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const filterOrders = (status: string) => {
    let filtered = mockOrders;
    
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

  const stats = {
    total: mockOrders.length,
    unpaid: mockOrders.filter(o => o.paymentStatus === "unpaid").length,
    paid: mockOrders.filter(o => o.paymentStatus === "paid").length,
    completed: mockOrders.filter(o => o.status === "completed").length,
    cancelled: mockOrders.filter(o => o.status === "cancelled" || o.paymentStatus === "failed").length,
    totalAmount: mockOrders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.totalAmount, 0),
  };

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
