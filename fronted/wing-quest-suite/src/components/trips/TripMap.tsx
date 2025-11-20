import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  type: "flight" | "hotel" | "ticket";
}

interface TripMapProps {
  locations: Location[];
}

const TripMap = ({ locations }: TripMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = "tkxxxx";

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: locations.length > 0 ? locations[0].coordinates : [116.4074, 39.9042],
        zoom: 10,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // 添加标记
      locations.forEach((location) => {
        const color =
          location.type === "flight"
            ? "#3b82f6"
            : location.type === "hotel"
            ? "#22c55e"
            : "#f97316";

        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.width = "30px";
        el.style.height = "30px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = color;
        el.style.border = "3px solid white";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
        el.style.cursor = "pointer";

        new mapboxgl.Marker(el)
          .setLngLat(location.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${location.name}</h3>
                <p style="font-size: 12px; color: #666;">
                  ${
                    location.type === "flight"
                      ? "航班"
                      : location.type === "hotel"
                      ? "酒店"
                      : "景点"
                  }
                </p>
              </div>`
            )
          )
          .addTo(map.current!);
      });

      // 如果有多个位置，调整视图以包含所有标记
      if (locations.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        locations.forEach((loc) => bounds.extend(loc.coordinates));
        map.current.fitBounds(bounds, { padding: 50 });
      }
    } catch (error) {
      console.error("地图初始化失败:", error);
    }

    return () => {
      map.current?.remove();
    };
  }, [locations]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      {locations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">暂无位置信息</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripMap;