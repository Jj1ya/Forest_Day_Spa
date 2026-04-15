import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

export default function Gallery() {
  const { data } = useSite();
  const [ref, vis] = useReveal();
  const images = data?.gallery;
  if (!images?.length) return null;

  return (
    <section className="section-padding bg-warm overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 mb-10">
        <div ref={ref}
          className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="eyebrow">Gallery</span>
          <h2 className="heading-lg mb-5">Our Atmosphere</h2>
          <p className="desc-text">Step into a space designed for calm, clarity, and total renewal.</p>
        </div>
      </div>

      {/* Horizontal scroll gallery */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-4 snap-x snap-mandatory">
        {images.map((url, i) => (
          <div key={i} className="flex-shrink-0 w-[280px] md:w-[350px] aspect-[3/4] snap-center overflow-hidden group">
            <img src={url} alt={`Spa atmosphere ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        ))}
      </div>
    </section>
  );
}
