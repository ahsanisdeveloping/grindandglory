import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [375, 768, 1024, 1672]) {
  test(`mascot hero fits and loads at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 941 });
    await page.goto("/");
    const scene = page.locator("[data-mascot-scene]");
    await expect(scene).toHaveAttribute("data-ready", "true", { timeout: 30000 });
    await expect(scene.locator("canvas")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("rare accounts.real flex.");
    for (const image of await page.locator(".hero img").all()) {
      if (!(await image.isVisible())) continue;
      await expect(image).toHaveJSProperty("complete", true);
      await expect(image).not.toHaveJSProperty("naturalWidth", 0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const box = await scene.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    const missingTargets = await page.locator('.hero a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")!).filter((href) => !document.querySelector(href)));
    expect(missingTargets).toEqual([]);
    await page.screenshot({ path: `artifacts/mascot-${width}.png` });
    expect(errors).toEqual([]);
  });
}

test("mascot follows the cursor, blinks, pauses, and sleeps offscreen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const scene = page.locator("[data-mascot-scene]");
  await expect(scene).toHaveAttribute("data-ready", "true");
  await page.mouse.move(1400, 350);
  await expect.poll(async () => Number(await scene.getAttribute("data-rotation"))).toBeGreaterThan(0.05);
  await page.mouse.move(40, 350);
  await expect.poll(async () => Number(await scene.getAttribute("data-rotation"))).toBeLessThan(-0.05);
  await expect.poll(async () => Number(await scene.getAttribute("data-blink")), { timeout: 12000, intervals: [80] }).toBeLessThan(0.9);
  const pause = page.getByRole("button", { name: "Pause mascot animation" });
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(scene).toHaveAttribute("data-paused", "true");
  const rotation = await scene.getAttribute("data-rotation");
  await page.mouse.move(1400, 350);
  await page.waitForTimeout(400);
  expect(await scene.getAttribute("data-rotation")).toBe(rotation);
  await page.getByRole("button", { name: "Play mascot animation" }).press("Enter");
  await page.locator("#process").scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-paused", "true");
  await expect(page.locator(".site-header")).toBeVisible();
});

test("reduced motion renders a still character and passes hero accessibility checks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator("[data-mascot-scene]");
  await expect(scene).toHaveAttribute("data-ready", "true");
  await expect(scene).toHaveAttribute("data-paused", "true");
  await expect(page.getByRole("button", { name: "Pause mascot animation" })).toHaveCount(0);
  await page.mouse.move(30, 200);
  await page.waitForTimeout(300);
  expect(await scene.getAttribute("data-rotation")).toBeNull();
  const audit = await new AxeBuilder({ page }).include(".hero").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
});

test("mobile menu contains focus and contact navigation reaches the contact section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.locator(".hero").getByRole("button", { name: "Open navigation menu" });
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.locator(".hero").getByRole("link", { name: "Get in touch" }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
});

test("WebGL failure keeps the hero and collection link usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (/webgl/i.test(contextId)) return null;
      return Reflect.apply(original, this, [contextId, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".hero").getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Your grind mate is taking a break.")).toBeVisible();
  await expect(page.locator("[data-mascot-scene]").getByRole("link", { name: "Explore the collection" })).toHaveAttribute("href", "#accounts");
});
