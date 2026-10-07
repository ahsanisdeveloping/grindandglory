import { expect, test } from "@playwright/test";

test("gradient hero keeps its content usable when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (args[0] === "webgl" || args[0] === "webgl2") return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hero = page.locator(".hero");
  await expect(hero.locator("img")).toHaveCount(0);
  const canvas = hero.locator("canvas");
  await expect(canvas).toHaveCSS("opacity", "0");
  const fallback = await canvas.evaluate((element) => getComputedStyle(element.parentElement!).backgroundImage);
  expect(fallback).toContain("linear-gradient");
  expect(fallback).toContain("rgb(199, 184, 197)");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/We do the\s*GRIND\.\s*You get the\s*GLORY\./i);
  await expect(hero.getByRole("link", { name: "Explore Grind&Glory" })).toBeVisible();
  await hero.getByRole("link", { name: "Explore Grind&Glory" }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator(".site-header")).toHaveCSS("color", "rgb(53, 20, 49)");
});
