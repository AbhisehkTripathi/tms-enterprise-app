# tms-api

Node.js GraphQL API for the Transportation Management System (TMS). Part of the TMS Nx monorepo.

- **API:** GraphQL only at `/api/v1/user` (no MongoDB). Exposes **users**, **shipments**, **roles**, **categories**, **storage** via type-graphql resolvers; data is in-memory by default.
- **GraphQL config:** Schema build, context, and express-graphql handler live in `src/config/graphql.ts`; the route in `src/routes/user.route.ts` mounts the handler. (Backend uses **express-graphql** + **type-graphql**, not Apollo Server.)
- **Optional:** Set `SPRING_BOOT_SHIPMENT_URL` to delegate shipment CRUD to the Spring Boot shipment-service.
- **Path:** `apps/tms-api`
- **Run:** From repo root: `npx nx run tms-api:serve` or `npm run tms-api:serve`
- **Build:** `npx nx run tms-api:build`
- **Test:** `npx nx run tms-api:test`

- **Sample data (seed):** On server start, when using in-memory mode (no `SPRING_BOOT_SHIPMENT_URL`) and the shipment store is empty, 10 sample shipments are seeded so grid, tile, and report views have data. To manually seed against a running server (in-memory or Spring Boot): `npm run seed:api` or `npx nx run tms-api:seed-api` (requires server running and admin role).

See the [root README](../../README.md) for full monorepo documentation, architecture, and run instructions.
