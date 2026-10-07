import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Grind } from "@/components/sections/grind";
import { Games } from "@/components/sections/games";
import { Process } from "@/components/sections/process";
import { BrandBreak } from "@/components/sections/brand-break";
import { WhyUs } from "@/components/sections/why-us";
import { Marketplace } from "@/components/sections/marketplace";
import { FinalCTA } from "@/components/sections/final-cta";
import { SiteMotion } from "@/components/layout/site-motion";

export default function Home() {
  return (
    <SiteMotion>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Manifesto />
        <Grind />
        <Games />
        <Process />
        <BrandBreak />
        <WhyUs />
        <Marketplace />
        <FinalCTA />
      </main>
      <Footer />
    </SiteMotion>
  );
}
