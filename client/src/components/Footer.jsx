import { useSite } from '../context/SiteContext';

export default function Footer() {
  const { data } = useSite();
  const c = data?.contact;

  return (
    <footer className="bg-forest-700 text-white/50 pt-20 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-16">
          {/* Brand */}
          <div>
            <a href="#" className="font-serif text-2xl font-semibold text-white block mb-4">
              Forest Day Spa
            </a>
            <p className="text-sm leading-relaxed max-w-xs">
              Korean-inspired wellness spa dedicated to skin health, scalp restoration,
              and total relaxation in Carrollton, TX.
            </p>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-white/30 mb-3 font-semibold">Newsletter</p>
              <form onSubmit={e => e.preventDefault()} className="flex">
                <input type="email" placeholder="Your email"
                  className="bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white
                    placeholder:text-white/30 focus:outline-none focus:border-gold-400 flex-1" />
                <button className="bg-gold-400 text-forest-700 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider
                  hover:bg-gold-300 transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.15em] text-white/30 mb-5">Services</h4>
            <a href="#services" className="block text-sm py-1 hover:text-gold-400 transition-colors">Facial Care</a>
            <a href="#services" className="block text-sm py-1 hover:text-gold-400 transition-colors">Body Care</a>
            <a href="#services" className="block text-sm py-1 hover:text-gold-400 transition-colors">Scalp Care</a>
            <a href="#membership" className="block text-sm py-1 hover:text-gold-400 transition-colors">Membership</a>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.15em] text-white/30 mb-5">Company</h4>
            <a href="#about" className="block text-sm py-1 hover:text-gold-400 transition-colors">About Us</a>
            <a href="#results" className="block text-sm py-1 hover:text-gold-400 transition-colors">Results</a>
            <a href="#contact" className="block text-sm py-1 hover:text-gold-400 transition-colors">Contact</a>
            <a href="#faq" className="block text-sm py-1 hover:text-gold-400 transition-colors">FAQ</a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.15em] text-white/30 mb-5">Contact</h4>
            {c && (
              <>
                <p className="text-sm py-1">{c.address}</p>
                <a href={`tel:${c.phone?.replace(/[^0-9+]/g, '')}`}
                  className="block text-sm py-1 hover:text-gold-400 transition-colors">{c.phone}</a>
                <a href={`mailto:${c.email}`}
                  className="block text-sm py-1 hover:text-gold-400 transition-colors">{c.email}</a>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center gap-4 text-xs">
          <span>© 2026 Forest Day Spa. All rights reserved.</span>
          <div className="flex gap-5">
            {c?.instagram && <a href={c.instagram} target="_blank" rel="noreferrer"
              className="hover:text-gold-400 transition-colors">Instagram</a>}
            {c?.facebook && <a href={c.facebook} target="_blank" rel="noreferrer"
              className="hover:text-gold-400 transition-colors">Facebook</a>}
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
