import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, User, CreditCard, MapPin, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export interface OrderPassenger {
  name: string;
  idCard: string;
  seatNumber?: string;
  checkInStatus: "not_checked" | "checked";
}

export interface FlightOrderItem {
  type: "flight";
  flightNumber: string;
  airline: string;
  departureAirport: string;
  departureCity: string;
  arrivalAirport: string;
  arrivalCity: string;
  departureTime: Date;
  arrivalTime: Date;
  cabinClass: "economy" | "business" | "first";
  passengers: OrderPassenger[];
  originalPrice: number;
  paidPrice: number;
}

export interface HotelOrderItem {
  type: "hotel";
  hotelName: string;
  address: string;
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  roomType: string;
  guests: OrderPassenger[];
  originalPrice: number;
  paidPrice: number;
}

export interface TicketOrderItem {
  type: "ticket";
  attractionName: string;
  address: string;
  city: string;
  visitDate: Date;
  ticketType: string;
  quantity: number;
  visitors: OrderPassenger[];
  originalPrice: number;
  paidPrice: number;
}

export type OrderItem = FlightOrderItem | HotelOrderItem | TicketOrderItem;

export interface Order {
  orderNo: string;
  totalAmountOriginal: number;
  totalAmount: number;
  paymentStatus: "unpaid" | "paid" | "refunded" | "failed";
  status: "pending" | "paid" | "cancelled" | "completed";
  paymentMethod: "alipay" | "wechat" | "unionpay" | "credit_card" | "offline";
  createdAt: Date;
  paidAt?: Date;
  expiredAt?: Date;
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

const paymentStatusLabels = {
  unpaid: { text: "待支付", variant: "outline" as const, color: "text-orange-600" },
  paid: { text: "已支付", variant: "default" as const, color: "text-green-600" },
  refunded: { text: "已退款", variant: "secondary" as const, color: "text-gray-600" },
  failed: { text: "支付失败", variant: "destructive" as const, color: "text-red-600" },
};

const orderStatusLabels = {
  pending: { text: "待处理", color: "text-orange-600" },
  paid: { text: "已支付", color: "text-green-600" },
  cancelled: { text: "已取消", color: "text-gray-500" },
  completed: { text: "已完成", color: "text-blue-600" },
};

const cabinClassLabels = {
  economy: "经济舱",
  business: "商务舱",
  first: "头等舱",
};

const paymentMethodLabels = {
  alipay: "支付宝",
  wechat: "微信支付",
  unionpay: "银联",
  credit_card: "信用卡",
  offline: "线下支付",
};

const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
  const mainItem = order.items[0];
  
  const getTotalPeople = () => {
    return order.items.reduce((sum, item) => {
      if (item.type === "flight") return sum + item.passengers.length;
      if (item.type === "hotel") return sum + item.guests.length;
      if (item.type === "ticket") return sum + item.visitors.length;
      return sum;
    }, 0);
  };

  const renderItemContent = () => {
    if (mainItem.type === "flight") {
      return (
        <>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <div className="text-xl font-bold">{mainItem.departureCity}</div>
                  <div className="text-xs text-muted-foreground">{mainItem.departureAirport}</div>
                  <div className="text-sm">{format(mainItem.departureTime, "HH:mm", { locale: zhCN })}</div>
                </div>
                
                <div className="flex flex-col items-center px-4">
                  <Plane className="w-5 h-5 text-primary mb-1" />
                  <div className="text-xs text-muted-foreground">{mainItem.flightNumber}</div>
                  <div className="text-xs text-muted-foreground">{mainItem.airline}</div>
                </div>

                <div className="space-y-1 text-right">
                  <div className="text-xl font-bold">{mainItem.arrivalCity}</div>
                  <div className="text-xs text-muted-foreground">{mainItem.arrivalAirport}</div>
                  <div className="text-sm">{format(mainItem.arrivalTime, "HH:mm", { locale: zhCN })}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(mainItem.departureTime, "MM月dd日", { locale: zhCN })}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{mainItem.passengers.length} 位乘客</span>
            </div>
            <Badge variant="outline">{cabinClassLabels[mainItem.cabinClass]}</Badge>
          </div>
        </>
      );
    }

    if (mainItem.type === "hotel") {
      return (
        <>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <div className="text-lg font-bold">{mainItem.hotelName}</div>
                <div className="text-sm text-muted-foreground">{mainItem.address}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(mainItem.checkInDate, "MM月dd日", { locale: zhCN })} - {format(mainItem.checkOutDate, "MM月dd日", { locale: zhCN })}</span>
            </div>
            <span>{mainItem.nights} 晚</span>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{mainItem.guests.length} 位客人</span>
            </div>
            <Badge variant="outline">{mainItem.roomType}</Badge>
          </div>
        </>
      );
    }

    if (mainItem.type === "ticket") {
      return (
        <>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <div className="text-lg font-bold">{mainItem.attractionName}</div>
                <div className="text-sm text-muted-foreground">{mainItem.address}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(mainItem.visitDate, "yyyy年MM月dd日", { locale: zhCN })}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{mainItem.quantity} 张门票</span>
            </div>
            <Badge variant="outline">{mainItem.ticketType}</Badge>
          </div>
        </>
      );
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">订单号: {order.orderNo}</span>
              <Badge variant={paymentStatusLabels[order.paymentStatus].variant}>
                {paymentStatusLabels[order.paymentStatus].text}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              下单时间: {format(order.createdAt, "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">¥{order.totalAmount}</div>
            {order.totalAmountOriginal > order.totalAmount && (
              <div className="text-xs text-muted-foreground line-through">¥{order.totalAmountOriginal}</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {renderItemContent()}

        {/* 支付信息 */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{paymentMethodLabels[order.paymentMethod]}</span>
            </div>
            {order.paidAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  支付时间: {format(order.paidAt, "MM-dd HH:mm", { locale: zhCN })}
                </span>
              </div>
            )}
          </div>
          <span className={`text-sm font-medium ${orderStatusLabels[order.status].color}`}>
            {orderStatusLabels[order.status].text}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 justify-end">
        {order.paymentStatus === "unpaid" && order.status === "pending" && (
          <>
            <Button variant="outline" size="sm">取消订单</Button>
            <Button size="sm">立即支付</Button>
          </>
        )}
        {order.paymentStatus === "paid" && (
          <Button variant="outline" size="sm">申请退款</Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onViewDetails(order)}>
          查看详情 <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
