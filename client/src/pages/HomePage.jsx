import { useSite } from '../context/SiteContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Membership from '../components/Membership';
import BeforeAfter from '../components/BeforeAfter';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingCTA from '../components/FloatingCTA';

export default function HomePage() {
  const { loading } = useSite();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-forest-700 flex items-center justify-center z-[999]">
        <div className="text-center">
          <div className="font-serif text-3xl text-white mb-4">Forest Day Spa</div>
          <div className="w-12 h-px bg-gold-400 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <Membership />
      <BeforeAfter />
      <Testimonials />
      <Gallery />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingCTA />
    </>
  );
}
