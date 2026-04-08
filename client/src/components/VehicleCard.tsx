import { GitCompareArrows, Heart, MapPin } from "lucide-react";
import type { Vehicle } from "@/lib/vehicleData";
import { Link } from "wouter";

interface VehicleCardProps {
  vehicle: Vehicle;
  onCompare?: (vehicle: Vehicle) => void;
  onFavorite?: (vehicle: Vehicle) => void;
  isInCompare?: boolean;
}

export default function VehicleCard({
  vehicle,
  onCompare,
  onFavorite,
  isInCompare,
}: VehicleCardProps) {
  return (
    <div className="group bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image - clickable */}
      <Link href={`/vehicle/${vehicle.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer">
          <img
            src={vehicle.image}
            alt={vehicle.model}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {vehicle.isNew && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-sm px-3 py-1.5 font-medium tracking-wide">
              最新上架
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/vehicle/${vehicle.id}`}>
              <h3 className="font-display text-xl font-semibold text-gray-900 tracking-wide hover:text-gray-600 transition-colors cursor-pointer">
                {vehicle.model}
              </h3>
            </Link>
            <div className="mt-2 space-y-1">
              <p className="text-base text-gray-500">
                {vehicle.year}年{vehicle.month}月出廠 | {vehicle.color}
              </p>
              <p className="text-base text-gray-500">
                {vehicle.mileage.toLocaleString()} 公里
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {vehicle.location}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-display text-3xl font-bold text-gray-900">
              {vehicle.price}
            </span>
            <span className="text-base text-gray-500 ml-0.5">萬</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              onCompare?.(vehicle);
            }}
            className={`p-2 rounded-full transition-colors ${
              isInCompare
                ? "bg-gray-900 text-white"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            title="加入比較"
          >
            <GitCompareArrows size={20} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite?.(vehicle);
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="收藏清單"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
