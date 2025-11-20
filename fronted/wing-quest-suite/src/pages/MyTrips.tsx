import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TripTimeline from "@/components/trips/TripTimeline";
import TripMap from "@/components/trips/TripMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapIcon, Wallet } from "lucide-react";

// Mock 数据
const mockTripItems = [
  {
    id: "1",
    type: "flight" as const,
    date: new Date(2024, 11, 15),
    title: "CA1234 北京 → 上海",
    location: "北京首都国际机场",
    time: "08:00",
    details: {
      from: "北京",
      to: "上海",
      flightNumber: "CA1234",
      airline: "中国国航",
    },
  },
  {
    id: "2",
    type: "hotel" as const,
    date: new Date(2024, 11, 15),
    title: "上海外滩华尔道夫酒店",
    location: "上海市黄浦区中山东一路2号",
    time: "14:00",
    details: {
      checkIn: "12月15日",
      checkOut: "12月18日",
      nights: 3,
    },
  },
  {
    id: "3",
    type: "ticket" as const,
    date: new Date(2024, 11, 16),
    title: "上海迪士尼乐园",
    location: "上海市浦东新区川沙镇黄赵路310号",
    time: "09:00",
    details: {
      quantity: 2,
      price: 399,
    },
  },
  {
    id: "4",
    type: "ticket" as const,
    date: new Date(2024, 11, 17),
    title: "上海东方明珠",
    location: "上海市浦东新区世纪大道1号",
    time: "10:00",
    details: {
      quantity: 2,
      price: 180,
    },
  },
  {
    id: "5",
    type: "flight" as const,
    date: new Date(2024, 11, 18),
    title: "CA1235 上海 → 北京",
    location: "上海浦东国际机场",
    time: "16:00",
    details: {
      from: "上海",
      to: "北京",
      flightNumber: "CA1235",
      airline: "中国国航",
    },
  },
];

const mockLocations = [
  {
    id: "1",
    name: "北京首都国际机场",
    coordinates: [116.5974, 40.0801] as [number, number],
    type: "flight" as const,
  },
  {
    id: "2",
    name: "上海外滩华尔道夫酒店",
    coordinates: [121.4906, 31.2394] as [number, number],
    type: "hotel" as const,
  },
  {
    id: "3",
    name: "上海迪士尼乐园",
    coordinates: [121.6644, 31.1434] as [number, number],
    type: "ticket" as const,
  },
  {
    id: "4",
    name: "上海东方明珠",
    coordinates: [121.4995, 31.2397] as [number, number],
    type: "ticket" as const,
  },
];

const MyTrips = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 计算总费用
  const totalCost = mockTripItems.reduce((sum, item) => {
    if (item.type === "flight") return sum + 1280;
    if (item.type === "hotel") return sum + 1800;
    if (item.type === "ticket") return sum + item.details.price * item.details.quantity;
    return sum;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} />

      <div className="flex-1 pt-20">
        {/* 顶部统计卡片 */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">我的行程</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">行程天数</CardTitle>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4 天</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    12月15日 - 12月18日
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">预订项目</CardTitle>
                  <MapIcon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockTripItems.length} 项</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">2 航班</Badge>
                    <Badge variant="outline">1 酒店</Badge>
                    <Badge variant="outline">2 门票</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">预算总计</CardTitle>
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">¥{totalCost}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    平均 ¥{Math.round(totalCost / 4)}/天
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="timeline">时间线视图</TabsTrigger>
              <TabsTrigger value="map">地图视图</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* 左侧：时间线 */}
                <div className="lg:col-span-2">
                  <Card className="p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle>行程安排</CardTitle>
                      <CardDescription>
                        您的完整旅行时间表
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <TripTimeline
                        items={mockTripItems}
                        onItemClick={setSelectedItem}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* 右侧：地图 */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>位置地图</CardTitle>
                        <CardDescription>
                          查看所有行程位置
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="h-[600px]">
                          <TripMap locations={mockLocations} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="map">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>地图视图</CardTitle>
                  <CardDescription>
                    在地图上查看您的所有行程位置
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[calc(100vh-300px)] min-h-[600px]">
                    <TripMap locations={mockLocations} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyTrips;