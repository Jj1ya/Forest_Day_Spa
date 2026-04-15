import { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

export default function Testimonials() {
  const { data } = useSite();
  const [current, setCurrent] = useState(0);
  const [ref, vis] = useReveal();
  const items = data?.testimonials;
  if (!items?.length) return null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section className="section-padding bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="eyebrow">Testimonials</span>
          <h2 className="heading-lg mb-5">What Our Guests Say</h2>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden max-w-2xl mx-auto">
          <div className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}>
            {items.map(t => (
              <div key={t.id} className="flex-shrink-0 w-full px-4">
                <div className="text-center p-10 border border-gray-100">
                  <div className="text-gold-400 text-xl tracking-widest mb-6">
                    {'★'.repeat(t.rating)}
                  </div>
                  <blockquote className="font-serif text-xl md:text-2xl italic text-gray-800 leading-relaxed mb-6">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <p className="text-sm font-semibold text-gray-500">
                    {t.author} — {t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300
                  ${i === current ? 'w-6 bg-forest-500' : 'w-2 bg-gray-300 hover:bg-gray-400'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
