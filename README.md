# Contacts

A small contacts directory built as a React + TypeScript practice project. Add people through a validated form and see them grouped A to Z in a phone-directory style list.

> Status: runs fully in the browser against a **mock API** (MSW). There is no real backend yet.

## What it does

- Loads contacts from `GET /api/contacts` and adds new ones with `POST /api/contacts`.
- Groups contacts by first letter, with sticky letter tiles and an A to Z jump rail.
- Validates the form on the client (Zod) and also shows errors the server sends back.
- Handles loading, empty, error (with "Try again") and duplicate-email states.
- A newly added contact flashes briefly so you can see where it landed.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React, TypeScript, Vite |
| Styling | Tailwind CSS 4 with theme tokens, `class-variance-authority` |
| Server state | TanStack Query v5 (`useQuery`, `useMutation`, cache invalidation) |
| Forms | React Hook Form + Zod (`@hookform/resolvers`) |
| Mock API | MSW (browser worker for dev, node server for tests) |
| Tests | Vitest + Testing Library (jsdom) |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173, mock API enabled
npm run typecheck  # tsc -b
npm test           # 18 tests
```

Mock data lives in memory, so it resets when you reload the page.

## Project structure

```
src/
  components/          shared UI (Button, Input, Card, PageLayout)
  features/contacts/   schema, API hooks, form, list, card, page + tests
  lib/api.ts           fetch wrapper with timeout and typed ApiError
  mocks/               MSW handlers (GET/POST, 422 and 409 cases)
  test/                test setup and render helper
```

## Decisions worth knowing

- **Responses are parsed with Zod**, not just trusted after `res.ok`. A wrong-shaped response becomes an error state instead of a crash.
- **`ApiError` carries `status` and `body`**, so the form can map 409 to "email already exists" and 422 to per-field messages.
- **Retries:** TanStack Query never retries 4xx errors and retries other failures at most twice.
- **Accessibility:** labelled inputs, `aria-describedby` for errors and hints, 44px touch targets, visible focus ring, `prefers-reduced-motion` respected.
- **Tests run against the same MSW handlers** as the dev app, so the mock cannot drift from what the tests expect.

## Known limits

- Mock API only, no persistence.
- No edit or delete yet.
- The mock is enabled in development only. A production deploy needs either a real backend or the mock switched on.