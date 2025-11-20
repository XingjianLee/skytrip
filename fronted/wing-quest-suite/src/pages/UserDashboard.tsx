import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import QuickServicesBar from "@/components/QuickServicesBar";
import RecentTrips from "@/components/RecentTrips";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plane,
  Hotel,
  Footprints,
  Tent,
  Bike,
  Waves,
  ArrowRightLeft,
  Clock,
  Star,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Mountain,
  ArrowRight,
  Filter
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("成都");
  const [destination, setDestination] = useState("上海");
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(2);

  // 生成未来7天日期
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const activities = [
    { id: "hiking", name: "徒步", icon: Footprints },
    { id: "kayaking", name: "皮划艇", icon: Waves },
    { id: "camping", name: "露营", icon: Tent },
    { id: "cycling", name: "骑行", icon: Bike },
  ];

  const trips = [
    {
      id: 1,
      title: "自然之声",
      subtitle: "真正的冒险，自然揭示其美丽",
      description: "在最纯净的森林里",
      duration: "7天6夜",
      distance: "18公里",
      rating: 8,
      ratingTotal: 10
    },
    {
      id: 2,
      title: "自然之声",
      subtitle: "探索未知的旅程",
      description: "感受大自然的力量",
      duration: "5天4夜",
      distance: "25公里",
      rating: 9,
      ratingTotal: 10
    }
  ];

  const recommendedRoutes = [
    {
      id: 1,
      route: "成都 → 上海",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      priceFrom: 680,
      duration: "2小时30分",
      popularity: "热门航线",
      tags: ["直飞", "快速"],
      reason: "商务出行首选，航班密集",
      flights: "每日20+班次",
      bestTime: "早班/晚班"
    },
    {
      id: 2,
      route: "成都 → 北京",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      priceFrom: 750,
      duration: "2小时45分",
      popularity: "精品路线",
      tags: ["直飞", "舒适"],
      reason: "多家航司运营，价格实惠",
      flights: "每日15+班次",
      bestTime: "全天候"
    },
    {
      id: 3,
      route: "上海 → 三亚",
      color: "bg-gradient-to-br from-orange-500 to-amber-500",
      priceFrom: 580,
      duration: "3小时20分",
      popularity: "度假推荐",
      tags: ["度假", "海岛"],
      reason: "休闲度假热门目的地",
      flights: "每日12+班次",
      bestTime: "早班优惠"
    }
  ];

  const hotels = [
    {
      id: 1,
      name: "Lenas Donau Hotel",
      location: "多瑙河畔22区，维也纳",
      rating: 7.6,
      reviews: 76,
      guests: 2,
      beds: "1张大床",
      price: "$89.00"
    }
  ];

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar isLoggedIn={true} />

        <QuickServicesBar />

        <RecentTrips />

        <main className="container mx-auto px-6 pt-6 pb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">智能行程推荐</h2>
            <p className="text-sm text-muted-foreground">为您精心定制的旅行方案</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 左侧边栏 - 主题导航与核心推荐 */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="border-0 shadow-lg overflow-hidden bg-card/95 backdrop-blur">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>挪威</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">
                      自然<br/>力量
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {activities.map((activity) => (
                          <Button
                              key={activity.id}
                              variant={activeActivity === activity.id ? "default" : "secondary"}
                              size="sm"
                              onClick={() => setActiveActivity(activity.id === activeActivity ? null : activity.id)}
                              className="gap-1.5 rounded-full px-4"
                          >
                            <activity.icon className="w-3.5 h-3.5" />
                            {activity.name}
                          </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {trips.map((trip, index) => (
                        <Card
                            key={trip.id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 group cursor-pointer hover-scale"
                        >
                          <div className="relative h-64 bg-gradient-to-br from-green-600 to-emerald-700 flex flex-col items-center justify-center p-6 text-white">
                            <div className="relative z-10 text-center">
                              <h3 className="text-2xl font-bold mb-2">{trip.title}</h3>
                              <p className="text-sm text-white/90 mb-1">{trip.subtitle}</p>
                              <p className="text-xs text-white/70 mb-6">{trip.description}</p>

                              <div className="flex items-center justify-center gap-4 text-sm mb-6">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {trip.duration}
                            </span>
                                <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                                  {trip.distance}
                            </span>
                                <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-current" />
                                  {trip.rating}/{trip.ratingTotal}
                            </span>
                              </div>

                              <Button
                                  variant="secondary"
                                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-full px-8"
                              >
                                开始旅程
                              </Button>
                            </div>
                          </div>
                        </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 中间栏 - 航班搜索与票务系统 */}
            <div className="lg:col-span-5 space-y-4">
              {/* 航线选择器 */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">中国</p>
                        <p className="text-xl font-bold">{origin}</p>
                      </div>

                      <div className="relative px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-foreground" />
                          <Plane className="w-5 h-5" />
                          <div className="w-2 h-2 rounded-full bg-foreground" />
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">中国</p>
                        <p className="text-xl font-bold">{destination}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                          variant="default"
                          size="sm"
                          className="rounded-full gap-2 bg-foreground text-background hover:bg-foreground/90"
                          onClick={() => navigate("/book-flight")}
                      >
                        <span>搜索</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full gap-2"
                          onClick={handleSwap}
                      >
                        <span>交换</span>
                        <ArrowRightLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 日期选择器 */}
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      今天
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      2025年2月
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full ml-auto">
                      <Star className="w-4 h-4 mr-2" />
                      8/10
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {dates.map((date, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDateIndex(index)}
                            className={`
                        flex flex-col items-center justify-center p-3 rounded-2xl transition-all
                        ${selectedDateIndex === index
                                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                                : 'hover:bg-muted'
                            }
                      `}
                        >
                      <span className="text-xs mb-1">
                        {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]}
                      </span>
                          <span className="text-2xl font-bold">{date.getDate()}</span>
                        </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">推荐 {recommendedRoutes.length} 条热门航线</p>
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 推荐航线列表 */}
              <div className="space-y-4">
                {recommendedRoutes.map((route) => (
                    <Card
                        key={route.id}
                        className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                        onClick={() => navigate("/book-flight")}
                    >
                      <div className="relative">
                        {/* 顶部彩色条 */}
                        <div className={`${route.color} h-2`}></div>

                        <div className="p-6">
                          {/* 航线和价格 */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-2xl font-bold">{route.route}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {route.popularity}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{route.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Plane className="w-4 h-4" />
                                  <span>{route.flights}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-muted-foreground mb-1">最低价</p>
                              <p className="text-3xl font-bold text-primary">
                                ¥{route.priceFrom}
                                <span className="text-sm font-normal text-muted-foreground ml-1">起</span>
                              </p>
                            </div>
                          </div>

                          {/* 标签和推荐理由 */}
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              {route.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                              ))}
                              <Badge variant="outline" className="text-xs">
                                {route.bestTime}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground flex items-start gap-2">
                              <Star className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500 fill-amber-500" />
                              <span>{route.reason}</span>
                            </p>
                          </div>

                          {/* 查看按钮 */}
                          <Button
                              className="w-full mt-4 group-hover:shadow-lg transition-all"
                              variant="default"
                          >
                            <span>查看航班</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                ))}
              </div>
            </div>

            {/* 右侧栏 - 目的地详情与住宿信息 */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-0 shadow-lg overflow-hidden group">
                {/* 目的地大图 */}
                <div className="relative h-64 bg-gradient-to-br from-orange-400 to-amber-600 overflow-hidden">
                  <div className="absolute top-4 left-4 text-white">
                    <Mountain className="w-5 h-5 mb-2" />
                    <p className="text-sm font-semibold mb-1">2,665米</p>
                    <h3 className="text-3xl font-bold drop-shadow-lg">第洛尔<br/>阿尔卑斯</h3>
                  </div>

                  <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4 rounded-full bg-white hover:bg-white/90"
                  >
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                  </Button>

                  <div className="absolute bottom-4 left-4 flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-xs font-semibold">
                          {i}
                        </div>
                    ))}
                    <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full bg-white hover:bg-white/90">
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-primary">奥地利</span>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">
                    发现奥地利山脉的魔力
                  </h2>

                  <div className="flex items-center gap-4 text-sm mb-6">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>27/03 - 7/04</span>
                  </span>
                    <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>10公里</span>
                  </span>
                    <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span className="font-semibold">8/10</span>
                  </span>
                  </div>

                  <Separator className="my-6" />

                  {/* 住宿推荐 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">推荐住宿</h4>
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate("/book-hotel")}
                          className="gap-1"
                      >
                        更多
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {hotels.map((hotel) => (
                        <Card key={hotel.id} className="border-0 bg-muted/50 hover:shadow-lg transition-all overflow-hidden group">
                          <div className="flex gap-4 p-4">
                            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-amber-200 to-orange-300 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              <Hotel className="w-10 h-10 text-white/80" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold mb-1">{hotel.name}</h5>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                <MapPin className="w-3 h-3" />
                                {hotel.location}
                              </p>

                              <div className="flex items-center gap-3 text-xs mb-2">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-yellow-500" />
                              <span className="font-semibold">{hotel.rating}</span>
                              <span className="text-muted-foreground">({hotel.reviews}条评价)</span>
                            </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {hotel.guests} 人
                            </span>
                                <span>•</span>
                                <span>{hotel.beds}</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xl font-bold">{hotel.price}</span>
                                  <span className="text-xs text-muted-foreground"> / 晚</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default UserDashboard;
