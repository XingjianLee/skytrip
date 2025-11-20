import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "S. Dunnewind女士",
    text: "我们非常感谢您为我们精心安排了去阿尔塔的难忘之旅。我们目前在奥斯陆等待前往阿姆斯特丹的航班。我们真的很喜欢这里美丽的自然风光和精彩的短途旅行。感谢您为让这次旅行成为可能所付出的一切努力。一切都组织得非常好！",
    rating: 4.5,
    avatar: "👩",
  },
  {
    name: "Kees Dunnewind",
    text: "SkyTrip旅行社为我们安排了前往塔斯马尼亚、新西兰和巴厘岛的航班，包括抵达时的酒店和租车服务。航班安排得非常好，我们不用在任何地方等待太久。酒店就在机场，这样我们可以直接从一个航班到下一个航班，中转停留时间最多2小时。酒店就在机场，所以我们可以在第二天开始我们的旅程。",
    rating: 4.5,
    avatar: "👨",
  },
  {
    name: "J. Collins先生",
    text: "我们在新西兰的旅行真的很美妙。这是一次完美的体验，住宿安排得很好，一切都没有问题。旅程非常顺利，我们对这次旅行的每一个方面都很满意，一定会在下一次长途旅行时再次使用这个服务。",
    rating: 5,
    avatar: "👨‍💼",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16 animate-fade-in-up">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase">
            #用户评价
          </span>
          <div className="flex items-end justify-between mt-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              听听我们的<br />
              <span className="text-accent">旅客们</span>怎么说
            </h2>
            <div className="hidden md:flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full w-12 h-12"
                onClick={prevTestimonial}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full w-12 h-12"
                onClick={nextTestimonial}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-2">
                <Card className="p-8 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 max-w-3xl mx-auto">
                  <Quote className="w-12 h-12 text-accent/30 mb-4" />
                  <p className="text-foreground text-lg leading-relaxed mb-6">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(testimonial.rating) 
                                  ? 'fill-accent text-accent' 
                                  : i < testimonial.rating 
                                  ? 'fill-accent/50 text-accent' 
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden justify-center gap-2 mt-8">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-12 h-12"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-12 h-12"
            onClick={nextTestimonial}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-accent w-8' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
