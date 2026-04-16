import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

export default function Membership() {
  const { data } = useSite();
  const m = data?.membership;
  const [ref1, vis1] = useReveal();
  const [ref2, vis2] = useReveal();
  if (!m) return null;

  return (
    <section id="membership" className="section-padding bg-forest-700 text-white relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full
        bg-gradient-radial from-gold-400/10 to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-16 items-center">
          {/* Visual */}
          <div ref={ref1}
            className={`relative p-12 md:p-16 bg-gradient-to-br from-forest-600 to-forest-500 text-center
              transition-all duration-700 ${vis1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="absolute inset-2 border border-white/15 pointer-events-none" />
            <p className="text-sm font-display font-bold uppercase tracking-[0.2em] text-white/60">{m.name}</p>
            <div className="font-serif text-6xl font-semibold text-gold-300 leading-none mt-4">
              {m.price} <span className="text-xl font-normal text-white/50">/ mo</span>
            </div>
            <p className="text-sm text-white/50 mt-3">{m.subtitle}</p>
            <a href="https://booking.mangomint.com/forestdayspa" target="_blank" rel="noreferrer" className="btn-gold mt-8 inline-block">Join Now</a>
          </div>

          {/* Details */}
          <div ref={ref2}
            className={`transition-all duration-700 delay-100 ${vis2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="eyebrow">Membership</span>
            <h2 className="heading-lg text-white mb-5">{m.title}</h2>
            <div className="w-16 h-px bg-gold-400 mb-6" />
            <p className="text-base text-white/60 leading-relaxed max-w-xl">{m.description}</p>

            <ul className="mt-8 space-y-0">
              {m.perks.map((p, i) => (
                <li key={i} className="flex items-start gap-3.5 py-3.5 border-b border-white/10 last:border-0">
                  <span className="w-5 h-5 shrink-0 border border-gold-400 flex items-center justify-center text-[0.65rem] text-gold-400 mt-0.5">
                    ✓
                  </span>
                  <span className="text-base text-white/75 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
