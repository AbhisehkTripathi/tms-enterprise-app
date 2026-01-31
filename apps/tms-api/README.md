# tms-api

Node.js GraphQL API for the Transportation Management System (TMS). Part of the TMS Nx monorepo.

- **API:** GraphQL only at `/api/v1/user` (no MongoDB). Exposes **users**, **shipments**, **roles**, **categories**, **storage** via type-graphql resolvers; data is in-memory by default.
- **Optional:** Set `SPRING_BOOT_SHIPMENT_URL` to delegate shipment CRUD to the Spring Boot shipment-service.
- **Path:** `apps/tms-api`
- **Run:** From repo root: `npx nx run tms-api:serve` or `npm run tms-api:serve`
- **Build:** `npx nx run tms-api:build`
- **Test:** `npx nx run tms-api:test`

See the [root README](../../README.md) for full monorepo documentation, architecture, and run instructions.
