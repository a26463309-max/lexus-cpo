import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import { MapPin, Phone, Clock, Navigation, Car, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/hero-search-MTrBzy4pL7jUUup6KbFyEd.webp";

const LOCATION_PHOTOS = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-showroom_8f1884de.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-dealership_49d15a41.jpg",
];

export default function Locations() {
  const openGoogleMaps = () => {
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=25.0553,121.6057&destination_place_id=ChIJp0lN0FirQjQRQm8OFkZBApM",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />
      <div className="pt-16" />

      <HeroBanner
        title="營 業 據 點"
        backgroundImage={HERO_IMAGE}
        breadcrumbs={[
          { label: "首頁", href: "/" },
          { label: "營業據點" },
        ]}
      />

      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Location Detail */}
          <div className="bg-white border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Info */}
              <div className="p-8 lg:p-12">
                {/* Location Name */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400 tracking-wider uppercase">
                      LEXUS CPO
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-gray-900 tracking-wide">
                    CPO 南港所
                  </h2>
                  <div className="w-12 h-0.5 bg-[#0a0a0a] mt-4" />
                </div>

                {/* Info Items */}
                <div className="space-y-5 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-gray-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">地址</p>
                      <p className="text-base text-gray-800 leading-relaxed">
                        台北市南港區南港路三段92號
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-gray-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                      <Clock size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">營業時間</p>
                      <div className="text-base text-gray-800 space-y-1">
                        <p>平日 08:30 - 19:30</p>
                        <p>假日 09:00 - 19:30</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-3">
                    {LOCATION_PHOTOS.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-[4/3] overflow-hidden bg-gray-100"
                      >
                        <img
                          src={photo}
                          alt={`CPO 南港所 ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={openGoogleMaps}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0a0a0a] text-white text-base font-medium tracking-wider hover:bg-[#1a1a1a] transition-colors"
                  >
                    <Navigation size={16} />
                    取得路線
                  </button>
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 text-base font-medium tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    <Car size={16} />
                    查看在庫車輛
                  </Link>
                </div>
              </div>

              {/* Right: Map */}
              <div className="relative min-h-[400px] lg:min-h-0 bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.7!2d121.6035!3d25.0553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ab18d04d49a7%3A0x930241464e0e6f42!2z5Y-w5YyX5biC5Y2X5riv5Y2A5Y2X5riv6Lev5LiJ5q61OTLomZ8!5e0!3m2!1szh-TW!2stw!4v1700000000000!5m2!1szh-TW!2stw"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CPO 南港所位置"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#0a0a0a] rounded flex items-center justify-center">
                  <Car size={16} className="text-white" />
                </div>
                <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide">
                  車輛展示
                </h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                現場展示多款 LEXUS 原廠認證中古車，歡迎蒞臨賞車試乘
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#0a0a0a] rounded flex items-center justify-center">
                  <ChevronRight size={16} className="text-white" />
                </div>
                <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide">
                  專業諮詢
                </h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                專業銷售顧問為您提供一對一購車諮詢與建議
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#0a0a0a] rounded flex items-center justify-center">
                  <Phone size={16} className="text-white" />
                </div>
                <h3 className="font-display text-base font-semibold text-gray-900 tracking-wide">
                  預約服務
                </h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                歡迎來電預約賞車，我們將為您安排最佳服務時段
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
