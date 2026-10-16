# Local security review: public accounts display

Scope: application source, public data access, browser traffic and bundles, environment-file exposure, supported HTTP methods and response headers. This is a local implementation review, not a penetration test or verification of production hosting, account permissions or Eldorado's infrastructure.

## Credential boundary

- `.env` is ignored by Git. The two credential variables have no `NEXT_PUBLIC_` prefix.
- Application code does not read either credential. No token exchange, Authorization header or private seller API is used.
- `server-only` prevents the data access module from being imported into a client bundle.
- Browser tests check rendered HTML/RSC, loaded scripts and browser requests for the configured credential values without printing those values.
- `scripts/check-public-secrets.mjs` checks production `.next/static` artifacts for both configured values.

## Read-only API boundary

- The website has no API route, generic proxy, Server Action or account mutation handler.
- `proxy.ts` rejects POST, PUT, PATCH, DELETE, OPTIONS and other methods with 405; only GET and HEAD pass for public app routes. Next static/image infrastructure is excluded from this guard.
- The server performs an explicit GET to one fixed HTTPS endpoint, with one fixed seller ID and category. Redirects fail; request credentials are omitted.
- Client URL parameters cannot choose upstream URLs, sellers, methods or headers. Account/image URLs are constructed on fixed hosts after validating their path components.
- The response is checked for the fixed seller, Account category, prices, counts, page sizes and URL components. Unknown fields and raw seller objects are not forwarded to the client. Offer text renders as React text, not HTML.
- Shared 60-second upstream caching, bounded page counts, four-page concurrency and 12-second request timeouts limit upstream work. Local filter changes make zero network requests.

## Browser hardening

`nosniff`, frame denial, strict-origin referrer policy and disabled camera/microphone/geolocation permissions are set. The framework identification header is disabled. External listing links use `noopener noreferrer`. Environment-file and nonexistent API paths return 404.

## Limits

Visitors can read or copy the public account data and public Eldorado listing URLs shown on the site. Those are intentionally public; this does not grant access to the stored client credentials or private seller API. Public page traffic can cause bounded cache refreshes; the app does not implement distributed traffic rate limiting. Production hosting/WAF rate limits and protection of deployment environment variables remain infrastructure responsibilities.

The app currently stores credentials because the owner requested it, but this public display feature does not need them. It never grants visitors authenticated Eldorado access.
