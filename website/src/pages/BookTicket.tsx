import { useState } from "react";
import { Search, MapPin, Calendar, Users, Ticket as TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TicketFilters from "@/components/TicketFilters";
import TicketCard from "@/components/TicketCard";

const attractionCategories = [
  { icon: "🏞️", label: "自然风光", value: "nature" },
  { icon: "🏛️", label: "历史文化", value: "history" },
  { icon: "🎢", label: "主题乐园", value: "theme" },
  { icon: "🏛️", label: "博物馆", value: "museum" },
  { icon: "🐼", label: "动物园", value: "zoo" },
  { icon: "🎭", label: "演出活动", value: "show" },
];

const mockTickets = [
  {
    id: 1,
    name: "故宫博物院",
    location: "北京市东城区景山前街4号",
    rating: 4.8,
    reviews: 12580,
    price: 60,
    type: "历史文化",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
    tags: ["世界遗产", "必游景点"],
    highlights: ["明清皇家宫殿", "珍贵文物", "中国古建筑"],
    openTime: "08:30-17:00",
  },
  {
    id: 2,
    name: "上海迪士尼乐园",
    location: "上海市浦东新区川沙镇黄赵路310号",
    rating: 4.7,
    reviews: 25600,
    price: 399,
    originalPrice: 499,
    type: "主题乐园",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
    tags: ["亲子游", "网红打卡"],
    highlights: ["童话城堡", "刺激游乐设施", "精彩表演"],
    openTime: "09:00-21:00",
  },
  {
    id: 3,
    name: "张家界国家森林公园",
    location: "湖南省张家界市武陵源区",
    rating: 4.9,
    reviews: 18900,
    price: 225,
    type: "自然风光",
    image: "https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=800&q=80",
    tags: ["世界自然遗产", "摄影圣地"],
    highlights: ["奇峰异石", "云海仙境", "玻璃栈道"],
    openTime: "07:00-18:00",
  },
  {
    id: 4,
    name: "成都大熊猫繁育研究基地",
    location: "四川省成都市成华区外北熊猫大道1375号",
    rating: 4.8,
    reviews: 20300,
    price: 55,
    type: "动植物园",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80",
    tags: ["亲子游", "国宝大熊猫"],
    highlights: ["近距离观看熊猫", "生态环境", "科普教育"],
    openTime: "07:30-18:00",
  },
  {
    id: 5,
    name: "西湖风景名胜区",
    location: "浙江省杭州市西湖区龙井路1号",
    rating: 4.9,
    reviews: 35600,
    price: 0,
    type: "自然风光",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    tags: ["免费景点", "世界遗产"],
    highlights: ["断桥残雪", "雷峰塔", "三潭印月"],
    openTime: "全天开放",
  },
  {
    id: 6,
    name: "秦始皇兵马俑博物馆",
    location: "陕西省西安市临潼区秦陵北路",
    rating: 4.8,
    reviews: 28900,
    price: 120,
    type: "历史文化",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
    tags: ["世界奇迹", "必游景点"],
    highlights: ["千年陶俑", "世界第八大奇迹", "历史震撼"],
    openTime: "08:30-18:00",
  },
];

const BookTicket = () => {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [ticketType, setTicketType] = useState("adult");
  const [quantity, setQuantity] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    types: [] as string[],
    rating: 0,
    features: [] as string[],
  });

  const filteredTickets = mockTickets.filter((ticket) => {
    if (filters.priceRange[0] > ticket.price || filters.priceRange[1] < ticket.price) {
      return false;
    }
    if (filters.rating > 0 && ticket.rating < filters.rating) {
      return false;
    }
    return true;
  });

  return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar isLoggedIn={true} />

        {/* Hero Section with Search */}
        <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background pt-24 pb-12">
          <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                探索世界精彩景点
              </h1>
              <p className="text-muted-foreground text-lg">
                发现热门景区，预订优惠门票，开启难忘旅程
              </p>
            </div>

            {/* Search Bar */}
            <Card className="max-w-5xl mx-auto p-2 shadow-lg border-primary/20">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-accent/5">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="目的地或景区名称"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-accent/5">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="游玩日期"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-accent/5">
                  <TicketIcon className="w-5 h-5 text-muted-foreground" />
                  <Select value={ticketType} onValueChange={setTicketType}>
                    <SelectTrigger className="border-0 bg-transparent p-0 focus:ring-0">
                      <SelectValue placeholder="门票类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adult">成人票</SelectItem>
                      <SelectItem value="child">儿童票</SelectItem>
                      <SelectItem value="student">学生票</SelectItem>
                      <SelectItem value="senior">老年票</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-accent/5">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="人数"
                  />
                </div>
                <Button size="lg" className="gap-2 px-8">
                  <Search className="w-5 h-5" />
                  搜索
                </Button>
              </div>
            </Card>

            {/* Attraction Categories */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {attractionCategories.map((category) => (
                  <Card
                      key={category.value}
                      className={`px-6 py-4 cursor-pointer transition-all hover:shadow-md hover:scale-105 ${
                          selectedCategories.includes(category.value)
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-card hover:bg-accent/10"
                      }`}
                      onClick={() =>
                          setSelectedCategories((prev) =>
                              prev.includes(category.value)
                                  ? prev.filter((c) => c !== category.value)
                                  : [...prev, category.value]
                          )
                      }
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <div className="text-sm font-medium">{category.label}</div>
                    </div>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12 flex-1">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Filters Sidebar */}
              <div className="w-80 shrink-0 sticky top-[88px] h-fit">
                <TicketFilters filters={filters} onFilterChange={setFilters} />
              </div>

              {/* Results */}
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">
                    找到 <span className="text-primary">{filteredTickets.length}</span> 个景点
                  </h2>
                  <p className="text-muted-foreground">为您精选最热门的旅游景点</p>
                </div>

                <div className="space-y-6">
                  {filteredTickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
  );
};

export default BookTicket;