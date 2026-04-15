import { useSite } from '../context/SiteContext';

export default function Hero() {
  const { data } = useSite();
  const h = data?.hero;
  if (!h) return null;

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-forest-700">
      {/* Background */}
      <div className="absolute inset-0">
        {h.videoUrl ? (
          <video autoPlay muted loop playsInline poster={h.posterUrl}
            className="w-full h-full object-cover opacity-55">
            <source src={h.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={h.posterUrl} alt="Forest Day Spa"
            className="w-full h-full object-cover opacity-55" />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-700/40 via-forest-700/15 to-forest-700/50" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-[800px]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-gold-400 mb-6">
          {h.eyebrow}
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] text-white leading-[1.1] mb-6">
          {h.headline}
        </h1>
        <p className="text-lg text-white/70 max-w-[540px] mx-auto mb-10 leading-relaxed">
          {h.description}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://booking.mangomint.com/forestdayspa" target="_blank" rel="noreferrer" className="btn-gold">{h.primaryBtn}</a>
          <a href="#services" className="btn-outline-white">{h.secondaryBtn}</a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Scroll</span>
        <div className="w-px h-10 bg-white/20 relative overflow-hidden scroll-line" />
      </div>
    </section>
  );
}
