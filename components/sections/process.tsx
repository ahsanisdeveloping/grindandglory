import type { CSSProperties } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Crown, Gem, ListChecks, Target } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Typewriter } from "@/components/ui/typewriter";
import { site } from "@/data/site";
import styles from "./process.module.css";

function ProcessMotif({ index }: { index: number }) {
  return (
    <div className={styles.motif} aria-hidden="true">
      {index === 0 && (
        <div className={styles.repeat}>
          <span>PLAY.</span>
          <span>LEARN.</span>
          <span>REPEAT.<ArrowDownRight /></span>
        </div>
      )}
      {index === 1 && (
        <div className={styles.selection}>
          <span className={styles.selectionPiece}><Target /><span>Rank</span></span>
          <span className={styles.selectionPiece}><Gem /><span>Collection</span></span>
          <span className={styles.selectionPiece}><Crown /><span>Character</span></span>
        </div>
      )}
      {index === 2 && (
        <div className={styles.clarity}>
          <ListChecks className={styles.clarityIcon} />
          <span className={styles.clearWord}>CLEAR.</span>
          <div className={styles.details}>
            <span><Check />Progression</span>
            <span><Check />Ranks</span>
            <span><Check />Collections</span>
          </div>
        </div>
      )}
      {index === 3 && (
        <div className={styles.achievement}>
          <Crown className={styles.crown} />
          <span className={styles.podium} />
          <span className={styles.nextChapter}>Your next chapter.</span>
        </div>
      )}
    </div>
  );
}

export function Process() {
  return (
    <Section
      id="process"
      tabIndex={-1}
      className="process"
      aria-labelledby="process-title"
    >
      <Container>
        <div className={styles.heading}>
          <span className="section-note">From effort to opportunity</span>
          <h2 id="process-title" className={`section-title ${styles.title}`}>
            There’s a process to <Typewriter className="display-word" text="the glory." startOnView delay={200} />
          </h2>
          <p className="section-intro">Time, taste, and a clear path to your next chapter.</p>
        </div>
        <ol className={styles.journey} aria-label="The Grind and Glory process">
          {site.process.map((step, index) => (
            <li
              key={step.name}
              className={styles.sheet}
              style={{ "--step-index": index } as CSSProperties}
            >
              <div className={styles.sheetHeader}>
                <span className={styles.sheetLabel} aria-hidden="true">
                  <span className={styles.number}>0{index + 1}</span>
                  {step.name}
                </span>
                <p>{step.detail}</p>
              </div>
              <div className={styles.sheetContent}>
                <div className={styles.copy}>
                  <h3><Typewriter text={`${step.name}.`} startOnView speed={85} delay={150} /></h3>
                  <p>{step.description}</p>
                  {index === site.process.length - 1 ? (
                    <ArrowUpRight className={styles.direction} aria-hidden="true" />
                  ) : (
                    <ArrowDownRight className={styles.direction} aria-hidden="true" />
                  )}
                </div>
                <ProcessMotif index={index} />
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.handoff}>
          <span>Built by us.</span>
          <ArrowUpRight aria-hidden="true" />
          <span>Continued by you.</span>
        </div>
      </Container>
    </Section>
  );
}
