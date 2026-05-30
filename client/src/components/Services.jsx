import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

const TABS = [
  { key: 'facial', label: 'Facial' },
  { key: 'body', label: 'Body' },
  { key: 'scalp', label: 'Head Spa' },
  { key: 'waxing', label: 'Waxing' },
];

export default function Services() {
  const { data } = useSite();
  const [active, setActive] = useState('facial');
  const [ref, vis] = useReveal();

  if (!data?.services) return null;

  const filtered = data.services.filter(s => s.category === active);

  return (
    <section id="services" className="section-padding">
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="eyebrow">Our Services</span>
          <h2 className="heading-lg mb-5">Treatments Tailored for You</h2>
          <p className="desc-text mx-auto">
            From K-beauty facials to tension-melting body work, restorative head spa, and smooth waxing —
            every treatment is a journey to renewal.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-14 flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActive(t.key)}
              className={`relative px-8 py-4 text-sm font-display font-bold uppercase tracking-wider
                transition-colors ${active === t.key ? 'text-forest-500' : 'text-gray-400 hover:text-gray-600'}`}>
              {t.label}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400
                transition-transform duration-300 origin-left
                ${active === t.key ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
          ))}
        </div>

        {/* Waxing — special price list layout */}
        {active === 'waxing' ? (
          <WaxingPanel services={filtered} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
            {filtered.map((s, i) => (
              <ServiceCard key={s.id} service={s} delay={i % 2 === 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WaxingPanel({ services }) {
  const facial = services.filter(s => s.korean === 'Facial Waxing');
  const body   = services.filter(s => s.korean === 'Body Waxing');
  const [ref, vis] = useReveal();

  return (
    <div ref={ref}
      className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Facial Waxing */}
        <div className="border border-gray-200 p-8">
          <h3 className="font-serif text-2xl mb-6 pb-4 border-b border-gray-100">Facial Waxing</h3>
          <ul className="space-y-0">
            {facial.map(s => (
              <li key={s.id}
                className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
                <span className="text-base text-gray-700">{s.name}</span>
                <span className="font-display font-bold text-forest-500 text-base">{s.price}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Body Waxing */}
        <div className="border border-gray-200 p-8">
          <h3 className="font-serif text-2xl mb-6 pb-4 border-b border-gray-100">Body Waxing</h3>
          <ul className="space-y-0">
            {body.map(s => (
              <li key={s.id}
                className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
                <span className="text-base text-gray-700">{s.name}</span>
                <span className="font-display font-bold text-forest-500 text-base">{s.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service: s, delay }) {
  const [ref, vis] = useReveal();

  return (
    <div ref={ref}
      className={`bg-white p-8 hover:bg-cream transition-all duration-300
        ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        ${delay ? 'delay-100' : ''}`}
      style={{ transitionDuration: '0.7s' }}>
      <div className="flex justify-between items-start gap-4 mb-1">
        <div>
          <h3 className="font-serif text-2xl md:text-[1.5rem]">{s.name}</h3>
          {s.korean && <span className="text-sm text-forest-300 font-display">{s.korean}</span>}
        </div>
        {s.duration && <span className="text-xs text-gray-400 whitespace-nowrap mt-1">{s.duration}</span>}
      </div>
      {s.description && <p className="text-base text-gray-500 leading-relaxed my-4">{s.description}</p>}
      <div className="flex gap-5 pt-3 border-t border-gray-100 text-[0.82rem]">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Non-member</span>
          <span className="font-bold text-forest-500">{s.price}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Member</span>
          <span className="font-bold text-gold-500">{s.memberPrice}</span>
        </div>
      </div>
    </div>
  );
}
