# E2E checkout tests (Playwright)

End-to-end coverage of the purchase funnel against Mercado Pago:
product → cart → checkout (address, delivery, payment, review) → order confirmation.

---

## ⚠️ Safety gate — read before running

**These tests complete a real purchase.** They only ever run against
**Mercado Pago TEST credentials**. Verify both before running:

| Variable | Where | Must look like |
| --- | --- | --- |
| `MERCADOPAGO_ACCESS_TOKEN` | backend `.env` | starts with `TEST-` |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | storefront `.env.local` | the **test** public key |

**The prefix alone is not proof.** An app created *inside a Mercado Pago test
user* issues `APP_USR-` credentials that are still fully sandbox, and its API
calls report `live_mode: true`. So neither the prefix nor `live_mode` settles it
on its own.

What actually matters is that **both halves come from the same account/app**.
The reliable check is to run the card test: if they are mismatched, Mercado
Pago rejects the charge with **`Unauthorized use of live credentials`** and no
order is created. Two checks that do *not* work, learned the hard way:

- reading a card token back with the backend's access token — it returns `200`
  regardless of ownership (only a malformed token gives `401`), so it proves
  nothing;
- `live_mode` on `POST /v1/card_tokens` — `true` for production *and* for test
  users alike.

Pick **one** source and take both halves from it:

- **Option A (recommended)** — the client's own app, *Credenciales de prueba*
  tab (`cuarzosmx_checkoutapi`, AppID `5408916179048928`): public key → storefront,
  access token → backend. `TEST-` prefixed, because it is a **Checkout API** app.
- **Option B** — log in as the sandbox test user, open its developer panel, and
  take that app's public key *and* access token.

Mixing them (backend from B, storefront from A) is the exact failure above.

### The app type matters: Checkout API vs Checkout Pro

The CardPayment Brick this suite drives is **Checkout API**. In **sandbox** it only
accepts credentials whose prefix is **`TEST-`**, and those are issued by a
**Checkout API** application. A **Checkout Pro** application issues test credentials
that look like `APP_USR-`, and charging with them fails with:

```
401  code 7  Unauthorized use of live credentials
```

**This is a sandbox-only restriction. In production, Checkout Pro works** — order
#156 was charged with real money through it. So a `401 code 7` in local testing is
*never* a reason to change anything in production. Fix it by pointing the local env
at a Checkout API app's test credentials (Option A above); leave production alone.

And to repeat, because it cost a full debugging session: neither the prefix, nor
`live_mode`, nor reading the card token back with the access token tells you whether
two credentials belong to the same account. **The only test that settles it is
attempting the charge.**

Restart both services after changing the env files (Next inlines
`NEXT_PUBLIC_*` at build/compile time).

---

## Services that must be up

Playwright does **not** start anything (`webServer` is intentionally unset) —
it attaches to the dev services you already have running.

| Service | URL | Start with |
| --- | --- | --- |
| Medusa backend | http://localhost:9000 | `pnpm dev` in `cuarzosmx/` |
| Next storefront | http://localhost:8000 | `pnpm dev` in `cuarzosmx-storefront/` |
| Postgres | localhost:5431 | docker |
| Redis | localhost:6380 | docker |

Quick check: `curl -s -o /dev/null -w '%{http_code}' http://localhost:9000/health`
and the same for `http://localhost:8000/mx` — both must be `200`.

Catalog prerequisites (already satisfied on the local docker DB): a **MX / MXN**
region with `pp_mercadopago_mercadopago` enabled, and at least one in-stock
product with a non-zero price.

---

## The tunnel changes on every restart

Mercado Pago must be able to reach the backend webhook from the public
internet. The dev tunnel URL (cloudflared/ngrok) is **regenerated every time
the tunnel restarts**, and a stale URL means payments are charged but orders
are never completed.

After restarting the tunnel, update it in **two** places:

1. **Mercado Pago panel**, *in test mode* → your application → *Webhooks /
   Notificaciones* → set the URL to `https://<new-tunnel>/hooks/mercadopago`
   and save. Use *Simular notificación* to confirm it answers `200`.
2. **Backend `.env`** → `MERCADOPAGO_WEBHOOK_URL=https://<new-tunnel>/hooks/mercadopago`,
   then restart the backend.

Sanity check: the endpoint should answer `401` without a signature and `200`
with a valid one — a `200` on an unsigned request means signature verification
is off.

---

## Credentials and where each one goes

No secrets are stored in this repo. Set them in the env files:

| Variable | File | Purpose |
| --- | --- | --- |
| `MERCADOPAGO_ACCESS_TOKEN` | backend `.env` | Server-side charges. **Must be `TEST-`.** |
| `MERCADOPAGO_WEBHOOK_SECRET` | backend `.env` | Verifies the `x-signature` header on `/hooks/mercadopago`. |
| `MERCADOPAGO_WEBHOOK_URL` | backend `.env` | Public tunnel URL sent to MP. |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | storefront `.env.local` | Card tokenization in the browser Brick. **Must be the test key.** |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | storefront `.env.local` | Medusa store API key. |
| `MP_TEST_BUYER_USER` / `MP_TEST_BUYER_PASSWORD` | shell env | **Only** for the skipped Checkout Pro test — the MP sandbox buyer account. |

