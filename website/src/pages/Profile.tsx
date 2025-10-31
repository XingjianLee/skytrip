import { useState } from "react";
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

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("张伟");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);
  const [isEditingBasic, setIsEditingBasic] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    toast.success("已退出登录");
    navigate("/auth");
  };

  const handleSave = async () => {
    setLoading(true);
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("个人资料已保存");
    setLoading(false);
  };

  const handleSaveNickname = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname);
      setIsEditingNickname(false);
      toast.success("昵称已更新");
    } else {
      toast.error("昵称不能为空");
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
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" />
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
                      已认证
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    会员编号: VIP202401001 · 加入于 2024年1月
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">金牌会员</Badge>
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
                                onClick={() => {
                                  setIsEditingBasic(false);
                                  toast.success("已保存更改");
                                }}
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
                        <Input id="lastName" defaultValue="张" placeholder="请输入姓氏" disabled={!isEditingBasic} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">名字 *</Label>
                        <Input id="firstName" defaultValue="伟" placeholder="请输入名字" disabled={!isEditingBasic} />
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
                        <Input id="birthday" type="date" defaultValue="1990-01-15" disabled={!isEditingBasic} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          手机号码 *
                        </Label>
                        <Input id="phone" defaultValue="13800138000" placeholder="请输入手机号" disabled={!isEditingBasic} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          电子邮箱 *
                        </Label>
                        <Input id="email" type="email" defaultValue="zhangwei@example.com" placeholder="请输入邮箱" disabled={!isEditingBasic} />
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
                      <Label htmlFor="specialRequirements">特殊需求</Label>
                      <Textarea
                          id="specialRequirements"
                          placeholder="如：需要无障碍房间、对某些物品过敏、需要婴儿床等"
                          rows={4}
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

        <Footer />
      </div>
  );
};

export default Profile;
