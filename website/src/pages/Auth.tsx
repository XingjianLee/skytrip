import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

// 写死的测试用户
const MOCK_USER = {
  username: "admin",
  email: "admin@example.com",
  password: "123456",
};

const Auth = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginEmail === MOCK_USER.email && loginPassword === MOCK_USER.password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({
        username: MOCK_USER.username,
        email: MOCK_USER.email,
      }));
      toast.success("登录成功！");
      navigate("/");
    } else {
      toast.error("邮箱或密码错误");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupEmail === MOCK_USER.email) {
      toast.error("该邮箱已被注册");
      return;
    }
    
    toast.info("注册功能暂未开放，请使用测试账号登录");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* 浅色白绿雾透渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0]">
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-[#d1fae5]/30 to-[#e8f5e9]/50" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(74,222,128,0.12),transparent_50%)]" />
      </div>
      
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center shadow-accent">
            <Plane className="w-7 h-7 text-primary" />
          </div>
          <span className="text-3xl font-bold text-primary">SkyTrip</span>
        </div>

        <Card className="border-border/50 shadow-elegant backdrop-blur-xl bg-background/85 animate-fade-in-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">欢迎回来</CardTitle>
            <CardDescription className="text-center">
              登录您的账户或创建新账户
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="signup">注册</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">邮箱</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="admin@example.com"
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••"
                        className="pl-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" variant="accent" size="lg">
                    登录
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    测试账号：admin@example.com / 123456
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">用户名</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="请输入用户名"
                        className="pl-10"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">邮箱</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="至少6位密码"
                        className="pl-10"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" variant="accent" size="lg">
                    注册
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
