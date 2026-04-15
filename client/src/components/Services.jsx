import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

const TABS = [
  { key: 'facial', label: 'Facial' },
  { key: 'body', label: 'Body' },
  { key: 'scalp', label: 'Scalp' },
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
            From K-beauty facials to tension-melting body work and restorative scalp care,
            every treatment is a journey to renewal.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-14">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActive(t.key)}
              className={`relative px-8 py-4 text-[0.82rem] font-semibold uppercase tracking-wider
                transition-colors ${active === t.key ? 'text-forest-500' : 'text-gray-400 hover:text-gray-600'}`}>
              {t.label}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400
                transition-transform duration-300 origin-left
                ${active === t.key ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
          {filtered.map((s, i) => (
            <ServiceCard key={s.id} service={s} delay={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
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
          <h3 className="font-serif text-xl md:text-[1.3rem]">{s.name}</h3>
          <span className="text-[0.78rem] text-forest-300">{s.korean}</span>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap mt-1">{s.duration}</span>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed my-4">{s.description}</p>
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
