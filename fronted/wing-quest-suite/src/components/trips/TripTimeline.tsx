import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, Ticket, MapPin, Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface TripItem {
  id: string;
  type: "flight" | "hotel" | "ticket";
  date: Date;
  title: string;
  location: string;
  time?: string;
  details: any;
}

interface TripTimelineProps {
  items: TripItem[];
  onItemClick: (item: TripItem) => void;
}

const TripTimeline = ({ items, onItemClick }: TripTimelineProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="w-5 h-5" />;
      case "hotel":
        return <Hotel className="w-5 h-5" />;
      case "ticket":
        return <Ticket className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "flight":
        return "航班";
      case "hotel":
        return "酒店";
      case "ticket":
        return "门票";
      default:
        return "";
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case "flight":
        return "bg-blue-500";
      case "hotel":
        return "bg-green-500";
      case "ticket":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  // 按日期分组
  const groupedItems = items.reduce((acc, item) => {
    const dateKey = format(item.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, TripItem[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([date, dayItems]) => (
        <div key={date} className="relative">
          {/* 日期标题 */}
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-4 mb-4 border-b">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">
                {format(new Date(date), "M月d日 EEEE", { locale: zhCN })}
              </h3>
            </div>
          </div>

          {/* 时间线项目 */}
          <div className="space-y-4 pl-6 border-l-2 border-border">
            {dayItems.map((item, index) => (
              <div key={item.id} className="relative">
                {/* 时间线圆点 */}
                <div
                  className={`absolute -left-[29px] w-4 h-4 rounded-full ${getColorClass(item.type)} border-4 border-background`}
                />

                {/* 项目卡片 */}
                <Card
                  className="ml-4 p-4 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => onItemClick(item)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getColorClass(item.type)} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                      {getIcon(item.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {getTypeLabel(item.type)}
                          </Badge>
                          <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                        </div>
                        {item.time && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {item.time}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>

                      {/* 详细信息预览 */}
                      {item.type === "flight" && (
                        <div className="mt-3 pt-3 border-t text-sm">
                          <div className="flex items-center gap-4">
                            <span>{item.details.from} → {item.details.to}</span>
                            <span className="text-muted-foreground">航班号: {item.details.flightNumber}</span>
                          </div>
                        </div>
                      )}

                      {item.type === "hotel" && (
                        <div className="mt-3 pt-3 border-t text-sm">
                          <div className="flex items-center gap-4">
                            <span>入住: {item.details.checkIn}</span>
                            <span>退房: {item.details.checkOut}</span>
                            <span className="text-muted-foreground">{item.details.nights}晚</span>
                          </div>
                        </div>
                      )}

                      {item.type === "ticket" && (
                        <div className="mt-3 pt-3 border-t text-sm">
                          <div className="flex items-center gap-4">
                            <span>数量: {item.details.quantity}张</span>
                            <span className="text-muted-foreground">¥{item.details.price}/人</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">暂无行程安排</p>
          <p className="text-sm">开始预订机票、酒店或景点门票来规划您的旅程</p>
        </div>
      )}
    </div>
  );
};

export default TripTimeline;