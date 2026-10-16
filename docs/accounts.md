# Accounts storefront

`/accounts` displays the public inventory for the verified Grind&Glory seller. The landing page previews three live listings after the games section using the original compact card layout: level columns, 1.6:1 images, plain dividers and standard prices. Cards stack on mobile.

`lib/eldorado.ts` is server-only. It fetches `GET https://www.eldorado.gg/api/flexibleOffers` for the fixed verified seller ID and `category=Account`. It accepts only an internally generated page number. It does not read, send or exchange credentials, forward browser input, or expose an API route. Fetches cache for 60 seconds. A maximum of 20 upstream pages, 50 results each, are fetched in batches of four. The integration fails visibly if the limit is exceeded, rather than silently omitting inventory.

Only an explicit list of public listing fields reaches the browser. Search, game and price presets, sorting and 12-item pagination run locally against this data. Filters update immediately and stay in the URL through Next.js's native history integration. Filtering performs no additional API or page request. Listings render on the server; interactive filtering requires JavaScript. The public API's search parameter was unreliable during verification, so search uses the displayed public inventory instead.

Prices use the API's USD value when supplied. Account cards link to Eldorado for full details and checkout. No purchases, account management, secret delivery details, or write operations are implemented.

Credentials remain in the ignored `.env` file as `ELDORADO_CLIENT_ID` and `ELDORADO_CLIENT_SECRET`. Neither is needed for this feature. Never prefix these variables with `NEXT_PUBLIC_`.

Design Taste dials: variance 7, motion 4, density 5. UI/UX Pro Max informs accessible control semantics, visible focus, responsive sizing and reduced motion. Dropdowns use the project's existing MUI Select/MenuItem components with branded plum selected states, ivory menus, checkmarks, keyboard navigation and focus restoration. The filter bar is one row on desktop and two compact rows on mobile.

Validation commands:

- `node node_modules/next/dist/bin/next build`
- `node scripts/check-public-secrets.mjs`
- `node node_modules/@playwright/test/cli.js test tests/accounts.spec.ts tests/security.spec.ts`

Screenshots are saved to ignored `artifacts/`. Security scope and limits are in `docs/security-review.md`.
