import { ArrowDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { GrainGradient } from "@/components/ui/grain-gradient";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StoreLink } from "@/components/ui/store-link";
import { Typewriter } from "@/components/ui/typewriter";
import { site } from "@/data/site";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={`hero ${styles.hero}`} aria-labelledby="hero-title" data-animate="hero">
      <div className={styles.background} aria-hidden="true">
        <GrainGradient
          colorLight="#f5f5f2"
          colorMid="#e6dce5"
          colorDark="#c7b8c5"
          angle={0}
          position={0}
          curve={0.48}
          softness={0.24}
          scale={1}
          grain={0.32}
          grainSize={1}
          seed={1}
          speed={1}
          className={styles.gradient}
        />
      </div>
      <Container className={styles.content}>
        <div className={`hero-topline ${styles.topline}`}>
          <Eyebrow>{site.hero.eyebrow}</Eyebrow>
        </div>
        <div className={`hero-stage ${styles.stage}`}>
          <h1 id="hero-title" className={`hero-title ${styles.title}`}>
            <span className={`hero-title__group ${styles.group}`} data-animate="hero-title">
              <span className={`hero-title__intro ${styles.intro}`}>We do the</span>
              <Typewriter
                className={`hero-title__display ${styles.display}`}
                text="GRIND."
                delay={250}
                speed={110}
              />
            </span>
            <span
              className={`hero-title__group hero-title__group--glory ${styles.group}`}
              data-animate="hero-title"
            >
              <span className={`hero-title__intro ${styles.intro}`}>You get the</span>
              <Typewriter
                className={`hero-title__display ${styles.display}`}
                text="GLORY."
                delay={1000}
                speed={110}
              />
            </span>
          </h1>
        </div>
        <div className={`hero-bottom ${styles.bottom}`} data-animate="hero-copy">
          <p>{site.hero.copy}</p>
          <div className={`hero-actions ${styles.actions}`}>
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
