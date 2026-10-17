import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("live seller accounts render with images and direct listing links", async ({ page }) => {
  await page.goto("/accounts");
  const cards = page.locator(".account-card");
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThan(0);
  await expect(cards.first().getByRole("link")).toHaveAttribute("href", /^https:\/\/www\.eldorado\.gg\/[\w-]+\/oa\/[\w-]+$/);
  for (const image of await cards.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    await expect(image).not.toHaveJSProperty("naturalWidth", 0);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "artifacts/accounts-desktop.png", fullPage: true });
});

test("compact filters apply instantly without an API or navigation request", async ({ page }) => {
  await page.goto("/accounts");
  await expect(page.locator(".account-card").first()).toBeVisible();
  const dataRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname === "/accounts" || url.pathname.startsWith("/api/")) dataRequests.push(url.pathname);
  });
  await expect(page.getByRole("button", { name: "Apply filters" })).toHaveCount(0);
  await page.getByRole("combobox", { name: "Sort by", exact: true }).click();
  await page.getByRole("option", { name: "Price: low to high", exact: true }).click();
  await expect(page).toHaveURL(/sort=price-asc/);
  const prices = await page.locator(".account-price").evaluateAll((els) => els.map((el) => Number(el.childNodes[0].textContent?.replace(/[^\d.]/g, ""))));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
  await page.getByRole("searchbox", { name: "Search accounts" }).fill("valorant");
  await expect(page.locator(".account-card").first()).toBeVisible();
  for (const game of await page.locator(".account-game").allTextContents()) expect(game).toBe("VALORANT");
  await page.getByRole("searchbox", { name: "Search accounts" }).fill("single skin");
  await expect(page.getByRole("searchbox")).toHaveValue("single skin");
  await expect(page.locator(".account-card").first()).toBeVisible();
  await page.getByRole("searchbox").fill("no-matching-account-xyzq123456");
  await expect(page.getByRole("heading", { name: "No accounts match just yet." })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await page.getByRole("combobox", { name: "Price range" }).click();
  await page.getByRole("option", { name: "Under $25", exact: true }).click();
  const bounded = await page.locator(".account-price").evaluateAll((els) => els.map((el) => Number(el.childNodes[0].textContent?.replace(/[^\d.]/g, ""))));
  expect(bounded.length).toBeGreaterThan(0);
  expect(bounded.every((price) => price <= 25)).toBe(true);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("combobox", { name: "Game", exact: true }).click();
  await page.getByRole("option").nth(1).click();
  await expect(page.locator(".account-card").first()).toBeVisible();
  expect(new Set(await page.locator(".account-game").allTextContents()).size).toBe(1);
  expect(dataRequests).toEqual([]);
});

test("mobile accounts and landing preview remain accessible and on brand", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/accounts");
  await expect(page.locator(".account-card").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.screenshot({ path: "artifacts/accounts-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "Games", exact: true }).click();
  await expect(page).toHaveURL(/\/#games$/);
  const preview = page.locator("#accounts");
  await preview.scrollIntoViewIfNeeded();
  await expect(preview.getByRole("heading", { level: 2 })).toBeVisible();
  await expect(preview.getByRole("heading", { level: 3 }).first()).toBeVisible();
  await expect(preview.locator(".account-card")).toHaveCount(4);
  for (const image of await preview.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    await expect(image).not.toHaveJSProperty("naturalWidth", 0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  await preview.screenshot({ path: "artifacts/accounts-home-mobile.png", style: ".site-header,.skip-link,nextjs-portal{visibility:hidden!important}" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await preview.screenshot({ path: "artifacts/accounts-home-desktop.png", style: ".site-header,.skip-link,nextjs-portal{visibility:hidden!important}" });
  const homeAudit = await new AxeBuilder({ page }).include("#accounts").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(homeAudit.violations).toEqual([]);
  await preview.getByRole("link", { name: "Explore accounts" }).click();
  await expect(page).toHaveURL(/\/accounts$/);
});

test("branded dropdown options support keyboard selection, Escape and accessible contrast", async ({ page }) => {
  await page.goto("/accounts");
  await expect(page.locator(".account-card").first()).toBeVisible();
  const trigger = page.getByRole("combobox", { name: "Sort by", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("listbox", { name: "Sort by" });
  await expect(menu).toBeVisible();
  await expect(page.getByRole("option", { name: "Newest first", exact: true })).toHaveAttribute("aria-selected", "true");
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.screenshot({ path: "artifacts/accounts-filter-open.png" });
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/sort=price-asc/);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
