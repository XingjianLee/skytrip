import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hotel, Plane, Users, FileCheck, Shield, ArrowRight } from "lucide-react";
import travelerSuitcase from "@/assets/traveler-suitcase.png";

const services = [
  {
    icon: Hotel,
    title: "酒店预订",
    description: "不要再等待合适的时机",
  },
  {
    icon: Plane,
    title: "航班预订",
    description: "不要再等待合适的时机",
  },
  {
    icon: Users,
    title: "朝圣优惠",
    description: "不要再等待合适的时机",
  },
  {
    icon: Users,
    title: "副朝优惠",
    description: "不要再等待合适的时机",
  },
  {
    icon: Shield,
    title: "旅行保险",
    description: "不要再等待合适的时机",
  },
  {
    icon: FileCheck,
    title: "签证办理",
    description: "不要再等待合适的时机",
  },
];

const ServicesSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent rounded-full blur-3xl"></div>
      </div>

      {/* Dotted pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, rgba(123, 220, 143, 0.3) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <span className="text-accent text-sm font-semibold tracking-wider uppercase">
                #优惠
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              我们提供什么 <span className="text-accent">服务</span>
            </h2>
            
            <p className="text-lg text-white/80 max-w-xl">
              我们让旅行变得简单，只需几次点击即可预订您的航班和酒店，享受最优惠的价格、值得信赖的选择和无缝的规划体验。
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <Card 
                  key={index}
                  className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-accent cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                      <service.icon className="w-6 h-6 text-accent group-hover:text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{service.title}</h3>
                      <p className="text-white/70 text-sm">{service.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="accent" size="lg" className="group">
              了解更多
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Content - Traveler Image with decorative circle */}
          <div className="relative animate-fade-in hidden lg:block">
            <div className="relative">
              {/* Large decorative circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] rounded-full bg-accent/30 border-4 border-dashed border-accent/50 animate-spin" style={{ animationDuration: '20s' }}></div>
              </div>
              
              {/* Traveler image */}
              <div className="relative z-10 flex items-center justify-center">
                <img 
                  src={travelerSuitcase} 
                  alt="Traveler with suitcase" 
                  className="w-[400px] h-auto drop-shadow-2xl animate-float"
                />
              </div>

              {/* Small plane icon */}
              <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-accent">
                  <Plane className="w-8 h-8 text-accent rotate-45" />
                </div>
              </div>

              {/* Travelers count badge */}
              <div className="absolute top-1/3 left-0 bg-white rounded-2xl px-6 py-3 shadow-card-hover animate-scale-in">
                <p className="text-sm text-muted-foreground mb-1">已出行</p>
                <p className="text-2xl font-bold text-primary">32,783+ <span className="text-sm font-normal text-muted-foreground">位旅客</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
