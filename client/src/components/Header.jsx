import { useState, useEffect, useMemo } from 'react';
import { useSite } from '../context/SiteContext';
import { BOOKING_URL, GIFT_CARD_URL } from '../constants/links';
import { getNavigation } from '../constants/siteDefaults';

export default function Header() {
  const { data } = useSite();
  const navLinks = useMemo(() => getNavigation(data), [data]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  function scrollTo(href) {
    setMenuOpen(false);
    if (!href.startsWith('#')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled ? 'bg-forest-700/95 backdrop-blur-xl' : ''}`}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 transition-all duration-500"
          style={{ padding: scrolled ? '14px 24px' : '24px' }}
        >
          <a href="#" className="font-serif text-3xl font-semibold text-white tracking-tight">
            Forest Day Spa
          </a>

          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.map(l => (
              <button key={`${l.href}-${l.label}`} onClick={() => scrollTo(l.href)}
                className="text-white/70 hover:text-white text-sm font-display font-semibold uppercase tracking-[0.12em] transition-colors">
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href={GIFT_CARD_URL} target="_blank" rel="noreferrer"
              className="btn-outline-forest">
              Gift Card
            </a>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer"
              className="btn-outline-forest">
              Book Now
            </a>
          </div>

          <button onClick={() => setMenuOpen(true)} className="lg:hidden flex flex-col gap-1.5 p-1"
            aria-label="Open menu">
            <span className="w-6 h-[1.5px] bg-white" />
            <span className="w-6 h-[1.5px] bg-white" />
            <span className="w-6 h-[1.5px] bg-white" />
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-[200] bg-forest-700 flex flex-col items-center justify-center gap-6
        transition-opacity duration-400 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-white text-3xl bg-transparent border-none cursor-pointer">
          &times;
        </button>
        {navLinks.map(l => (
          <button key={`${l.href}-${l.label}`} onClick={() => scrollTo(l.href)}
            className="font-serif text-3xl text-white hover:text-gold-400 transition-colors">
            {l.label}
          </button>
        ))}
        <a href={GIFT_CARD_URL} target="_blank" rel="noreferrer"
          className="font-serif text-3xl text-gold-400">
          Gift Card
        </a>
        <a href={BOOKING_URL} target="_blank" rel="noreferrer"
          className="font-serif text-3xl text-gold-400">
          Book Now
        </a>
      </div>
    </>
  );
}
