import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users, SlidersHorizontal, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const propertyTypes = [
  { icon: "🏠", label: "别墅", value: "villa" },
  { icon: "🏨", label: "酒店", value: "hotel" },
  { icon: "🏢", label: "公寓", value: "apartment" },
  { icon: "🏡", label: "民宿", value: "guesthouse" },
  { icon: "🎫", label: "优惠券", value: "voucher" },
  { icon: "💰", label: "超值优惠", value: "deal" },
  { icon: "✅", label: "待办", value: "todo" },
];

const mockHotels = [
  {
    id: 1,
    name: "马里布海景豪宅",
    location: "北京市朝阳区建国路88号",
    rating: 4.8,
    beds: 3,
    baths: 1,
    price: 620,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  },
  {
    id: 2,
    name: "星光山顶小屋",
    location: "上海市浦东新区陆家嘴环路1000号",
    rating: 4.8,
    beds: 3,
    baths: 1,
    price: 520,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    id: 3,
    name: "月光木屋度假村",
    location: "广州市天河区珠江新城花城大道123号",
    rating: 4.8,
    beds: 3,
    baths: 1,
    price: 540,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
  {
    id: 4,
    name: "水晶湖畔别墅",
    location: "深圳市南山区科技园南区深南大道9988号",
    rating: 4.8,
    beds: 3,
    baths: 2,
    price: 620,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
  },
];

const BookHotel = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("北京");
  const [checkIn, setCheckIn] = useState("2024年1月5日");
  const [checkOut, setCheckOut] = useState("2024年1月25日");
  const [guests, setGuests] = useState("4位成人");
  const [priceRange, setPriceRange] = useState([120, 700]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["villa"]);
  const [locationArea, setLocationArea] = useState("");
  const [ratingSort, setRatingSort] = useState<"none" | "asc" | "desc">("none");
  const [starRating, setStarRating] = useState<number[]>([]);

  return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar isLoggedIn={true} />

        {/* Hero Section with Search */}
        <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background pt-24 pb-12">
          <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                享受无限精彩旅程
              </h1>
              <p className="text-muted-foreground text-lg">
                寻找理想住宿和精彩体验
              </p>
            </div>

            {/* Search Bar */}
            <Card className="max-w-5xl mx-auto p-2 shadow-lg border-primary/20">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-accent/5">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="目的地城市"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-accent/5">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <Input
                      value={locationArea}
                      onChange={(e) => setLocationArea(e.target.value)}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="区域/地标"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-accent/5">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <Input
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="入住日期"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-accent/5">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <Input
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="退房日期"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-accent/5">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <Input
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      placeholder="入住人数"
                  />
                </div>
                <Button size="lg" className="gap-2 px-8">
                  <Search className="w-5 h-5" />
                  搜索
                </Button>
              </div>
            </Card>

            {/* Property Types */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {propertyTypes.map((type) => (
                  <Card
                      key={type.value}
                      className={`px-6 py-4 cursor-pointer transition-all hover:shadow-md hover:scale-105 ${
                          selectedTypes.includes(type.value)
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-card hover:bg-accent/10"
                      }`}
                      onClick={() =>
                          setSelectedTypes((prev) =>
                              prev.includes(type.value)
                                  ? prev.filter((t) => t !== type.value)
                                  : [...prev, type.value]
                          )
                      }
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </div>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12 flex-1">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-80 shrink-0">
                <Card className="p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">筛选条件</h3>
                    <Button variant="ghost" size="sm">清除全部 (3)</Button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <Label className="mb-4 block font-semibold">价格区间</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      12晚的平均总价为 ¥2,694
                    </p>
                    <div className="space-y-4">
                      <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={1000}
                          step={10}
                          className="mb-4"
                      />
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label className="text-xs">最低价</Label>
                          <div className="flex items-center gap-2 border rounded-md px-3 py-2 mt-1">
                            <span className="text-muted-foreground">¥</span>
                            <span>{priceRange[0]}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs">最高价</Label>
                          <div className="flex items-center gap-2 border rounded-md px-3 py-2 mt-1">
                            <span className="text-muted-foreground">¥</span>
                            <span>{priceRange[1]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Sort */}
                  <div className="mb-6">
                    <Label className="mb-4 block font-semibold">评分排序</Label>
                    <div className="space-y-2">
                      <Button
                          variant={ratingSort === "none" ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setRatingSort("none")}
                      >
                        不排序
                      </Button>
                      <Button
                          variant={ratingSort === "desc" ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setRatingSort("desc")}
                      >
                        评分从高到低
                      </Button>
                      <Button
                          variant={ratingSort === "asc" ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setRatingSort("asc")}
                      >
                        评分从低到高
                      </Button>
                    </div>
                  </div>

                  {/* Star Rating Filter */}
                  <div className="mb-6">
                    <Label className="mb-4 block font-semibold">酒店星级</Label>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((star) => (
                          <div
                              key={star}
                              className="flex items-start space-x-3 cursor-pointer"
                              onClick={() => {
                                setStarRating((prev) =>
                                    prev.includes(star)
                                        ? prev.filter((s) => s !== star)
                                        : [...prev, star]
                                );
                              }}
                          >
                            <Checkbox
                                id={`star-${star}`}
                                checked={starRating.includes(star)}
                                onCheckedChange={() => {}}
                            />
                            <div className="space-y-1">
                              <label
                                  htmlFor={`star-${star}`}
                                  className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1"
                              >
                                {Array.from({ length: star }).map((_, i) => (
                                    <span key={i} className="text-yellow-500">★</span>
                                ))}
                                {Array.from({ length: 5 - star }).map((_, i) => (
                                    <span key={i} className="text-gray-300">★</span>
                                ))}
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {star === 5 && "豪华五星级酒店"}
                                {star === 4 && "高档四星级酒店"}
                                {star === 3 && "舒适三星级酒店"}
                                {star === 2 && "经济二星级酒店"}
                                {star === 1 && "简约一星级酒店"}
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* Type of place */}
                  <div className="mb-6">
                    <Label className="mb-4 block font-semibold">房源类型</Label>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox id="entire" defaultChecked />
                        <div className="space-y-1">
                          <label htmlFor="entire" className="text-sm font-medium leading-none">
                            整套房源
                          </label>
                          <p className="text-sm text-muted-foreground">
                            独享整套房源
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Checkbox id="room" defaultChecked />
                        <div className="space-y-1">
                          <label htmlFor="room" className="text-sm font-medium leading-none">
                            独立房间
                          </label>
                          <p className="text-sm text-muted-foreground">
                            拥有独立房间，可使用共享空间
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rooms and beds */}
                  <div className="mb-6">
                    <Label className="mb-4 block font-semibold">房间和床位</Label>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm mb-2 block">卧室</Label>
                        <div className="flex gap-2">
                          {["不限", "1", "2", "3", "4", "5"].map((num) => (
                              <Button
                                  key={num}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                              >
                                {num}
                              </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm mb-2 block">床位</Label>
                        <div className="flex gap-2">
                          {["不限", "1", "2", "3", "4", "5"].map((num) => (
                              <Button
                                  key={num}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                              >
                                {num}
                              </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property type */}
                  <div>
                    <Label className="mb-4 block font-semibold">住宿类型</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start gap-2">
                        🏠 房屋
                      </Button>
                      <Button variant="outline" className="justify-start gap-2">
                        🏢 公寓
                      </Button>
                      <Button variant="outline" className="justify-start gap-2">
                        🏡 别墅
                      </Button>
                      <Button variant="outline" className="justify-start gap-2">
                        🏨 酒店
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Results Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      在<span className="text-primary">北京</span>附近找到 1024 个结果
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden gap-2">
                          <SlidersHorizontal className="w-4 h-4" />
                          筛选
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>筛选条件</SheetTitle>
                        </SheetHeader>
                        {/* Mobile filters - same content as sidebar */}
                      </SheetContent>
                    </Sheet>
                    <Button variant="outline" size="sm">最新</Button>
                    <Button variant="outline" size="sm">地图视图</Button>
                    <Button variant="outline" size="sm">卡片视图</Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {mockHotels.map((hotel) => (
                      <Card
                          key={hotel.id}
                          className="overflow-hidden group hover:shadow-xl transition-all cursor-pointer"
                          onClick={() => navigate(`/hotel/${hotel.id}`)}
                      >
                        <div className="relative">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
                          >
                            <Heart className="w-5 h-5" />
                          </Button>
                          <Badge className="absolute top-3 left-3 gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {hotel.rating}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {hotel.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 flex items-start gap-1">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                            {hotel.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>🛏️ {hotel.beds}室</span>
                              <span>🚿 {hotel.baths}卫</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                ¥{hotel.price}
                                <span className="text-sm font-normal text-muted-foreground">/晚</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {[1, 2, 3, "...", 8, 9, 10].map((page, idx) => (
                      <Button
                          key={idx}
                          variant={page === 1 ? "default" : "outline"}
                          size="icon"
                          disabled={page === "..."}
                      >
                        {page}
                      </Button>
                  ))}
                  <Button variant="outline" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
  );
};

export default BookHotel;
