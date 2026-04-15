import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import useReveal from '../hooks/useReveal';

export default function Contact() {
  const { data } = useSite();
  const c = data?.contact;
  const [ref1, vis1] = useReveal();
  const [ref2, vis2] = useReveal();
  const [showBooking, setShowBooking] = useState(false);
  if (!c) return null;

  return (
    <>
      <section id="contact" className="section-padding">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-16">
            <div ref={ref1}
              className={`transition-all duration-700 ${vis1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="eyebrow">Visit Us</span>
              <h2 className="heading-lg mb-5">Location &amp; Contact</h2>
              <div className="w-16 h-px bg-gold-400 mb-8" />

              <div className="space-y-7">
                <ContactItem icon="📍" title="Address" content={c.address} />
                <ContactItem icon="📞" title="Phone"
                  content={<a href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-forest-500 hover:underline">{c.phone}</a>} />
                <ContactItem icon="✉" title="Email"
                  content={<a href={`mailto:${c.email}`}
                    className="text-forest-500 hover:underline">{c.email}</a>} />
                <ContactItem icon="🕐" title="Hours" content={c.hours} />
              </div>

              <button onClick={() => setShowBooking(true)} className="btn-gold mt-10">
                Book an Appointment
              </button>
            </div>

            <div ref={ref2}
              className={`bg-warm overflow-hidden min-h-[400px] md:min-h-[480px]
                transition-all duration-700 delay-100 ${vis2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {c.mapUrl ? (
                <iframe src={c.mapUrl} className="w-full h-full border-none" allowFullScreen loading="lazy"
                  title="Forest Day Spa Location" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🗺️</div>
                    <p>Google Maps will appear here</p>
                    <p className="text-xs mt-1">Add your embed URL in the admin panel</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} contact={c} />}
    </>
  );
}

function ContactItem({ icon, title, content }) {
  return (
    <div className="flex gap-5 items-start">
      <div className="w-12 h-12 shrink-0 border border-gray-200 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-sans text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
        <div className="text-sm text-gray-500 leading-relaxed">{content}</div>
      </div>
    </div>
  );
}

function BookingModal({ onClose, contact }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-none p-8 md:p-10 relative"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none">
          &times;
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="font-serif text-2xl mb-3">Thank You!</h3>
            <p className="text-gray-500 text-sm">We'll confirm your appointment shortly.</p>
            <p className="text-gray-400 text-xs mt-4">
              Or call us directly at <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                className="text-forest-500">{contact.phone}</a>
            </p>
          </div>
        ) : (
          <>
            <span className="eyebrow">Book Now</span>
            <h3 className="font-serif text-2xl mb-6">Request an Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" required
                  className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-forest-500 w-full" />
                <input type="text" placeholder="Last Name" required
                  className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-forest-500 w-full" />
              </div>
              <input type="tel" placeholder="Phone Number" required
                className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-forest-500 w-full" />
              <input type="email" placeholder="Email Address" required
                className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-forest-500 w-full" />
              <select required
                className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-forest-500 w-full text-gray-500">
                <option value="">Select Service</option>
                <optgroup label="Facial">
                  <option>Stay Beauty (60 min)</option>
                  <option>Snow Beauty (80 min)</option>
                  <option>Facial Contouring (90 min)</option>
                  <option>Sono Beauty (70 min)</option>
                  <option>Reset Beauty (80 min)</option>
                </optgroup>
                <optgroup label="Body">
                  <option>Gyeongrak Full Body (55-85 min)</option>
                  <option>Partial Contouring (50-65 min)</option>
                  <option>Cellulite Reduction (55 min)</option>
                  <option>Abdomen &amp; Sides (70 min)</option>
                  <option>Dress Care Sculpting (70 min)</option>
                </optgroup>
                <optgroup label="Scalp">
                  <option>Relaxing Head Spa (60 min)</option>
                  <option>Scalp Detox (75 min)</option>
                  <option>Hair-Loss Restoration (90 min)</option>
                  <option>Damaged Hair Restoration (90 min)</option>
                </optgroup>
              </select>
              <input type="date" required
                className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-forest-500 w-full text-gray-500" />
              <textarea placeholder="Special requests or notes (optional)" rows={3}
                className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-forest-500 w-full resize-none" />
              <button type="submit" className="btn-gold w-full justify-center">
                Submit Request
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
