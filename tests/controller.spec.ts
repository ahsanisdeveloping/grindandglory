import { expect, test } from "@playwright/test";

test("visitors can hold, rotate, release, and use keyboard controls", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator("[data-controller-scene]");
  const control = page.getByRole("button", { name: "Rotate the crowned controller" });
  await expect(control).toBeEnabled();
  const initial = await scene.getAttribute("data-pose");
  const box = (await control.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(control).toHaveAttribute("data-dragging", "true");
  await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2 + 40, { steps: 8 });
  expect(await scene.getAttribute("data-pose")).not.toBe(initial);
  const rotated = await scene.getAttribute("data-pose");
  // Pointer capture keeps the gesture working even when the pointer leaves the object.
  await page.mouse.move(20, 20, { steps: 4 });
  await page.mouse.up();
  await expect(control).toHaveAttribute("data-dragging", "false");
  expect(await scene.getAttribute("data-pose")).not.toBe(rotated);
  await control.focus();
  await page.keyboard.press("Home");
  await expect(scene).toHaveAttribute("data-pose", initial!);
  await page.keyboard.press("ArrowRight");
  expect(await scene.getAttribute("data-pose")).not.toBe(initial);
  await page.keyboard.press("Home");
  await expect(scene).toHaveAttribute("data-pose", initial!);
});

test("touch visitors can rotate horizontally and still scroll vertically", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, reducedMotion: "reduce", viewport: { width: 375, height: 1000 } });
  const page = await context.newPage();
  await page.goto("/");
  const control = page.getByRole("button", { name: "Rotate the crowned controller" });
  await expect(control).toBeEnabled();
  const scene = page.locator("[data-controller-scene]");
  const initial = await scene.getAttribute("data-pose");
  const box = (await control.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= 6; step++) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + step * 12, y }] });
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(control).toHaveAttribute("data-dragging", "false");
  expect(await scene.getAttribute("data-pose")).not.toBe(initial);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= 8; step++) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - step * 15 }] });
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await expect(control).toHaveAttribute("data-dragging", "false");
  await context.close();
});

test("crowned controller idles, moves on scroll, and stays inside the hero", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const scene = page.locator("[data-controller-scene]");
  await expect(scene.locator("[data-ready=true]")).toHaveCount(1);
  await expect(page.locator(".hero [data-controller-scene]")).toHaveCount(1);
  const initialPose = await scene.getAttribute("data-pose");
  await expect.poll(() => scene.getAttribute("data-pose")).not.toBe(initialPose);
  const initial = await scene.locator("[data-ready=true]").getAttribute("style");
  await page.evaluate(() => window.scrollTo({ top: 250, behavior: "instant" }));
  await expect.poll(async () => Number(await scene.getAttribute("data-progress"))).toBeGreaterThan(0);
  expect(await scene.locator("[data-ready=true]").getAttribute("style")).not.toEqual(initial);
  await page.locator("#games").scrollIntoViewIfNeeded();
  await expect(scene).toHaveCSS("visibility", "hidden");
  const pausedPose = await scene.getAttribute("data-pose");
  await page.waitForTimeout(200);
  expect(await scene.getAttribute("data-pose")).toBe(pausedPose);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(scene).toHaveAttribute("data-progress", "0.000");
  expect(errors).toEqual([]);
});

test("controller respects reduced motion and fits a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator("[data-controller-scene]");
  await expect(scene.locator("[data-ready=true]")).toHaveCount(1);
  await expect(scene).toHaveAttribute("data-progress", "0.000");
  const pose = await scene.getAttribute("data-pose");
  await page.waitForTimeout(200);
  expect(await scene.getAttribute("data-pose")).toBe(pose);
  await page.locator("#games").scrollIntoViewIfNeeded();
  await expect(scene).toHaveCSS("visibility", "hidden");
  await expect(scene).toHaveAttribute("data-progress", "0.000");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("controller keeps its fallback when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (args[0] === "webgl2" || args[0] === "webgl") return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/");
  const scene = page.locator("[data-controller-scene]");
  await expect(scene.locator("canvas")).toHaveCSS("opacity", "0");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Grind&Glory" })).toBeVisible();
});
