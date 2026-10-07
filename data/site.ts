export const site = {
  name: "Grind&Glory",
  description:
    "We do the grind. You get the glory. Gaming accounts, considered collections, and hard-earned progression. Discover Grind&Glory.",
  // Replace with your verified Eldorado seller URL. The fallback is labelled honestly.
  storeUrl: "https://www.eldorado.gg/",
  storeUrlIsPlaceholder: true,
  navigation: [
    { label: "About", href: "#about" },
    { label: "Games", href: "#games" },
    { label: "Process", href: "#process" },
    // { label: "Why us", href: "#why-us" },
  ],
  socials: [
    { label: "Instagram", href: null as string | null },
    { label: "Discord", href: null as string | null },
  ],
  hero: {
    eyebrow: "Premium gaming accounts",
    copy: "Built through hours of progression. Curated for players who know what they want.",
  },
  manifesto: {
    intro: "Some accounts are played.",
    statement: "Others are built.",
    copy: "The late nights. The next rank. The collection that took seasons to come together. We know what goes into an account worth having. That’s where Grind&Glory begins.",
    closing: "We put in the time. You find your next chapter.",
  },
  grind: [
    {
      title: "Hours invested",
      word: "TIME",
      description:
        "Late sessions. Daily dedication. The kind of progress you can’t rush.",
    },
    {
      title: "Ranks earned",
      word: "SKILL",
      description:
        "Every match is a lesson. Every new rank has a story behind it.",
    },
    {
      title: "Skins collected",
      word: "RARITY",
      description:
        "Standout cosmetics and collections with a character of their own.",
    },
    {
      title: "Progression built",
      word: "COMMITMENT",
      description:
        "A little further, every session. Small milestones become something bigger.",
    },
  ],
  process: [
    {
      name: "Grind",
      description:
        "It starts in the game. Time, consistency, and genuine play build the foundation.",
      detail: "Put in the hours.",
    },
    {
      name: "Curate",
      description:
        "We look for the details that make an account worth a second look: progression, ranks, and collections.",
      detail: "Find the distinctive.",
    },
    {
      name: "List",
      description:
        "Accounts are presented through our marketplace listings, with the details players need to make a choice.",
      detail: "Make it clear.",
    },
    {
      name: "Glory",
      description:
        "Find the account that fits what you’re looking for. Continue the story from there.",
      detail: "Your next chapter.",
    },
  ],
  reasons: [
    {
      title: "Curated, with intent.",
      description:
        "Progression, collections, and character. We focus on the details that give each account its appeal.",
    },
    {
      title: "The details, up front.",
      description:
        "Clear listings help you understand what’s included. Review the account details before making your choice.",
    },
    {
      title: "A marketplace you can check.",
      description:
        "View seller feedback, purchase terms, and available buyer protection directly on the marketplace.",
    },
    {
      title: "We speak your game.",
      description:
        "We understand why a rank, a favourite skin, or a hard-earned unlock can make all the difference.",
    },
  ],
  marketplace: {
    title: "Discover here.\nMake it yours there.",
    copy: "This is the home of our brand. Our accounts live on Eldorado, where you can explore listings, review the details, and complete your purchase.",
    notes: [
      "Check current account details",
      "Review seller feedback",
      "Read the marketplace’s purchase terms",
    ],
  },
} as const;
