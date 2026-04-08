interface HeroBannerProps {
  title: string;
  backgroundImage: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function HeroBanner({ title, backgroundImage, breadcrumbs }: HeroBannerProps) {
  return (
    <div className="relative">
      {/* Background Image */}
      <div
        className="h-[200px] sm:h-[260px] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-widest">
            {title}
          </h1>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-base text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-gray-700 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-gray-700">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
