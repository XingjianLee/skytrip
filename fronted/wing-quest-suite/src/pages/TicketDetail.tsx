import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Heart, Clock, Users, ChevronLeft, ChevronRight, Check, Calendar, Ticket as TicketIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const ticketData = {
    "1": {
        id: 1,
        name: "故宫博物院",
        location: "北京市东城区景山前街4号",
        rating: 4.8,
        reviewCount: 12580,
        description: "故宫博物院建立于1925年，是在明清两代皇宫及其收藏的基础上建立起来的中国综合性博物馆。故宫是世界上现存规模最大、保存最完整的木质结构古建筑群，拥有殿宇宫室9000余间，被誉为世界五大宫之首。这里不仅是中国古代宫廷建筑艺术的珍品，更是世界文化遗产，收藏着超过180万件珍贵文物，包括书画、陶瓷、铜器、玉器等各类艺术珍品。",
        coordinates: [116.3972, 39.9163] as [number, number],
        images: [
            "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&q=80",
            "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=80",
            "https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=1200&q=80",
            "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=1200&q=80",
        ],
        openTime: "08:30-17:00",
        suggestedDuration: "4-6小时",
        tags: ["世界遗产", "必游景点", "历史文化"],
        highlights: [
            { title: "太和殿", description: "中国现存最大的木结构大殿，皇家举行大典的地方" },
            { title: "珍宝馆", description: "展示清代皇家珍宝，金银器皿、玉器、珍珠宝石等" },
            { title: "钟表馆", description: "世界最大的古代钟表收藏展览馆" },
            { title: "御花园", description: "明清两代皇家花园，古树名木、假山叠石" }
        ],
        facilities: ["语音导览", "无障碍通道", "餐饮服务", "纪念品店", "卫生间", "休息区"],
        tickets: [
            {
                id: 1,
                name: "成人票",
                price: 60,
                originalPrice: 60,
                description: "适用于18岁以上成年人",
                rules: ["需提前预约", "当日有效", "一人一票"]
            },
            {
                id: 2,
                name: "学生票",
                price: 20,
                originalPrice: 60,
                description: "适用于大中小学生（不含成人教育、研究生）",
                rules: ["需提前预约", "需携带学生证", "当日有效"]
            },
            {
                id: 3,
                name: "儿童/老人票",
                price: 0,
                originalPrice: 60,
                description: "6岁以下或60岁以上",
                rules: ["需提前预约", "需携带有效证件", "当日有效"]
            }
        ],
        notices: [
            "请提前通过官方网站或小程序实名预约购票",
            "入院需出示身份证件、预约码、健康码",
            "禁止携带易燃易爆物品、管制刀具等危险品",
            "请勿在殿内拍照、触摸文物",
            "建议游览时长4-6小时，请合理安排时间"
        ]
    },
    "2": {
        id: 2,
        name: "上海迪士尼乐园",
        location: "上海市浦东新区川沙镇黄赵路310号",
        rating: 4.7,
        reviewCount: 25600,
        description: "上海迪士尼度假区是中国大陆首座迪士尼度假区，拥有全球最大的迪士尼城堡——奇幻童话城堡。乐园融合了经典迪士尼故事和中国文化元素，打造了探险岛、宝藏湾、明日世界等六大主题园区。这里有惊险刺激的雷鸣山漂流、令人尖叫的创极速光轮、浪漫温馨的七个小矮人矿山车，还有精彩绝伦的百老汇音乐剧《狮子王》。",
        coordinates: [121.6544, 31.1440] as [number, number],
        images: [
            "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&q=80",
            "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=1200&q=80",
            "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80",
            "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&q=80",
        ],
        openTime: "09:00-21:00",
        suggestedDuration: "全天",
        tags: ["亲子游", "网红打卡", "主题乐园"],
        highlights: [
            { title: "奇幻童话城堡", description: "全球最高最大的迪士尼城堡，夜间灯光秀震撼人心" },
            { title: "创极速光轮", description: "全球迪士尼乐园中首个《创：战纪》主题园区" },
            { title: "雷鸣山漂流", description: "穿越神秘部落，体验惊险刺激的漂流冒险" },
            { title: "加勒比海盗", description: "沉浸式海盗冒险，突破性视听体验" }
        ],
        facilities: ["婴儿车租赁", "轮椅租赁", "储物柜", "餐饮服务", "纪念品店", "急救站"],
        tickets: [
            {
                id: 1,
                name: "标准票",
                price: 399,
                originalPrice: 499,
                description: "适用于身高1.4米以上游客",
                rules: ["一日一园", "需提前预约", "当日有效"]
            },
            {
                id: 2,
                name: "儿童票",
                price: 299,
                originalPrice: 375,
                description: "适用于身高1.0-1.4米儿童",
                rules: ["一日一园", "需提前预约", "当日有效"]
            },
            {
                id: 3,
                name: "老年票",
                price: 299,
                originalPrice: 375,
                description: "适用于65岁及以上老年人",
                rules: ["一日一园", "需携带身份证", "当日有效"]
            },
            {
                id: 4,
                name: "两日联票",
                price: 718,
                originalPrice: 898,
                description: "连续两日入园",
                rules: ["连续两日有效", "需提前预约", "不可分开使用"]
            }
        ],
        notices: [
            "入园需通过安检，请勿携带食品饮料（婴儿食品除外）",
            "部分项目有身高限制，请提前查看游玩须知",
            "建议提前下载官方APP查看实时等候时间",
            "可购买迪士尼尊享卡，免排队体验热门项目",
            "烟花表演通常在晚上8:30开始，建议提前占位"
        ]
    },
    "3": {
        id: 3,
        name: "张家界国家森林公园",
        location: "湖南省张家界市武陵源区",
        rating: 4.9,
        reviewCount: 18900,
        description: "张家界国家森林公园是中国第一个国家森林公园，被誉为扩大的盆景、缩小的仙境。这里拥有独特的石英砂岩峰林地貌，3000多座石峰拔地而起，形态各异，云雾缭绕，宛如仙境。公园内有金鞭溪、袁家界、天子山、杨家界等著名景区，还有世界最高最长的玻璃桥——张家界大峡谷玻璃桥，以及世界自然遗产、世界地质公园等多项殊荣。",
        coordinates: [110.4428, 29.3477] as [number, number],
        images: [
            "https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=1200&q=80",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
            "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
        ],
        openTime: "07:00-18:00",
        suggestedDuration: "2-3天",
        tags: ["世界自然遗产", "摄影圣地", "自然风光"],
        highlights: [
            { title: "袁家界", description: "电影《阿凡达》取景地，神奇的悬浮山原型地" },
            { title: "天子山", description: "天子山云海、峰林晚霞，峰林之王的美誉" },
            { title: "金鞭溪", description: "全长7.5公里的峡谷溪流，世界上最美丽的峡谷" },
            { title: "玻璃栈道", description: "悬崖峭壁上的透明栈道，惊险刺激" }
        ],
        facilities: ["索道缆车", "环保车", "餐饮服务", "住宿服务", "医疗站", "行李寄存"],
        tickets: [
            {
                id: 1,
                name: "成人票（4日内多次入园）",
                price: 225,
                originalPrice: 225,
                description: "适用于成年游客",
                rules: ["4日内可多次入园", "包含环保车", "需实名制购买"]
            },
            {
                id: 2,
                name: "优惠票",
                price: 115,
                originalPrice: 225,
                description: "适用于学生、60-69岁老人",
                rules: ["4日内可多次入园", "需携带有效证件", "包含环保车"]
            },
            {
                id: 3,
                name: "免票",
                price: 0,
                originalPrice: 225,
                description: "14岁以下儿童、70岁以上老人、现役军人",
                rules: ["需携带有效证件", "需购买3元保险", "包含环保车"]
            }
        ],
        notices: [
            "景区面积大，建议安排2-3天游览时间",
            "山区天气多变，请备好雨具和防寒衣物",
            "部分景点需要爬山，请穿着舒适的运动鞋",
            "索道、电梯、观光车等需另外付费",
            "建议购买意外保险，注意安全"
        ]
    },
    "4": {
        id: 4,
        name: "成都大熊猫繁育研究基地",
        location: "四川省成都市成华区外北熊猫大道1375号",
        rating: 4.8,
        reviewCount: 20300,
        description: "成都大熊猫繁育研究基地是全球最大的大熊猫繁育科研机构，距市中心约10公里。基地占地1000亩，绿树成荫、鸟语花香，生活着100余只大熊猫及小熊猫、黑颈鹤、白鹤等珍稀动物。这里模拟大熊猫野外生活环境，建有湖泊、溪流、竹林、草坪，是大熊猫等珍稀濒危野生动物保护研究及繁育的重要场所。游客可以近距离观察大熊猫的日常生活，了解大熊猫的保护知识。",
        coordinates: [104.1486, 30.7326] as [number, number],
        images: [
            "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=80",
            "https://images.unsplash.com/photo-1527118732049-c88155f2107c?w=1200&q=80",
            "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=1200&q=80",
            "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=1200&q=80",
        ],
        openTime: "07:30-18:00",
        suggestedDuration: "2-3小时",
        tags: ["亲子游", "国宝大熊猫", "科普教育"],
        highlights: [
            { title: "大熊猫别墅", description: "观赏成年大熊猫悠闲玩耍、进食竹子" },
            { title: "大熊猫幼年园", description: "超萌的熊猫宝宝，最佳拍照打卡点" },
            { title: "大熊猫14号别墅", description: "熊猫产房，有机会看到刚出生的熊猫宝宝" },
            { title: "科普展馆", description: "了解大熊猫的生活习性和保护知识" }
        ],
        facilities: ["观光车", "轮椅租赁", "婴儿车", "餐厅", "咖啡厅", "纪念品店"],
        tickets: [
            {
                id: 1,
                name: "成人票",
                price: 55,
                originalPrice: 55,
                description: "适用于成年游客",
                rules: ["当日有效", "一人一票", "需提前预约"]
            },
            {
                id: 2,
                name: "学生票",
                price: 27,
                originalPrice: 55,
                description: "适用于6-18岁学生",
                rules: ["需携带学生证", "当日有效", "需提前预约"]
            },
            {
                id: 3,
                name: "儿童/老年票",
                price: 0,
                originalPrice: 55,
                description: "6岁以下儿童、60岁以上老人",
                rules: ["需携带有效证件", "当日有效", "需成人陪同"]
            }
        ],
        notices: [
            "大熊猫最活跃的时间是早上8:00-10:00，建议早点到达",
            "请勿投喂、惊扰动物，保持安静",
            "请勿使用闪光灯拍照，以免惊吓动物",
            "园区较大，可选择乘坐观光车（另付费）",
            "建议游览时间2-3小时，请合理安排行程"
        ]
    }
};

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedTicketType, setSelectedTicketType] = useState("1");
    const [visitDate, setVisitDate] = useState("");
    const [quantity, setQuantity] = useState(1);

    const ticket = ticketData[id as keyof typeof ticketData];

    useEffect(() => {
        if (!mapContainer.current || !ticket) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNTZqYWg4ZzBhZmkya3M4ZDh5OXFtOW4ifQ.FE5HYPPxNC0rWYeFLtLqhA';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: ticket.coordinates,
            zoom: 13,
        });

        new mapboxgl.Marker({ color: '#FF6B6B' })
            .setLngLat(ticket.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h3 class="font-semibold">${ticket.name}</h3><p class="text-sm">${ticket.location}</p>`)
            )
            .addTo(map.current);

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        return () => {
            map.current?.remove();
        };
    }, [ticket]);

    if (!ticket) {
        return <div>景点未找到</div>;
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % ticket.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + ticket.images.length) % ticket.images.length);
    };

    const selectedTicket = ticket.tickets.find(t => t.id.toString() === selectedTicketType);
    const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar isLoggedIn={true} />

            <div className="pt-20">
                {/* Image Gallery */}
                <div className="relative h-[500px] bg-black">
                    <img
                        src={ticket.images[currentImageIndex]}
                        alt={ticket.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Navigation Buttons */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={nextImage}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </Button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {ticket.images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Back Button */}
                    <Button
                        variant="outline"
                        className="absolute top-4 left-4 bg-white/90 hover:bg-white"
                        onClick={() => navigate('/book-ticket')}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        返回搜索
                    </Button>

                    {/* Favorite Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className={`absolute top-4 right-4 ${
                            isFavorite ? 'bg-primary text-white' : 'bg-white/90'
                        }`}
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                </div>

                {/* Ticket Info */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Header */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {ticket.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline">{tag}</Badge>
                                    ))}
                                </div>
                                <h1 className="text-4xl font-bold mb-4">{ticket.name}</h1>
                                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{ticket.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        <span className="font-semibold text-foreground">{ticket.rating}</span>
                                        <span>({ticket.reviewCount} 条评价)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{ticket.openTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>建议游玩 {ticket.suggestedDuration}</span>
                                    </div>
                                </div>
                                <Separator />
                            </div>

                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>景点介绍</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {ticket.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Highlights */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>景点亮点</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {ticket.highlights.map((highlight, index) => (
                                            <div key={index} className="p-4 rounded-lg bg-accent/5 border">
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-primary" />
                                                    {highlight.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {highlight.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Facilities */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>景区设施</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {ticket.facilities.map((facility, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-primary" />
                                                <span className="text-sm">{facility}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Map */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>位置导览</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div ref={mapContainer} className="h-[400px] rounded-lg" />
                                </CardContent>
                            </Card>

                            {/* Notices */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="w-5 h-5 text-primary" />
                                        游玩须知
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {ticket.notices.map((notice, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{notice}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Booking Card */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TicketIcon className="w-5 h-5" />
                                        门票预订
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Ticket Type Selection */}
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">选择门票类型</Label>
                                        <RadioGroup value={selectedTicketType} onValueChange={setSelectedTicketType}>
                                            <div className="space-y-3">
                                                {ticket.tickets.map((ticketType) => (
                                                    <div
                                                        key={ticketType.id}
                                                        className={`relative flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                            selectedTicketType === ticketType.id.toString()
                                                                ? 'border-primary bg-primary/5'
                                                                : 'border-border hover:border-primary/50'
                                                        }`}
                                                        onClick={() => setSelectedTicketType(ticketType.id.toString())}
                                                    >
                                                        <RadioGroupItem value={ticketType.id.toString()} id={`ticket-${ticketType.id}`} />
                                                        <div className="flex-1">
                                                            <Label
                                                                htmlFor={`ticket-${ticketType.id}`}
                                                                className="font-semibold cursor-pointer"
                                                            >
                                                                {ticketType.name}
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {ticketType.description}
                                                            </p>
                                                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-bold text-primary">
                                  ¥{ticketType.price}
                                </span>
                                                                {ticketType.originalPrice > ticketType.price && (
                                                                    <span className="text-sm text-muted-foreground line-through">
                                    ¥{ticketType.originalPrice}
                                  </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <Separator />

                                    {/* Selected Ticket Rules */}
                                    {selectedTicket && (
                                        <div className="bg-accent/5 p-4 rounded-lg">
                                            <p className="text-sm font-medium mb-2">购票须知：</p>
                                            <ul className="space-y-1">
                                                {selectedTicket.rules.map((rule, index) => (
                                                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                                                        <span>•</span>
                                                        <span>{rule}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Visit Date */}
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">游玩日期</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                value={visitDate}
                                                onChange={(e) => setVisitDate(e.target.value)}
                                                className="pl-10"
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">购买数量</Label>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="text-center"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setQuantity(quantity + 1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Price Summary */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {selectedTicket?.name} × {quantity}
                      </span>
                                            <span>¥{totalPrice}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>总计</span>
                                            <span className="text-primary">¥{totalPrice}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full" size="lg" disabled={!visitDate || quantity < 1}>
                                        立即预订
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground">
                                        预订后支持退改，具体以产品规则为准
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TicketDetail;
