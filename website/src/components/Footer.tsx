import { Plane } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">SkyTrip</span>
            </div>
            <p className="text-white/70">
              预订航班、预订酒店，景点预约。
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">公司</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-white/70 hover:text-accent transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/70 hover:text-accent transition-colors">
                  关于我们
                </a>
              </li>
              <li>
                <a href="#services" className="text-white/70 hover:text-accent transition-colors">
                  服务
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/70 hover:text-accent transition-colors">
                  联系我们
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">支持</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-accent transition-colors">
                  隐私政策
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-accent transition-colors">
                  条款
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-accent transition-colors">
                  服务
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-accent transition-colors">
                  联系我们
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">联系我们</h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:support@skytrip.com" className="hover:text-accent transition-colors">
                  support@skytrip.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+86-00000000" className="hover:text-accent transition-colors">
                  +86-00000000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>
                  天津市北辰区西平道5340号<br />

                </span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                f
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                📷
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-center text-white/60">
          <p>© 2025 SkyTrip 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
