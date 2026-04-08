import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { getSeriesImage } from "@/lib/vehicleData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MapPin,
  Calendar,
  Gauge,
  Palette,
  Car,
  Shield,
  Eye,
  MessageCircle,
  Loader2,
} from "lucide-react";

const LINE_URL = "https://lin.ee/z1bS1z8";
const DEFAULT_LEXUS_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-rx_3031ace1.jpg";

export default function VehicleDetail() {
  const [, params] = useRoute("/vehicle/:id");
  const vehicleId = params?.id ? parseInt(params.id, 10) : 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const { data: vehicle, isLoading } = trpc.vehicle.getById.useQuery(
    { id: vehicleId },
    { enabled: vehicleId > 0 }
  );

  // Sync carousel API with currentImageIndex - must be before early returns
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      setCurrentImageIndex(carouselApi.selectedScrollSnap());
    };
    carouselApi.on("select", onSelect);
    onSelect();
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafafa]">
        <Header />
        <div className="pt-16" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">載入車輛資料中...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafafa]">
        <Header />
        <div className="pt-16" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              找不到此車輛
            </h2>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              返回車輛搜尋
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Build image list from vehicle images or fallback
  const images: string[] = [];
  if (vehicle.images && vehicle.images.length > 0) {
    vehicle.images.forEach((img: any) => images.push(img.imageUrl));
  } else if (vehicle.imageUrl) {
    images.push(vehicle.imageUrl);
  } else {
    images.push(getSeriesImage(vehicle.series) || DEFAULT_LEXUS_IMAGE);
  }

  const nextImage = () => {
    carouselApi?.scrollNext();
  };

  const prevImage = () => {
    carouselApi?.scrollPrev();
  };

  const scrollToImage = (idx: number) => {
    carouselApi?.scrollTo(idx);
  };

  // Parse features from text fields
  const parseFeatures = (text: string | null): string[] => {
    if (!text) return [];
    return text.split(/[,，、\n]/).map(s => s.trim()).filter(Boolean);
  };

  const exteriorFeatures = parseFeatures(vehicle.exteriorFeatures);
  const interiorFeatures = parseFeatures(vehicle.interiorFeatures);
  const safetyFeatures = parseFeatures(vehicle.safetyFeatures);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />
      <div className="pt-16" />

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-base text-gray-500">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            首頁
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-gray-700 transition-colors">
            車輛搜尋
          </Link>
          <span>/</span>
          <span className="text-gray-700">{vehicle.model}</span>
        </nav>
      </div>

      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-base text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            返回搜尋結果
          </Link>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Image Gallery */}
            <div>
              <div className="bg-white border border-gray-100 overflow-hidden relative">
                <Carousel
                  opts={{ loop: true }}
                  setApi={setCarouselApi}
                  className="w-full"
                >
                  <CarouselContent className="ml-0">
                    {images.map((img, idx) => (
                      <CarouselItem key={idx} className="pl-0">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={img}
                            alt={`${vehicle.model} - ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors z-10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors z-10"
                    >
                      <ChevronRightIcon size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-1.5 rounded-full z-10">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToImage(idx)}
                      className={`flex-shrink-0 w-20 h-16 overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx
                          ? "border-gray-900 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-80"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${vehicle.model} - 縮圖 ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {vehicle.isNew === 1 && (
                <div className="mt-3 inline-block bg-[#0a0a0a] text-white text-sm px-3 py-1.5 tracking-wider">
                  最新上架
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div>
              {/* Title & Price */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400 tracking-wider uppercase">
                    LEXUS CPO
                  </span>
                </div>
                <h1 className="font-display text-3xl font-bold text-gray-900 tracking-wide mb-2">
                  {vehicle.model}
                </h1>
                <div className="w-12 h-0.5 bg-[#0a0a0a] mb-4" />
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-[#0a0a0a]">
                    {vehicle.price}
                  </span>
                  <span className="text-lg text-gray-500">萬</span>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-400">出廠日期</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {vehicle.year}年{vehicle.month}月
                  </p>
                </div>
                <div className="bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-400">里程</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {vehicle.mileage.toLocaleString()} 公里
                  </p>
                </div>
                <div className="bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Palette size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-400">車色</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {vehicle.color}
                  </p>
                </div>
                {vehicle.displacement && (
                  <div className="bg-white border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Car size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-400">排氣量</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {vehicle.displacement} c.c.
                    </p>
                  </div>
                )}
                <div className="bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-400">展示據點</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {vehicle.location}
                  </p>
                </div>
              </div>

              {/* LINE Contact Button */}
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#06C755] text-white text-base font-semibold tracking-wider hover:bg-[#05b34d] transition-colors mb-4"
              >
                <MessageCircle size={22} />
                LINE 聯絡諮詢
              </a>

              <p className="text-xs text-gray-400 text-center mb-6">
                點擊上方按鈕加入 LEXUS 官方 LINE，即時諮詢此車輛
              </p>

              {/* Contact Us */}
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 text-gray-700 text-sm font-medium tracking-wider hover:bg-gray-50 transition-colors"
              >
                聯絡我們
              </Link>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-12 space-y-6">
            <h2 className="font-display text-xl font-semibold text-gray-900 tracking-wide">
              車輛規格與配備
            </h2>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white border border-gray-100 p-6">
                <h3 className="font-display text-sm font-semibold text-gray-900 tracking-wide mb-3">
                  車輛描述
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* Exterior */}
            {exteriorFeatures.length > 0 && (
              <div className="bg-white border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#0a0a0a] rounded flex items-center justify-center">
                    <Eye size={16} className="text-white" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-gray-900 tracking-wide">
                    外觀配備
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {exteriorFeatures.map((f, i) => (
                    <div
                      key={i}
                      className="text-sm text-gray-600 py-1.5 px-3 bg-gray-50 rounded"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interior */}
            {interiorFeatures.length > 0 && (
              <div className="bg-white border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#0a0a0a] rounded flex items-center justify-center">
                    <Car size={16} className="text-white" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-gray-900 tracking-wide">
                    內裝配備
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {interiorFeatures.map((f, i) => (
                    <div
                      key={i}
                      className="text-sm text-gray-600 py-1.5 px-3 bg-gray-50 rounded"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety */}
            {safetyFeatures.length > 0 && (
              <div className="bg-white border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#0a0a0a] rounded flex items-center justify-center">
                    <Shield size={16} className="text-white" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-gray-900 tracking-wide">
                    安全配備
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {safetyFeatures.map((f, i) => (
                    <div
                      key={i}
                      className="text-sm text-gray-600 py-1.5 px-3 bg-gray-50 rounded"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
