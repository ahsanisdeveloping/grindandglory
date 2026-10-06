import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StoreLink } from "@/components/ui/store-link";
import { site } from "@/data/site";

export function Marketplace() {
  return (
    <Section
      id="marketplace"
      tabIndex={-1}
      className="marketplace"
      aria-labelledby="marketplace-title"
    >
      <Container className="marketplace-layout">
        <div>
          <Eyebrow>Our marketplace home</Eyebrow>
          <h2
            id="marketplace-title"
            className="section-title"
            data-animate="text-reveal"
          >
            {site.marketplace.title.split("\n").map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </h2>
          <p className="section-intro">{site.marketplace.copy}</p>
          <StoreLink>
            {site.storeUrlIsPlaceholder
              ? "Explore Eldorado"
              : "Visit our Eldorado store"}
          </StoreLink>
          {site.storeUrlIsPlaceholder && (
            <p className="marketplace-placeholder">
              Our direct store link is coming soon. For now, explore Eldorado.
            </p>
          )}
        </div>
        <div className="marketplace-detail">
          <div className="marketplace-route">
            <span>
              Grind&Glory<small>Discover the brand</small>
            </span>
            <ArrowRight aria-hidden="true" />
            <span>
              Eldorado<small>Explore & purchase</small>
            </span>
          </div>
          <div className="marketplace-wordmark">
            eldorado<span>.gg</span>
            <ArrowUpRight aria-hidden="true" />
          </div>
          <ul>
            {site.marketplace.notes.map((note) => (
              <li key={note}>
                <Check aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>
          <p>
            Payments, delivery, and any buyer protection are handled by the
            marketplace under its own terms.
          </p>
        </div>
      </Container>
    </Section>
  );
}
