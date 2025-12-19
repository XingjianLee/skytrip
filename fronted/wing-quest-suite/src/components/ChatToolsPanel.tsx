import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar, RefreshCw, Headphones, Plane, Sparkles } from "lucide-react";

interface ChatToolsPanelProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const tools = [
  { id: "book-flight", name: "预订机票", icon: Plane, route: "/book-flight" },
  { id: "check-in", name: "在线值机", icon: CheckCircle2, route: "/check-in" },
  { id: "price-calendar", name: "价格日历", icon: Calendar, route: "/price-calendar" },
  { id: "refund", name: "退改签", icon: RefreshCw, route: "/refund-change" },
  { id: "support", name: "客服中心", icon: Headphones, route: "/customer-service" },
];

export default function ChatToolsPanel({ collapsed, onToggle }: ChatToolsPanelProps) {
  const navigate = useNavigate();

  if (collapsed) {
    return (
      <div className="h-full flex items-center">
        <Button variant="ghost" size="icon" onClick={onToggle} aria-label="展开工具">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">快捷工具</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} aria-label="收起工具">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-3 bg-card/80 backdrop-blur border-border">
        <div className="grid grid-cols-1 gap-2">
          {tools.map((t) => (
            <Button key={t.id} variant="outline" className="w-full justify-start gap-2" onClick={() => navigate(t.route)}>
              <t.icon className="w-4 h-4" />
              <span className="text-sm">{t.name}</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}

