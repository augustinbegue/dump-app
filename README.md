# Stack Template

## Before starting developement

- Connect to firebase
  - Edit [`$lib/components/firebase/Init.svelte`](./src/lib/components/firebase/Init.svelte) by adding the firebase web client credentials
  - Edit [`$lib/modules/firebase/init.ts`](./src/lib/modules/firebase/init.ts) by adding the firebase admin sdk credentials

_AND/OR_

- [Configure prisma with the database](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgres)

## To develop

- `npm run dev` ➡️ live dev server
- `npm run preview` ➡️ live production preview
- `npm run test` ➡️ runs tests

## What's in there ?

### Front

- [Sveltekit](https://kit.svelte.dev/) & Typescript 📂 [`./svelte.config.js`](./svelte.config.js) & [`./src`](./src)
- Tailwind w. [daisyUi](https://daisyui.com/) 📂 [`./tailwind.config.cjs`](./tailwind.config.cjs) & [`./playwright.config.ts`](./playwright.config.ts)

### DB

- **Scalable App** [Firebase](https://firebase.google.com/) 📂 [`./src/lib/modules/firebase`](./src/lib/modules/firebase)
- **Cheap App** Postgres w. [Prisma](https://www.prisma.io/) 📂 [`./src/lib/modules/database`](./src/lib/modules/database)

### E2E Tests

- [Playwright](https://playwright.dev/) 📂 [`./tests`](./tests)

### Other APIs not included

- **Email** [SendGrid](https://sendgrid.com/)
- **Search** [Algolia](https://www.algolia.com/)
- **Payments** [Stripe](https://stripe.com/)
