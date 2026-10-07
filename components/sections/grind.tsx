import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GrindStories } from "@/components/sections/grind-stories";
import { Typewriter } from "@/components/ui/typewriter";
import styles from "./grind.module.css";

export function Grind() {
  return (
    <Section className="grind" aria-labelledby="grind-title">
      <Container>
        <div className={styles.heading}>
          <h2
            className={`section-title ${styles.title}`}
            id="grind-title"
            data-animate="text-reveal"
          >
            Good things take <Typewriter className="display-word" text="grind." startOnView delay={200} />
          </h2>
          <p className="section-intro">
            Behind every standout account, there’s something you can’t skip.
          </p>
        </div>
        <GrindStories />
      </Container>
    </Section>
  );
}
