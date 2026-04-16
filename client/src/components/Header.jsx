import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#membership', label: 'Membership' },
  { href: '#results', label: 'Results' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
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

          <nav className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)}
                className="text-white/70 hover:text-white text-sm font-display font-semibold uppercase tracking-[0.12em] transition-colors">
                {l.label}
              </button>
            ))}
          </nav>

          <a href="https://booking.mangomint.com/forestdayspa" target="_blank" rel="noreferrer"
            className="hidden md:inline-flex btn-outline-forest">
            Book Now
          </a>

          <button onClick={() => setMenuOpen(true)} className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label="Open menu">
            <span className="w-6 h-[1.5px] bg-white" />
            <span className="w-6 h-[1.5px] bg-white" />
            <span className="w-6 h-[1.5px] bg-white" />
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className={`fixed inset-0 z-[200] bg-forest-700 flex flex-col items-center justify-center gap-6
        transition-opacity duration-400 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-white text-3xl bg-transparent border-none cursor-pointer">
          &times;
        </button>
        {NAV_LINKS.map(l => (
          <button key={l.href} onClick={() => scrollTo(l.href)}
            className="font-serif text-3xl text-white hover:text-gold-400 transition-colors">
            {l.label}
          </button>
        ))}
        <a href="https://booking.mangomint.com/forestdayspa" target="_blank" rel="noreferrer"
          className="font-serif text-3xl text-gold-400">
          Book Now
        </a>
      </div>
    </>
  );
}
