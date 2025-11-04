import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plane, Clock, MapPin, User, Phone, Mail, CreditCard, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CabinClass {
    type: string;
    name: string;
    basePrice: number;
    features: string[];
}

const OrderFlight = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const flight = location.state?.flight;

    const [selectedCabin, setSelectedCabin] = useState("economy");
    const [passengerCount, setPassengerCount] = useState(1);
    const [passengers, setPassengers] = useState([
        { name: "", idType: "idCard", idNumber: "", birthDate: "" }
    ]);
    const [contact, setContact] = useState({
        name: "",
        phone: "",
        email: ""
    });

    // 舱位价格配置
    const cabinClasses: CabinClass[] = [
        {
            type: "economy",
            name: "经济舱",
            basePrice: flight?.price || 1280,
            features: ["标准座椅", "免费托运20kg", "飞机餐"]
        },
        {
            type: "business",
            name: "商务舱",
            basePrice: (flight?.price || 1280) * 3,
            features: ["宽敞座椅", "免费托运40kg", "高级餐饮", "优先登机", "贵宾休息室"]
        },
        {
            type: "first",
            name: "头等舱",
            basePrice: (flight?.price || 1280) * 5,
            features: ["豪华座椅", "免费托运60kg", "定制餐饮", "优先服务", "专属休息室", "专车接送"]
        }
    ];

    // 费用计算
    const selectedCabinData = cabinClasses.find(c => c.type === selectedCabin);
    const basePrice = selectedCabinData?.basePrice || 0;
    const airportFee = 50; // 机场建设费
    const fuelSurcharge = 80; // 燃油附加费
    const totalPerPerson = basePrice + airportFee + fuelSurcharge;
    const grandTotal = totalPerPerson * passengerCount;

    const handleAddPassenger = () => {
        if (passengers.length < 9) {
            setPassengers([...passengers, { name: "", idType: "idCard", idNumber: "", birthDate: "" }]);
            setPassengerCount(passengers.length + 1);
        }
    };

    const handleRemovePassenger = (index: number) => {
        if (passengers.length > 1) {
            const newPassengers = passengers.filter((_, i) => i !== index);
            setPassengers(newPassengers);
            setPassengerCount(newPassengers.length);
        }
    };

    const handlePassengerChange = (index: number, field: string, value: string) => {
        const newPassengers = [...passengers];
        newPassengers[index] = { ...newPassengers[index], [field]: value };
        setPassengers(newPassengers);
    };

    const handleSubmit = () => {
        // 验证表单
        if (!contact.name || !contact.phone || !contact.email) {
            toast({
                title: "请填写完整联系人信息",
                variant: "destructive"
            });
            return;
        }

        for (let i = 0; i < passengers.length; i++) {
            if (!passengers[i].name || !passengers[i].idNumber || !passengers[i].birthDate) {
                toast({
                    title: `请填写完整第${i + 1}位乘机人信息`,
                    variant: "destructive"
                });
                return;
            }
        }

        toast({
            title: "订单提交成功",
            description: "正在跳转到支付页面..."
        });

        // 准备订单数据
        const orderData = {
            flightInfo: flight.airline
                ? `${flight.departure.airport} → ${flight.arrival.airport}`
                : `${flight.segments[0].departure.airport} → ${flight.segments[flight.segments.length - 1].arrival.airport}`,
            cabinName: selectedCabinData?.name,
            passengerCount,
            basePrice,
            airportFee,
            fuelSurcharge,
            totalPerPerson,
            grandTotal,
            passengers,
            contact,
            flight
        };

        // 跳转到支付页面
        setTimeout(() => {
            navigate("/payment", { state: { orderData } });
        }, 1000);
    };

    if (!flight) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar isLoggedIn={true} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">未选择航班</p>
                        <Button onClick={() => navigate("/book-flight")}>返回选择航班</Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

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
                        <h1 className="text-3xl font-bold">填写订单</h1>
                        <p className="text-muted-foreground mt-2">请仔细核对航班信息和乘机人信息</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Flight Summary */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Plane className="w-5 h-5 text-primary" />
                                    航班信息
                                </h2>
                                <div className="bg-accent/5 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <div className="text-2xl font-bold">{flight.departure?.time || flight.segments[0].departure.time}</div>
                                            <div className="text-sm text-muted-foreground">{flight.departure?.airport || flight.segments[0].departure.airport}</div>
                                        </div>
                                        <div className="flex-1 px-6">
                                            <div className="text-center">
                                                <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {flight.duration || flight.totalDuration}
                                                </div>
                                                <div className="h-0.5 bg-gradient-accent" />
                                                {flight.direct ? (
                                                    <div className="text-xs text-accent mt-1">直达</div>
                                                ) : (
                                                    <div className="text-xs text-muted-foreground mt-1">中转</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold">{flight.arrival?.time || flight.segments[flight.segments.length - 1].arrival.time}</div>
                                            <div className="text-sm text-muted-foreground">{flight.arrival?.airport || flight.segments[flight.segments.length - 1].arrival.airport}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {flight.airline || flight.segments[0].airline} · {flight.flightNumber || flight.segments[0].flightNumber}
                                    </div>
                                </div>
                            </Card>

                            {/* Cabin Class Selection */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">选择舱位</h2>
                                <RadioGroup value={selectedCabin} onValueChange={setSelectedCabin}>
                                    <div className="space-y-3">
                                        {cabinClasses.map((cabin) => (
                                            <div
                                                key={cabin.type}
                                                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    selectedCabin === cabin.type
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:border-primary/50"
                                                }`}
                                                onClick={() => setSelectedCabin(cabin.type)}
                                            >
                                                <RadioGroupItem value={cabin.type} id={cabin.type} className="mt-1" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label htmlFor={cabin.type} className="text-lg font-semibold cursor-pointer">
                                                            {cabin.name}
                                                        </Label>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-primary">¥{cabin.basePrice}</div>
                                                            <div className="text-xs text-muted-foreground">基础票价</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {cabin.features.map((feature, idx) => (
                                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                                <Check className="w-3 h-3 mr-1" />
                                                                {feature}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </Card>

                            {/* Passenger Information */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        乘机人信息
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddPassenger}
                                        disabled={passengers.length >= 9}
                                    >
                                        添加乘机人
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {passengers.map((passenger, index) => (
                                        <div key={index} className="border rounded-lg p-4 relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold">乘机人 {index + 1}</h3>
                                                {passengers.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemovePassenger(index)}
                                                    >
                                                        删除
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor={`name-${index}`}>姓名 *</Label>
                                                    <Input
                                                        id={`name-${index}`}
                                                        placeholder="请输入姓名"
                                                        value={passenger.name}
                                                        onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor={`idType-${index}`}>证件类型 *</Label>
                                                    <Select
                                                        value={passenger.idType}
                                                        onValueChange={(value) => handlePassengerChange(index, "idType", value)}
                                                    >
                                                        <SelectTrigger id={`idType-${index}`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="idCard">身份证</SelectItem>
                                                            <SelectItem value="passport">护照</SelectItem>
                                                            <SelectItem value="other">其他</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label htmlFor={`idNumber-${index}`}>证件号码 *</Label>
                                                    <Input
                                                        id={`idNumber-${index}`}
                                                        placeholder="请输入证件号码"
                                                        value={passenger.idNumber}
                                                        onChange={(e) => handlePassengerChange(index, "idNumber", e.target.value)}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor={`birthDate-${index}`}>出生日期 *</Label>
                                                    <Input
                                                        id={`birthDate-${index}`}
                                                        type="date"
                                                        value={passenger.birthDate}
                                                        onChange={(e) => handlePassengerChange(index, "birthDate", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Contact Information */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-primary" />
                                    联系人信息
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="contact-name">联系人姓名 *</Label>
                                        <Input
                                            id="contact-name"
                                            placeholder="请输入联系人姓名"
                                            value={contact.name}
                                            onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contact-phone">联系电话 *</Label>
                                        <Input
                                            id="contact-phone"
                                            type="tel"
                                            placeholder="请输入手机号码"
                                            value={contact.phone}
                                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label htmlFor="contact-email">电子邮箱 *</Label>
                                        <Input
                                            id="contact-email"
                                            type="email"
                                            placeholder="用于接收电子机票和通知"
                                            value={contact.email}
                                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-3">
                                    * 请确保联系方式准确无误，我们将通过以上方式发送行程通知
                                </p>
                            </Card>
                        </div>

                        {/* Right Column - Price Summary */}
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-24">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    费用明细
                                </h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">舱位类型</span>
                                        <span className="font-medium">{selectedCabinData?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">乘机人数</span>
                                        <span className="font-medium">{passengerCount} 人</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">基础票价</span>
                                        <span>¥{basePrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">机场建设费</span>
                                        <span>¥{airportFee}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">燃油附加费</span>
                                        <span>¥{fuelSurcharge}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">单人总价</span>
                                        <span className="font-semibold">¥{totalPerPerson}</span>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-semibold">订单总价</span>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-primary">¥{grandTotal}</div>
                                        <div className="text-xs text-muted-foreground">含税费及附加费</div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleSubmit}
                                >
                                    提交订单
                                </Button>

                                <div className="mt-4 p-3 bg-accent/5 rounded-lg">
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        点击"提交订单"即表示您同意我们的服务条款和隐私政策。订单提交后将跳转至支付页面。
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

export default OrderFlight;
