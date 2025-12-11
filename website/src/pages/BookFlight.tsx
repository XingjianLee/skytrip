import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlightSearchBar, { SearchData } from "@/components/FlightSearchBar";
import FlightFilters from "@/components/FlightFilters";
import FlightCard from "@/components/FlightCard";
import { searchFlights, getFlightPricing, getFlightAvailability } from "@/lib/api";
import { toast } from "sonner";

type CabinClassOption = "all" | "economy" | "business" | "first";
type SortOption = "price" | "duration" | "departure";
interface FiltersState {
  direct: boolean;
  cabinClass: CabinClassOption;
  facilities: string[];
  sortBy: SortOption;
  priceRange: number[];
}

// Mock flight data
const mockFlights = [
  {
    id: 1,
    airline: "中国国航",
    flightNumber: "CA1234",
    departure: {
      airport: "北京首都国际机场",
      code: "PEK",
      time: "08:00",
      date: "2024-11-15"
    },
    arrival: {
      airport: "上海浦东国际机场",
      code: "PVG",
      time: "10:30",
      date: "2024-11-15"
    },
    duration: "2h 30m",
    price: 1280,
    cabinClass: "economy",
    direct: true,
    facilities: ["wifi", "meal"],
    seats: 23
  },
  {
    id: 2,
    airline: "东方航空",
    flightNumber: "MU5678",
    departure: {
      airport: "北京首都国际机场",
      code: "PEK",
      time: "10:15",
      date: "2024-11-15"
    },
    arrival: {
      airport: "上海浦东国际机场",
      code: "PVG",
      time: "12:50",
      date: "2024-11-15"
    },
    duration: "2h 35m",
    price: 980,
    cabinClass: "economy",
    direct: true,
    facilities: ["meal"],
    seats: 15
  },
  {
    id: 3,
    segments: [
      {
        airline: "南方航空",
        flightNumber: "CZ3456",
        departure: {
          airport: "北京首都国际机场",
          code: "PEK",
          time: "14:30",
          date: "2024-11-15"
        },
        arrival: {
          airport: "武汉天河国际机场",
          code: "WUH",
          time: "16:45",
          date: "2024-11-15"
        },
        duration: "2h 15m"
      },
      {
        airline: "南方航空",
        flightNumber: "CZ7890",
        departure: {
          airport: "武汉天河国际机场",
          code: "WUH",
          time: "18:20",
          date: "2024-11-15"
        },
        arrival: {
          airport: "上海浦东国际机场",
          code: "PVG",
          time: "20:10",
          date: "2024-11-15"
        },
        duration: "1h 50m"
      }
    ],
    totalDuration: "5h 40m",
    transferTime: "1h 35m",
    price: 750,
    cabinClass: "economy",
    direct: false,
    facilities: ["wifi", "meal", "tv"],
    seats: 42
  },
  {
    id: 4,
    airline: "海南航空",
    flightNumber: "HU8901",
    departure: {
      airport: "北京首都国际机场",
      code: "PEK",
      time: "16:45",
      date: "2024-11-15"
    },
    arrival: {
      airport: "上海浦东国际机场",
      code: "PVG",
      time: "19:15",
      date: "2024-11-15"
    },
    duration: "2h 30m",
    price: 1580,
    cabinClass: "business",
    direct: true,
    facilities: ["wifi", "meal", "tv"],
    seats: 8
  }
];

