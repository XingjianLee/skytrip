import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plane, Calendar, User, CreditCard, CheckCircle2, XCircle, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Order, FlightOrderItem, HotelOrderItem, TicketOrderItem } from "./OrderCard";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentStatusLabels = {
  unpaid: { text: "待支付", variant: "outline" as const },
  paid: { text: "已支付", variant: "default" as const },
  refunded: { text: "已退款", variant: "secondary" as const },
  failed: { text: "支付失败", variant: "destructive" as const },
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

const OrderDetailsDialog = ({ order, open, onOpenChange }: OrderDetailsDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>订单详情</span>
            <Badge variant={paymentStatusLabels[order.paymentStatus].variant}>
              {paymentStatusLabels[order.paymentStatus].text}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            订单号: {order.orderNo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 订单信息 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">订单信息</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">下单时间:</span>
                <span>{format(order.createdAt, "yyyy-MM-dd HH:mm:ss", { locale: zhCN })}</span>
              </div>
              {order.paidAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-muted-foreground">支付时间:</span>
                  <span>{format(order.paidAt, "yyyy-MM-dd HH:mm:ss", { locale: zhCN })}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">支付方式:</span>
                <span>{paymentMethodLabels[order.paymentMethod]}</span>
              </div>
              {order.expiredAt && order.paymentStatus === "unpaid" && (
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-muted-foreground">过期时间:</span>
                  <span className="text-orange-600">
                    {format(order.expiredAt, "yyyy-MM-dd HH:mm:ss", { locale: zhCN })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 订单项信息 */}
          {order.items.map((item, index) => (
            <div key={index} className="space-y-3">
              {item.type === "flight" && (
                <>
                  <h3 className="font-semibold text-sm">航班 {index + 1}</h3>
                  
                  {/* 航线信息 */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{item.departureCity}</div>
                        <div className="text-xs text-muted-foreground">{item.departureAirport}</div>
                        <div className="text-sm font-medium">
                          {format(item.departureTime, "yyyy-MM-dd HH:mm", { locale: zhCN })}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center px-4">
                        <Plane className="w-6 h-6 text-primary mb-2" />
                        <div className="text-sm font-medium">{item.flightNumber}</div>
                        <div className="text-xs text-muted-foreground">{item.airline}</div>
                        <Badge variant="outline" className="mt-2">{cabinClassLabels[item.cabinClass]}</Badge>
                      </div>

                      <div className="space-y-1 text-right">
                        <div className="text-2xl font-bold">{item.arrivalCity}</div>
                        <div className="text-xs text-muted-foreground">{item.arrivalAirport}</div>
                        <div className="text-sm font-medium">
                          {format(item.arrivalTime, "yyyy-MM-dd HH:mm", { locale: zhCN })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 乘客信息 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">乘客信息</h4>
                    {item.passengers.map((passenger, pIndex) => (
                      <div key={pIndex} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{passenger.name}</div>
                            <div className="text-xs text-muted-foreground">
                              身份证: {passenger.idCard.replace(/^(.{6})(.{8})(.{4})$/, "$1****$3")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {passenger.seatNumber && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">座位: </span>
                              <span className="font-medium">{passenger.seatNumber}</span>
                            </div>
                          )}
                          {passenger.checkInStatus === "checked" ? (
                            <Badge variant="default">已值机</Badge>
                          ) : (
                            <Badge variant="outline">未值机</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 价格信息 */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.passengers.length} × {cabinClassLabels[item.cabinClass]}
                    </span>
                    <div className="flex items-center gap-3">
                      {item.originalPrice > item.paidPrice && (
                        <span className="line-through text-muted-foreground">¥{item.originalPrice}</span>
                      )}
                      <span className="font-medium text-primary">¥{item.paidPrice}</span>
                    </div>
                  </div>
                </>
              )}

              {item.type === "hotel" && (
                <>
                  <h3 className="font-semibold text-sm">酒店预订</h3>
                  
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="text-xl font-bold mb-1">{item.hotelName}</div>
                        <div className="text-sm text-muted-foreground">{item.address}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">入住时间: </span>
                        <span className="font-medium">{format(item.checkInDate, "yyyy-MM-dd", { locale: zhCN })}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">离店时间: </span>
                        <span className="font-medium">{format(item.checkOutDate, "yyyy-MM-dd", { locale: zhCN })}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">住宿天数: </span>
                        <span className="font-medium">{item.nights} 晚</span>
                      </div>
                      <div>
                        <Badge variant="outline">{item.roomType}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">客人信息</h4>
                    {item.guests.map((guest, gIndex) => (
                      <div key={gIndex} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{guest.name}</div>
                            <div className="text-xs text-muted-foreground">
                              身份证: {guest.idCard.replace(/^(.{6})(.{8})(.{4})$/, "$1****$3")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.roomType} × {item.nights} 晚</span>
                    <div className="flex items-center gap-3">
                      {item.originalPrice > item.paidPrice && (
                        <span className="line-through text-muted-foreground">¥{item.originalPrice}</span>
                      )}
                      <span className="font-medium text-primary">¥{item.paidPrice}</span>
                    </div>
                  </div>
                </>
              )}

              {item.type === "ticket" && (
                <>
                  <h3 className="font-semibold text-sm">景点门票</h3>
                  
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="text-xl font-bold mb-1">{item.attractionName}</div>
                        <div className="text-sm text-muted-foreground">{item.address}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">游玩日期: </span>
                        <span className="font-medium">{format(item.visitDate, "yyyy-MM-dd", { locale: zhCN })}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">门票数量: </span>
                        <span className="font-medium">{item.quantity} 张</span>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline">{item.ticketType}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">游客信息</h4>
                    {item.visitors.map((visitor, vIndex) => (
                      <div key={vIndex} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{visitor.name}</div>
                            <div className="text-xs text-muted-foreground">
                              身份证: {visitor.idCard.replace(/^(.{6})(.{8})(.{4})$/, "$1****$3")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.ticketType} × {item.quantity}</span>
                    <div className="flex items-center gap-3">
                      {item.originalPrice > item.paidPrice && (
                        <span className="line-through text-muted-foreground">¥{item.originalPrice}</span>
                      )}
                      <span className="font-medium text-primary">¥{item.paidPrice}</span>
                    </div>
                  </div>
                </>
              )}

              {index < order.items.length - 1 && <Separator />}
            </div>
          ))}

          {/* 费用汇总 */}
          <div className="bg-primary/5 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">原价</span>
              <span>¥{order.totalAmountOriginal}</span>
            </div>
            {order.totalAmountOriginal > order.totalAmount && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">优惠</span>
                <span className="text-green-600">-¥{(order.totalAmountOriginal - order.totalAmount).toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>实付金额</span>
              <span className="text-primary">¥{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
