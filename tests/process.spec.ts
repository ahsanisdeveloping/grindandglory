import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [375, 768, 1440]) {
  test(`process stays readable and image-free at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#process");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("img")).toHaveCount(0);
    await expect(section.getByRole("listitem")).toHaveCount(4);
    for (const name of ["Grind.", "Curate.", "List.", "Glory."]) {
      await expect(section.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const audit = await new AxeBuilder({ page })
      .include("#process")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    await section.screenshot({ path: `artifacts/process-${width}.png` });
  });
}

test("process sheets stack below the navbar and keep stage labels visible", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const sheets = page.locator("#process li");
  await sheets.nth(3).evaluate((element) => {
    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - 296, behavior: "instant" });
  });
  for (let index = 0; index < 4; index++) {
    const box = (await sheets.nth(index).boundingBox())!;
    expect(box.y).toBeCloseTo(104 + index * 64, 0);
    const label = sheets.nth(index).locator("div").first();
    expect(await label.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return element.contains(document.elementFromPoint(box.x + 50, box.y + 25));
    })).toBe(true);
  }
  await expect.poll(() => sheets.nth(3).locator("[data-letter]").evaluateAll((letters) =>
    letters.every((letter) => getComputedStyle(letter).opacity === "1"),
  )).toBe(true);
  await page.screenshot({ path: "artifacts/process-stack.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(sheets.nth(0)).toHaveCSS("position", "relative");
});

test("all process stages are available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000");
  await expect(page.locator("#process h3")).toHaveCount(4);
  await expect(page.locator("#process h3").last()).toHaveAccessibleName("Glory.");
  await expect(page.locator("#process img")).toHaveCount(0);
  await context.close();
});
