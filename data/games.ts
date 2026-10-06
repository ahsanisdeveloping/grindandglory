export type Game = {
  id: string;
  name: string;
  description: string;
  features: readonly string[];
  image: string;
  imageAlt: string;
  imagePosition: string;
  artworkIsPlaceholder: boolean;
};

// Editorial category examples, not live inventory. Replace with commissioned artwork.
export const games: readonly Game[] = [
  {
    id: "valorant",
    name: "VALORANT",
    description: "For the rank chasers and the collection builders.",
    features: ["Ranks", "Weapon skins", "Progression"],
    image: "/images/games/valorant.webp",
    imageAlt: "Jett from VALORANT in the game’s illustrated character artwork",
    imagePosition: "53% center",
    artworkIsPlaceholder: true,
  },
  {
    id: "fortnite",
    name: "FORTNITE",
    description: "Season after season. A locker that tells a story.",
    features: ["Outfits", "Collectibles", "Progression"],
    image: "/images/games/fortnite.webp",
    imageAlt: "Fortnite characters in official promotional artwork",
    imagePosition: "50% center",
    artworkIsPlaceholder: true,
  },
  {
    id: "league",
    name: "LEAGUE OF LEGENDS",
    description: "Champions, mastery, and the climb that never stops.",
    features: ["Champions", "Skins", "Mastery"],
    image: "/images/games/league.webp",
    imageAlt: "Akali from League of Legends in Riot Games’ champion artwork",
    imagePosition: "65% center",
    artworkIsPlaceholder: true,
  },
];
