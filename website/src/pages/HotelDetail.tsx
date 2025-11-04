import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Heart, Wifi, Coffee, Car, Utensils, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const hotelData = {
    "1": {
        id: 1,
        name: "马里布海景豪宅",
        location: "北京市朝阳区建国路88号",
        rating: 4.8,
        reviewCount: 328,
        description: "坐落于繁华的朝阳商务区，这家五星级酒店将现代奢华与传统优雅完美融合。酒店拥有壮丽的城市天际线景观，为您提供难忘的住宿体验。每间客房都经过精心设计，配备了最先进的设施和优质的床上用品，确保您拥有舒适的睡眠体验。",
        coordinates: [116.4574, 39.9042] as [number, number],
        images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80",
        ],
        amenities: ["免费WiFi", "停车场", "餐厅", "健身房", "游泳池", "商务中心", "24小时前台", "洗衣服务"],
        rooms: [
            {
                id: 1,
                name: "豪华大床房",
                size: 35,
                beds: "1张特大床",
                price: 620,
                image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
                features: ["城市景观", "免费WiFi", "迷你吧", "独立浴室"],
                breakfast: "含双人自助早餐",
                maxGuests: 2
            },
            {
                id: 2,
                name: "行政套房",
                size: 55,
                beds: "1张特大床 + 客厅",
                price: 980,
                image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80",
                features: ["全景城市景观", "免费WiFi", "迷你吧", "浴缸", "行政酒廊权限"],
                breakfast: "含双人自助早餐 + 下午茶",
                maxGuests: 3
            },
            {
                id: 3,
                name: "家庭套房",
                size: 65,
                beds: "1张特大床 + 1张双人床",
                price: 1280,
                image: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800&q=80",
                features: ["城市景观", "两个卫生间", "儿童设施", "客厅", "厨房设施"],
                breakfast: "含家庭自助早餐",
                maxGuests: 4
            }
        ]
    },
    "2": {
        id: 2,
        name: "星光山顶小屋",
        location: "上海市浦东新区陆家嘴环路1000号",
        rating: 4.8,
        reviewCount: 256,
        description: "位于标志性的浦东陆家嘴金融区中心，这家精品酒店以其独特的设计风格和卓越的服务而闻名。酒店融合了现代艺术元素与东方传统美学，为客人打造独一无二的入住体验。从房间可以俯瞰黄浦江和外滩的迷人景色。",
        coordinates: [121.5050, 31.2400] as [number, number],
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80",
        ],
        amenities: ["免费WiFi", "代客停车", "米其林餐厅", "空中酒吧", "水疗中心", "室内泳池", "贵宾服务", "礼宾服务"],
        rooms: [
            {
                id: 1,
                name: "江景豪华房",
                size: 40,
                beds: "1张特大床",
                price: 520,
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
                features: ["黄浦江景观", "落地窗", "智能控制系统", "胶囊咖啡机"],
                breakfast: "含自助早餐",
                maxGuests: 2
            },
            {
                id: 2,
                name: "浦江全景套房",
                size: 70,
                beds: "1张特大床 + 独立客厅",
                price: 890,
                image: "https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&q=80",
                features: ["180度江景", "独立浴缸", "私人阳台", "胶囊咖啡机", "迎宾水果"],
                breakfast: "含行政早餐 + 晚间鸡尾酒",
                maxGuests: 3
            },
            {
                id: 3,
                name: "顶层豪华套房",
                size: 95,
                beds: "1张特大床 + 客厅 + 书房",
                price: 1580,
                image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
                features: ["全景江景", "私人露台", "按摩浴缸", "智能家居", "管家服务"],
                breakfast: "含定制早餐 + 全日餐饮",
                maxGuests: 4
            }
        ]
    },
    "3": {
        id: 3,
        name: "月光木屋度假村",
        location: "广州市天河区珠江新城花城大道123号",
        rating: 4.8,
        reviewCount: 192,
        description: "坐落于广州市中心的绿洲，这家度假村以其宁静的环境和贴心的服务著称。酒店周围环绕着精心打造的花园和水景，为您提供远离城市喧嚣的私密空间。每间房间都配有私人阳台，让您在享受现代便利的同时亲近自然。",
        coordinates: [113.3235, 23.1291] as [number, number],
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
        ],
        amenities: ["免费WiFi", "免费停车", "花园餐厅", "户外泳池", "儿童乐园", "自行车租赁", "瑜伽课程", "SPA中心"],
        rooms: [
            {
                id: 1,
                name: "园景标准房",
                size: 32,
                beds: "2张单人床",
                price: 540,
                image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
                features: ["花园景观", "私人阳台", "茶具套装", "空气净化器"],
                breakfast: "含有机自助早餐",
                maxGuests: 2
            },
            {
                id: 2,
                name: "豪华别墅套房",
                size: 80,
                beds: "1张特大床 + 客厅",
                price: 1080,
                image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=80",
                features: ["独立庭院", "私人泳池", "户外淋浴", "烧烤设施"],
                breakfast: "含别墅早餐 + 欢迎饮品",
                maxGuests: 4
            },
            {
                id: 3,
                name: "湖畔木屋",
                size: 50,
                beds: "1张特大床",
                price: 780,
                image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
                features: ["湖景", "独立木屋", "壁炉", "户外休息区"],
                breakfast: "含有机早餐 + 下午茶",
                maxGuests: 2
            }
        ]
    },
    "4": {
        id: 4,
        name: "水晶湖畔别墅",
        location: "深圳市南山区科技园南区深南大道9988号",
        rating: 4.8,
        reviewCount: 412,
        description: "这家现代化的高端酒店位于深圳科技园区的核心地带，是商务和休闲旅客的理想选择。酒店采用前卫的建筑设计和智能化设施，为客人提供无缝的入住体验。配备了最新的科技设备和高速网络，满足现代旅客的各种需求。",
        coordinates: [113.9354, 22.5326] as [number, number],
        images: [
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
        ],
        amenities: ["千兆WiFi", "充电桩", "智能餐厅", "科技展示厅", "VR体验区", "商务中心", "会议室", "健身房"],
        rooms: [
            {
                id: 1,
                name: "智能商务房",
                size: 38,
                beds: "1张大床",
                price: 620,
                image: "https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&q=80",
                features: ["智能语音控制", "无线充电", "工作区", "智能电视"],
                breakfast: "含商务早餐",
                maxGuests: 2
            },
            {
                id: 2,
                name: "科技套房",
                size: 60,
                beds: "1张特大床 + 客厅",
                price: 1150,
                image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
                features: ["全智能家居", "会议设施", "投影系统", "私人会客区"],
                breakfast: "含高级自助早餐 + 商务套餐",
                maxGuests: 3
            },
            {
                id: 3,
                name: "顶层行政套房",
                size: 85,
                beds: "1张特大床 + 2个客厅",
                price: 1680,
                image: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800&q=80",
                features: ["城市全景", "智能管家", "私人办公室", "VIP接待室"],
                breakfast: "含定制早餐 + 行政酒廊",
                maxGuests: 4
            }
        ]
    }
};

const HotelDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const hotel = hotelData[id as keyof typeof hotelData];

    useEffect(() => {
        if (!mapContainer.current || !hotel) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNTZqYWg4ZzBhZmkya3M4ZDh5OXFtOW4ifQ.FE5HYPPxNC0rWYeFLtLqhA';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: hotel.coordinates,
            zoom: 14,
        });

        new mapboxgl.Marker({ color: '#FF6B6B' })
            .setLngLat(hotel.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h3 class="font-semibold">${hotel.name}</h3><p class="text-sm">${hotel.location}</p>`)
            )
            .addTo(map.current);

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        return () => {
            map.current?.remove();
        };
    }, [hotel]);

    if (!hotel) {
        return <div>酒店未找到</div>;
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar isLoggedIn={true} />

            <div className="pt-20">
                {/* Image Gallery */}
                <div className="relative h-[500px] bg-black">
                    <img
                        src={hotel.images[currentImageIndex]}
                        alt={hotel.name}
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
                        {hotel.images.map((_, index) => (
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
                        onClick={() => navigate('/book-hotel')}
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

                {/* Hotel Info */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Header */}
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-3">{hotel.name}</h1>
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{hotel.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                <span className="font-semibold text-foreground">{hotel.rating}</span>
                                                <span>({hotel.reviewCount} 条评价)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                            </div>

                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>酒店介绍</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {hotel.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Amenities */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>酒店设施</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {hotel.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-primary" />
                                                <span className="text-sm">{amenity}</span>
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

                            {/* Room Types */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">房型选择</h2>
                                <div className="space-y-6">
                                    {hotel.rooms.map((room) => (
                                        <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="grid grid-cols-1 md:grid-cols-3">
                                                {/* Room Image */}
                                                <div className="relative h-[250px] md:h-auto">
                                                    <img
                                                        src={room.image}
                                                        alt={room.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <Badge className="absolute top-3 left-3">
                                                        {room.size}㎡
                                                    </Badge>
                                                </div>

                                                {/* Room Info */}
                                                <div className="md:col-span-2 p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                                <span>{room.beds}</span>
                                                                <span>•</span>
                                                                <span>最多入住 {room.maxGuests} 人</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-3xl font-bold text-primary">
                                                                ¥{room.price}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">每晚</div>
                                                        </div>
                                                    </div>

                                                    {/* Features */}
                                                    <div className="mb-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {room.features.map((feature, index) => (
                                                                <Badge key={index} variant="outline">
                                                                    {feature}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Breakfast */}
                                                    <div className="flex items-center gap-2 mb-4 text-sm">
                                                        <Coffee className="w-4 h-4 text-primary" />
                                                        <span className="font-medium">{room.breakfast}</span>
                                                    </div>

                                                    <Button className="w-full md:w-auto">
                                                        立即预订
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Booking Card */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>预订信息</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">入住日期</label>
                                        <Input type="date" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">退房日期</label>
                                        <Input type="date" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">房间数量</label>
                                        <Input type="number" min="1" defaultValue="1" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">入住人数</label>
                                        <Input type="number" min="1" defaultValue="2" />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">房费 × 3晚</span>
                                            <span>¥1,860</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">服务费</span>
                                            <span>¥93</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>总计</span>
                                            <span className="text-primary">¥1,953</span>
                                        </div>
                                    </div>
                                    <Button className="w-full" size="lg">
                                        确认预订
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        预订后24小时内可免费取消
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

export default HotelDetail;
