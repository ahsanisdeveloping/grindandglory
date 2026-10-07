import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [375, 430, 768, 1024, 1440, 1920]) {
  test(`layout and assets at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    // Trigger lazy images before checking assets and capturing the full page.
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty("complete", true);
      await expect(image).not.toHaveJSProperty("naturalWidth", 0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("main")).toBeVisible();
    const brokenAnchors = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href")!)
          .filter((href) => !document.querySelector(href)),
      );
    expect(brokenAnchors).toEqual([]);
    const unsafeLinks = await page
      .locator('a[target="_blank"]')
      .evaluateAll((links) =>
        links
          .filter(
            (link) =>
              !["noopener", "noreferrer"].every((value) =>
                link.getAttribute("rel")?.includes(value),
              ),
          )
          .map((link) => link.outerHTML),
      );
    expect(unsafeLinks).toEqual([]);
    expect(errors).toEqual([]);
    // Audit and capture the settled page, after scroll-triggered fades finish.
    await page.waitForFunction(() =>
      document.getAnimations().every((animation) => animation.playState !== "running"),
    );
    await page.screenshot({
      path: `artifacts/landing-${width}.png`,
      fullPage: true,
    });
    if (width === 375 || width === 1440) {
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
    }
  });
}

test("mobile menu supports keyboard, dismissal, and section navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 9; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog).toBeVisible();
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await dialog.getByRole("link", { name: "Games", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#games$/);
  await expect(page.locator("#games")).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Grind and Glory, back to top" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#top$/);
});

test("reduced motion and JavaScript-free content stay usable", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 430, height: 932 },
  });
  const page = await context.newPage();
  await page.goto(process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("list", { name: "Popular multiplayer games" }).getByRole("listitem"))
    .toHaveCount(12);
  await expect(page.locator(".hero .store-link")).toHaveAttribute(
    "href",
    "https://www.eldorado.gg/users/grindandglory/shop/Account",
  );
  await context.close();
});
