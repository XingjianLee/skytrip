import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterProps {
  filters: any;
  onFilterChange: (filters: any) => void;
}

export default function FlightFilters({ filters, onFilterChange }: FilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    direct: true,
    cabin: true,
    facilities: true,
    price: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFacilityToggle = (facility: string) => {
    const newFacilities = filters.facilities.includes(facility)
      ? filters.facilities.filter((f: string) => f !== facility)
      : [...filters.facilities, facility];
    onFilterChange({ ...filters, facilities: newFacilities });
  };

  const resetFilters = () => {
    onFilterChange({
      direct: false,
      cabinClass: "all",
      facilities: [],
      sortBy: "price",
      priceRange: [0, 5000]
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6 sticky top-24 border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">筛选条件</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-accent hover:text-accent-hover"
        >
          重置
        </Button>
      </div>

      <div className="space-y-6">
        {/* Sort By */}
        <div>
          <button
            onClick={() => toggleSection("sort")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-medium text-foreground">排序方式</h4>
            {expandedSections.sort ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.sort && (
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFilterChange({ ...filters, sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">价格最低</SelectItem>
                <SelectItem value="duration">时长最短</SelectItem>
                <SelectItem value="departure">最早出发</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="border-t border-border/50 pt-6">
          <button
            onClick={() => toggleSection("direct")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-medium text-foreground">航班类型</h4>
            {expandedSections.direct ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.direct && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="direct"
                checked={filters.direct}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, direct: checked })
                }
              />
              <Label htmlFor="direct" className="cursor-pointer">
                仅显示直达航班
              </Label>
            </div>
          )}
        </div>

        {/* Cabin Class */}
        <div className="border-t border-border/50 pt-6">
          <button
            onClick={() => toggleSection("cabin")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-medium text-foreground">舱位等级</h4>
            {expandedSections.cabin ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.cabin && (
            <div className="space-y-2">
              {["all", "economy", "business", "first"].map((cabin) => (
                <div key={cabin} className="flex items-center space-x-2">
                  <Checkbox
                    id={cabin}
                    checked={filters.cabinClass === cabin}
                    onCheckedChange={() =>
                      onFilterChange({ ...filters, cabinClass: cabin })
                    }
                  />
                  <Label htmlFor={cabin} className="cursor-pointer">
                    {cabin === "all" && "全部"}
                    {cabin === "economy" && "经济舱"}
                    {cabin === "business" && "商务舱"}
                    {cabin === "first" && "头等舱"}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Facilities */}
        <div className="border-t border-border/50 pt-6">
          <button
            onClick={() => toggleSection("facilities")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-medium text-foreground">基础设施</h4>
            {expandedSections.facilities ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.facilities && (
            <div className="space-y-2">
              {["wifi", "meal", "tv"].map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    id={facility}
                    checked={filters.facilities.includes(facility)}
                    onCheckedChange={() => handleFacilityToggle(facility)}
                  />
                  <Label htmlFor={facility} className="cursor-pointer">
                    {facility === "wifi" && "Wi-Fi"}
                    {facility === "meal" && "含餐"}
                    {facility === "tv" && "娱乐系统"}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-t border-border/50 pt-6">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-3"
          >
            <h4 className="font-medium text-foreground">价格区间</h4>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.price && (
            <div>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  onFilterChange({ ...filters, priceRange: value })
                }
                min={0}
                max={5000}
                step={100}
                className="mb-3"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>¥{filters.priceRange[0]}</span>
                <span>¥{filters.priceRange[1]}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
