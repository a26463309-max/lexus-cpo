import { Link } from "wouter";
import { ChevronUp, Settings } from "lucide-react";

const TOYOTA_CPO_URL = "https://toyotacpo-qh7857au.manus.space";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1a1a1a] text-white/70">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-2xl font-bold text-white tracking-wider">
                LEXUS
              </span>
              <span className="text-white/30">|</span>
              <span className="font-display text-base font-medium text-white/60 tracking-widest">
                CPO
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              LEXUS CPO 原廠認證中古車<br />
              嚴選品質，安心保障
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4 tracking-wide">快速連結</h4>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm hover:text-white transition-colors">
                車輛搜尋
              </Link>
              <Link href="/compare" className="text-sm hover:text-white transition-colors">
                車輛比較
              </Link>
              <a
                href={TOYOTA_CPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
              >
                TOYOTA CPO原廠認證中古車
              </a>
              <Link href="/contact" className="text-sm hover:text-white transition-colors">
                聯絡我們
              </Link>
            </div>
          </div>

          {/* Service */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4 tracking-wide">服務項目</h4>
            <div className="flex flex-col gap-3">
              <Link href="/appraisal" className="text-sm hover:text-white transition-colors">
                鑑價服務
              </Link>
              <Link href="/locations" className="text-sm hover:text-white transition-colors">
                據點查詢
              </Link>
              <Link href="/about" className="text-sm hover:text-white transition-colors">
                關於LEXUS CPO
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-3">
            <div className="flex items-center gap-4 text-sm text-white/40">
              <button
                onClick={() => alert("版權宣告")}
                className="hover:text-white/70 transition-colors"
              >
                版權宣告
              </button>
              <button
                onClick={() => alert("隱私權聲明")}
                className="hover:text-white/70 transition-colors"
              >
                隱私權聲明
              </button>
            </div>
            <div className="flex items-center gap-6">
              {/* Admin Entry - always visible */}
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                <Settings size={16} />
                後台管理
              </Link>
              <div className="text-sm text-white/30">
                Copyright &copy; {new Date().getFullYear()} LEXUS CPO. All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-11 h-11 bg-white/10 backdrop-blur text-white rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition-colors z-40 border border-white/10"
        aria-label="回到頂部"
      >
        <ChevronUp size={22} />
      </button>
    </footer>
  );
}
