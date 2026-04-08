/*
 * Design: Urban Night Gradient - Lexus CPO
 * Dark hero banner + white content area + brand-consistent colors
 * Font: Montserrat (display) + Noto Sans TC (body)
 */
import { useState, useMemo, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import RangeSlider from "@/components/RangeSlider";
import { allSeries, getSeriesImage } from "@/lib/vehicleData";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight, RotateCcw, SlidersHorizontal, MapPin, Heart, GitCompareArrows } from "lucide-react";
import { useLocation, Link } from "wouter";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/hero-search-MTrBzy4pL7jUUup6KbFyEd.webp";
const ITEMS_PER_PAGE = 12;

const locations = [
  "CPO 南港所",
];

const sortOptions = [
  { value: "newest", label: "上架時間由新到舊" },
  { value: "price_asc", label: "價格由低到高" },
  { value: "price_desc", label: "價格由高到低" },
  { value: "mileage_asc", label: "里程由低到高" },
  { value: "year_desc", label: "年份由新到舊" },
];

// Default Lexus placeholder image
const DEFAULT_LEXUS_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-rx_3031ace1.jpg";

export default function Home() {
  const [, navigate] = useLocation();
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 20]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([0, 30]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch vehicles from API
  const { data: dbVehicles = [], isLoading } = trpc.vehicle.list.useQuery({
    series: selectedSeries.length > 0 ? selectedSeries : undefined,
    priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
    priceMax: priceRange[1] < 1000 ? priceRange[1] : undefined,
    mileageMin: mileageRange[0] > 0 ? mileageRange[0] * 10000 : undefined,
    mileageMax: mileageRange[1] < 30 ? mileageRange[1] * 10000 : undefined,
    location: selectedLocation || undefined,
  });

  const currentYear = new Date().getFullYear();

  const filteredVehicles = useMemo(() => {
    let result = dbVehicles.filter((v: any) => {
      const age = currentYear - v.year;
      if (age < ageRange[0] || age > ageRange[1]) return false;
      return true;
    });

    // Sort
    switch (sortBy) {
      case "price_asc":
        result.sort((a: any, b: any) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a: any, b: any) => b.price - a.price);
        break;
      case "mileage_asc":
        result.sort((a: any, b: any) => a.mileage - b.mileage);
        break;
      case "year_desc":
        result.sort((a: any, b: any) => b.year - a.year);
        break;
      default:
        result.sort((a: any, b: any) => b.id - a.id);
    }

    return result;
  }, [dbVehicles, ageRange, sortBy, currentYear]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Compare list
  const [compareList, setCompareList] = useState<any[]>([]);

  const handleCompare = (vehicle: any) => {
    setCompareList((prev) => {
      if (prev.find((v) => v.id === vehicle.id)) {
        return prev.filter((v) => v.id !== vehicle.id);
      }
      if (prev.length >= 3) {
        alert("最多只能比較3輛車");
        return prev;
      }
      return [...prev, vehicle];
    });
  };

  const handleFavorite = () => {
    window.open("https://toyotacpo-qh7857au.manus.space", "_blank");
  };

  const resetFilters = () => {
    setSelectedSeries([]);
    setPriceRange([0, 1000]);
    setAgeRange([0, 20]);
    setMileageRange([0, 30]);
    setSelectedLocation("");
    setCurrentPage(1);
  };

  const toggleSeries = (series: string) => {
    setSelectedSeries((prev) =>
      prev.includes(series) ? prev.filter((s) => s !== series) : [...prev, series]
    );
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <HeroBanner
          title="車 輛 搜 尋"
          backgroundImage={HERO_IMAGE}
          breadcrumbs={[
            { label: "首頁", href: "/" },
            { label: "車輛搜尋" },
          ]}
        />

        {/* Series Carousel */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide px-10 py-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* All Models */}
              <button
                onClick={() => {
                  setSelectedSeries([]);
                  setCurrentPage(1);
                }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                  selectedSeries.length === 0
                    ? "bg-gray-100 ring-2 ring-gray-800"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="w-[120px] h-[70px] flex items-center justify-center">
                  <span className="text-base font-medium text-gray-700">全車款</span>
                </div>
              </button>

              {allSeries.map((series) => (
                <button
                  key={series}
                  onClick={() => {
                    setSelectedSeries([series]);
                    setCurrentPage(1);
                  }}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                    selectedSeries.includes(series)
                      ? "bg-gray-100 ring-2 ring-gray-800"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-[120px] h-[70px] overflow-hidden rounded">
                    <img
                      src={getSeriesImage(series)}
                      alt={series}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-base font-display font-semibold text-gray-700">
                    {series}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Filters + Results */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Filter Panel */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-4 tracking-wide">篩選條件</h3>

            {/* Series Checkboxes */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-600">車系</span>
                <button
                  onClick={() => setSelectedSeries([])}
                  className={`text-sm px-2.5 py-1 rounded ${
                    selectedSeries.length === 0
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  不限
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allSeries.map((series) => (
                  <label
                    key={series}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-sm cursor-pointer transition-colors ${
                      selectedSeries.includes(series)
                        ? "bg-gray-800 text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSeries.includes(series)}
                      onChange={() => toggleSeries(series)}
                      className="sr-only"
                    />
                    {series}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-600">價格</span>
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className="text-sm px-2.5 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  不限
                </button>
              </div>
              <RangeSlider
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onChange={(v) => { setPriceRange(v); setCurrentPage(1); }}
                suffix="萬"
              />
            </div>

            {/* Age Range */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-600">車齡</span>
                <button
                  onClick={() => setAgeRange([0, 20])}
                  className="text-sm px-2.5 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  不限
                </button>
              </div>
              <RangeSlider
                min={0}
                max={20}
                step={1}
                value={ageRange}
                onChange={(v) => { setAgeRange(v); setCurrentPage(1); }}
                suffix="年"
              />
            </div>

            {/* Mileage Range */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-600">里程</span>
                <button
                  onClick={() => setMileageRange([0, 30])}
                  className="text-sm px-2.5 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  不限
                </button>
              </div>
              <RangeSlider
                min={0}
                max={30}
                step={1}
                value={mileageRange}
                onChange={(v) => { setMileageRange(v); setCurrentPage(1); }}
                suffix="萬公里"
              />
            </div>

            {/* Location */}
            {showAllFilters && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">據點</span>
                  <button
                    onClick={() => setSelectedLocation("")}
                    className="text-sm px-2.5 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    不限
                  </button>
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded text-sm text-gray-700 bg-white"
                >
                  <option value="">選擇據點</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Filter Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RotateCcw size={16} />
                重設篩選條件
              </button>
              <button
                onClick={() => setShowAllFilters(!showAllFilters)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <SlidersHorizontal size={16} />
                {showAllFilters ? "收合篩選條件" : "全部篩選條件"}
              </button>
            </div>
          </div>

          {/* Compare Bar */}
          {compareList.length > 0 && (
            <div className="bg-gray-900 text-white rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base">已選擇 {compareList.length} 輛車進行比較</span>
                <div className="flex gap-2">
                  {compareList.map((v: any) => (
                    <span key={v.id} className="text-sm bg-white/20 px-2 py-1 rounded">
                      {v.model}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareList([])}
                  className="text-sm text-white/70 hover:text-white"
                >
                  清除
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("compareVehicles", JSON.stringify(compareList));
                    navigate("/compare");
                  }}
                  className="bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  前往比較
                </button>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-base text-gray-600">
              共 <span className="font-display font-bold text-gray-900 text-xl">{filteredVehicles.length}</span> 輛原廠認證中古車
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded px-3 py-2 text-gray-600 bg-white"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              <p className="mt-4 text-gray-400">載入車輛資料中...</p>
            </div>
          )}

          {/* Vehicle Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedVehicles.map((vehicle: any) => (
                <div key={vehicle.id} className="group bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Image - clickable */}
                  <Link href={`/vehicle/${vehicle.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer">
                      <img
                        src={vehicle.imageUrl || getSeriesImage(vehicle.series) || DEFAULT_LEXUS_IMAGE}
                        alt={vehicle.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {vehicle.isNew === 1 && (
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
                          handleCompare(vehicle);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          compareList.some((v) => v.id === vehicle.id)
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
                          handleFavorite();
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="TOYOTA CPO原廠認證中古車"
                      >
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && paginatedVehicles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">目前沒有符合條件的車輛</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                重設篩選條件
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  className={`w-10 h-10 rounded text-base font-medium transition-colors ${
                    currentPage === page
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
