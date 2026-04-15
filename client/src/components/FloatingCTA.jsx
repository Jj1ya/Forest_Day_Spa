import { useState, useEffect } from 'react';

export default function FloatingCTA() {
  const [show, setShow] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 600);
      setShowTop(window.scrollY > 1500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Mobile sticky CTA */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-forest-700/95 backdrop-blur-lg
        border-t border-white/10 px-4 py-3 transition-transform duration-300
        ${show ? 'translate-y-0' : 'translate-y-full'}`}>
        <a href="#contact"
          className="btn-gold w-full justify-center text-center">
          Book Appointment
        </a>
      </div>

      {/* Back to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 bg-forest-600 text-white
          flex items-center justify-center shadow-lg hover:bg-forest-500
          transition-all duration-300 hidden md:flex
          ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Back to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
