import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Typewriter } from "@/components/ui/typewriter";

export function BrandBreak() {
  return (
    <section
      className="brand-break theme-purple"
      aria-labelledby="brand-break-title"
      data-animate="brand-break"
    >
      <div className="brand-break__pattern" data-animate="pattern-parallax">
        <Image src="/images/brand/pattern.webp" alt="" fill sizes="100vw" />
      </div>
      <Container className="brand-break__content">
        <span className="brand-break__label">
          A little obsession goes a long way.
        </span>
        <h2 id="brand-break-title" data-typewriter-group>
          <Typewriter text="GRIND." startOnView speed={100} delay={150} />
          <Typewriter text="EARN." startOnView speed={100} delay={850} />
          <Typewriter text="ASCEND." startOnView speed={100} delay={1450} />
        </h2>
        <span className="brand-break__signature">
          The Grind&Glory mentality.
        </span>
      </Container>
    </section>
  );
}
