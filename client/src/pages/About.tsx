import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import { Link } from "wouter";
import {
  Shield,
  Clock,
  Wrench,
  Car,
  Gift,
  Calculator,
  PhoneCall,
  FileCheck,
  ChevronRight,
  CheckCircle2,
  Search,
  FileText,
} from "lucide-react";

const HERO_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/hero-search-MTrBzy4pL7jUUup6KbFyEd.webp";

const SHOWROOM_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-showroom_8f1884de.jpg";
const NX_RX_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-nx-rx_fd11a6df.jpg";
const LINEUP_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663464049249/oT4LPFq4GYpxYGRXMYXZLN/lexus-lineup_b4f77610.jpg";

const guarantees = [
  {
    id: 1,
    icon: Shield,
    title: "原廠品質認證",
    description:
      "從車源嚴格把關，汰除泡水、重大事故、引擎/里程數變造、產權不明等劣質車。且每台 LEXUS CPO 車輛均通過 7大類 188項專業原廠檢驗，層層把關，才得以擁有 LEXUS CPO 認證標誌，成就媲美新車的名門座駕。",
  },
  {
    id: 2,
    icon: Clock,
    title: "14天購車鑑賞期",
    description:
      "LEXUS CPO 以您的權益為優先，每位車主在 14 天鑑賞期內，若購得不滿意的車輛，可依約定條件辦理退車，讓您安心購車無後顧之憂。",
  },
  {
    id: 3,
    icon: Wrench,
    title: "原廠保固服務",
    description:
      "LEXUS CPO 提供出廠後最多 2 年或 4 萬公里原廠保固服務；油電車則再享電池 2 年或 4 萬公里延長保固，給您最完整的售後保障。",
  },
  {
    id: 4,
    icon: Car,
    title: "維修代步車貼心服務",
    description:
      "保固期間內，若您的愛車需要進廠維修，LEXUS CPO 將提供代步車服務，讓您的行程不受影響，享受無縫接軌的用車體驗。",
  },
  {
    id: 5,
    icon: Gift,
    title: "免費服務",
    description:
      "購買 LEXUS CPO 認證中古車，即享有免費基礎保養服務，包含機油更換、輪胎對調等項目，為您的愛車提供最佳呵護。",
  },
  {
    id: 6,
    icon: Calculator,
    title: "專業理財規劃",
    description:
      "LEXUS 根據您的財務需求，提供超低利率/低月付分期貸款或租賃方案，輕鬆實現您入主進口高級車的夢想！",
  },
  {
    id: 7,
    icon: PhoneCall,
    title: "免費道路救援",
    description:
      "全天候 24 小時免費道路救援服務，無論何時何地，LEXUS CPO 都是您最堅實的後盾，讓您安心馳騁每一哩路。",
  },
  {
    id: 8,
    icon: FileCheck,
    title: "完整保障",
    description:
      "LEXUS CPO 提供完整的車輛歷史報告，包含保養紀錄、事故紀錄等透明資訊，讓您對愛車的過去一目瞭然，買得放心。",
  },
];

export default function About() {
  const [activeGuarantee, setActiveGuarantee] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <HeroBanner
          title="關 於  L E X U S  C P O"
          backgroundImage={HERO_IMAGE}
          breadcrumbs={[
            { label: "首頁", href: "/" },
            { label: "LEXUS CPO" },
            { label: "關於 LEXUS CPO" },
          ]}
        />

        {/* Section 1: 原廠認證 承襲完美 */}
        <section className="py-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-center text-gray-900 tracking-widest mb-12">
              原廠認證 承襲完美
            </h2>

            {/* Three Image Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-12">
              <div className="relative group overflow-hidden">
                <img
                  src={SHOWROOM_IMG}
                  alt="嚴選品質"
                  className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-lg font-semibold text-white tracking-wider mb-2">
                    嚴選品質 媲美新車
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed">
                    從車源嚴格把關，每台 LEXUS CPO 車輛均通過 7大類 188項專業原廠檢驗，層層把關，才得以擁有 LEXUS CPO 認證標誌。
                  </p>
                </div>
              </div>

              <div className="relative group overflow-hidden">
                <img
                  src={NX_RX_IMG}
                  alt="好車鑑賞"
                  className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-lg font-semibold text-white tracking-wider mb-2">
                    好車 值得鑑賞
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed">
                    LEXUS CPO 以您的權益為優先，每位車主在 14 天鑑賞期內，若購得不滿意的車輛可退車。
                  </p>
                </div>
              </div>

              <div className="relative group overflow-hidden">
                <img
                  src={LINEUP_IMG}
                  alt="原廠保固"
                  className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-lg font-semibold text-white tracking-wider mb-2">
                    原廠保固 尊榮服務
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed">
                    LEXUS CPO 提供出廠後最多 2 年或 4 萬公里原廠保固服務；油電車則再享電池延長保固。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 8 大保證 超越期待 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-center text-gray-900 tracking-widest mb-12">
              8 大保證 超越期待
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Guarantee List */}
              <div className="lg:col-span-4">
                <div className="space-y-1">
                  {guarantees.map((g, index) => {
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setActiveGuarantee(index)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-lg text-left transition-all duration-300 ${
                          activeGuarantee === index
                            ? "bg-[#0a0a0a] text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={
                            activeGuarantee === index
                              ? "text-white/80"
                              : "text-gray-400"
                          }
                        />
                        <span className="text-base font-medium tracking-wide">
                          {g.id} {g.title}
                        </span>
                        <ChevronRight
                          size={16}
                          className={`ml-auto transition-transform ${
                            activeGuarantee === index
                              ? "text-white/60 translate-x-1"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Guarantee Detail */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 h-full flex flex-col justify-center">
                  {(() => {
                    const g = guarantees[activeGuarantee];
                    const Icon = g.icon;
                    return (
                      <div className="animate-in fade-in duration-500">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                            <Icon size={24} className="text-white" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-400 font-display tracking-wider">
                              保證 {g.id}
                            </span>
                            <h3 className="font-display text-xl font-semibold text-gray-900 tracking-wider">
                              {g.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-base">
                          {g.description}
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-base text-gray-400">
                          <CheckCircle2 size={16} />
                          <span>LEXUS CPO 原廠認證保障</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: 馬上行動 */}
        <section className="py-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* 搜尋車輛 */}
            <div className="relative h-[350px] group overflow-hidden">
              <img
                src={NX_RX_IMG}
                alt="搜尋車輛"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-widest mb-3">
                  嚴選品質 媲美新車
                </h3>
                <p className="text-white/70 text-base mb-8">
                  即刻入主 Lexus CPO 啟動您的不凡旅程
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-8 py-3 text-base font-medium tracking-wider hover:bg-gray-100 transition-colors"
                >
                  <Search size={16} />
                  搜尋車輛
                </Link>
              </div>
            </div>

            {/* 鑑價服務 */}
            <div className="relative h-[350px] group overflow-hidden">
              <img
                src={LINEUP_IMG}
                alt="鑑價服務"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-widest mb-3">
                  邁向下個成就 不容止步
                </h3>
                <p className="text-white/70 text-base mb-8">
                  安心交付您的愛車 讓 Lexus CPO 為您鑑價
                </p>
                <Link
                  href="/appraisal"
                  className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] px-8 py-3 text-base font-medium tracking-wider hover:bg-gray-100 transition-colors"
                >
                  <FileText size={16} />
                  鑑價服務
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
