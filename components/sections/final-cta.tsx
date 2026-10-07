import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BrandMark } from "@/components/ui/logo";
import { StoreLink } from "@/components/ui/store-link";
import { Typewriter } from "@/components/ui/typewriter";

export function FinalCTA() {
  return (
    <Section className="final-cta theme-purple" aria-labelledby="final-title">
      <Container className="final-cta__layout">
        <div>
          <h2 id="final-title" data-animate="final-title">
            <span>Ready for</span>
            <Typewriter className="display-word" text="THE GLORY?" startOnView delay={250} />
          </h2>
          <p>
            We’ve done the grinding.
            <br />
            Find your next chapter.
          </p>
          <StoreLink variant="light" />
        </div>
        <BrandMark light className="final-cta__mark" />
      </Container>
    </Section>
  );
}
