import Image from "next/image";
import { Container } from "@/components/layout/container";

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
        <h2 id="brand-break-title" data-animate="brand-statement">
          <span>GRIND.</span>
          <span>EARN.</span>
          <span>ASCEND.</span>
        </h2>
        <span className="brand-break__signature">
          The Grind&Glory mentality.
        </span>
      </Container>
    </section>
  );
}
