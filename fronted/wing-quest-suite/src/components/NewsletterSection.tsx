import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, ArrowRight } from "lucide-react";

const NewsletterSection = () => {
  return (
    <section className="relative py-24 bg-accent overflow-hidden">
      {/* Decorative dotted flight path */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1200 400">
          <path
            d="M 0 200 Q 300 100 600 200 T 1200 200"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10,10"
          />
        </svg>
      </div>

      {/* Animated plane icon */}
      <div className="absolute top-1/2 left-1/4 animate-float">
        <Plane className="w-8 h-8 text-white/50 rotate-45" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">
            想要第一时间了解<br />
            最新 <span className="text-white">精彩的</span> 旅行优惠？
          </h2>
          
          <p className="text-lg text-primary/80">
            接收我们的电子邮件，获取您的 ✈️ 旅行小贴士
          </p>

          {/* Newsletter Form */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <Input 
              type="email" 
              placeholder="输入您的电子邮件地址" 
              className="flex-1 h-14 px-6 text-lg bg-white border-none shadow-lg"
            />
            <Button variant="default" size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 group shadow-lg">
              订阅
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Social proof badge */}
          <div className="inline-block bg-white rounded-2xl px-6 py-3 shadow-lg">
            <p className="text-sm text-muted-foreground">
              已有 <span className="text-primary font-bold">32,783+</span> 位旅客订阅
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
