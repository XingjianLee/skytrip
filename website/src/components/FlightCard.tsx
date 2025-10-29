import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, Wifi, Utensils, Tv, MapPin } from "lucide-react";

interface FlightCardProps {
  flight: any;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const navigate = useNavigate();

  const facilityIcons = {
    wifi: <Wifi className="h-4 w-4" />,
    meal: <Utensils className="h-4 w-4" />,
    tv: <Tv className="h-4 w-4" />
  };

  const handleSelect = () => {
    navigate("/order-flight", { state: { flight } });
  };

  // Get airline logo based on airline name
  // Direct flight
  if (flight.direct) {
    return (
        <div className="bg-card rounded-xl shadow-card hover:shadow-card-hover border border-border/50 transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
          {/* Decorative top bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <Plane className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{flight.airline}</h3>
                <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
              </div>
              <Badge variant="outline" className="bg-primary/5">
                直达
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-4 relative">
              {/* Departure */}
              <div className="flex-1 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-l-lg">
                <div className="text-3xl font-bold text-foreground">{flight.departure.time}</div>
                <div className="text-sm font-medium text-foreground mt-1">{flight.departure.airport}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {flight.departure.code}
                </div>
              </div>

              {/* Duration with animation */}
              <div className="flex-1 px-6 relative">
                <div className="flex flex-col items-center">
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    {flight.duration}
                  </div>
                  <div className="w-full relative">
                    <div className="w-full h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <div className="text-xs text-primary mt-2 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    直达航班
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="flex-1 text-right bg-gradient-to-l from-accent/5 to-transparent p-4 rounded-r-lg">
                <div className="text-3xl font-bold text-foreground">{flight.arrival.time}</div>
                <div className="text-sm font-medium text-foreground mt-1">{flight.arrival.airport}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                  <MapPin className="w-3 h-3" />
                  {flight.arrival.code}
                </div>
              </div>
            </div>

            {/* Facilities and Price */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-3">
                {flight.facilities.map((facility: string) => (
                    <div
                        key={facility}
                        className="flex items-center gap-1 text-muted-foreground"
                        title={facility}
                    >
                      {facilityIcons[facility as keyof typeof facilityIcons]}
                    </div>
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                剩余 {flight.seats} 座
              </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent">¥{flight.price}</div>
                  <div className="text-xs text-muted-foreground">含税费</div>
                </div>
                <Button
                    className="bg-gradient-accent hover:shadow-accent transition-all group-hover:scale-105"
                    onClick={handleSelect}
                >
                  选择
                </Button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  // Connecting flight
  return (
      <div className="bg-card rounded-xl shadow-card hover:shadow-card-hover border border-border/50 transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
        {/* Decorative top bar */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500" />

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-md">
              <Plane className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">中转航班</h3>
              <p className="text-sm text-muted-foreground">
                {flight.segments.length} 个航段 · {flight.segments[0].airline}
              </p>
            </div>
            <Badge variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-200">
              中转
            </Badge>
          </div>

          {/* Flight segments */}
          <div className="space-y-4 mb-4">
            {flight.segments.map((segment: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between bg-gradient-to-r from-accent/5 to-primary/5 p-3 rounded-lg">
                    {/* Departure */}
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-foreground">{segment.departure.time}</div>
                      <div className="text-sm font-medium text-foreground mt-1">{segment.departure.airport}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {segment.departure.code}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex-1 px-4">
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                          <Clock className="h-3 w-3" />
                          {segment.duration}
                        </div>
                        <div className="w-full relative">
                          <div className="w-full h-0.5 bg-gradient-to-r from-accent/50 to-accent" />
                          <Plane className="absolute -top-2 right-0 h-4 w-4 text-accent" />
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 font-mono">{segment.flightNumber}</div>
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="flex-1 text-right">
                      <div className="text-2xl font-bold text-foreground">{segment.arrival.time}</div>
                      <div className="text-sm font-medium text-foreground mt-1">{segment.arrival.airport}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                        <MapPin className="w-3 h-3" />
                        {segment.arrival.code}
                      </div>
                    </div>
                  </div>

                  {/* Transfer info */}
                  {index < flight.segments.length - 1 && (
                      <div className="flex items-center justify-center gap-2 py-3 my-3 bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 dark:from-orange-950/20 dark:via-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    在 {segment.arrival.airport} 中转 · 停留 {flight.transferTime}
                  </span>
                      </div>
                  )}
                </div>
            ))}
          </div>

          {/* Total info */}
          <div className="bg-secondary/30 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">总飞行时间</span>
              <span className="font-medium text-foreground">{flight.totalDuration}</span>
            </div>
          </div>

          {/* Facilities and Price */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              {flight.facilities.map((facility: string) => (
                  <div
                      key={facility}
                      className="flex items-center gap-1 text-muted-foreground"
                      title={facility}
                  >
                    {facilityIcons[facility as keyof typeof facilityIcons]}
                  </div>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
              剩余 {flight.seats} 座
            </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-accent">¥{flight.price}</div>
                <div className="text-xs text-muted-foreground">含税费</div>
              </div>
              <Button
                  className="bg-gradient-accent hover:shadow-accent transition-all group-hover:scale-105"
                  onClick={handleSelect}
              >
                选择
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}
