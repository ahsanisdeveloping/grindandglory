"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { site } from "@/data/site";
import styles from "./grind.module.css";

const artwork = [
  { src: "/images/grind/time.webp", word: "TIME.", caption: "The hours behind the account." },
  { src: "/images/grind/skill.webp", word: "SKILL.", caption: "Earned one match at a time." },
  { src: "/images/grind/rarity.webp", word: "RARITY.", caption: "A collection with character." },
  { src: "/images/grind/progress.webp", word: "PROGRESS.", caption: "Every session leaves its mark." },
] as const;

export function GrindStories() {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.stories}>
      <div className={styles.chapters}>
        {site.grind.map((item, index) => (
          <details
            className={styles.chapter}
            name="grind-stories"
            key={item.title}
            open={index === 0}
            onToggle={(event) => {
              if (event.currentTarget.open) setActive(index);
            }}
          >
            <summary className={styles.trigger}>
              <span className={styles.chapterWord}>{item.word}</span>
              <h3>{item.title}</h3>
              <Plus className={styles.plus} aria-hidden="true" />
              <ArrowUpRight className={styles.arrow} aria-hidden="true" />
            </summary>
            <div className={styles.description}>
              <p>{item.description}</p>
            </div>
          </details>
        ))}
        <p className={styles.closing}>We put in the time. You take it from here.</p>
      </div>
      <div className={styles.visual} aria-hidden="true" data-animate="grind-item">
        <div className={styles.art}>
          {artwork.map((item, index) => (
            <Image
              key={item.src}
              src={item.src}
              alt=""
              fill
              sizes="(max-width: 767px) 90vw, (max-width: 1023px) 50vw, 55vw"
              className={styles.image}
              data-active={active === index}
            />
          ))}
        </div>
        <div className={styles.artCaption}>
          <span className={styles.display} key={active}>{artwork[active].word}</span>
          <p>{artwork[active].caption}</p>
        </div>
      </div>
    </div>
  );
}
