import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

const DEFAULTS = {
  label: 'Packages',
  title: 'Signature Package Deals',
  description: '',
  items: [],
};

export default function Packages() {
  const { data } = useSite();
  const p = { ...DEFAULTS, ...data?.packages };
  const [refHead, visHead] = useReveal();

  return (
    <section id="packages" className="section-padding bg-cream">
      <div className="max-w-[800px] mx-auto px-6">
        <div ref={refHead}
          className={`text-center mb-12 transition-all duration-700 ${visHead ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="eyebrow">{p.label}</span>
          <h2 className="heading-lg mb-5">{p.title}</h2>
          {p.description && (
            <>
              <div className="w-16 h-px bg-gold-400 mx-auto mb-6" />
              <p className="desc-text mx-auto">{p.description}</p>
            </>
          )}
        </div>

        {p.items.length === 0 ? (
          <p className="text-center text-gray-400 desc-text">Packages coming soon.</p>
        ) : (
          <div className="space-y-4">
            {p.items.map((item, i) => (
              <PackageRow key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PackageRow({ item, index }) {
  const [ref, vis] = useReveal();

  return (
    <article ref={ref}
      className={`w-full bg-white border border-gray-200 p-7 md:p-8 transition-all duration-700
        hover:border-gold-400/40 hover:bg-white
        ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${Math.min(index, 4) * 80}ms` }}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
            <h3 className="font-serif text-2xl md:text-[1.65rem] text-forest-700">{item.name}</h3>
            {item.duration && (
              <span className="text-xs text-gray-400 font-display uppercase tracking-wider">{item.duration}</span>
            )}
          </div>
          {item.description && (
            <p className="text-base text-gray-500 leading-relaxed">{item.description}</p>
          )}
        </div>
        <div className="shrink-0 flex gap-6 pt-1 md:pt-0 md:text-right border-t md:border-t-0 border-gray-100 md:border-none">
          <div>
            <span className="block text-[0.7rem] uppercase tracking-wider text-gray-400 mb-1">Non-member</span>
            <span className="font-display font-bold text-lg text-forest-500">{item.price}</span>
          </div>
          <div>
            <span className="block text-[0.7rem] uppercase tracking-wider text-gray-400 mb-1">Member</span>
            <span className="font-display font-bold text-lg text-gold-500">{item.memberPrice}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
