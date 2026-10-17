import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Preserve the supplied artwork, including the original wordmark lettering.
await mkdir("public/images/brand", { recursive: true });
await sharp("app/assets/iconlogopurple.png").trim().png().toFile("public/images/brand/hero-mark.png");
const { data, info } = await sharp("app/assets/logoimagefilled.jpg")
  .extract({ left: 280, top: 790, width: 650, height: 100 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const pixels = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < info.width * info.height; i++) {
  const light = Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
  pixels[i * 4] = 43;
  pixels[i * 4 + 1] = 10;
  pixels[i * 4 + 2] = 51;
  pixels[i * 4 + 3] = Math.round(Math.max(0, Math.min(1, (light - 60) / 183)) * 255);
}
await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toFile("public/images/brand/hero-wordmark.png");
console.log("Prepared hero logo from the original brand artwork.");
