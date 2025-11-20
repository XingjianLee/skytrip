import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plane, Hotel, Ticket, Calendar, MapPin, AlertCircle, CheckCircle2, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Fake 数据 - 机票订单
const flightOrders = [
  {
    id: "F001",
    type: "flight" as const,
    orderNumber: "FL20251101001",
    flightNumber: "CA1234",
    airline: "中国国际航空",
    departure: { city: "北京", airport: "首都国际机场", time: "2025-11-15 14:30" },
    arrival: { city: "上海", airport: "浦东国际机场", time: "2025-11-15 17:15" },
    passenger: "张三",
    cabinClass: "business" as "first" | "business" | "economy",
    ticketPrice: 1580,
    status: "confirmed" as const,
  },
  {
    id: "F002",
    type: "flight" as const,
    orderNumber: "FL20251105002",
    flightNumber: "MU5678",
    airline: "中国东方航空",
    departure: { city: "上海", airport: "虹桥机场", time: "2025-12-20 09:00" },
    arrival: { city: "广州", airport: "白云国际机场", time: "2025-12-20 11:45" },
    passenger: "李四",
    cabinClass: "economy" as "first" | "business" | "economy",
    ticketPrice: 680,
    status: "confirmed" as const,
  },
];

// Fake 数据 - 酒店订单
const hotelOrders = [
  {
    id: "H001",
    type: "hotel" as const,
    orderNumber: "HT20251101001",
    hotelName: "上海外滩W酒店",
    location: "上海市黄浦区",
    checkIn: "2025-11-16",
    checkOut: "2025-11-18",
    nights: 2,
    roomType: "豪华海景房",
    guests: 2,
    totalPrice: 2800,
    status: "confirmed" as const,
  },
  {
    id: "H002",
    type: "hotel" as const,
    orderNumber: "HT20251105002",
    hotelName: "广州长隆酒店",
    location: "广州市番禺区",
    checkIn: "2025-12-21",
    checkOut: "2025-12-23",
    nights: 2,
    roomType: "主题家庭房",
    guests: 3,
    totalPrice: 1680,
    status: "confirmed" as const,
  },
];

// Fake 数据 - 景点门票订单
const ticketOrders = [
  {
    id: "T001",
    type: "ticket" as const,
    orderNumber: "TK20251101001",
    attraction: "上海迪士尼乐园",
    location: "上海市浦东新区",
    visitDate: "2025-11-17",
    ticketType: "成人票",
    quantity: 2,
    unitPrice: 599,
    totalPrice: 1198,
    status: "confirmed" as const,
  },
  {
    id: "T002",
    type: "ticket" as const,
    orderNumber: "TK20251105002",
    attraction: "广州长隆野生动物世界",
    location: "广州市番禺区",
    visitDate: "2025-12-22",
    ticketType: "家庭套票",
    quantity: 1,
    unitPrice: 980,
    totalPrice: 980,
    status: "confirmed" as const,
  },
];

// 计算改签手续费
const calculateChangeFee = (departureTime: string, ticketPrice: number, cabinClass: string) => {
  const now = new Date();
  const departure = new Date(departureTime);
  const hoursUntilDeparture = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);
  const daysUntilDeparture = hoursUntilDeparture / 24;

  let feePercentage = 0;
  let timeCategory = "";

  if (daysUntilDeparture > 7) {
    // 7天以上：5%-30%
    feePercentage = cabinClass === "first" ? 5 : cabinClass === "business" ? 15 : 30;
    timeCategory = "起飞前7天以上";
  } else if (hoursUntilDeparture >= 48 && daysUntilDeparture <= 7) {
    // 48小时-7天：5%-40%
    feePercentage = cabinClass === "first" ? 5 : cabinClass === "business" ? 20 : 40;
    timeCategory = "起飞前48小时-7天";
  } else if (hoursUntilDeparture < 48) {
    // 48小时内：50%-70%
    feePercentage = cabinClass === "first" ? 50 : cabinClass === "business" ? 60 : 70;
    timeCategory = "起飞前48小时内";
  }

  const fee = Math.round(ticketPrice * (feePercentage / 100));
  return { fee, feePercentage, timeCategory };
};

// 计算酒店退改手续费
const calculateHotelCancelFee = (checkInDate: string, totalPrice: number) => {
  const now = new Date();
  const checkIn = new Date(checkInDate);
  const daysUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  let feePercentage = 0;
  let timeCategory = "";

  if (daysUntilCheckIn > 7) {
    feePercentage = 10;
    timeCategory = "入住前7天以上";
  } else if (daysUntilCheckIn >= 3) {
    feePercentage = 30;
    timeCategory = "入住前3-7天";
  } else if (daysUntilCheckIn >= 1) {
    feePercentage = 50;
    timeCategory = "入住前1-3天";
  } else {
    feePercentage = 100;
    timeCategory = "入住前24小时内";
  }

  const fee = Math.round(totalPrice * (feePercentage / 100));
  return { fee, feePercentage, timeCategory };
};

