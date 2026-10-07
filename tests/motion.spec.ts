import { expect, test } from "@playwright/test";

test("hero types progressively and sections reveal on scroll", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const letters = page.locator(".hero-title__display [data-letter]");
  await page.waitForFunction(() => {
    const opacity = [...document.querySelectorAll(".hero-title__display [data-letter]")]
      .map((letter) => Number(getComputedStyle(letter).opacity));
    return opacity.some((value) => value > 0.5) && opacity.some((value) => value === 0);
  });
  const before = await page.locator(".hero-stage").boundingBox();
  await expect.poll(() => letters.evaluateAll((elements) =>
    elements.every((element) => getComputedStyle(element).opacity === "1"),
  )).toBe(true);
  expect(await page.locator(".hero-stage").boundingBox()).toEqual(before);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    /We do the\s*GRIND\.\s*You get the\s*GLORY\./i,
  );

  const title = page.locator("#grind-title");
  await title.scrollIntoViewIfNeeded();
  await expect.poll(() => title.evaluate((element) => element.style.transform !== ""))
    .toBe(true);
  await expect.poll(() => title.evaluate((element) => getComputedStyle(element).opacity))
    .toBe("1");
  const finished = await title.evaluate((element) => element.getAttribute("style"));
  await page.locator("#hero-title").scrollIntoViewIfNeeded();
  await title.scrollIntoViewIfNeeded();
  expect(await title.getAttribute("style")).toBe(finished);
  expect(errors).toEqual([]);
});

test("reduced motion cancels active animations and keeps all content readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => [...document.querySelectorAll("[data-letter]")]
    .some((element) => getComputedStyle(element).opacity === "0"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator("[data-letter]").evaluateAll((elements) =>
    elements.every((element) => getComputedStyle(element).opacity === "1" &&
      getComputedStyle(element).transform === "none"),
  )).toBe(true);
  await page.locator("#grind-title").scrollIntoViewIfNeeded();
  await expect(page.locator("#grind-title")).not.toHaveAttribute("style");
  await page.locator(".hero-actions .button").first().hover();
  await expect(page.locator(".hero-actions .button").first()).not.toHaveAttribute("style");
});
