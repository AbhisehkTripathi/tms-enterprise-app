# TMS Enterprise App – Nx Monorepo

Transportation Management System (TMS) full-stack Nx monorepo: **tms-web** (React) → **tms-api** (Node.js GraphQL) → **shipment-service** (Spring Boot) → Database.

---

## Monorepo structure

```
tms-enterprise-app/
├── package.json              # Root workspace + Nx
├── nx.json                   # Nx configuration
├── README.md
├── .github/
│   └── workflows/
│       └── ci.yml            # CI: lint, build, test (Nx)
│
├── apps/
│   ├── tms-api/              # Node.js GraphQL API (renamed from transporr)
│   │   ├── project.json      # Nx targets: build, serve, test, lint
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── app/
│   │       │   ├── controllers/
│   │       │   ├── services/
│   │       │   ├── models/
│   │       │   ├── validators/
│   │       │   ├── graphschema/
│   │       │   └── middlewares/
│   │       ├── config/
│   │       ├── libs/
│   │       └── routes/
│   │
│   ├── tms-web/              # React TMS frontend
│   │   ├── project.json      # Nx targets: build, serve, lint
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── app/
│   │       │   ├── api/
│   │       │   │   └── protected/   # Protected route wrapper + pages
│   │       │   ├── HomePage.tsx
│   │       │   └── LoginPage.tsx
│   │       ├── components/
│   │       ├── libs/
│   │       ├── styles/
│   │       └── utils/
│   │
│   └── shipment-service/     # Spring Boot Shipment domain service
│       ├── project.json     # Nx targets: build, serve, test
│       ├── pom.xml
│       └── src/
│           ├── main/java/com/tms/shipment/
│           │   ├── ShipmentServiceApplication.java
│           │   └── app/
│           │       ├── controllers/
│           │       ├── services/
│           │       ├── models/
│           │       └── repositories/
│           └── test/java/...
│
└── (no libs/ at root – each app is self-contained)
```

---

## Architecture

```
tms-web (React)  →  GraphQL  →  tms-api (Node.js)  →  REST  →  shipment-service (Spring Boot)  →  DB (H2 / Postgres)
      |                              |                                    |
  app/, components/,            express-graphql,                    Shipment CRUD,
  libs/, styles/, utils/,       auth, RBAC                           persistence
  app/api/protected/
```

### Purpose of each app

| App | Path | Purpose |
|-----|------|--------|
| **tms-web** | `apps/tms-web` | TMS UI: hamburger + horizontal menu, grid/tile views, shipment detail, protected routes. Talks to tms-api via GraphQL. |
| **tms-api** | `apps/tms-api` | GraphQL BFF: auth, RBAC (admin/employee). Exposes **users**, **shipments**, **roles**, **categories**, **storage** via GraphQL only (no MongoDB). In-memory by default; when `SPRING_BOOT_SHIPMENT_URL` is set, delegates shipment CRUD to shipment-service. |
| **shipment-service** | `apps/shipment-service` | Shipment domain service: persistence and business logic. REST `GET/POST/PATCH/DELETE /api/shipments`. H2 in-memory by default; switchable to Postgres. |

---

## Databases

| Service | Database | Notes |
|--------|----------|--------|
| **tms-api** | **In-memory** (default) | Users, roles, categories, storage, shipments are held in memory. No DB required to run. |
| **tms-api** | **PostgreSQL** (optional) | TypeORM is configured in `database.ts`; with `entities: []` the app does not persist to Postgres. Add entities and set `DB_*` in env to use Postgres. |
| **shipment-service** | **H2 in-memory** (default) | `jdbc:h2:mem:shipments`. Data is lost on restart. H2 console: http://localhost:8081/h2-console when running. |
| **shipment-service** | **PostgreSQL** (optional) | Override `spring.datasource.*` in `application.yml` (or profile) to point to Postgres for persistent shipments. |

---

## Environment variables (inter-service)

Use these so the apps can talk to each other when running locally or in one environment.

| App | Env file | Variable | Value | Purpose |
|-----|----------|----------|--------|---------|
| **tms-web** | `apps/tms-web/.env` | `VITE_GRAPHQL_URI` | `http://localhost:3010/api/v1/user` | GraphQL endpoint (tms-api). Default in code is 3010; set only if tms-api runs elsewhere. |
| **tms-api** | `apps/tms-api/.env.development` | `APP_HOST` | `0.0.0.0` | Bind address. |
| **tms-api** | `apps/tms-api/.env.development` | `APP_PORT` | `3010` | Port for GraphQL and REST. tms-web expects this by default. |
| **tms-api** | `apps/tms-api/.env.development` | `SPRING_BOOT_SHIPMENT_URL` | `http://localhost:8081` | Optional. When set, tms-api delegates shipment CRUD to shipment-service. |

**shipment-service** has no env for calling other services; it is the backend. Port is in `apps/shipment-service/src/main/resources/application.yml` (`server.port: 8081`).

**Copy examples:**  
- tms-api: `cp apps/tms-api/.env.example apps/tms-api/.env.development` (then edit).  
- tms-web: `cp apps/tms-web/.env.example apps/tms-web/.env` (only if you need to override the GraphQL URL).

---

## How tms-api and shipment-service (Java backend) interact

