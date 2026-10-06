import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BrandMark } from "@/components/ui/logo";
import { StoreLink } from "@/components/ui/store-link";

export function FinalCTA() {
  return (
    <Section className="final-cta theme-purple" aria-labelledby="final-title">
      <Container className="final-cta__layout">
        <div>
          <h2 id="final-title" data-animate="final-title">
            <span>Ready for</span>
            <span className="display-word">THE GLORY?</span>
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
