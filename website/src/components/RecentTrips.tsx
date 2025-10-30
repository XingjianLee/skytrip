import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plane,
  Hotel,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight
} from "lucide-react";

interface Trip {
  id: string;
  type: "flight" | "hotel" | "ticket";
  title: string;
  subtitle: string;
  date: string;
  time?: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed";
  statusText: string;
  details: string;
}

const mockTrips: Trip[] = [
  {
    id: "1",
    type: "flight",
    title: "北京 → 上海",
    subtitle: "中国国航 CA1234",
    date: "2024-12-25",
    time: "08:00",
    location: "北京首都国际机场 T3",
    status: "upcoming",
    statusText: "即将出发",
    details: "经济舱 · 1位乘客"
  },
  {
    id: "2",
    type: "hotel",
    title: "上海浦东香格里拉大酒店",
    subtitle: "豪华江景房",
    date: "2024-12-25",
    time: "14:00",
    location: "上海市浦东新区富城路33号",
    status: "upcoming",
    statusText: "已确认",
    details: "入住2晚 · 含早餐"
  },
  {
    id: "3",
    type: "ticket",
    title: "上海迪士尼乐园",
    subtitle: "一日票 · 成人票",
    date: "2024-12-26",
    time: "09:00",
    location: "上海市浦东新区川沙镇黄赵路310号",
    status: "upcoming",
    statusText: "待使用",
    details: "1张门票 · 可快速通道"
  }
];

const RecentTrips = () => {
  const navigate = useNavigate();

  const getIcon = (type: Trip["type"]) => {
    switch (type) {
      case "flight":
        return Plane;
      case "hotel":
        return Hotel;
      case "ticket":
        return Ticket;
    }
  };

  const getColor = (type: Trip["type"]) => {
    switch (type) {
      case "flight":
        return "from-sky-500 to-blue-500";
      case "hotel":
        return "from-amber-500 to-orange-500";
      case "ticket":
        return "from-purple-500 to-pink-500";
    }
  };

  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "ongoing":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "completed":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">最近的出行计划</h2>
            <p className="text-sm text-muted-foreground">您即将开始的旅程</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/my-trips")}
            className="gap-2 group"
          >
            查看全部
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTrips.map((trip) => {
            const Icon = getIcon(trip.type);
            return (
              <Card
                key={trip.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border hover:border-primary/50 animate-fade-in"
                onClick={() => navigate("/my-trips")}
              >
                <div className="p-5">
                  {/* Header with Icon and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColor(trip.type)} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={getStatusColor(trip.status)}>
                      {trip.statusText}
                    </Badge>
                  </div>

                  {/* Trip Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {trip.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {trip.subtitle}
                      </p>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{trip.date}</span>
                      </div>
                      {trip.time && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{trip.time}</span>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{trip.location}</span>
                    </div>

                    {/* Details */}
                    <div className="pt-3 border-t flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {trip.details}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {mockTrips.length === 0 && (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <Plane className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">暂无出行计划</h3>
              <p className="text-sm text-muted-foreground mb-6">
                开始规划您的下一次旅程吧！
              </p>
              <Button onClick={() => navigate("/book-flight")}>
                预订航班
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecentTrips;