- **tms-api** is the API layer the frontend talks to: it exposes **GraphQL** (`/api/v1/user`) and **REST** (`/api/v1/shipment`, etc.). It does **not** store shipment data itself when the Java backend is used.
- **shipment-service** (Java/Spring Boot) is the **backend** that owns shipment persistence (H2 or Postgres). It exposes **REST only**: `GET/POST/PATCH/DELETE /api/shipments` on port **8081**.

**Interaction:**

1. **Frontend** calls **tms-api** (GraphQL or REST) for shipments.
2. **tms-api** checks `SPRING_BOOT_SHIPMENT_URL`:
   - **If set** (e.g. `http://localhost:8081`): tms-api **calls the Java service over HTTP** for every shipment operation.  
     - List → `GET http://localhost:8081/api/shipments?page=...&size=...&sortBy=...`  
     - Get one → `GET http://localhost:8081/api/shipments/{id}`  
     - Create → `POST http://localhost:8081/api/shipments`  
     - Update → `PATCH http://localhost:8081/api/shipments/{id}`  
     - Delete → `DELETE http://localhost:8081/api/shipments/{id}`  
     The logic lives in `apps/tms-api/src/libs/shipmentClient.ts` (axios); `ShipmentService` in `apps/tms-api/src/app/services/shipment.service.ts` uses it when the env is set.
   - **If not set**: tms-api uses **in-memory** shipment data (no Java service involved).

So: **Java service = backend (persistence)**. **tms-api = API gateway** that the frontend calls and that **proxies shipment CRUD to the Java backend** when `SPRING_BOOT_SHIPMENT_URL` is set.

---

## Prerequisites

- **Node.js** 18+ (for tms-api and tms-web)
- **npm** (root and workspace installs)
- **Java 11** (or 17) and **Maven** (for shipment-service)

---

## Quick start

### 1. Install dependencies (root)

From the repo root:

```bash
npm install
```

This installs Nx and workspace packages for `tms-api` and `tms-web`.

### 2. Run with Nx

**Option A – Run one app**

```bash
# Node.js GraphQL API (default port 3010)
npx nx run tms-api:serve

# React frontend (default port 5173)
npx nx run tms-web:serve

# Spring Boot Shipment Service (port 8081)
npx nx run shipment-service:serve
```

**Option B – Root scripts**

```bash
npm run tms-api:serve
npm run tms-web:serve
npm run shipment-service:serve
```

### 3. Build all

```bash
npx nx run-many -t build
# or
npm run build
```

### 4. Test all

```bash
npx nx run-many -t test
# or
npm run test
```

---

## Running the full stack

1. **Start shipment-service** (optional; for persistent shipment data in H2)

   ```bash
   npx nx run shipment-service:serve
   ```

   - REST API: http://localhost:8081/api/shipments  
   - H2 console: http://localhost:8081/h2-console  
   - Database: H2 in-memory (see [Databases](#databases)).

2. **Start tms-api**

   ```bash
   npx nx run tms-api:serve
   ```

   - GraphQL: http://localhost:3010/api/v1/user (headers: `x-role: employee` or `x-role: admin`)
   - REST: http://localhost:3010/api/v1/shipment (and role/category/storage)
   - Port from `apps/tms-api/.env.development` (default 3010).  
   - To use shipment-service: set `SPRING_BOOT_SHIPMENT_URL=http://localhost:8081` in `.env.development` (see [Environment variables](#environment-variables-inter-service)).

3. **Start tms-web**

   ```bash
   npx nx run tms-web:serve
   ```

   - App: http://localhost:5173  
   - Uses tms-api at `http://localhost:3010/api/v1/user` by default; override with `VITE_GRAPHQL_URI` in `apps/tms-web/.env` if needed.

**Flow:** Open app → Login (Employee/Admin) → Shipments (grid/tile) → View details. Data comes from tms-api (in-memory, or via shipment-service when `SPRING_BOOT_SHIPMENT_URL` is set).

---

## Nx commands

| Command | Description |
|--------|-------------|
| `npx nx run tms-api:build` | Build tms-api |
| `npx nx run tms-api:serve` | Run tms-api (dev) |
| `npx nx run tms-web:build` | Build tms-web |
| `npx nx run tms-web:serve` | Run tms-web (dev) |
| `npx nx run shipment-service:build` | Compile shipment-service (Maven) |
| `npx nx run shipment-service:serve` | Run shipment-service (Spring Boot) |
| `npx nx run shipment-service:test` | Run shipment-service tests |
| `npx nx run-many -t build` | Build all apps |
| `npx nx run-many -t test` | Run tests for all apps that have a test target |
| `npx nx graph` | Open dependency graph (if Nx graph is configured) |

---

## CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml`

- **Single job:** Node 20 + Java 17, root `npm install`, then Nx:
  - Lint: `tms-api`, `tms-web` (if lint target exists)
  - Build: `tms-api`, `tms-web`, `shipment-service`
  - Test: `tms-api` (if test script exists), `shipment-service` (Maven)

---

## Renames and paths

- **transporr** → **tms-api** (under `apps/tms-api`)
- **shipment-service** → **apps/shipment-service**
- **tms-web** remains **tms-web** (under `apps/tms-web`)

All references in this README and in CI use the new names and paths.
