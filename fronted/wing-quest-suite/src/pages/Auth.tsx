import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "sonner";
import { login, register, getMe } from "@/lib/api";

const Auth = () => {
  const navigate = useNavigate();
  // 登录：使用用户名 + 密码
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // 注册：后端要求 username/password/real_name/id_card；email/phone 可选
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupRealName, setSignupRealName] = useState("");
  const [signupIdCard, setSignupIdCard] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(loginUsername, loginPassword);
      localStorage.setItem("access_token", token.access_token);
      localStorage.setItem("token_type", token.token_type);
      const me = await getMe(token.access_token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(me));
      toast.success("登录成功！");
      navigate("/home");
    } catch (err: any) {
      toast.error(err?.message || "登录失败");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!signupRealName || !signupIdCard) {
        toast.error("请填写真实姓名和身份证号");
        return;
      }
      const payload = {
        username: signupUsername,
        password: signupPassword,
        email: signupEmail || undefined,
        phone: signupPhone || undefined,
        real_name: signupRealName,
        id_card: signupIdCard,
      };
      await register(payload);
      // 注册成功后自动登录并跳转到导航栏
      const token = await login(signupUsername, signupPassword);
      localStorage.setItem("access_token", token.access_token);
      localStorage.setItem("token_type", token.token_type);
      const me = await getMe(token.access_token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(me));
      toast.success("注册成功！已自动登录并进入导航栏");
      navigate("/home");
    } catch (err: any) {
      toast.error(err?.message || "注册失败");
    }
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
                    <Label htmlFor="login-username">用户名</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="admin"
                        className="pl-10"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
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
                    示例：用户名 admin / 密码 123456
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

                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">手机号（可选）</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="1XXXXXXXXXX"
                        className="pl-10"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-realname">真实姓名</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-realname"
                        type="text"
                        placeholder="请输入真实姓名"
                        className="pl-10"
                        value={signupRealName}
                        onChange={(e) => setSignupRealName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-idcard">身份证号</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-idcard"
                        type="text"
                        placeholder="18位身份证号"
                        className="pl-10"
                        value={signupIdCard}
                        onChange={(e) => setSignupIdCard(e.target.value)}
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
