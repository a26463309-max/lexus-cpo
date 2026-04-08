import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const TOYOTA_CPO_URL = "https://toyotacpo-qh7857au.manus.space";

const navItems = [
  { label: "車輛搜尋", href: "/" },
  { label: "車輛比較", href: "/compare" },
  { label: "TOYOTA CPO原廠認證中古車", href: TOYOTA_CPO_URL, external: true },
  { label: "聯絡我們", href: "/contact" },
];

const menuItems = [
  { label: "車輛搜尋", href: "/" },
  { label: "車輛比較", href: "/compare" },
  { label: "TOYOTA CPO原廠認證中古車", href: TOYOTA_CPO_URL, external: true },
  { label: "鑑價服務", href: "/appraisal" },
  { label: "關於LEXUS CPO", href: "/about" },
  { label: "據點查詢", href: "/locations" },
  { label: "聯絡我們", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="font-display text-2xl font-bold tracking-wider text-white">
              LEXUS
            </span>
            <span className="text-white/40 text-xl">|</span>
            <span className="font-display text-base font-medium tracking-widest text-white/80">
              CPO
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium text-white/80 hover:text-white transition-colors tracking-wide"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-base font-medium transition-colors tracking-wide ${
                    location === item.href
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Desktop Hamburger for more options */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white/80 hover:text-white p-1.5 transition-colors"
              aria-label="更多選項"
            >
              <Menu size={22} />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
            aria-label="選單"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menu Overlay (both mobile and desktop) */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/30 z-30"
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="fixed top-16 right-0 w-full md:w-[320px] bg-[#0a0a0a]/98 backdrop-blur-md z-40 shadow-2xl">
            <nav className="px-6 py-6">
              <div className="flex flex-col gap-1">
                {menuItems.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="text-white/80 hover:text-white hover:bg-white/5 py-3.5 px-3 text-base tracking-wide transition-colors rounded"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`hover:bg-white/5 py-3.5 px-3 text-base tracking-wide transition-colors rounded ${
                        location === item.href
                          ? "text-white bg-white/10"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
