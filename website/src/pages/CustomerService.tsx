import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  Clock,
  MessageSquare,
  HeadphonesIcon,
  FileQuestion,
  Plane,
  Hotel,
  Ticket,
  CreditCard,
  User,
  AlertCircle,
  Send,
  ArrowLeft,
} from "lucide-react";

const CustomerService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实际提交逻辑
    toast.success("您的问题已提交，我们会尽快回复！");
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "",
      subject: "",
      message: "",
    });
  };

  const categories = [
    { icon: Plane, label: "机票问题", value: "flight" },
    { icon: Hotel, label: "酒店问题", value: "hotel" },
    { icon: Ticket, label: "景点门票", value: "ticket" },
    { icon: CreditCard, label: "支付问题", value: "payment" },
    { icon: User, label: "账户问题", value: "account" },
    { icon: AlertCircle, label: "其他问题", value: "other" },
  ];

  const faqData = [
    {
      category: "机票相关",
      questions: [
        {
          q: "如何修改或取消已预订的机票？",
          a: '登录账户后，进入"我的订单"页面，找到对应订单点击"改签/退票"按钮。请注意：退改签会根据时间收取相应手续费，具体费率请参考退改签政策。',
        },
        {
          q: "可以为他人预订机票吗？",
          a: "可以的。在填写乘客信息时，您可以添加其他乘客的信息。请确保提供准确的姓名、证件号码等信息，与登机时使用的证件一致。",
        },
        {
          q: "如何办理网上值机？",
          a: '航班起飞前24小时，您可以在"在线值机"页面选择座位并获取电子登机牌。部分航空公司可能有不同的值机时间规定。',
        },
        {
          q: "机票价格会变动吗？",
          a: "是的。机票价格会根据航班日期、舱位余量、购票时间等因素实时变动。建议使用我们的价格日历功能查看最优价格。",
        },
      ],
    },
    {
      category: "酒店相关",
      questions: [
        {
          q: "酒店预订可以取消吗？",
          a: "大部分酒店支持取消，但取消政策因酒店而异。预订前请仔细阅读取消政策，部分酒店在入住前24-48小时可免费取消。",
        },
        {
          q: "如何确认酒店预订成功？",
          a: '预订成功后，您会收到确认邮件和站内消息。您也可以在"我的订单"中查看预订详情和确认号。',
        },
        {
          q: "可以修改入住日期吗？",
          a: '可以在"我的订单"中申请修改。是否成功取决于酒店的可用性和政策，可能会产生费用差额。',
        },
      ],
    },
    {
      category: "支付相关",
      questions: [
        {
          q: "支持哪些支付方式？",
          a: "我们支持支付宝、微信支付、银行卡（借记卡和信用卡）等多种支付方式。所有支付均通过加密通道，确保安全。",
        },
        {
          q: "支付后多久能收到确认？",
          a: "通常支付成功后会立即确认订单。如遇特殊情况，最多不超过30分钟。若超时未确认，请联系客服。",
        },
        {
          q: "退款多久能到账？",
          a: "退款会在审核通过后1-3个工作日内原路返回。具体到账时间取决于银行处理速度。",
        },
      ],
    },
    {
      category: "账户相关",
      questions: [
        {
          q: "如何修改个人信息？",
          a: '登录后进入"个人中心"，点击"编辑资料"即可修改您的个人信息，包括联系方式、邮箱等。',
        },
        {
          q: "忘记密码怎么办？",
          a: '在登录页面点击"忘记密码"，按照提示通过邮箱或手机号重置密码。',
        },
        {
          q: "如何注销账户？",
          a: "请联系客服申请注销账户。注销前请确保已处理完所有订单和退款。",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">客服中心</h1>
              <p className="text-sm text-muted-foreground">我们随时为您提供帮助</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Contact Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">客服热线</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-2">400-888-9999</p>
              <p className="text-sm text-muted-foreground">24小时人工服务</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">邮箱咨询</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-2">support@skytrip.com</p>
              <p className="text-sm text-muted-foreground">24小时内回复</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">服务时间</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-2">7×24小时</p>
              <p className="text-sm text-muted-foreground">全年无休为您服务</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="faq" className="gap-2">
              <FileQuestion className="h-4 w-4" />
              常见问题
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              在线咨询
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeadphonesIcon className="h-5 w-5 text-primary" />
                  常见问题解答
                </CardTitle>
                <CardDescription>
                  以下是用户最常咨询的问题，希望能帮助您快速找到答案
                </CardDescription>
              </CardHeader>
              <CardContent>
                {faqData.map((section, idx) => (
                  <div key={idx} className="mb-8 last:mb-0">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Badge variant="secondary">{section.category}</Badge>
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      {section.questions.map((item, qIdx) => (
                        <AccordionItem key={qIdx} value={`${idx}-${qIdx}`}>
                          <AccordionTrigger className="text-left hover:text-primary">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Form Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  提交咨询
                </CardTitle>
                <CardDescription>
                  请填写以下表单，我们会在24小时内回复您
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label>问题类型</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <Button
                          key={cat.value}
                          type="button"
                          variant={formData.category === cat.value ? "default" : "outline"}
                          className="h-auto py-4 flex flex-col items-center gap-2"
                          onClick={() =>
                            setFormData({ ...formData, category: cat.value })
                          }
                        >
                          <cat.icon className="h-5 w-5" />
                          <span className="text-sm">{cat.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名 *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="请输入您的姓名"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱 *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">联系电话</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="请输入您的联系电话"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">问题标题 *</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="简要描述您的问题"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">详细描述 *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="请详细描述您遇到的问题，以便我们更好地帮助您"
                      className="min-h-[150px]"
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto gap-2">
                    <Send className="h-4 w-4" />
                    提交咨询
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Help */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">需要紧急帮助？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  如果您的问题比较紧急，建议直接拨打客服热线或使用在线客服获取即时帮助。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default" className="gap-2">
                    <Phone className="h-4 w-4" />
                    拨打热线
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    在线客服
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerService;
