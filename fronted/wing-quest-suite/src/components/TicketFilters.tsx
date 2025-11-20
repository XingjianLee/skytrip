import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TicketFiltersProps {
  filters: {
    priceRange: number[];
    types: string[];
    rating: number;
    features: string[];
  };
  onFilterChange: (filters: any) => void;
}

const TicketFilters = ({ filters, onFilterChange }: TicketFiltersProps) => {
  const attractionTypes = [
    { id: "nature", label: "自然风光" },
    { id: "history", label: "历史文化" },
    { id: "theme", label: "主题乐园" },
    { id: "museum", label: "博物馆" },
    { id: "zoo", label: "动植物园" },
    { id: "park", label: "公园" },
  ];

  const features = [
    { id: "family", label: "亲子游" },
    { id: "couple", label: "情侣约会" },
    { id: "photo", label: "摄影圣地" },
    { id: "trending", label: "网红打卡" },
    { id: "refundable", label: "可退改" },
    { id: "instant", label: "即买即用" },
  ];

  const handleTypeToggle = (typeId: string) => {
    const newTypes = filters.types.includes(typeId)
      ? filters.types.filter((t) => t !== typeId)
      : [...filters.types, typeId];
    onFilterChange({ ...filters, types: newTypes });
  };

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = filters.features.includes(featureId)
      ? filters.features.filter((f) => f !== featureId)
      : [...filters.features, featureId];
    onFilterChange({ ...filters, features: newFeatures });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>筛选条件</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onFilterChange({
                priceRange: [0, 500],
                types: [],
                rating: 0,
                features: [],
              })
            }
          >
            清除
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 价格区间 */}
        <div>
          <Label className="mb-4 block font-semibold">价格区间</Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) =>
              onFilterChange({ ...filters, priceRange: value })
            }
            max={500}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>¥{filters.priceRange[0]}</span>
            <span>¥{filters.priceRange[1]}</span>
          </div>
        </div>

        {/* 景区类型 */}
        <div>
          <Label className="mb-4 block font-semibold">景区类型</Label>
          <div className="space-y-3">
            {attractionTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={filters.types.includes(type.id)}
                  onCheckedChange={() => handleTypeToggle(type.id)}
                />
                <label
                  htmlFor={type.id}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 评分 */}
        <div>
          <Label className="mb-4 block font-semibold">最低评分</Label>
          <div className="flex gap-2">
            {[0, 3, 4, 4.5].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange({ ...filters, rating })}
                className="flex-1"
              >
                {rating === 0 ? "不限" : `${rating}+`}
              </Button>
            ))}
          </div>
        </div>

        {/* 特色标签 */}
        <div>
          <Label className="mb-4 block font-semibold">特色标签</Label>
          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={filters.features.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
                <label
                  htmlFor={feature.id}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketFilters;