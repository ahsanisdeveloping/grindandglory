import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { site } from "@/data/site";

export function Grind() {
  return (
    <Section className="grind" aria-labelledby="grind-title">
      <Container>
        <h2
          className="section-title"
          id="grind-title"
          data-animate="text-reveal"
        >
          Good things take <span className="display-word">grind.</span>
        </h2>
        <p className="section-intro">
          Behind every standout account, there’s something you can’t skip.
        </p>
        <div className="grind-grid">
          {site.grind.map((item, index) => (
            <article
              className="grind-item"
              key={item.title}
              data-animate="grind-item"
            >
              <span className="grind-item__number" aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="grind-item__word">{item.word}</span>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
