import { ArrowDown, ArrowDownRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { BrandMark } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StoreLink } from "@/components/ui/store-link";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title" data-animate="hero">
      <Container>
        <div className="hero-topline">
          <Eyebrow>{site.hero.eyebrow}</Eyebrow>
          <span className="hero-edition">
            Built through play. Chosen with purpose.
          </span>
        </div>
        <div className="hero-stage">
          <h1 id="hero-title" className="hero-title">
            <span className="hero-title__group" data-animate="hero-title">
              <span className="hero-title__intro">We do the</span>
              <span className="hero-title__display">GRIND.</span>
            </span>
            <span
              className="hero-title__group hero-title__group--glory"
              data-animate="hero-title"
            >
              <span className="hero-title__intro">You get the</span>
              <span className="hero-title__display">GLORY.</span>
            </span>
          </h1>
          <div className="hero-art" aria-hidden="true" data-animate="hero-logo">
            <div className="hero-art__orbit" />
            <div className="hero-art__axis" />
            <BrandMark preload className="hero-art__mark" />
            <span className="hero-art__caption">THE MARK OF THE GRIND</span>
            <ArrowDownRight className="hero-art__arrow" strokeWidth={1} />
          </div>
        </div>
        <div className="hero-bottom" data-animate="hero-copy">
          <p>{site.hero.copy}</p>
          <div className="hero-actions">
            <Button asChild>
              <a href="#about">
                Explore Grind&Glory
                <ArrowDown aria-hidden="true" />
              </a>
            </Button>
            <StoreLink variant="ghost" />
          </div>
        </div>
      </Container>
    </section>
  );
}
