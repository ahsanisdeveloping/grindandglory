import { expect, test } from "@playwright/test";

for (const width of [375, 1440]) {
  test(`navbar blends at the top and stays visible on scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const header = page.locator(".site-header");
    await expect(header).toHaveAttribute("data-scrolled", "false");
    await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await page.locator("#games").scrollIntoViewIfNeeded();
    await expect(header).toHaveAttribute("data-scrolled", "true");
    expect((await header.boundingBox())!.y).toBeCloseTo(0, 0);
    const nav = width < 1024
      ? header.getByRole("button", { name: "Open navigation menu" })
      : header.getByRole("navigation");
    await expect(nav).toBeInViewport();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toHaveAttribute("data-scrolled", "false");
  });
}

test("section typewriters wait for view and brand words type in sequence", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const words = page.locator("#brand-break-title > span");
  const hidden = (elements: Element[]) => elements.every((element) => getComputedStyle(element).opacity === "0");
  const visible = (elements: Element[]) => elements.every((element) => getComputedStyle(element).opacity === "1");
  await expect.poll(() => words.locator("[data-letter]").evaluateAll(hidden)).toBe(true);
  await expect.poll(() => page.locator("#grind-title [data-letter]").evaluateAll(hidden)).toBe(true);
  await page.locator("#grind-title").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator("#grind-title [data-letter]").evaluateAll(visible)).toBe(true);
  await expect.poll(() => words.locator("[data-letter]").evaluateAll(hidden)).toBe(true);
  await page.locator("#brand-break-title").scrollIntoViewIfNeeded();
  await expect.poll(() => words.nth(0).locator("[data-letter]").evaluateAll(visible)).toBe(true);
  expect(await words.nth(2).locator("[data-letter]").evaluateAll(hidden)).toBe(true);
  await expect.poll(() => words.nth(1).locator("[data-letter]").evaluateAll(visible)).toBe(true);
  await expect.poll(() => words.nth(2).locator("[data-letter]").evaluateAll(visible)).toBe(true);
  await page.locator("#final-title").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator("#final-title [data-letter]").evaluateAll(visible)).toBe(true);
  await expect(page.locator("#final-title")).toHaveAccessibleName(/Ready for\s*THE GLORY\?/);
  await page.locator("#hero-title").scrollIntoViewIfNeeded();
  await page.locator("#brand-break-title").scrollIntoViewIfNeeded();
  expect(await words.locator("[data-letter]").evaluateAll(visible)).toBe(true);
});

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

test("hero word pairs erase, cycle, and retain their mobile layout", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const title = page.locator("#hero-title");
  const stage = page.locator(".hero-stage");
  const initial = await stage.boundingBox();
  const visibleWords = () => title.locator(".hero-title__display [data-letter]").evaluateAll(
    (letters) => letters.filter((letter) => getComputedStyle(letter).opacity === "1")
      .map((letter) => letter.textContent).join(""),
  );
  await expect.poll(visibleWords).toBe("GRIND.GLORY.");
  await page.waitForFunction(() => {
    const title = document.querySelector("#hero-title")!;
    const visible = [...title.querySelectorAll("[data-letter]")]
      .filter((letter) => getComputedStyle(letter).opacity === "1").length;
    return title.getAttribute("data-cycle-index") === "0" && visible > 0 && visible < 12;
  });
  await expect(title).toHaveAttribute("data-cycle-index", "1");
  await expect.poll(visibleWords).toBe("WORK.WINS.");
  expect(await stage.boundingBox()).toEqual(initial);
  await expect(title).toHaveAttribute("data-cycle-index", "2", { timeout: 6000 });
  await expect.poll(visibleWords).toBe("PREP.EDGE.");
  for (const [offset, words] of ["CLIMB.RANK.", "HUNT.LOOT.", "QUESTS.GEAR.", "LEVELS.POWER.", "HOURS.SKINS.", "BUILD.BOOST."].entries()) {
    await expect(title).toHaveAttribute("data-cycle-index", String(offset + 3), { timeout: 6000 });
    await expect.poll(visibleWords).toBe(words);
    expect(await stage.boundingBox()).toEqual(initial);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await expect(title).toHaveAttribute("data-cycle-index", "0", { timeout: 6000 });
  expect(await stage.boundingBox()).toEqual(initial);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(visibleWords).toBe("GRIND.GLORY.");
  await expect(title).toHaveAccessibleName(/We do the\s*GRIND\.\s*You get the\s*GLORY\./i);
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
