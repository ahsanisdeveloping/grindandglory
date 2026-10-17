import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Export the actual character, lighting, and materials without generating new art.
// Run with the dev server open and the desktop scene available.
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL ?? "msedge",
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1100, height: 1000 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  await page.goto(process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000", { waitUntil: "domcontentloaded" });
  const scene = page.locator("[data-mascot-scene]");
  await scene.locator("canvas").waitFor();
  await scene.waitFor({ state: "visible" });
  await page.waitForFunction(() => document.querySelector("[data-mascot-scene]")?.dataset.ready === "true");
  await page.addStyleTag({ content: `
    html, body, .hero { background: transparent !important; }
    body * { visibility: hidden !important; }
    [data-mascot-scene], [data-mascot-scene] > div:has(> canvas),
    [data-mascot-scene] canvas { visibility: visible !important; opacity: 1 !important; }
  ` });
  await scene.evaluate((element) => {
    Object.assign(element.parentElement.style, {
      position: "absolute", top: "0", left: "0", bottom: "auto",
      width: "748px", height: "668px", transform: "none", margin: "0",
    });
  });
  await page.waitForTimeout(600);
  const png = await scene.locator("canvas").screenshot({ omitBackground: true });
  await mkdir("public/images/mascot", { recursive: true });
  const output = "public/images/mascot/mobile-mascot.webp";
  await sharp(png).resize({ width: 1200 }).webp({ quality: 92, alphaQuality: 100 }).toFile(output);
  console.log(`Saved ${output}`);
} finally {
  await browser.close();
}
