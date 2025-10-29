import { Card } from "@/components/ui/card";
import { Hotel, Search, Zap, MapPin, Users, Headphones } from "lucide-react";

const features = [
  {
    icon: Hotel,
    title: "百万酒店可选",
    description: "为您提供全球各地的酒店预订服务，从经济实惠到豪华选择，并提供价格对比。",
  },
  {
    icon: Search,
    title: "轻松搜索机票",
    description: "在线搜索机票，比较价格、机型、vip尊享服务，选择最适合您的航班。",
  },
  {
    icon: Zap,
    title: "独家酒店优惠",
    description: "探索全球各地的实惠酒店，比较价格，预订符合您预算的最优惠价格。",
  },
  {
    icon: MapPin,
    title: "景点快速预约",
    description: "我们为您提供知名景点的票务预约服务，为您带来最实惠的价格和优质的旅行体验。",
  },
  {
    icon: Users,
    title: "旅游咨询",
    description: "凭借我们团队的丰富经验，我们为您提供最佳解决方案，让您的旅程极其愉快且轻松。",
  },
  {
    icon: Headphones,
    title: "7x24全天候服务",
    description: "我们全天候为您服务，随时为您提供持续的建议和支持。",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase">
            #特色功能
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            我们的 <span className="text-accent">特色</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-white hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
