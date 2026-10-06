import { ArrowDownRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { site } from "@/data/site";

export function Manifesto() {
  return (
    <Section
      id="about"
      tabIndex={-1}
      className="manifesto theme-purple"
      aria-labelledby="manifesto-title"
    >
      <Container>
        <div className="manifesto-heading">
          <span className="section-note">The mindset</span>
          <h2 id="manifesto-title" data-animate="text-reveal">
            <span>{site.manifesto.intro}</span>
            <br />
            {site.manifesto.statement}
          </h2>
        </div>
        <div className="manifesto-bottom">
          <ArrowDownRight
            className="manifesto-arrow"
            strokeWidth={0.8}
            aria-hidden="true"
          />
          <div>
            <p className="body-large">{site.manifesto.copy}</p>
            <p className="manifesto-closing">{site.manifesto.closing}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
