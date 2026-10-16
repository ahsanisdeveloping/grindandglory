import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

test("public routes reject write methods and expose no API proxy or env files", async ({ request }) => {
  for (const route of ["/", "/accounts", "/api/eldorado", "/api/flexibleOffers"]) {
    for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
      const response = await request.fetch(route, { method });
      expect(response.status(), `${method} ${route}`).toBe(405);
      expect(response.headers().allow).toBe("GET, HEAD");
    }
  }
  for (const path of ["/.env", "/.env.local", "/api/eldorado", "/api/flexibleOffers"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  const response = await request.get("/accounts");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["x-powered-by"]).toBeUndefined();
  expect((await request.head("/accounts")).status()).toBe(200);
});

test("credentials stay out of HTML, browser scripts, and browser requests", async ({ page, request }) => {
  // Do not print secret values in assertions or test output.
  const env = readFileSync(".env", "utf8");
  const credentials = env.split(/\r?\n/).filter((line) => /^ELDORADO_CLIENT_(ID|SECRET)=/.test(line)).map((line) => line.slice(line.indexOf("=") + 1).trim()).filter(Boolean);
  expect(credentials.length).toBe(2);
  let leakedRequest = false;
  let privateApiCall = false;
  page.on("request", (req) => {
    const text = req.url() + JSON.stringify(req.headers()) + (req.postData() ?? "");
    if (credentials.some((credential) => text.includes(credential))) leakedRequest = true;
    if (req.url().includes("eldorado.gg/api/") || /oauth|\/token\b/.test(req.url())) privateApiCall = true;
  });
  for (const path of ["/", "/accounts?userId=someone-else&url=https://example.com&method=POST"]) {
    const response = await request.get(path);
    const text = await response.text();
    expect(credentials.some((credential) => text.includes(credential)), "Credentials must not appear in HTML/RSC").toBe(false);
  }
  await page.goto("/accounts");
  await expect(page.locator(".account-card").first()).toBeVisible();
  const scripts = await page.locator("script[src]").evaluateAll((elements) => elements.map((element) => (element as HTMLScriptElement).src));
  for (const src of scripts) {
    const text = await (await request.get(src)).text();
    expect(credentials.some((credential) => text.includes(credential)), "Credentials must not appear in browser bundles").toBe(false);
  }
  expect(leakedRequest, "Browser requests must not contain credentials").toBe(false);
  expect(privateApiCall, "Browser must not call Eldorado APIs or token endpoints").toBe(false);
});
