import { Plane } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BoardingPassProps {
  passengerName: string;
  bookingReference: string;
  seatNumber: string;
  baggageAllowance: string;
  flightNumber: string;
  airline: string;
  departure: {
    code: string;
    city: string;
    airport: string;
    time: string;
    terminal: string;
  };
  arrival: {
    code: string;
    city: string;
    airport: string;
    time: string;
  };
  boardingTime: string;
  ticketNumber: string;
  gate: string;
  cabinClass: string;
}

const BoardingPass = ({ 
  passengerName, 
  bookingReference, 
  seatNumber,
  baggageAllowance,
  flightNumber,
  airline,
  departure,
  arrival,
  boardingTime,
  ticketNumber,
  gate,
  cabinClass
}: BoardingPassProps) => {
  return (
    <div className="animate-[slideUp_0.6s_ease-out] relative">
      <Card className="w-full mx-auto overflow-hidden shadow-2xl border-l-8 border-l-primary">
        <div className="bg-gradient-to-br from-background via-secondary/10 to-background p-6 flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plane className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-bold text-lg">{airline}</div>
              <div className="text-xs text-muted-foreground">电子登机牌</div>
            </div>
            <div className="ml-auto">
              <div className="text-xs text-muted-foreground">舱位</div>
              <div className="font-semibold">{cabinClass}</div>
            </div>
          </div>

          {/* Flight Info */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-6">
            <div>
              <div className="text-4xl font-bold">{departure.code}</div>
              <div className="text-xl font-medium mt-1">{departure.time}</div>
              <div className="text-sm text-muted-foreground mt-1">{departure.city}</div>
              <div className="text-xs text-muted-foreground">{departure.airport}</div>
            </div>

            <div className="flex flex-col items-center px-4">
              <div className="text-xs text-muted-foreground mb-1">直飞</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <Plane className="h-5 w-5 text-primary" />
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{flightNumber}</div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold">{arrival.code}</div>
              <div className="text-xl font-medium mt-1">{arrival.time}</div>
              <div className="text-sm text-muted-foreground mt-1">{arrival.city}</div>
              <div className="text-xs text-muted-foreground">{arrival.airport}</div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div>
              <div className="text-xs text-muted-foreground mb-1">乘客姓名</div>
              <div className="font-semibold">{passengerName}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">预订编号</div>
              <div className="font-semibold">{bookingReference}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">座位号</div>
              <div className="font-semibold text-primary text-lg">{seatNumber}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">行李限额</div>
              <div className="font-semibold">{baggageAllowance}</div>
            </div>
          </div>

          {/* Boarding Details */}
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <div className="text-xs text-muted-foreground mb-1">登机时间</div>
              <div className="font-semibold">{boardingTime}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">票号</div>
              <div className="font-semibold text-sm">{ticketNumber}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">航站楼</div>
              <div className="font-semibold text-lg text-primary">{departure.terminal}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">登机口</div>
              <div className="font-semibold text-lg text-primary">{gate}</div>
            </div>
          </div>

          {/* Notice */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              请提前45分钟到达登机口 · 携带有效身份证件 · 祝您旅途愉快
            </p>
          </div>
          </div>

          {/* Barcode - Right Side Rotated */}
          <div className="flex items-center justify-center border-l border-border pl-4">
            <div className="flex flex-col items-center justify-center rotate-90 origin-center" style={{ width: '60px' }}>
              <div className="mb-2">
                <svg width="200" height="60">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <rect
                      key={i}
                      x={i * 5}
                      y="0"
                      width={Math.random() > 0.5 ? 2 : 3}
                      height="60"
                      fill="currentColor"
                      className="text-foreground"
                    />
                  ))}
                </svg>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">{ticketNumber}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BoardingPass;