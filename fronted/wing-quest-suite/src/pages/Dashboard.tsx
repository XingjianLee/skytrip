import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  Hotel, 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock,
  TrendingUp,
  Users,
  Globe
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("user");
    
    if (!isLoggedIn || !userData) {
      navigate("/auth");
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const quickActions = [
    {
      icon: Plane,
      title: "预订机票",
      description: "搜索并预订国内外航班",
      color: "bg-primary/10 text-primary",
      href: "/book-flight"
    },
    {
      icon: Hotel,
      title: "预订酒店",
      description: "查找优质住宿",
      color: "bg-accent/10 text-accent",
      href: "/book-hotel"
    },
    {
      icon: Ticket,
      title: "景区门票",
      description: "预订热门景点门票",
      color: "bg-secondary/10 text-secondary",
      href: "/book-ticket"
    }
  ];

  const stats = [
    {
      icon: Globe,
      label: "覆盖城市",
      value: "500+",
      trend: "+12%"
    },
    {
      icon: Users,
      label: "服务用户",
      value: "100万+",
      trend: "+25%"
    },
    {
      icon: Plane,
      label: "合作航司",
      value: "200+",
      trend: "+8%"
    },
    {
      icon: TrendingUp,
      label: "满意度",
      value: "98%",
      trend: "+3%"
    }
  ];

  const recentActivities = [
    {
      icon: Plane,
      title: "航班提醒",
      description: "您关注的上海-北京航班有特价",
      time: "2小时前",
      color: "text-primary"
    },
    {
      icon: Hotel,
      title: "酒店推荐",
      description: "三亚酒店优惠活动进行中",
      time: "5小时前",
      color: "text-accent"
    },
    {
      icon: Ticket,
      title: "门票更新",
      description: "故宫门票已可预约下月",
      time: "1天前",
      color: "text-secondary"
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar isLoggedIn={true} />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        {/* 欢迎区域 */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary mb-2">
            欢迎回来，{user.username}！
          </h1>
          <p className="text-muted-foreground">
            开始您的下一段旅程
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="border-border/50 hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-8 h-8 text-primary" />
                  <span className="text-sm text-accent font-medium">{stat.trend}</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="border-border/50 hover:shadow-elegant transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
              onClick={() => navigate(action.href)}
            >
              <CardHeader>
                <div className={`w-14 h-14 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-start text-accent hover:text-accent-hover">
                  立即前往 →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 最近活动 */}
        <Card className="border-border/50 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              最近活动
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
