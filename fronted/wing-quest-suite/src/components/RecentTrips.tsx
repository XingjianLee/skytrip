import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrders, type BackendOrder } from "@/lib/api";
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
  const [trips, setTrips] = useState<Trip[]>([]);

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

  const mapBackendOrdersToTrips = (orders: BackendOrder[]): Trip[] => {
    const res: Trip[] = [];
    const now = Date.now();
    for (const o of orders) {
      for (const it of o.items) {
        const dep = it.flight?.route?.departure_airport;
        const arr = it.flight?.route?.arrival_airport;
        const dateStr = it.flight_date || new Date(o.created_at).toISOString().slice(0, 10);
        const timeStr = (it.flight?.scheduled_departure_time || "00:00").slice(0, 5);
        const title = dep && arr ? `${dep.city} → ${arr.city}` : `航班 ${it.flight?.flight_number || it.flight_id}`;
        const subtitle = `${it.flight?.airline?.airline_name || ""} ${it.flight?.flight_number || it.flight_id}`.trim();
        const location = dep ? `${dep.city} ${dep.airport_code}` : "待确认";
        const depDateTime = new Date(`${dateStr}T${it.flight?.scheduled_departure_time || "00:00"}`).getTime();
        const status: Trip["status"] =
          depDateTime > now ? "upcoming" : (Math.abs(depDateTime - now) < 6 * 3600 * 1000 ? "ongoing" : "completed");
        const statusText = status === "upcoming" ? "即将出发" : status === "ongoing" ? "进行中" : "已完成";
        const details = `${it.cabin_class === "economy" ? "经济舱" : it.cabin_class === "business" ? "商务舱" : "头等舱"} · 1位乘客`;
        res.push({
          id: `${o.order_no}-${it.item_id}`,
          type: "flight",
          title,
          subtitle,
          date: dateStr,
          time: timeStr,
          location,
          status,
          statusText,
          details,
        });
      }
    }
    // 排序：按出发时间升序，仅保留未来或近期 7 天内的前 3 个
    const sorted = res
      .sort((a, b) => {
        const ta = new Date(`${a.date}T${(a.time || "00:00")}:00`).getTime();
        const tb = new Date(`${b.date}T${(b.time || "00:00")}:00`).getTime();
        return ta - tb;
      })
      .filter(t => new Date(t.date).getTime() >= new Date().setDate(new Date().getDate() - 1))
      .slice(0, 3);
    return sorted;
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    if (!token) {
      // 未登录，仅展示 mock
      setTrips(mockTrips);
      return;
    }
    (async () => {
      try {
        const orders = await getOrders(token, { limit: 20 });
        const realTrips = mapBackendOrdersToTrips(orders);
        // 真实订单在前，若不足 3 个，用 mock 补齐
        const need = Math.max(0, 3 - realTrips.length);
        const mockTail = need > 0 ? mockTrips.slice(0, need) : [];
        setTrips([...realTrips, ...mockTail]);
      } catch {
        setTrips(mockTrips);
      }
    })();
  }, []);

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
          {trips.map((trip) => {
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

        {trips.length === 0 && (
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
