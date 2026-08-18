<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>

<h1 align="center">
  Cuarzosmx Storefront
</h1>

<p align="center">
Storefront de Cuarzos MX sobre Next.js 15 (App Router) y Medusa v2, con pagos por <strong>Mercado Pago</strong>.</p>

<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

### Requisitos previos

El backend de Medusa (`../cuarzosmx/`) tiene que estar corriendo en `http://localhost:9000`,
con una region **MX / MXN** que tenga `pp_mercadopago_mercadopago` habilitado. Ese estado lo
deja `pnpm seed:mx` en el backend; ver `../cuarzosmx/README.md`.

# Overview

The Medusa Next.js Starter is built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Medusa](https://medusajs.com/)

Features include:

- Full ecommerce support:
  - Product Detail Page
  - Product Overview Page
  - Product Collections
  - Cart
  - Checkout con Mercado Pago (Checkout API / Bricks y Checkout Pro)
  - User Accounts
  - Order Details
- Full Next.js 15 support:
  - App Router
  - Next fetching/caching
  - Server Components
  - Server Actions
  - Streaming
  - Static Pre-Rendering

# Quickstart

### Variables de entorno

```shell
cd cuarzosmx-storefront
cp .env.template .env.local
```

Minimo necesario en `.env.local`:

| Variable | Para que sirve |
| --- | --- |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | URL del backend (`http://localhost:9000`) |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | publishable key de Medusa (la imprime `pnpm seed:mx`) |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | public key de Mercado Pago para tokenizar la tarjeta en el navegador |
| `NEXT_PUBLIC_DEFAULT_REGION` | `mx` |

`NEXT_PUBLIC_*` se **inlinea en tiempo de compilacion**: al cambiarlas hay que reiniciar
el dev server.

### Instalar dependencias

El proyecto usa **pnpm**. `package.json` declara `packageManager: pnpm@8.15.4` pero el
lockfile es v9, asi que **todo comando pnpm de este paquete** necesita el flag:

```shell
pnpm --config.manage-package-manager-versions=false install
```

### Desarrollo

```shell
pnpm --config.manage-package-manager-versions=false dev
```

El sitio queda en http://localhost:8000 (redirige a `/mx`).

### Tests E2E

```shell
pnpm --config.manage-package-manager-versions=false test:e2e
```

**Los tests E2E completan una compra real contra el sandbox de Mercado Pago.** Antes de
correrlos hay que leer `tests/README.md`: explica las credenciales, la tarjeta de prueba
MLM y las trampas del Brick.

# Pagos: Mercado Pago

Este storefront **no usa Stripe**. La pasarela es **Mercado Pago**, por dos caminos:

- **Checkout API / CardPayment Brick** ("Pago con tarjeta"): la tarjeta se tokeniza en el
  navegador con `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` y el cobro lo hace el backend.
- **Checkout Pro / Wallet Brick** ("Hasta 12 pagos sin tarjeta con Mercado Pago"):
  redireccion al flujo de Mercado Pago con una preferencia creada por el backend.

```shell
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=<tu-public-key-de-mercado-pago>
```

El provider correspondiente (`pp_mercadopago_mercadopago`) se configura en el backend:
ver `../cuarzosmx/medusa-config.ts` y `../cuarzosmx/README.md`.

**En sandbox, el CardPayment Brick exige credenciales con prefijo `TEST-`** (son las de
una aplicacion de *Checkout API*). Las credenciales de prueba de una aplicacion de
*Checkout Pro* salen como `APP_USR-` y Mercado Pago responde
`401 code 7 Unauthorized use of live credentials`. Es una limitacion **solo de sandbox**:
en produccion Checkout Pro funciona con normalidad, asi que **no hay que cambiar
produccion por esto**. Detalle completo en `tests/README.md`.

`NEXT_PUBLIC_STRIPE_KEY` puede seguir apareciendo en `.env.local` por herencia de la
plantilla: **no se usa**.

# Resources

## Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

## Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)
