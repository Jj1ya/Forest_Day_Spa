import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

export default function About() {
  const { data } = useSite();
  const a = data?.about;
  const [ref1, vis1] = useReveal();
  const [ref2, vis2] = useReveal();
  if (!a) return null;

  return (
    <section id="about" className="section-padding bg-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[5fr_6fr] gap-16 md:gap-20 items-center">
          {/* Image */}
          <div ref={ref1}
            className={`relative transition-all duration-700 ${vis1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <img src={a.imageUrl} alt="Forest Day Spa"
              className="w-full aspect-[4/5] object-cover" />
            <div className="absolute -bottom-4 -right-4 w-[140px] bg-forest-600 text-white text-center py-5 px-4">
              <div className="font-serif text-4xl font-semibold text-gold-300 leading-none">K</div>
              <div className="text-[0.7rem] uppercase tracking-[0.15em] text-white/70 mt-1">Beauty Expert</div>
            </div>
          </div>

          {/* Text */}
          <div ref={ref2}
            className={`transition-all duration-700 delay-100 ${vis2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="eyebrow">{a.label}</span>
            <h2 className="heading-lg mb-5">{a.title}</h2>
            <div className="w-16 h-px bg-gold-400 mb-6" />
            {a.paragraphs.map((p, i) => (
              <p key={i} className="desc-text mb-4">{p}</p>
            ))}
            <div className="grid grid-cols-2 gap-5 mt-8">
              {a.features.map((f, i) => (
                <div key={i} className="p-5 border border-gray-200 hover:border-gold-400/50 transition-colors">
                  <h4 className="font-sans text-sm font-semibold mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
