import { useRef, useCallback } from 'react';
import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

export default function BeforeAfter() {
  const { data } = useSite();
  const [ref, vis] = useReveal();
  if (!data?.beforeAfter?.length) return null;

  return (
    <section id="results" className="section-padding bg-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={ref}
          className={`text-center mb-14 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="eyebrow">Real Results</span>
          <h2 className="heading-lg mb-5">Before &amp; After</h2>
          <p className="desc-text mx-auto">See the visible difference our treatments make. Drag the slider to compare.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.beforeAfter.map((item, i) => (
            <BASlider key={item.id} item={item} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BASlider({ item, delay }) {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const [revRef, vis] = useReveal();

  const updateSlider = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    el.querySelector('.ba-after').style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    el.querySelector('.ba-line').style.left = `${pct}%`;
    el.querySelector('.ba-handle').style.left = `${pct}%`;
  }, []);

  const onPointerDown = (e) => {
    isDragging.current = true;
    updateSlider(e.clientX || e.touches?.[0]?.clientX);
    const onMove = (ev) => {
      if (!isDragging.current) return;
      updateSlider(ev.clientX || ev.touches?.[0]?.clientX);
    };
    const onUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onUp);
  };

  return (
    <div ref={revRef}
      className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div ref={containerRef}
        className="relative aspect-[3/2] overflow-hidden cursor-col-resize select-none"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}>
        <img src={item.beforeImg} alt="Before"
          className="absolute inset-0 w-full h-full object-cover" />
        <img src={item.afterImg} alt="After"
          className="ba-after absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: 'inset(0 50% 0 0)' }} />
        <div className="ba-line absolute top-0 bottom-0 left-1/2 w-0.5 bg-white -translate-x-1/2 z-10 pointer-events-none" />
        <div className="ba-handle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center z-20 pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <path d="M8 4l-6 8 6 8M16 4l6 8-6 8" />
          </svg>
        </div>
        <span className="absolute bottom-4 left-4 z-30 text-[0.7rem] font-semibold uppercase tracking-widest
          text-white bg-black/50 px-3 py-1.5 pointer-events-none">Before</span>
        <span className="absolute bottom-4 right-4 z-30 text-[0.7rem] font-semibold uppercase tracking-widest
          text-white bg-black/50 px-3 py-1.5 pointer-events-none">After</span>
      </div>
      <div className="text-center mt-3">
        <h4 className="font-serif text-lg">{item.title}</h4>
        <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
      </div>
    </div>
  );
}
