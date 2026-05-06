import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { LogoMarquee } from "./_components/logo-marquee";
import { TestimonialsSection } from "./_components/testimonials-section";
import { WhySection } from "./_components/why-section";
import { PricingSection } from "./_components/pricing-section";
import { StatsSection } from "./_components/stats-section";
import { SecuritySection } from "./_components/security-section";
import { CTASection } from "./_components/cta-section";
import { Footer } from "./_components/footer";

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <>
      {/* 30px sentinel observed by Navbar to flip its background */}
      <div id="rogo-nav-sentinel" aria-hidden className="absolute top-0 h-[30px] w-full" />

      <Navbar />

      <main>
        <Hero />
        <LogoMarquee />
        <TestimonialsSection />
        <WhySection />
        <PricingSection />
        <StatsSection />
        <SecuritySection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
