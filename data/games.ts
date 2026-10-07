export type Game = {
  id: string;
  name: string;
  logo: string;
  logoTone?: "dark";
};

// Editorial game examples, not live marketplace inventory.
export const games: readonly Game[] = [
  { id: "apex", name: "Apex Legends", logo: "/images/games/logos/apex.webp" },
  { id: "valorant", name: "VALORANT", logo: "/images/games/logos/valorant.webp" },
  { id: "call-of-duty", name: "Call of Duty", logo: "/images/games/logos/call-of-duty.webp" },
  { id: "fortnite", name: "Fortnite", logo: "/images/games/logos/fortnite.webp" },
  { id: "marvel-rivals", name: "Marvel Rivals", logo: "/images/games/logos/marvel-rivals.webp" },
  { id: "pubg", name: "PUBG: Battlegrounds", logo: "/images/games/logos/pubg.webp", logoTone: "dark" },
  { id: "clash-of-clans", name: "Clash of Clans", logo: "/images/games/logos/clash-of-clans.webp" },
  { id: "league", name: "League of Legends", logo: "/images/games/logos/league.webp" },
  { id: "counter-strike", name: "Counter-Strike 2", logo: "/images/games/logos/counter-strike.webp" },
  { id: "overwatch", name: "Overwatch 2", logo: "/images/games/logos/overwatch.webp", logoTone: "dark" },
  { id: "rocket-league", name: "Rocket League", logo: "/images/games/logos/rocket-league.webp" },
  { id: "dota", name: "Dota 2", logo: "/images/games/logos/dota.webp", logoTone: "dark" },
];
