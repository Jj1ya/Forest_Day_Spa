import { useRef, useState, useEffect, useCallback } from 'react';
import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

export default function Gallery() {
  const { data } = useSite();
  const [ref, vis] = useReveal();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const images = data?.gallery;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [images, updateScrollState]);

  function scrollGallery(direction) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.82, behavior: 'smooth' });
  }

  if (!images?.length) return null;

  return (
    <section className="section-padding bg-warm overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 mb-10">
        <div ref={ref}
          className={`flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between
            transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <span className="eyebrow">Gallery</span>
            <h2 className="heading-lg mb-5">Our Atmosphere</h2>
            <p className="desc-text">Step into a space designed for calm, clarity, and total renewal.</p>
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-gray-400 hidden sm:inline">Scroll to explore</span>
              <button type="button" onClick={() => scrollGallery(-1)} disabled={!canScrollLeft}
                aria-label="Previous gallery photos"
                className="w-11 h-11 border border-gray-300 bg-white text-forest-700 flex items-center justify-center
                  transition-all hover:border-forest-500 hover:bg-forest-700 hover:text-white
                  disabled:opacity-30 disabled:pointer-events-none">
                ←
              </button>
              <button type="button" onClick={() => scrollGallery(1)} disabled={!canScrollRight}
                aria-label="Next gallery photos"
                className="w-11 h-11 border border-gray-300 bg-white text-forest-700 flex items-center justify-center
                  transition-all hover:border-forest-500 hover:bg-forest-700 hover:text-white
                  disabled:opacity-30 disabled:pointer-events-none">
                →
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="gallery-scroll flex gap-4 overflow-x-auto px-6 pb-3 snap-x snap-mandatory scroll-smooth"
      >
        {images.map((url, i) => (
          <div key={i}
            className="flex-shrink-0 w-[280px] md:w-[350px] aspect-[3/4] snap-center overflow-hidden group">
            <img src={url} alt={`Spa atmosphere ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        ))}
      </div>
    </section>
  );
}
