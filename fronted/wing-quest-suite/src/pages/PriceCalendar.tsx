import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, TrendingDown, TrendingUp, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addDays, format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { zhCN } from "date-fns/locale";

// Fake price data for demonstration
const generatePriceData = () => {
  const today = new Date();
  const priceMap: { [key: string]: number } = {};
  
  for (let i = 0; i < 60; i++) {
    const date = addDays(today, i);
    const dateKey = format(date, "yyyy-MM-dd");
    // Generate random prices between 500-2000
    const basePrice = 800 + Math.random() * 800;
    // Weekend prices tend to be higher
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const price = Math.round(basePrice * (isWeekend ? 1.3 : 1));
    priceMap[dateKey] = price;
  }
  
  return priceMap;
};

const cities = [
  { code: "PEK", name: "北京" },
  { code: "PVG", name: "上海" },
  { code: "CAN", name: "广州" },
  { code: "CTU", name: "成都" },
  { code: "SZX", name: "深圳" },
  { code: "HGH", name: "杭州" },
];

const cabinClasses = [
  { value: "economy", label: "经济舱" },
  { value: "business", label: "商务舱" },
  { value: "first", label: "头等舱" },
];

const PriceCalendar = () => {
  const navigate = useNavigate();
  const [priceData] = useState(generatePriceData());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [departure, setDeparture] = useState("PEK");
  const [arrival, setArrival] = useState("PVG");
  const [cabinClass, setCabinClass] = useState("economy");

  const getPriceForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return priceData[dateKey] || 0;
  };

  const getPriceLevel = (price: number) => {
    if (price < 900) return "low";
    if (price < 1200) return "medium";
    return "high";
  };

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/50";
      case "high": return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/50";
      default: return "";
    }
  };

  // Get all prices for current month
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const monthPrices = daysInMonth.map(date => getPriceForDate(date)).filter(p => p > 0);
  const avgPrice = Math.round(monthPrices.reduce((a, b) => a + b, 0) / monthPrices.length);
  const minPrice = Math.min(...monthPrices);
  const maxPrice = Math.max(...monthPrices);

  // Get cheapest dates
  const cheapestDates = daysInMonth
    .map(date => ({ date, price: getPriceForDate(date) }))
    .filter(item => item.price > 0)
    .sort((a, b) => a.price - b.price)
    .slice(0, 5);

  const handleBookFlight = (date: Date) => {
    const price = getPriceForDate(date);
    toast.success(`即将跳转到预订页面，${format(date, "yyyy年MM月dd日", { locale: zhCN })} 最低价 ¥${price}`);
    setTimeout(() => navigate("/book-flight"), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <CalendarIcon className="h-8 w-8 text-primary" />
              价格日历
            </h1>
            <p className="text-muted-foreground">查看未来两个月的机票价格趋势，选择最优出行日期</p>
          </div>

          {/* Search Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">出发地</label>
                  <Select value={departure} onValueChange={setDeparture}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city.code} value={city.code}>
                          {city.name} ({city.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">目的地</label>
                  <Select value={arrival} onValueChange={setArrival}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city.code} value={city.code}>
                          {city.name} ({city.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">舱位类型</label>
                  <Select value={cabinClass} onValueChange={setCabinClass}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cabinClasses.map(cabin => (
                        <SelectItem key={cabin.value} value={cabin.value}>
                          {cabin.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full" onClick={() => toast.success("搜索完成")}>
                    <Plane className="mr-2 h-4 w-4" />
                    搜索航班
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Calendar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Legend */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">价格区间：</div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500"></div>
                        <span className="text-sm">低价 (&lt;¥900)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-yellow-500"></div>
                        <span className="text-sm">中等 (¥900-1200)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-500"></div>
                        <span className="text-sm">高价 (&gt;¥1200)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calendar with Prices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{format(selectedMonth, "yyyy年MM月", { locale: zhCN })}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedMonth(addDays(selectedMonth, -30))}
                      >
                        上月
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedMonth(addDays(selectedMonth, 30))}
                      >
                        下月
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {/* Weekday headers */}
                    {["日", "一", "二", "三", "四", "五", "六"].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                    
                    {/* Empty cells for alignment */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    
                    {/* Date cells with prices */}
                    {daysInMonth.map(date => {
                      const price = getPriceForDate(date);
                      const priceLevel = getPriceLevel(price);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      const isPast = date < new Date() && !isSameDay(date, new Date());
                      
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => {
                            if (!isPast) {
                              setSelectedDate(date);
                            }
                          }}
                          disabled={isPast}
                          className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                            isPast 
                              ? "bg-muted/50 cursor-not-allowed opacity-50" 
                              : isSelected
                              ? "border-primary bg-primary/10 scale-105"
                              : getPriceLevelColor(priceLevel)
                          } hover:scale-105 disabled:hover:scale-100`}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-sm font-medium">{format(date, "d")}</div>
                            {!isPast && price > 0 && (
                              <div className="text-xs font-bold mt-1">¥{price}</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">本月价格统计</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">平均价格</span>
                      <span className="text-lg font-bold">¥{avgPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <TrendingDown className="h-4 w-4 text-green-500" />
                        最低价格
                      </span>
                      <span className="text-lg font-bold text-green-600">¥{minPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-red-500" />
                        最高价格
                      </span>
                      <span className="text-lg font-bold text-red-600">¥{maxPrice}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-sm text-muted-foreground">价格波动</div>
                    <div className="text-2xl font-bold text-primary">
                      ¥{maxPrice - minPrice}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Best Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">最佳出行日期</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cheapestDates.map((item, index) => (
                      <div 
                        key={item.date.toISOString()}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => handleBookFlight(item.date)}
                      >
                        <div>
                          <div className="font-medium">
                            {format(item.date, "MM月dd日 EEEE", { locale: zhCN })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            比平均价低 ¥{avgPrice - item.price}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={index === 0 ? "default" : "secondary"} className="text-base">
                            ¥{item.price}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Date Info */}
              {selectedDate && (
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">已选日期</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {format(selectedDate, "yyyy年MM月dd日", { locale: zhCN })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(selectedDate, "EEEE", { locale: zhCN })}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground mb-1">当日最低价</div>
                      <div className="text-3xl font-bold text-primary">
                        ¥{getPriceForDate(selectedDate)}
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => handleBookFlight(selectedDate)}
                    >
                      立即预订
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PriceCalendar;