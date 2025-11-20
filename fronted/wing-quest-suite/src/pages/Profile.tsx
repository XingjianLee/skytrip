import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin, Calendar, CreditCard, Shield, Heart, Globe, Bell, Camera, Save, Pencil, X, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { getMe, updateMe } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type BackendUser = {
  id: number;
  username: string;
  email?: string | null;
  phone?: string | null;
  real_name: string;
  id_card: string;
  avatar_url?: string | null;
  bio?: string | null;
  vip_level: number;
  vip_expire_date?: string | null;
  role: string;
  created_at: string;
};

function splitChineseName(fullName: string) {
  if (!fullName) return { lastName: "", firstName: "" };
  // 简单规则：第一个字为姓，剩余为名
  const lastName = fullName.slice(0, 1);
  const firstName = fullName.slice(1) || fullName;
  return { lastName, firstName };
}

function formatJoinDate(iso: string | undefined) {
  if (!iso) return "加入时间未知";
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

function vipLabel(level: number) {
  switch (level) {
    case 1: return "银卡会员";
    case 2: return "金牌会员";
    case 3: return "白金会员";
    case 4: return "钻石会员";
    default: return "普通会员";
  }
}

function parseBirthdayFromIdCard(idCard?: string): string | undefined {
  if (!idCard) return undefined;
  const s = idCard.toUpperCase();
  // 18位身份证：第7到14位为出生日期 YYYYMMDD
  if (/^\d{17}[0-9X]$/.test(s)) {
    const yyyymmdd = s.substring(6, 14);
    const yyyy = yyyymmdd.substring(0, 4);
    const mm = yyyymmdd.substring(4, 6);
    const dd = yyyymmdd.substring(6, 8);
    const iso = `${yyyy}-${mm}-${dd}`;
    const d = new Date(iso);
    if (!isNaN(d.getTime())) {
      return iso;
    }
  }
  return undefined;
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("张伟");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [verified, setVerified] = useState<boolean>(true);
  const [memberNo, setMemberNo] = useState<string>("暂未开通");
  const [joinDate, setJoinDate] = useState<string>("2024年1月");
  const [phoneValue, setPhoneValue] = useState<string>("13800138000");
  const [emailValue, setEmailValue] = useState<string>("zhangwei@example.com");
  const [lastName, setLastName] = useState<string>("张");
  const [firstName, setFirstName] = useState<string>("伟");
  const [vipLevel, setVipLevel] = useState<number>(2);
  const [birthdayValue, setBirthdayValue] = useState<string>("1990-01-15");
  const [bioValue, setBioValue] = useState<string>("");
  const [showVerify, setShowVerify] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    async function load() {
      try {
        if (!token) {
          // 无token，保持示例数据
          return;
        }
        const me: BackendUser = await getMe(token);
        const displayName = me.real_name || me.username;
        setNickname(displayName);
        setTempNickname(displayName);
        setAvatarUrl(me.avatar_url || undefined);
        setVerified(Boolean(me.id_card));
        // 会员编号：若无后端字段，基于用户ID与创建日期生成
        // 会员编号逻辑：vip_level != 0 显示统一编号，否则显示“暂未开通”
        setMemberNo((me.vip_level ?? 0) !== 0 ? "VIP00000001" : "暂未开通");
        setJoinDate(formatJoinDate(me.created_at));
        setPhoneValue(me.phone || "");
        setEmailValue(me.email || "");
        const { lastName, firstName } = splitChineseName(displayName);
        setLastName(lastName || "");
        setFirstName(firstName || "");
        setVipLevel(me.vip_level ?? 0);
        const b = parseBirthdayFromIdCard(me.id_card);
        if (b) setBirthdayValue(b);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    toast.success("已退出登录");
    navigate("/auth");
  };

  const handleSave = async () => {
    setShowVerify(true);
  };

  const confirmVerifyAndSave = async () => {
    setShowVerify(false);
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token") || "";
      if (!token) {
        toast.error("请先登录后再保存");
        return;
      }
      const real_name = `${lastName}${firstName}` || nickname;
      await updateMe({ real_name, phone: phoneValue || undefined, email: emailValue || undefined, bio: bioValue || undefined, avatar_url: avatarUrl || undefined }, token);
      const me = await getMe(token);
      localStorage.setItem("user", JSON.stringify(me));
      toast.success("资料已保存并同步");
    } catch (e: any) {
      toast.error(e?.message || "保存失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNickname = async () => {
    if (!tempNickname.trim()) {
      toast.error("昵称不能为空");
      return;
    }
    try {
      const token = localStorage.getItem("access_token") || "";
      await updateMe({ real_name: tempNickname }, token);
      setNickname(tempNickname);
      setIsEditingNickname(false);
      const me = await getMe(token);
      localStorage.setItem("user", JSON.stringify(me));
      toast.success("昵称已更新并同步");
    } catch (e: any) {
      toast.error(e?.message || "更新失败");
    }
  };

  const handleCancelEdit = () => {
    setTempNickname(nickname);
    setIsEditingNickname(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn={true} />

      <div className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"} />
                  <AvatarFallback>用户</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {isEditingNickname ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={tempNickname}
                        onChange={(e) => setTempNickname(e.target.value)}
                        className="text-3xl font-bold h-auto py-2 max-w-xs"
                        placeholder="输入昵称"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveNickname}
                        className="text-primary hover:text-primary"
                      >
                        <Check className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold">{nickname}</h1>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsEditingNickname(true)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <Badge variant="default" className="gap-1">
                    <Shield className="w-3 h-3" />
                    {verified ? "已认证" : "未认证"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  会员编号: {memberNo} · 加入于 {joinDate}
                </p>
                <div className="flex flex-wrap gap-2">
                  {vipLevel !== 0 && (
                    <Badge variant="outline">{vipLabel(vipLevel)}</Badge>
                  )}
                  <Badge variant="outline">旅行达人</Badge>
                  <Badge variant="outline">已完成 15 次旅行</Badge>
                </div>
              </div>

              <Button size="lg" onClick={handleSave} disabled={loading} className="gap-2">
                <Save className="w-4 h-4" />
                {loading ? "保存中..." : "保存资料"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="identity">身份认证</TabsTrigger>
              <TabsTrigger value="travel">旅行偏好</TabsTrigger>
              <TabsTrigger value="emergency">紧急联系人</TabsTrigger>
              <TabsTrigger value="settings">账号设置</TabsTrigger>
            </TabsList>

            {/* 基本信息 */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        个人信息
                      </CardTitle>
                      <CardDescription>管理您的基本个人信息</CardDescription>
                    </div>
                    {!isEditingBasic ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingBasic(true)}
                        className="gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        编辑
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowVerify(true)}
                          className="gap-2"
                        >
                          <Check className="w-4 h-4" />
                          保存
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditingBasic(false);
                            toast.info("已取消编辑");
                          }}
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          取消
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">姓氏 *</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="请输入姓氏" disabled={!isEditingBasic} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">名字 *</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="请输入名字" disabled={!isEditingBasic} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="gender">性别</Label>
                      <Select defaultValue="male" disabled={!isEditingBasic}>
                        <SelectTrigger id="gender">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">男</SelectItem>
                          <SelectItem value="female">女</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthday">出生日期</Label>
                      <Input id="birthday" type="date" value={birthdayValue} onChange={(e) => setBirthdayValue(e.target.value)} disabled={!isEditingBasic} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        手机号码 *
                      </Label>
                      <Input id="phone" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} placeholder="请输入手机号" disabled={!isEditingBasic} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        电子邮箱 *
                      </Label>
                      <Input id="email" type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} placeholder="请输入邮箱" disabled={!isEditingBasic} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      居住地址
                    </Label>
                    <Textarea
                      id="address"
                      defaultValue="北京市朝阳区建国路88号"
                      placeholder="请输入详细地址"
                      rows={3}
                      disabled={!isEditingBasic}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nationality">国籍</Label>
                      <Select defaultValue="china" disabled={!isEditingBasic}>
                        <SelectTrigger id="nationality">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="china">中国</SelectItem>
                          <SelectItem value="usa">美国</SelectItem>
                          <SelectItem value="uk">英国</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">首选语言</Label>
                      <Select defaultValue="zh" disabled={!isEditingBasic}>
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zh">简体中文</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">职业</Label>
                      <Input id="occupation" defaultValue="软件工程师" placeholder="请输入职业" disabled={!isEditingBasic} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 身份认证 */}
            <TabsContent value="identity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    身份证信息
                  </CardTitle>
                  <CardDescription>
                    实名认证可以提高账号安全性，享受更多服务
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">身份证号码 *</Label>
                      <Input
                        id="idNumber"
                        defaultValue="110101199001011234"
                        placeholder="请输入18位身份证号"
                        maxLength={18}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idName">证件姓名 *</Label>
                      <Input id="idName" defaultValue="张伟" placeholder="请输入证件上的姓名" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="idIssueDate">签发日期</Label>
                      <Input id="idIssueDate" type="date" defaultValue="2020-01-01" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idExpiryDate">有效期至</Label>
                      <Input id="idExpiryDate" type="date" defaultValue="2030-01-01" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idIssuer">签发机关</Label>
                    <Input id="idIssuer" defaultValue="北京市公安局朝阳分局" placeholder="请输入签发机关" />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>身份证照片上传</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">上传身份证正面</p>
                        <p className="text-xs text-muted-foreground">支持 JPG, PNG 格式</p>
                      </div>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">上传身份证背面</p>
                        <p className="text-xs text-muted-foreground">支持 JPG, PNG 格式</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    护照信息
                  </CardTitle>
                  <CardDescription>
                    添加护照信息以便预订国际航班和酒店
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="passportNumber">护照号码</Label>
                      <Input id="passportNumber" placeholder="请输入护照号码" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportType">护照类型</Label>
                      <Select>
                        <SelectTrigger id="passportType">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ordinary">普通护照</SelectItem>
                          <SelectItem value="official">公务护照</SelectItem>
                          <SelectItem value="diplomatic">外交护照</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="passportIssueCountry">签发国家</Label>
                      <Select defaultValue="china">
                        <SelectTrigger id="passportIssueCountry">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="china">中国</SelectItem>
                          <SelectItem value="usa">美国</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportIssueDate">签发日期</Label>
                      <Input id="passportIssueDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportExpiryDate">有效期至</Label>
                      <Input id="passportExpiryDate" type="date" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 旅行偏好 */}
            <TabsContent value="travel" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    旅行偏好设置
                  </CardTitle>
                  <CardDescription>
                    告诉我们您的偏好，我们会为您推荐更合适的行程
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="seatPreference">座位偏好</Label>
                      <Select defaultValue="window">
                        <SelectTrigger id="seatPreference">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="window">靠窗</SelectItem>
                          <SelectItem value="aisle">靠走廊</SelectItem>
                          <SelectItem value="any">无所谓</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mealPreference">餐食偏好</Label>
                      <Select defaultValue="normal">
                        <SelectTrigger id="mealPreference">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">普通餐</SelectItem>
                          <SelectItem value="vegetarian">素食</SelectItem>
                          <SelectItem value="halal">清真餐</SelectItem>
                          <SelectItem value="none">不需要</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="roomType">房间类型偏好</Label>
                      <Select defaultValue="single">
                        <SelectTrigger id="roomType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">单人间</SelectItem>
                          <SelectItem value="double">双人间</SelectItem>
                          <SelectItem value="twin">双床房</SelectItem>
                          <SelectItem value="suite">套房</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bedType">床型偏好</Label>
                      <Select defaultValue="king">
                        <SelectTrigger id="bedType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="king">特大床</SelectItem>
                          <SelectItem value="queen">大床</SelectItem>
                          <SelectItem value="twin">双床</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">个人签名</Label>
                    <Textarea
                      id="bio"
                      placeholder="写点什么..."
                      rows={4}
                      value={bioValue}
                      onChange={(e) => setBioValue(e.target.value)}
                      disabled={!isEditingBasic}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base">旅行兴趣</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        "美食探索",
                        "文化体验",
                        "自然风光",
                        "历史古迹",
                        "户外探险",
                        "购物休闲",
                        "海滨度假",
                        "都市观光",
                      ].map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Switch id={interest} />
                          <Label htmlFor={interest} className="cursor-pointer">
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>常用旅客信息</CardTitle>
                  <CardDescription>
                    保存常用旅客信息，预订时可快速填写
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">李娜 (配偶)</p>
                        <p className="text-sm text-muted-foreground">身份证: 110101199205051234</p>
                      </div>
                      <Button variant="outline" size="sm">编辑</Button>
                    </div>
                    <Button variant="outline" className="w-full">+ 添加常用旅客</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 紧急联系人 */}
            <TabsContent value="emergency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    紧急联系人
                  </CardTitle>
                  <CardDescription>
                    在紧急情况下，我们将联系您指定的人员
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">联系人姓名 *</Label>
                      <Input id="emergencyName" defaultValue="李娜" placeholder="请输入姓名" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelation">与您的关系 *</Label>
                      <Select defaultValue="spouse">
                        <SelectTrigger id="emergencyRelation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">配偶</SelectItem>
                          <SelectItem value="parent">父母</SelectItem>
                          <SelectItem value="sibling">兄弟姐妹</SelectItem>
                          <SelectItem value="child">子女</SelectItem>
                          <SelectItem value="friend">朋友</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">联系电话 *</Label>
                      <Input id="emergencyPhone" defaultValue="13900139000" placeholder="请输入电话号码" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyEmail">电子邮箱</Label>
                      <Input
                        id="emergencyEmail"
                        type="email"
                        defaultValue="lina@example.com"
                        placeholder="请输入邮箱"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyAddress">联系地址</Label>
                    <Textarea
                      id="emergencyAddress"
                      defaultValue="北京市朝阳区建国路88号"
                      placeholder="请输入详细地址"
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base">第二紧急联系人（可选）</Label>
                    <Button variant="outline" className="w-full">+ 添加第二联系人</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 账号设置 */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    通知设置
                  </CardTitle>
                  <CardDescription>管理您的通知偏好</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { id: "emailNotif", label: "邮件通知", description: "接收预订确认和行程更新" },
                    { id: "smsNotif", label: "短信通知", description: "接收重要提醒和验证码" },
                    { id: "pushNotif", label: "推送通知", description: "接收应用内推送消息" },
                    { id: "promoNotif", label: "优惠信息", description: "接收促销活动和特惠信息" },
                    { id: "newsNotif", label: "旅行资讯", description: "接收目的地攻略和旅行建议" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={item.id}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch id={item.id} defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>隐私设置</CardTitle>
                  <CardDescription>控制您的个人信息可见性</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { id: "profilePublic", label: "公开个人资料", description: "允许其他用户查看您的基本信息" },
                    { id: "showTrips", label: "显示旅行记录", description: "在个人主页显示您的旅行足迹" },
                    { id: "allowMessages", label: "接收私信", description: "允许其他用户向您发送消息" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={item.id}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch id={item.id} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">危险操作</CardTitle>
                  <CardDescription>这些操作将永久影响您的账号</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">修改密码</p>
                      <p className="text-sm text-muted-foreground">更改您的登录密码</p>
                    </div>
                    <Button variant="outline">修改</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <div>
                        <p className="font-medium">退出登录</p>
                        <p className="text-sm text-muted-foreground">退出当前账号</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>退出</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">注销账号</p>
                      <p className="text-sm text-muted-foreground">永久删除您的账号和所有数据</p>
                    </div>
                    <Button variant="destructive">注销</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 验证弹窗（示例，不进行真实校验） */}
      <Dialog open={showVerify} onOpenChange={setShowVerify}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>手机验证码验证</DialogTitle>
            <DialogDescription>
              我们已向你的手机号 {phoneValue || "(未填写)"} 发送验证码。输入验证码后即可保存修改。当前为示例，不进行真实校验。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="verifyCode">验证码</Label>
            <Input id="verifyCode" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} placeholder="6位数字" />
            <div className="flex items-center gap-2">
              <Button variant="outline" type="button">发送验证码</Button>
              <Button variant="accent" type="button" onClick={confirmVerifyAndSave}>确认保存</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Profile;
