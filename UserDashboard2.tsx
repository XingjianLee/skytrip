import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import QuickServicesBar from "@/components/QuickServicesBar";
import RecentTrips from "@/components/RecentTrips";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Filter,
  Heart,
  ThermometerSun
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("成都");
  const [destination, setDestination] = useState("上海");
  const [activeActivity, setActiveActivity] = useState<string | null>("hiking");
  const [selectedDateIndex, setSelectedDateIndex] = useState(2);

  // --- 数据定义保持不变，为了展示效果，我为 trips 和 hotels 增加了图片字段 ---
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
      title: "迷雾森林",
      subtitle: "寻找遗失的秘境",
      description: "深入原始森林，聆听自然呼吸",
      duration: "7天6夜",
      distance: "18km",
      rating: 9.2,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "峡谷探险",
      subtitle: "挑战自我的极限",
      description: "穿越壮丽峡谷，体验皮划艇漂流",
      duration: "5天4夜",
      distance: "25km",
      rating: 9.5,
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2670&auto=format&fit=crop"
    }
  ];

  const recommendedRoutes = [
    {
      id: 1,
      route: "成都 → 上海",
      color: "bg-blue-500", // 简化颜色逻辑
      priceFrom: 680,
      duration: "2h 30m",
      popularity: "热门",
      tags: ["直飞", "快速"],
      reason: "商务出行首选",
      flights: "20+班次",
      bestTime: "早/晚"
    },
    {
      id: 2,
      route: "成都 → 北京",
      color: "bg-purple-500",
      priceFrom: 750,
      duration: "2h 45m",
      popularity: "精品",
      tags: ["直飞", "舒适"],
      reason: "价格实惠",
      flights: "15+班次",
      bestTime: "全天"
    },
    {
      id: 3,
      route: "上海 → 三亚",
      color: "bg-orange-500",
      priceFrom: 580,
      duration: "3h 20m",
      popularity: "度假",
      tags: ["海岛"],
      reason: "休闲首选",
      flights: "12+班次",
      bestTime: "早班"
    }
  ];

  const hotels = [
    {
      id: 1,
      name: "高山全景度假酒店",
      location: "奥地利 · 蒂罗尔",
      rating: 9.4,
      reviews: 128,
      guests: 2,
      tag: "景观房",
      price: "¥1,200",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "湖畔静谧木屋",
      location: "哈尔施塔特",
      rating: 8.9,
      reviews: 85,
      guests: 4,
      tag: "家庭套房",
      price: "¥2,100",
      image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2670&auto=format&fit=crop"
    }
  ];

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
        <Navbar isLoggedIn={true} />
        <QuickServicesBar />
        <RecentTrips />

        <main className="container mx-auto px-4 sm:px-6 pt-6 pb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">探索您的下一站</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">为您定制的专属行程建议</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ================= 左侧边栏：沉浸式探索 ================= */}
            <div className="lg:col-span-3 space-y-6 flex flex-col">
              {/* 主题探索卡片 */}
              <div className="relative rounded-3xl overflow-hidden h-full min-h-[500px] group shadow-xl shadow-slate-200 dark:shadow-none">
                {/* 背景大图 */}
                <img
                    src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop"
                    alt="Nature"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* 渐变蒙层 */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/80" />

                <div className="relative h-full flex flex-col p-6 text-white">
                  {/* 顶部标签 */}
                  <div className="flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>挪威 · 罗弗敦群岛</span>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-4xl font-bold leading-tight drop-shadow-lg">
                      回归<br/>自然
                    </h2>
                    <p className="text-white/80 text-sm mt-2 max-w-[200px]">感受极地风光与原始森林的呼唤</p>
                  </div>

                  {/* 中部活动筛选 - 改为垂直胶囊 */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {activities.map((activity) => (
                        <button
                            key={activity.id}
                            onClick={() => setActiveActivity(activity.id === activeActivity ? null : activity.id)}
                            className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs backdrop-blur-md transition-all border
                          ${activeActivity === activity.id
                                ? "bg-white text-black border-white font-bold shadow-lg"
                                : "bg-black/20 text-white border-white/20 hover:bg-white/10"}
                        `}
                        >
                          <activity.icon className="w-3.5 h-3.5" />
                          {activity.name}
                        </button>
                    ))}
                  </div>

                  {/* 底部推荐行程 - 叠加在最下方 */}
                  <div className="mt-auto pt-8 space-y-4">
                    <div className="flex items-center justify-between text-xs text-white/70 uppercase tracking-wider font-semibold mb-2">
                      <span>本周热门</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>

                    {trips.map((trip) => (
                        <div key={trip.id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 hover:bg-white/20 transition-colors cursor-pointer flex gap-3 group/card">
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate">{trip.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {trip.duration}</span>
                              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/> {trip.rating}</span>
                            </div>
                            <div className="mt-2 flex items-center text-[10px] text-white/60 gap-2">
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white">{trip.distance}</span>
                              <span className="truncate">{trip.description}</span>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ================= 中间栏：功能区 (保持原有逻辑，微调样式) ================= */}
            <div className="lg:col-span-5 space-y-6">
              {/* 航线选择器 - 更清爽 */}
              <Card className="border-none shadow-xl shadow-amber-100/50 dark:shadow-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    {/* 城市交换区 */}
                    <div className="flex-1 flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                      <div className="text-center min-w-[80px]">
                        <div className="text-xs text-slate-400 mb-1">出发</div>
                        <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{origin}</div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleSwap} className="rounded-full hover:bg-white hover:shadow-sm text-slate-400">
                        <ArrowRightLeft className="w-5 h-5" />
                      </Button>
                      <div className="text-center min-w-[80px]">
                        <div className="text-xs text-slate-400 mb-1">到达</div>
                        <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{destination}</div>
                      </div>
                    </div>

                    {/* 搜索按钮 */}
                    <Button className="ml-4 h-auto py-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                      <Plane className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* 日期选择 - 胶囊样式 */}
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {dates.map((date, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDateIndex(index)}
                            className={`
                                flex flex-col items-center justify-center min-w-[60px] py-3 rounded-2xl border transition-all
                                ${selectedDateIndex === index
                                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-105'
                                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                            }
                            `}
                        >
                            <span className="text-[10px] opacity-80 mb-0.5">
                                {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]}
                            </span>
                          <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                        </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 推荐列表 - 增加视觉层次 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-slate-700">特价航线推荐</h3>
                  <Button variant="link" className="text-xs text-slate-400 h-auto p-0">查看全部</Button>
                </div>
                {recommendedRoutes.map((route) => (
                    <div
                        key={route.id}
                        className="group relative bg-white dark:bg-card rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => navigate("/book-flight")}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${route.color}`}></div>
                      <div className="flex justify-between items-center pl-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-slate-800 dark:text-white">{route.route}</span>
                            <Badge variant="secondary" className="rounded-md text-[10px] bg-slate-100 text-slate-600 font-normal">{route.popularity}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {route.duration}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{route.flights}</span>
                          </div>
                          <div className="mt-3 flex gap-2">
                            {route.tags.map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400 line-through mb-1">¥{route.priceFrom * 1.2}</div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            <span className="text-sm align-top mr-0.5">¥</span>{route.priceFrom}
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 mt-1 text-xs group-hover:translate-x-1 transition-transform text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                            预订 <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* ================= 右侧栏：视觉化目的地详情 ================= */}
            <div className="lg:col-span-4 space-y-6 flex flex-col">
              {/* 目的地大卡片 */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl shadow-slate-300 dark:shadow-none group h-[400px]">
                <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop"
                    alt="Alps"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>

                {/* 浮动信息 - 顶部 */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                      <Mountain className="w-4 h-4" />
                      蒂罗尔阿尔卑斯
                    </div>
                    <div className="text-xs text-white/70">奥地利 · 2,665m 海拔</div>
                  </div>
                  <Button size="icon" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-red-500 border-0">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* 底部详情 */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ThermometerSun className="w-5 h-5 text-yellow-400" />
                        <span className="text-lg font-medium">12°C 晴朗</span>
                      </div>
                      <p className="text-sm text-white/80 line-clamp-2 max-w-[260px]">
                        在世界顶级的滑雪胜地体验速度与激情，或在山间小屋享受宁静时光。
                      </p>
                    </div>
                  </div>
                  <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold">
                    查看攻略
                  </Button>
                </div>
              </div>

              {/* 酒店推荐 - 图文列表 */}
              <div className="bg-white dark:bg-card rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg">当季热推住宿</h4>
                  <Button variant="ghost" size="sm" className="text-xs">更多</Button>
                </div>

                <div className="space-y-4">
                  {hotels.map((hotel) => (
                      <div key={hotel.id} className="group flex gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer">
                        {/* 酒店图 */}
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute top-1 left-1 bg-black/50 backdrop-blur px-1.5 py-0.5 rounded text-[10px] text-white">
                            {hotel.tag}
                          </div>
                        </div>

                        {/* 信息 */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <h5 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{hotel.name}</h5>
                            <div className="flex items-center text-xs text-slate-500 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="truncate max-w-[120px]">{hotel.location}</span>
                            </div>
                          </div>

                          <div className="flex items-end justify-between mt-2">
                            <div className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              {hotel.rating} <span className="text-slate-400 font-normal">({hotel.reviews})</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-sm font-bold text-primary">{hotel.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default UserDashboard;