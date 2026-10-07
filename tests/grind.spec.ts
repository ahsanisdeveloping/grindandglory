import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("grind chapters support keyboard selection and update artwork", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section.grind");
  await section.scrollIntoViewIfNeeded();
  const chapters = section.locator("details");
  await expect(chapters).toHaveCount(4);
  await expect(chapters.nth(0)).toHaveAttribute("open", "");

  for (const [index, word] of ["TIME.", "SKILL.", "RARITY.", "PROGRESS."].entries()) {
    if (index > 0) {
      await chapters.nth(index).locator("summary").focus();
      await page.keyboard.press("Enter");
    }
    await expect(chapters.nth(index)).toHaveAttribute("open", "");
    await expect(section.locator("details[open]")).toHaveCount(1);
    await expect(section.getByText(word, { exact: true })).toBeVisible();
    await expect(section.locator('img[data-active="true"]')).toHaveCount(1);
  }
});

for (const width of [375, 768, 1440]) {
  test(`grind layout and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("section.grind");
    await section.scrollIntoViewIfNeeded();
    if (width >= 1024) {
      const heading = await section.locator("h2").evaluate((element) => ({
        height: element.getBoundingClientRect().height,
        fontSize: parseFloat(getComputedStyle(element).fontSize),
      }));
      expect(heading.height).toBeLessThan(heading.fontSize * 1.5);
    }
    await expect(section.locator('img[data-active="true"]')).toHaveJSProperty("complete", true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for (const chapter of await section.locator("details").all()) {
      await chapter.locator("summary").click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    const audit = await new AxeBuilder({ page })
      .include("section.grind")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    await section.locator("summary").first().click();
    await section.screenshot({ path: `artifacts/grind-${width}.png` });
  });
}

test("grind stories remain expandable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000");
  const chapter = page.locator("section.grind details").nth(2);
  await chapter.locator("summary").click();
  await expect(chapter).toHaveAttribute("open", "");
  await expect(chapter.locator("p")).toBeVisible();
  await context.close();
});
