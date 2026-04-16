import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

export default function FAQ() {
  const { data } = useSite();
  const [openIdx, setOpenIdx] = useState(-1);
  const [ref, vis] = useReveal();
  if (!data?.faq?.length) return null;

  return (
    <section id="faq" className="section-padding bg-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="eyebrow">FAQ</span>
          <h2 className="heading-lg mb-5">Frequently Asked Questions</h2>
          <p className="desc-text mx-auto">Everything you need to know before your visit.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {data.faq.map((item, i) => (
            <FAQItem key={i} item={item} isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ item, isOpen, onToggle }) {
  const [ref, vis] = useReveal();

  return (
    <div ref={ref}
      className={`border-b border-gray-200 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group">
        <span className="font-display text-lg font-bold text-gray-800 group-hover:text-forest-500 transition-colors pr-4">
          {item.q}
        </span>
        <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm shrink-0
          transition-all duration-300
          ${isOpen
            ? 'bg-forest-500 border-forest-500 text-white rotate-45'
            : 'bg-cream border-gray-200 text-gray-400'}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-400 ease-out
        ${isOpen ? 'max-h-60 pb-6' : 'max-h-0'}`}>
        <p className="text-base text-gray-500 leading-relaxed pr-12">{item.a}</p>
      </div>
    </div>
  );
}
