import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Wallet, Lock, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
    id: string;
    name: string;
    icon: JSX.Element;
    description: string;
    type: "alipay" | "wechat" | "card" | "applepay" | "unionpay";
}

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const orderData = location.state?.orderData;

    const [selectedMethod, setSelectedMethod] = useState("alipay");
    const [cardInfo, setCardInfo] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: ""
    });

    const paymentMethods: PaymentMethod[] = [
        {
            id: "alipay",
            name: "支付宝",
            icon: <Wallet className="w-6 h-6 text-[#1677FF]" />,
            description: "推荐使用，快捷安全",
            type: "alipay"
        },
        {
            id: "wechat",
            name: "微信支付",
            icon: <Smartphone className="w-6 h-6 text-[#07C160]" />,
            description: "扫码支付，方便快捷",
            type: "wechat"
        },
        {
            id: "unionpay",
            name: "银联云闪付",
            icon: <CreditCard className="w-6 h-6 text-[#E53935]" />,
            description: "银联卡快捷支付",
            type: "unionpay"
        },
        {
            id: "card",
            name: "信用卡/借记卡",
            icon: <CreditCard className="w-6 h-6 text-primary" />,
            description: "支持Visa、MasterCard、银联",
            type: "card"
        },
        {
            id: "applepay",
            name: "Apple Pay",
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
            ),
            description: "快速便捷的支付方式",
            type: "applepay"
        }
    ];

    if (!orderData) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar isLoggedIn={true} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">订单信息丢失</p>
                        <Button onClick={() => navigate("/book-flight")}>返回首页</Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const handlePayment = () => {
        if (selectedMethod === "card") {
            // 验证卡信息
            if (!cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvv) {
                toast({
                    title: "请填写完整的银行卡信息",
                    variant: "destructive"
                });
                return;
            }

            // 验证卡号格式（简单验证）
            if (cardInfo.number.replace(/\s/g, "").length < 16) {
                toast({
                    title: "请输入正确的卡号",
                    variant: "destructive"
                });
                return;
            }
        }

        toast({
            title: "正在处理支付",
            description: "请稍候..."
        });

        // 模拟支付处理
        setTimeout(() => {
            toast({
                title: "支付成功！",
                description: "订单已确认，祝您旅途愉快"
            });

            setTimeout(() => {
                navigate("/my-orders");
            }, 1500);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar isLoggedIn={true} />

            <section className="py-8 flex-1">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            返回
                        </Button>
                        <h1 className="text-3xl font-bold">支付订单</h1>
                        <p className="text-muted-foreground mt-2">请选择支付方式完成订单</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Payment Methods */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Payment Methods */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-6">选择支付方式</h2>
                                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                                    <div className="space-y-3">
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    selectedMethod === method.id
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:border-primary/50"
                                                }`}
                                                onClick={() => setSelectedMethod(method.id)}
                                            >
                                                <RadioGroupItem value={method.id} id={method.id} />
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                                                        {method.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label htmlFor={method.id} className="text-base font-semibold cursor-pointer block">
                                                            {method.name}
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {method.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </Card>

                            {/* Card Details Form (shown only when card is selected) */}
                            {selectedMethod === "card" && (
                                <Card className="p-6">
                                    <h2 className="text-xl font-semibold mb-6">银行卡信息</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="cardNumber">卡号 *</Label>
                                            <Input
                                                id="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardInfo.number}
                                                onChange={(e) => {
                                                    // 格式化卡号显示
                                                    const value = e.target.value.replace(/\s/g, "");
                                                    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                                                    setCardInfo({ ...cardInfo, number: formatted });
                                                }}
                                                maxLength={19}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="cardName">持卡人姓名 *</Label>
                                            <Input
                                                id="cardName"
                                                placeholder="ZHANG SAN"
                                                value={cardInfo.name}
                                                onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="expiry">有效期 *</Label>
                                                <Input
                                                    id="expiry"
                                                    placeholder="MM/YY"
                                                    value={cardInfo.expiry}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, "");
                                                        if (value.length >= 2) {
                                                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                                        }
                                                        setCardInfo({ ...cardInfo, expiry: value });
                                                    }}
                                                    maxLength={5}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="cvv">CVV *</Label>
                                                <Input
                                                    id="cvv"
                                                    type="password"
                                                    placeholder="123"
                                                    value={cardInfo.cvv}
                                                    onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, "") })}
                                                    maxLength={3}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 p-3 bg-accent/5 rounded-lg">
                                            <Lock className="w-4 h-4 text-muted-foreground mt-0.5" />
                                            <p className="text-xs text-muted-foreground">
                                                您的银行卡信息将被加密传输和存储，我们遵守PCI DSS标准以确保您的支付安全。
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* QR Code Display (for mobile payments) */}
                            {(selectedMethod === "alipay" || selectedMethod === "wechat") && (
                                <Card className="p-6">
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold mb-4">
                                            {selectedMethod === "alipay" ? "支付宝" : "微信"}扫码支付
                                        </h3>
                                        <div className="w-64 h-64 mx-auto bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                                            <div className="text-center">
                                                <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-border">
                                                    <p className="text-sm text-muted-foreground">
                                                        扫码支付<br />二维码将在<br />点击支付后显示
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            请使用{selectedMethod === "alipay" ? "支付宝" : "微信"}App扫描二维码完成支付
                                        </p>
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-24">
                                <h2 className="text-xl font-semibold mb-4">订单信息</h2>

                                <div className="space-y-3 mb-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">航班</div>
                                        <div className="font-medium">{orderData.flightInfo}</div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">舱位类型</div>
                                        <div className="font-medium">{orderData.cabinName}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">乘机人数</div>
                                        <div className="font-medium">{orderData.passengerCount} 人</div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">基础票价</span>
                                            <span>¥{orderData.basePrice}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">机场建设费</span>
                                            <span>¥{orderData.airportFee}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">燃油附加费</span>
                                            <span>¥{orderData.fuelSurcharge}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">应付总额</span>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-primary">
                                                ¥{orderData.grandTotal}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handlePayment}
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    确认支付
                                </Button>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span>支持7天无理由退票</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span>航班延误自动赔付</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span>支付信息加密保护</span>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="p-3 bg-accent/5 rounded-lg">
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        点击"确认支付"即表示您已阅读并同意我们的退改签政策和用户协议。支付完成后将自动发送电子机票至您的邮箱。
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Payment;
