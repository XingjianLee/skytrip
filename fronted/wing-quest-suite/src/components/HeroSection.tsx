import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plane, Hotel, CalendarIcon, Users, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import heroTraveler from "@/assets/hero-traveler.jpg";
import destinationEgypt from "@/assets/destination-egypt.jpg";
import destinationDubai from "@/assets/destination-dubai.jpg";

const HeroSection = () => {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  return (
    <section id="home" className="relative min-h-screen bg-gradient-hero overflow-hidden pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-block">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase">
                #顶级旅行平台
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              预订您的下一次{" "}
              <span className="text-accent">冒险之旅</span> 就在今天！
            </h1>

            <p className="text-lg text-white/80 max-w-xl">
              不要再等待合适的时机去探索世界了！现在就开始您的旅程，与我们一起获得难忘的冒险时刻。
            </p>


          </div>

          {/* Right Content - Traveler Image */}
          <div className="relative animate-fade-in hidden lg:block">
            <img
              src={heroTraveler}
              alt="Traveler"
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </div>
        </div>

        {/* Search Form */}
        <Card className="mt-12 p-8 shadow-2xl animate-scale-in bg-white">
          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="flights" className="flex items-center gap-2">
                <Plane className="w-4 h-4" />
                航班
              </TabsTrigger>
              <TabsTrigger value="hotels" className="flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                酒店
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flights" className="space-y-6">
              <RadioGroup defaultValue="round-trip" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="round-trip" id="round-trip" />
                  <Label htmlFor="round-trip">往返</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-way" id="one-way" />
                  <Label htmlFor="one-way">单程</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multi-city" id="multi-city" />
                  <Label htmlFor="multi-city">多城市</Label>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>出发地</Label>
                  <Input placeholder="孟买" defaultValue="孟买" />
                  <span className="text-xs text-muted-foreground">BOM, Chhatrapati Shivaji Int...</span>
                </div>

                <div className="space-y-2">
                  <Label>目的地</Label>
                  <Input placeholder="利雅得" defaultValue="利雅得" />
                  <span className="text-xs text-muted-foreground">RUH, King Khaled Intl Saudi A...</span>
                </div>

                <div className="space-y-2">
                  <Label>出发日期</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departureDate ? format(departureDate, "PPP", { locale: zhCN }) : "8月8日'24"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-xs text-muted-foreground">星期四</span>
                </div>

                <div className="space-y-2">
                  <Label>返程日期</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "PPP", { locale: zhCN }) : "8月25日'24"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-xs text-muted-foreground">星期日</span>
                </div>

                <div className="space-y-2">
                  <Label>旅客 & 舱位</Label>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Users className="mr-2 h-4 w-4" />
                    1 位旅客
                  </Button>
                  <span className="text-xs text-muted-foreground">高级经济舱</span>
                </div>
              </div>

              <Button variant="hero" size="lg" className="w-full md:w-auto px-12">
                <Search className="mr-2 h-5 w-5" />
                搜索航班
              </Button>
            </TabsContent>

            <TabsContent value="hotels">
              <div className="text-center py-12 text-muted-foreground">
                酒店预订功能即将推出...
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
