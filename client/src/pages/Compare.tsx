/*
 * Design: Urban Night Gradient - Lexus CPO
 * Vehicle comparison page with side-by-side specs table
 * Uses actual DB vehicle shape (flat fields, not nested features)
 */
import { useState, useEffect, useMemo, Fragment } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import { trpc } from "@/lib/trpc";
import { Plus, X, Check, Minus, Phone, Loader2 } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/hero-compare-H5qfU9fECRMWfdRHjEdVuB.webp";
const LINE_URL = "https://lin.ee/z1bS1z8";

// Helper: parse comma/、/newline-separated feature text into array
function parseFeatures(text: string | null | undefined): string[] {
  if (!text) return [];
  return text.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean);
}

// DB vehicle type (matches what the API actually returns)
interface DbVehicle {
  id: number;
  series: string;
  model: string;
  year: number;
  month: number;
  color: string;
  mileage: number;
  price: number;
  location: string;
  imageUrl: string | null;
  engineType: string | null;
  displacement: string | null;
  fuelType: string | null;
  driveType: string | null;
  seats: number | null;
  exteriorFeatures: string | null;
  interiorFeatures: string | null;
  safetyFeatures: string | null;
  description: string | null;
  isNew: number | null;
  isActive: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

type FeatureKey = "exterior" | "interior" | "safety";

const featureCategories: Array<
  | {
      title: string;
      type: "fields";
      fields: { key: string; label: string; format: (v: DbVehicle) => string }[];
    }
  | {
      title: string;
      type: "features";
      featureKey: FeatureKey;
    }
> = [
  {
    title: "基本資訊",
    type: "fields",
    fields: [
      { key: "displacement", label: "排氣量", format: (v) => v.displacement || "純電" },
      { key: "mileage", label: "里程數", format: (v) => `${v.mileage.toLocaleString()}公里` },
      { key: "year", label: "出廠年月", format: (v) => `${v.year}/${String(v.month).padStart(2, "0")}` },
      { key: "fuelType", label: "燃料類型", format: (v) => v.fuelType || "-" },
      { key: "driveType", label: "驅動方式", format: (v) => v.driveType || "-" },
      { key: "engineType", label: "引擎型式", format: (v) => v.engineType || "-" },
      { key: "seats", label: "座位數", format: (v) => v.seats ? `${v.seats}人座` : "-" },
      { key: "color", label: "外觀車色", format: (v) => v.color },
    ],
  },
  {
    title: "外觀配備",
    type: "features",
    featureKey: "exterior",
  },
  {
    title: "內裝配備",
    type: "features",
    featureKey: "interior",
  },
  {
    title: "安全配備",
    type: "features",
    featureKey: "safety",
  },
  {
    title: "營業據點",
    type: "fields",
    fields: [
      { key: "location", label: "據點", format: (v) => v.location },
    ],
  },
];

// Map featureKey to the DB field name
function getFeatureText(v: DbVehicle, key: FeatureKey): string | null {
  switch (key) {
    case "exterior": return v.exteriorFeatures;
    case "interior": return v.interiorFeatures;
    case "safety": return v.safetyFeatures;
    default: return null;
  }
}

export default function Compare() {
  const [compareVehicles, setCompareVehicles] = useState<(DbVehicle | null)[]>([null, null, null]);
  const [showPicker, setShowPicker] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  // Fetch all vehicles for the picker
  const { data: allVehicles, isLoading } = trpc.vehicle.list.useQuery({});

  useEffect(() => {
    const stored = localStorage.getItem("compareVehicles");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DbVehicle[];
        const filled: (DbVehicle | null)[] = [null, null, null];
        parsed.forEach((v, i) => {
          if (i < 3) filled[i] = v;
        });
        setCompareVehicles(filled);
        localStorage.removeItem("compareVehicles");
      } catch {
        // ignore
      }
    }
  }, []);

  const filteredVehicles = useMemo(() => {
    if (!allVehicles) return [];
    return allVehicles.filter(
      (v: DbVehicle) =>
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.series.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allVehicles, searchTerm]);

  const selectVehicle = (index: number, vehicle: DbVehicle) => {
    const newList = [...compareVehicles];
    newList[index] = vehicle;
    setCompareVehicles(newList);
    setShowPicker(null);
    setSearchTerm("");
  };

  const removeVehicle = (index: number) => {
    const newList = [...compareVehicles];
    newList[index] = null;
    setCompareVehicles(newList);
  };

  const activeVehicles = compareVehicles.filter((v): v is DbVehicle => v !== null);

  // Collect all unique feature items across all active vehicles for each feature category
  const featureItemsMap = useMemo(() => {
    const map: Record<FeatureKey, string[]> = { exterior: [], interior: [], safety: [] };
    for (const key of ["exterior", "interior", "safety"] as FeatureKey[]) {
      const allItems = new Set<string>();
      for (const v of activeVehicles) {
        const items = parseFeatures(getFeatureText(v, key));
        items.forEach((item) => allItems.add(item));
      }
      map[key] = Array.from(allItems);
    }
    return map;
  }, [activeVehicles]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-16">
        <HeroBanner
          title="車 輛 比 較"
          backgroundImage={HERO_IMAGE}
          breadcrumbs={[
            { label: "首頁", href: "/" },
            { label: "車輛比較" },
          ]}
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Vehicle Selection Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {compareVehicles.map((vehicle, index) => (
              <div key={index} className="relative">
                {vehicle ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => removeVehicle(index)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700"
                    >
                      <X size={16} />
                    </button>
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src={vehicle.imageUrl || ""}
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-display font-semibold text-base">{vehicle.model}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {vehicle.price}萬 | {vehicle.mileage.toLocaleString()}km
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPicker(index)}
                    className="w-full aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors bg-gray-50"
                  >
                    <Plus size={32} />
                    <span className="text-base">尋找車輛</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {activeVehicles.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <tbody>
                  {featureCategories.map((category) => (
                    <Fragment key={category.title}>
                      {/* Category Header */}
                      <tr key={`header-${category.title}`}>
                        <td
                          colSpan={4}
                          className="bg-gray-50 px-6 py-3 border-b border-gray-200 font-semibold text-base text-gray-800"
                        >
                          {category.title}
                        </td>
                      </tr>

                      {/* Fields (basic info / location) */}
                      {category.type === "fields" &&
                        category.fields.map((field) => (
                          <tr key={field.key} className="border-b border-gray-100">
                            <td className="px-6 py-3 text-sm text-gray-600 bg-white border-r border-gray-100 w-[200px] whitespace-nowrap">
                              {field.label}
                            </td>
                            {compareVehicles.map((v, i) => (
                              <td key={i} className="px-4 py-3 text-sm text-gray-800 text-center">
                                {v ? field.format(v) : "-"}
                              </td>
                            ))}
                          </tr>
                        ))}

                      {/* Feature Items (exterior, interior, safety) */}
                      {category.type === "features" &&
                        featureItemsMap[category.featureKey].length > 0 &&
                        featureItemsMap[category.featureKey].map((item) => (
                          <tr key={`${category.featureKey}-${item}`} className="border-b border-gray-100">
                            <td className="px-6 py-3 text-sm text-gray-600 bg-white border-r border-gray-100 w-[200px]">
                              {item}
                            </td>
                            {compareVehicles.map((v, i) => (
                              <td key={i} className="px-4 py-3 text-center">
                                {v ? (
                                  parseFeatures(getFeatureText(v, category.featureKey)).includes(item) ? (
                                    <Check size={16} className="text-green-600 inline-block" />
                                  ) : (
                                    <Minus size={16} className="text-gray-300 inline-block" />
                                  )
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}

                      {/* Show empty state for feature categories with no data */}
                      {category.type === "features" &&
                        featureItemsMap[category.featureKey].length === 0 &&
                        activeVehicles.length > 0 && (
                          <tr key={`${category.featureKey}-empty`} className="border-b border-gray-100">
                            <td colSpan={4} className="px-6 py-3 text-sm text-gray-400 text-center">
                              尚無配備資料
                            </td>
                          </tr>
                        )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty state */}
          {activeVehicles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-2">請選擇車輛進行比較</p>
              <p className="text-gray-400 text-sm">點擊上方「+」按鈕選擇要比較的車輛</p>
            </div>
          )}

          {/* Contact Button */}
          {activeVehicles.length > 0 && (
            <div className="mt-8 text-center">
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-8 py-3 rounded font-medium text-base hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                <Phone size={18} />
                立即洽詢
              </a>
            </div>
          )}
        </div>

        {/* Vehicle Picker Modal */}
        {showPicker !== null && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-800">選擇車輛</h3>
                <button
                  onClick={() => { setShowPicker(null); setSearchTerm(""); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  placeholder="搜尋車型..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              <div className="overflow-y-auto max-h-[50vh] p-4 pt-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredVehicles.map((v: DbVehicle) => (
                      <button
                        key={v.id}
                        onClick={() => selectVehicle(showPicker, v)}
                        className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <img
                          src={v.imageUrl || ""}
                          alt={v.model}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{v.model}</p>
                          <p className="text-xs text-gray-500">
                            {v.price}萬 | {v.year}年 | {v.mileage.toLocaleString()}km
                          </p>
                        </div>
                      </button>
                    ))}
                    {filteredVehicles.length === 0 && !isLoading && (
                      <p className="col-span-2 text-center text-gray-400 py-8">
                        找不到符合的車輛
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
