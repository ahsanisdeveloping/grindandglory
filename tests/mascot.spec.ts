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
    if (width < 768) {
      await expect(scene).toHaveAttribute("data-renderer", "image");
      await expect(scene.locator("canvas")).toHaveCount(0);
      await expect(scene.locator("img")).toBeVisible();
    } else {
      await expect(scene).toHaveAttribute("data-renderer", "webgl");
      await expect(scene.locator("canvas")).toBeVisible();
    }
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

test("desktop mascot follows the cursor, blinks, and sleeps offscreen without controls", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const scene = page.locator('[data-mascot-scene][data-renderer="webgl"]');
  await expect(scene).toHaveAttribute("data-ready", "true");
  await page.mouse.move(1400, 350);
  await expect.poll(async () => Number(await scene.getAttribute("data-rotation"))).toBeGreaterThan(0.05);
  await page.mouse.move(40, 350);
  await expect.poll(async () => Number(await scene.getAttribute("data-rotation"))).toBeLessThan(-0.05);
  await expect.poll(async () => Number(await scene.getAttribute("data-blink")), { timeout: 12000, intervals: [80] }).toBeLessThan(0.9);
  await expect(scene.getByRole("button")).toHaveCount(0);
  await page.locator("#process").scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-paused", "true");
  const rotation = await scene.getAttribute("data-rotation");
  await page.waitForTimeout(400);
  expect(await scene.getAttribute("data-rotation")).toBe(rotation);
  await expect(page.locator(".site-header")).toBeVisible();
});

test("reduced motion renders a still character and passes hero accessibility checks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator('[data-mascot-scene][data-renderer="webgl"]');
  await expect(scene).toHaveAttribute("data-ready", "true");
  await expect(scene).toHaveAttribute("data-paused", "true");
  await expect(page.getByRole("button", { name: "Pause mascot animation" })).toHaveCount(0);
  await page.mouse.move(30, 200);
  await page.waitForTimeout(300);
  expect(await scene.getAttribute("data-rotation")).toBeNull();
  const audit = await new AxeBuilder({ page }).include(".hero").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
});

test("mobile hero uses direct navigation without a hamburger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".hero").getByRole("button", { name: "Open navigation menu" })).toHaveCount(0);
  await expect(page.locator(".hero nav a")).toHaveCount(4);
  await page.locator(".hero").getByRole("link", { name: "Get in touch" }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
});

test("mobile uses a static mascot without loading 3D libraries or creating WebGL", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const sceneRequests: string[] = [];
  page.on("request", (request) => {
    // Turbopack may send a tiny async-loader stub; the runtime chunks must stay unloaded.
    if (/node_modules_three_(?:src|build)|react.three_fiber|node_modules_.*drei/i.test(request.url())) sceneRequests.push(request.url());
  });
  await page.addInitScript(() => {
    let requests = 0;
    Object.defineProperty(window, "mascotWebGLRequests", { get: () => requests });
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (/webgl/i.test(contextId)) requests++;
      return Reflect.apply(original, this, [contextId, ...args]);
    } as typeof original;
  });
  await page.goto("/", { waitUntil: "networkidle" });
  const scene = page.locator("[data-mascot-scene]");
  await expect(scene).toHaveAttribute("data-renderer", "image");
  await expect(scene.locator("img")).toHaveJSProperty("complete", true);
  await expect(scene.locator("img")).not.toHaveJSProperty("naturalWidth", 0);
  await expect(scene.locator("canvas")).toHaveCount(0);
  expect(await page.evaluate(() => Reflect.get(window, "mascotWebGLRequests"))).toBe(0);
  expect(sceneRequests).toEqual([]);
  await page.setViewportSize({ width: 1024, height: 941 });
  await expect(page.locator('[data-mascot-scene][data-renderer="webgl"]')).toHaveAttribute("data-ready", "true");
  await expect(page.locator("[data-mascot-scene] canvas")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("[data-mascot-scene]")).toHaveAttribute("data-renderer", "image");
  await expect(page.locator("[data-mascot-scene] canvas")).toHaveCount(0);
});

test("WebGL failure displays the static mascot and keeps collection navigation usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (/webgl/i.test(contextId)) return null;
      return Reflect.apply(original, this, [contextId, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".hero").getByRole("heading", { level: 1 })).toBeVisible();
  const scene = page.locator("[data-mascot-scene]");
  await expect(scene.getByRole("status")).toHaveText("Showing a still mascot. The interactive view is unavailable.");
  await expect(scene).toHaveAttribute("data-renderer", "image");
  await expect(scene.locator("img")).toBeVisible();
  await expect(scene.locator("img")).toHaveJSProperty("complete", true);
  await expect(scene.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".hero").getByRole("link", { name: "The collection" })).toHaveAttribute("href", "#accounts");
});
