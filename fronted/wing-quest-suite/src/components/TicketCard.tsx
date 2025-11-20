import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Heart, Ticket } from "lucide-react";

interface TicketCardProps {
  ticket: {
    id: number;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice?: number;
    type: string;
    image: string;
    tags: string[];
    highlights: string[];
    openTime: string;
  };
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const navigate = useNavigate();

  return (
      <Card
          className="overflow-hidden group hover:shadow-xl transition-all cursor-pointer border-0 shadow-lg"
          onClick={() => navigate(`/ticket/${ticket.id}`)}
      >
        <div className="flex flex-col md:flex-row">
          {/* 图片区域 */}
          <div className="relative md:w-80 flex-shrink-0">
            <div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
              <img
                  src={ticket.image}
                  alt={ticket.name}
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
            <Badge className="absolute top-3 left-3 gap-1 bg-primary">
              <Star className="w-3 h-3 fill-current" />
              {ticket.rating}
            </Badge>
          </div>

          {/* 信息区域 */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1">
              {/* 标题和位置 */}
              <div className="mb-3">
                <Badge variant="outline" className="mb-2">
                  {ticket.type}
                </Badge>
                <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                  {ticket.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {ticket.location}
                </p>
              </div>

              {/* 评价 */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{ticket.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                {ticket.reviews}条评价
              </span>
              </div>

              {/* 亮点 */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {ticket.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                  ))}
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {ticket.tags.map((tag, index) => (
                    <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground"
                    >
                  {tag}
                </span>
                ))}
              </div>

              {/* 开放时间 */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{ticket.openTime}</span>
              </div>
            </div>

            {/* 价格和预订 */}
            <div className="flex items-end justify-between mt-4 pt-4 border-t">
              <div>
                <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  ¥{ticket.price}
                </span>
                  {ticket.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                    ¥{ticket.originalPrice}
                  </span>
                  )}
                  <span className="text-sm text-muted-foreground">/人</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  已售 {Math.floor(Math.random() * 10000)}+ 张
                </p>
              </div>
              <Button className="gap-2">
                <Ticket className="w-4 h-4" />
                立即预订
              </Button>
            </div>
          </div>
        </div>
      </Card>
  );
};

export default TicketCard;