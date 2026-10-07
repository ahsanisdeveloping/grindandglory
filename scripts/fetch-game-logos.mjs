import { access, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const destination = new URL("../public/images/games/logos/", import.meta.url);
const { sources } = JSON.parse(await readFile(new URL("sources.json", destination), "utf8"));

// Recreate missing local logos from the recorded, verified source URLs.
for (const [id, source] of Object.entries(sources)) {
  const file = new URL(id + ".webp", destination);
  if (await access(file).then(() => true).catch(() => false)) continue;

  const response = await fetch(source, {
    headers: { "User-Agent": "GrindAndGloryAssetPreparation/1.0" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(id + ": HTTP " + response.status);
  const image = await sharp(Buffer.from(await response.arrayBuffer()), { density: 300 })
    .trim()
    .resize(320, 160, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90 })
    .toBuffer();
  await writeFile(file, image);
  console.log(id + ": saved");
}
