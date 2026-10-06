import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { site } from "@/data/site";

export function WhyUs() {
  return (
    <Section
      id="why-us"
      tabIndex={-1}
      className="why-us"
      aria-labelledby="why-title"
    >
      <Container>
        <h2 id="why-title" className="section-title" data-animate="text-reveal">
          For people who
          <br />
          <span className="display-word">get the game.</span>
        </h2>
        <div className="why-layout">
          <div className="why-art" data-animate="why-media">
            <Image
              src="/images/brand/radial.webp"
              alt=""
              fill
              sizes="(max-width: 767px) 90vw, 40vw"
            />
            <div className="why-art__caption">
              <span>Built by gamers.</span>
              <span>
                For what comes next.
                <ArrowUpRight aria-hidden="true" />
              </span>
            </div>
          </div>
          <div className="why-reasons">
            {site.reasons.map((reason) => (
              <article key={reason.title} data-animate="reason">
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
