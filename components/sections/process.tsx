import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BrandMark } from "@/components/ui/logo";
import { site } from "@/data/site";

export function Process() {
  return (
    <Section
      id="process"
      tabIndex={-1}
      className="process"
      aria-labelledby="process-title"
    >
      <Container className="process-layout">
        <div className="process-heading" data-animate="process-pin">
          <span className="section-note">From effort to opportunity</span>
          <h2 id="process-title" className="section-title">
            There’s a<br />
            process to
            <br />
            <span className="display-word">the glory.</span>
          </h2>
          <BrandMark className="process-mark" />
        </div>
        <ol className="process-steps">
          {site.process.map((step, index) => (
            <li
              key={step.name}
              className="process-step"
              data-animate="process-step"
            >
              <span className="process-step__number" aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <h3>
                  {step.name}
                  <ArrowRight aria-hidden="true" />
                </h3>
                <p>{step.description}</p>
                <span className="process-step__detail">{step.detail}</span>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
