import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("public/images/brand", { recursive: true });
await mkdir("public/images/games", { recursive: true });
await sharp("app/assets/backgroundcrowded.png")
  .resize(1200)
  .webp({ quality: 85 })
  .toFile("public/images/brand/pattern.webp");
await sharp("app/assets/backgroundround.png")
  .resize(900)
  .webp({ quality: 85 })
  .toFile("public/images/brand/radial.webp");
const icon = await sharp("app/assets/iconlogopurple.png")
  .trim()
  .resize(192, 192, { fit: "contain", background: "#F5F5F2" })
  .png()
  .toBuffer();
await writeFile("public/images/brand/icon.png", icon);
const iconHeader = Buffer.alloc(22);
iconHeader.writeUInt16LE(1, 2);
iconHeader.writeUInt16LE(1, 4);
iconHeader[6] = 192;
iconHeader[7] = 192;
iconHeader.writeUInt16LE(1, 10);
iconHeader.writeUInt16LE(32, 12);
iconHeader.writeUInt32LE(icon.length, 14);
iconHeader.writeUInt32LE(22, 18);
await writeFile("app/favicon.ico", Buffer.concat([iconHeader, icon]));
await sharp("app/assets/logoimagefilled.jpg")
  .resize(1200, 630, { fit: "contain", background: "#351431" })
  .jpeg({ quality: 90 })
  .toFile("public/images/brand/social.jpg");

if (process.argv.includes("--brand-only")) process.exit(0);

const sources = {
  valorant:
    "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/74075835ddc4e8457fb30f7fe560d2aff6d51702-5120x1772.png?accountingTag=VAL",
  fortnite:
    "https://cdn2.unrealengine.com/links-admin-EN_FN_OG_42-10_C1SX_DiscoverTile_480x270-8d2a8f48.jpg",
  league:
    "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akali_0.jpg",
};
for (const [name, url] of Object.entries(sources)) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  await sharp(Buffer.from(await response.arrayBuffer()))
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 87 })
    .toFile(`public/images/games/${name}.webp`);
}
await writeFile(
  "public/images/games/sources.json",
  JSON.stringify(
    {
      note: "Temporary official publisher artwork for editorial category examples. Replace with commissioned artwork before launch.",
      sources,
    },
    null,
    2,
  ) + "\n",
);
