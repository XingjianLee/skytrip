import { useState } from "react";
import { Calendar, MapPin, Users, Search, ArrowLeftRight } from "lucide-react";

export default function FlightSearchBar() {
  const [searchData, setSearchData] = useState({
    from: "北京",
    to: "上海",
    departDate: "2024-11-15",
    returnDate: "",
    passengers: 1,
    cabinClass: "economy"
  });

  const handleSwap = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-xl shadow-lg border border-primary/20 p-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
          {/* From */}
          <div className="md:col-span-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <input
                value={searchData.from}
                onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-accent/5 border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="出发城市"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="w-10 h-10 rounded-full hover:bg-accent/20 hover:text-accent transition-all flex items-center justify-center"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <input
                value={searchData.to}
                onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-accent/5 border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="到达城市"
              />
            </div>
          </div>

          {/* Date */}
          <div className="md:col-span-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <input
                type="date"
                value={searchData.departDate}
                onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-accent/5 border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Passengers */}
          <div className="md:col-span-2">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <input
                type="number"
                min="1"
                value={searchData.passengers}
                onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) })}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-accent/5 border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="乘客人数"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1">
            <button className="w-full h-[46px] bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all rounded-md flex items-center justify-center text-white">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