// 计算景点门票退改手续费
const calculateTicketCancelFee = (visitDate: string, totalPrice: number) => {
  const now = new Date();
  const visit = new Date(visitDate);
  const daysUntilVisit = (visit.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  let feePercentage = 0;
  let timeCategory = "";

  if (daysUntilVisit > 3) {
    feePercentage = 5;
    timeCategory = "游玩前3天以上";
  } else if (daysUntilVisit >= 1) {
    feePercentage = 20;
    timeCategory = "游玩前1-3天";
  } else {
    feePercentage = 50;
    timeCategory = "游玩前24小时内";
  }

  const fee = Math.round(totalPrice * (feePercentage / 100));
  return { fee, feePercentage, timeCategory };
};

const RefundChange = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [actionType, setActionType] = useState<"refund" | "change">("refund");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = (order: any, action: "refund" | "change") => {
    setSelectedOrder(order);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedOrder) return;

    const actionText = actionType === "refund" ? "退票" : "改签";
    toast.success(`${actionText}申请已提交，我们会尽快处理`);
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const cabinClassNames = {
    first: "头等舱",
    business: "商务舱",
    economy: "经济舱",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">退改签服务</h1>
            <p className="text-muted-foreground">管理您的机票、酒店、景点门票订单</p>
          </div>

          {/* 提示信息 */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">退改签政策说明：</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 机票：根据改签时间和舱位等级，手续费在5%-70%之间</li>
                    <li>• 酒店：根据入住时间，手续费在10%-100%之间</li>
                    <li>• 景点门票：根据游玩时间，手续费在5%-50%之间</li>
                    <li>• 舱位等级越高，机票改签手续费越低</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flights" className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                机票订单
              </TabsTrigger>
              <TabsTrigger value="hotels" className="flex items-center gap-2">
                <Hotel className="h-4 w-4" />
                酒店订单
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                景点门票
              </TabsTrigger>
            </TabsList>

            {/* 机票订单 */}
            <TabsContent value="flights" className="space-y-4">
              {flightOrders.map((order) => {
                const { fee, feePercentage, timeCategory } = calculateChangeFee(
                  order.departure.time,
                  order.ticketPrice,
                  order.cabinClass
                );

                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <Plane className="h-5 w-5" />
                            {order.airline} {order.flightNumber}
                          </CardTitle>
                          <CardDescription>订单号：{order.orderNumber}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          已确认
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 航班信息 */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">{order.departure.city}</div>
                          <div className="text-sm text-muted-foreground">{order.departure.airport}</div>
                          <div className="text-sm font-medium">{order.departure.time}</div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <Plane className="h-5 w-5 text-primary" />
                          <div className="text-xs text-muted-foreground">直飞</div>
                        </div>

                        <div className="space-y-1 text-right">
                          <div className="text-2xl font-bold">{order.arrival.city}</div>
                          <div className="text-sm text-muted-foreground">{order.arrival.airport}</div>
                          <div className="text-sm font-medium">{order.arrival.time}</div>
                        </div>
                      </div>

                      {/* 乘客和舱位信息 */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">乘客：</span>
                            <span className="font-medium">{order.passenger}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">舱位：</span>
                            <Badge variant="outline">{cabinClassNames[order.cabinClass]}</Badge>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-2xl font-bold text-primary">¥{order.ticketPrice}</div>
                          <div className="text-xs text-muted-foreground">票价</div>
                        </div>
                      </div>

                      {/* 改签费用信息 */}
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          改签手续费参考
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">当前时间段：</span>
                            <span className="font-medium ml-1">{timeCategory}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">手续费比例：</span>
                            <span className="font-medium ml-1 text-orange-500">{feePercentage}%</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">预估手续费：</span>
                            <span className="font-bold ml-1 text-orange-500">¥{fee}</span>
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleOpenDialog(order, "refund")}
                        >
                          申请退票
                        </Button>
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => handleOpenDialog(order, "change")}
                        >
                          申请改签
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            {/* 酒店订单 */}
            <TabsContent value="hotels" className="space-y-4">
              {hotelOrders.map((order) => {
                const { fee, feePercentage, timeCategory } = calculateHotelCancelFee(
                  order.checkIn,
                  order.totalPrice
                );

                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <Hotel className="h-5 w-5" />
                            {order.hotelName}
                          </CardTitle>
                          <CardDescription>订单号：{order.orderNumber}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          已确认
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{order.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {order.checkIn} 至 {order.checkOut} ({order.nights}晚)
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="text-muted-foreground">房型：</span>
                              <span className="font-medium">{order.roomType}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">入住人数：</span>
                              <span className="font-medium">{order.guests}人</span>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-2xl font-bold text-primary">¥{order.totalPrice}</div>
                            <div className="text-xs text-muted-foreground">总价</div>
                          </div>
                        </div>
                      </div>

                      {/* 取消费用信息 */}
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          取消手续费参考
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">当前时间段：</span>
                            <span className="font-medium ml-1">{timeCategory}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">手续费比例：</span>
                            <span className="font-medium ml-1 text-orange-500">{feePercentage}%</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">预估手续费：</span>
                            <span className="font-bold ml-1 text-orange-500">¥{fee}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleOpenDialog(order, "refund")}
                        >
                          申请取消
                        </Button>
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => handleOpenDialog(order, "change")}
                        >
                          修改订单
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            {/* 景点门票订单 */}
            <TabsContent value="tickets" className="space-y-4">
              {ticketOrders.map((order) => {
                const { fee, feePercentage, timeCategory } = calculateTicketCancelFee(
                  order.visitDate,
                  order.totalPrice
                );

                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <Ticket className="h-5 w-5" />
                            {order.attraction}
                          </CardTitle>
                          <CardDescription>订单号：{order.orderNumber}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          已确认
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{order.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>游玩日期：{order.visitDate}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="text-muted-foreground">门票类型：</span>
                              <span className="font-medium">{order.ticketType}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">数量：</span>
                              <span className="font-medium">{order.quantity}张</span>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-2xl font-bold text-primary">¥{order.totalPrice}</div>
                            <div className="text-xs text-muted-foreground">总价</div>
                          </div>
                        </div>
                      </div>

                      {/* 退票费用信息 */}
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          退票手续费参考
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">当前时间段：</span>
                            <span className="font-medium ml-1">{timeCategory}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">手续费比例：</span>
                            <span className="font-medium ml-1 text-orange-500">{feePercentage}%</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">预估手续费：</span>
                            <span className="font-bold ml-1 text-orange-500">¥{fee}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleOpenDialog(order, "refund")}
                        >
                          申请退票
                        </Button>
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => handleOpenDialog(order, "change")}
                        >
                          修改日期
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* 确认对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "refund" ? "确认退订" : "确认改签"}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">订单号：</span>
                  <span className="font-medium">{selectedOrder.orderNumber}</span>
                </div>
                {selectedOrder.type === "flight" && (
                  <>
                    <div className="text-sm">
                      <span className="text-muted-foreground">航班：</span>
                      <span className="font-medium">
                        {selectedOrder.flightNumber} {selectedOrder.departure.city} - {selectedOrder.arrival.city}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">预估手续费：</span>
                      <span className="font-bold text-orange-500">
                        ¥
                        {
                          calculateChangeFee(
                            selectedOrder.departure.time,
                            selectedOrder.ticketPrice,
                            selectedOrder.cabinClass
                          ).fee
                        }
                      </span>
                    </div>
                  </>
                )}
                {selectedOrder.type === "hotel" && (
                  <>
                    <div className="text-sm">
                      <span className="text-muted-foreground">酒店：</span>
                      <span className="font-medium">{selectedOrder.hotelName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">预估手续费：</span>
                      <span className="font-bold text-orange-500">
                        ¥
                        {
                          calculateHotelCancelFee(selectedOrder.checkIn, selectedOrder.totalPrice)
                            .fee
                        }
                      </span>
                    </div>
                  </>
                )}
                {selectedOrder.type === "ticket" && (
                  <>
                    <div className="text-sm">
                      <span className="text-muted-foreground">景点：</span>
                      <span className="font-medium">{selectedOrder.attraction}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">预估手续费：</span>
                      <span className="font-bold text-orange-500">
                        ¥
                        {
                          calculateTicketCancelFee(selectedOrder.visitDate, selectedOrder.totalPrice)
                            .fee
                        }
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  {actionType === "refund"
                    ? "确认后将提交退订申请，手续费将从退款中扣除，具体金额以实际处理为准。"
                    : "确认后将提交改签申请，我们会尽快为您处理，具体费用以实际处理为准。"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmAction}>
              确认{actionType === "refund" ? "退订" : "改签"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default RefundChange;