export default function BookFlight() {
  const [filters, setFilters] = useState<FiltersState>({
    direct: false,
    cabinClass: "all",
    facilities: [],
    sortBy: "price",
    priceRange: [0, 10000]
  });

  const [flights, setFlights] = useState<any[]>([]);

  const handleSearch = async (data: SearchData) => {
    try {
      const req: any = {
        departure_city: data.from,
        arrival_city: data.to,
        departure_date: data.departDate,
        adult_count: data.passengers,
      };
      // 可选 cabin_class（仅当不是 all）
      if (filters.cabinClass && filters.cabinClass !== "all") {
        req.cabin_class = filters.cabinClass;
      }
      // 价格区间
      if (filters.priceRange && filters.priceRange.length === 2) {
        req.price_min = filters.priceRange[0];
        req.price_max = filters.priceRange[1];
      }

      const resp = await searchFlights(req);
      const results = resp?.outbound_flights || [];
      // 映射后端结果到前端卡片结构
      const mapped = results.map((r: any) => ({
        id: r.flight_id,
        airline: r.airline_name,
        flightNumber: r.flight_number,
        departure: {
          airport: r.departure_airport_name,
          code: r.departure_airport_code,
          time: r.scheduled_departure_time,
          date: r.departure_date,
        },
        arrival: {
          airport: r.arrival_airport_name,
          code: r.arrival_airport_code,
          time: r.scheduled_arrival_time,
          date: r.arrival_date,
        },
        // 计算时长（基于计划时刻）
        duration: (() => {
          try {
            const [dh, dm] = String(r.scheduled_departure_time).split(":").map((x: string) => parseInt(x, 10));
            const [ah, am] = String(r.scheduled_arrival_time).split(":").map((x: string) => parseInt(x, 10));
            let depMin = dh * 60 + dm;
            let arrMin = ah * 60 + am;
            if (arrMin < depMin) arrMin += 24 * 60; // 次日到达
            const diff = Math.max(arrMin - depMin, 0);
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            return `${h}h ${m}m`;
          } catch {
            return "";
          }
        })(),
        price: r.current_price || 0, // 将在后续用后端定价覆盖
        cabinClass: filters.cabinClass === "all" ? "economy" : filters.cabinClass,
        direct: true,
        facilities: [],
        seats: r.available_seats || 0, // 将在后续用后端可用座覆盖
        pricingMap: undefined,
        availabilityMap: undefined,
      }));
      // 拉取每个航班的定价与可用座
      const enriched = await Promise.all(mapped.map(async (f: any) => {
        try {
          const [pricingList, availabilityList] = await Promise.all([
            getFlightPricing(f.id),
            getFlightAvailability(f.id, f.departure.date),
          ]);
          const pricingMap: Record<"economy" | "business" | "first", number> = { economy: 0, business: 0, first: 0 };
          for (const p of pricingList) {
            pricingMap[p.cabin_class] = p.base_price;
          }
          const availabilityMap: Record<"economy" | "business" | "first", number> = { economy: 0, business: 0, first: 0 };
          for (const a of availabilityList) {
            availabilityMap[a.cabin_class] = a.available_seats;
          }
          // 根据当前筛选舱位更新卡片的主价与主座显示
          const selected = f.cabinClass === "all" ? "economy" : f.cabinClass;
          const price = pricingMap[selected] ?? f.price;
          const seats = availabilityMap[selected] ?? f.seats;
          return { ...f, pricingMap, availabilityMap, price, seats };
        } catch {
          return f;
        }
      }));
      setFlights(enriched);
      toast.success(`已为您找到 ${mapped.length} 个航班`);
    } catch (e: any) {
      console.error("Search error:", e?.message || e);
      toast.error(e?.message || "搜索失败");
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Filter and sort flights based on current filters
  const filteredFlights = flights
    .filter(flight => {
      if (filters.direct && !flight.direct) return false;
      if (filters.cabinClass !== "all" && flight.cabinClass !== filters.cabinClass) return false;
      if (filters.facilities.length > 0) {
        const hasAllFacilities = filters.facilities.every(f => flight.facilities.includes(f));
        if (!hasAllFacilities) return false;
      }
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === "price") {
        return a.price - b.price;
      } else if (filters.sortBy === "duration") {
        const getDuration = (flight: any) => {
          if (flight.direct) {
            return parseInt(flight.duration);
          } else {
            return parseInt(flight.totalDuration);
          }
        };
        return getDuration(a) - getDuration(b);
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} />

      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background pt-24 pb-12">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              智能机票预订
            </h1>
            <p className="text-muted-foreground text-lg">
              比价更快，出行更省心，为您找到最优惠的航班
            </p>
          </div>

          {/* Search Bar */}
          <FlightSearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 shrink-0">
              <div className="sticky top-24">
                <FlightFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">
                  找到 <span className="text-primary">{filteredFlights.length}</span> 个航班
                </h2>
                <p className="text-muted-foreground">为您精选最优惠的航班方案</p>
              </div>

              <div className="space-y-4">
                {filteredFlights.map(flight => (
                  <FlightCard key={flight.id} flight={flight} selectedCabin={filters.cabinClass} />
                ))}
              </div>

              {filteredFlights.length === 0 && (
                <div className="bg-card rounded-lg p-12 text-center shadow-sm">
                  <p className="text-muted-foreground text-lg">
                    没有找到符合条件的航班，请调整搜索条件
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