Test cards live in `tests/helpers.ts` (public sandbox numbers from the MP docs,
MLM table) — they are not secrets.

---

## Running

```bash
# all e2e tests
pnpm test:e2e

# the card flow only
pnpm test:e2e --grep "@CHECKOUT-E2E-001"

# watch it happen
pnpm test:e2e --headed
pnpm test:e2e --ui

# open the report of the last run
pnpm exec playwright show-report
```

Optional overrides:

- `PLAYWRIGHT_BASE_URL` — defaults to `http://localhost:8000`.
- `E2E_PRODUCT_HANDLE` — defaults to `catedrales-de-cuarzo-121`; change it if
  that product goes out of stock or is unpublished.

Tests run serially (`workers: 1`): parallel carts against one dev backend and
one payment gateway produce flakiness that is not worth debugging.

---

## What the card test asserts

Beyond "the page loaded":

- the cart total is non-zero;
- the checkout total is **greater** than the cart subtotal (shipping applied);
- the order total on the confirmation page **equals** the amount presented at
  checkout — this is the guard against the 1/100 amount-conversion class of bug;
- the confirmation shows a real order number.

Do not relax these into `toBeVisible()` checks. If one fails, the product is
suspect, not the assertion.

---

## Storefront quirks these tests work around

Discovered by driving the real UI; worth knowing before editing selectors.

- **Cookie banner.** A `z-[9998]` overlay swallows every click until dismissed.
  `acceptCookiesUpfront()` seeds the two `cuarzosmx_cookie_*` localStorage keys
  so the banner never mounts. Far more stable than clicking it each time.
- **Duplicated `data-testid`s.** Several screens render a mobile *and* a
  desktop layout, so ids like `cart-container`, `cart-total` and
  `checkout-button` match twice and trip strict mode. `BasePage.testId()`
  resolves to the visible one.
- **Add-to-cart starts disabled.** It reads "Selecciona una opción" until a
  variant resolves — for single-variant products that happens after hydration,
  with no option button to click. The POM waits for it to become enabled.
- **Option buttons only render when a product has >1 variant.**
- **Province select uses state codes**, not labels (`ZAC`, `AGS`, …).
- **Pickup is a delivery option too** ("Recoger en tienda", free). The POM
  skips it on purpose so the shipping cost is exercised.
- **Mercado Pago card option is labelled "Pago con tarjeta"** (the Wallet /
  Checkout Pro option is "Hasta 12 pagos sin tarjeta con Mercado Pago").
- **The CardPayment Brick spans four documents.** Card number, expiry and CVV
  each live in their own cross-origin iframe on
  `secure-fields.mercadopago.com`, named `cardNumber`, `expirationDate` and
  `securityCode`. Every one of those iframes contains *all five* input ids, but
  only the input matching its own frame name is interactive — so the frame name
  and the input id must agree. The cardholder name
  (`input[name="HOLDER_NAME"]`) is in the parent document.
- **The Brick's submit button says "Continuar"** and only *tokenizes* the card;
  the actual charge happens on the review step, behind "Realizar pedido".
- **The payment outcome is chosen by the cardholder name**, not the card
  number: `APRO` approves, `OTHE` rejects, `FUND` fails for funds, etc.
  Mexico (MLM) needs no identification document, so the Brick renders none.
- **Installments are mandatory.** Once the BIN resolves, the Brick renders a
  "Selecciona la cantidad de cuotas" radio group and refuses to submit until
  one is chosen ("Elige una opción para avanzar"). The POM picks **1x**
  deliberately: it is the only option without financing. For a $577.48 cart,
  3x charges $623.16 and 12x charges $703.54 — so any other choice makes the
  amount Mercado Pago charges legitimately diverge from the Medusa order total.
- **Adding to the cart is a server action.** Navigating to `/cart` right after
  clicking loses the line item silently ("Tu carrito está vacío"). The POM
  waits for the nav badge to stop reading `Carrito (0)`.
- **`payer.email` is validated by Mercado Pago**, and reserved TLDs like
  `.test` are rejected with `payer.email must be a valid email` — *after* the
  card is tokenized. Do not use the seller test user's own address either: MP
  refuses payments where payer and collector are the same account.

---

## Not covered yet

- Checkout Pro / Wallet redirect (written but `test.skip`ped — see the spec).
- Mercado Crédito.
- Bank transfer (`pp_system_default` / manual).
- Rejected-payment paths (`OTHE`, `FUND`, `SECU`) — the cardholder names are
  already in `tests/helpers.ts`.
- Webhook-driven order completion when the browser closes mid-payment.
- Installments / financing totals.
