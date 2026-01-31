# shipment-service (Java / Spring Boot)

Backend service for the TMS: **shipment** persistence and business logic. Exposes a REST API; **tms-api** (Node.js) calls this service when `SPRING_BOOT_SHIPMENT_URL` is set.

---

## Overview

| Item | Value |
|------|--------|
| **Stack** | Spring Boot 2.7, Java 11, Spring Data JPA, H2 |
| **Port** | 8081 |
| **Base path** | `/api/shipments` |
| **Database** | H2 in-memory (default); optional PostgreSQL |

This service does **not** call other apps. It is the backend that **tms-api** calls over HTTP when you want shipment data persisted (e.g. in H2 or Postgres).

---

## Prerequisites

- **Java 11** (or 17)
- **Maven** 3.6+

Check versions:

```bash
java -version
mvn -version
```

---

## Project structure

```
apps/shipment-service/
├── pom.xml
├── README.md
├── src/main/
│   ├── java/com/tms/shipment/
│   │   ├── ShipmentServiceApplication.java    # Entry point
│   │   └── app/
│   │       ├── controllers/
│   │       │   └── ShipmentController.java    # REST /api/shipments
│   │       ├── models/
│   │       │   ├── Shipment.java              # JPA entity
│   │       │   ├── ShipmentDto.java           # Request/response DTO
│   │       │   └── JsonMapConverter.java      # JSON map ↔ DB column
│   │       ├── repositories/
│   │       │   └── ShipmentRepository.java    # Spring Data JPA
│   │       └── services/
│   │           └── ShipmentService.java       # Business logic
│   └── resources/
│       └── application.yml                   # Port, datasource, JPA
└── src/test/java/...                         # Unit & integration tests
```

---

## Run the service

**From repo root (Nx):**

```bash
npx nx run shipment-service:serve
```

**From this directory (Maven):**

```bash
cd apps/shipment-service
mvn spring-boot:run
```

When it’s up:

- REST API: **http://localhost:8081/api/shipments**
- H2 console: **http://localhost:8081/h2-console** (if enabled in `application.yml`)

---

## REST API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/shipments` | List shipments (paginated). Query: `page`, `size`, `status`, `shipperName`, `carrierName`, `sortBy`, `sortOrder`. |
| `GET` | `/api/shipments/{id}` | Get one shipment by ID. |
| `POST` | `/api/shipments` | Create shipment (body: JSON `ShipmentDto`). |
| `PATCH` | `/api/shipments/{id}` | Update shipment (body: JSON `ShipmentDto`). |
| `DELETE` | `/api/shipments/{id}` | Delete shipment. |

**Example – create shipment:**

```bash
curl -X POST http://localhost:8081/api/shipments \
  -H "Content-Type: application/json" \
  -d '{"shipperName":"Acme","carrierName":"FedEx","pickupLocation":"NY","deliveryLocation":"LA","status":"pending","rate":100}'
```

---

## Database

| Mode | Config | Notes |
|------|--------|--------|
| **H2 in-memory** (default) | `application.yml`: `jdbc:h2:mem:shipments` | Data is lost on restart. H2 console at `/h2-console`. |
| **PostgreSQL** (optional) | Override `spring.datasource.*` in `application.yml` or a profile | Use for persistent shipment data. |

Default `application.yml`:

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:h2:mem:shipments
    driver-class-name: org.h2.Driver
    username: sa
    password:
  h2:
    console:
      enabled: true
  jpa:
    hibernate:
      ddl-auto: create-drop
```

To use PostgreSQL, add (or use a profile) e.g.:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/yourdb
    driver-class-name: org.postgresql.Driver
    username: youruser
    password: yourpass
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
```

(Add `postgresql` dependency in `pom.xml` if not present.)

---

## How tms-api uses this service

1. **tms-api** (Node.js) is the API layer the frontend calls (GraphQL + REST).
2. In tms-api env (e.g. `.env.development`) set:
   ```bash
   SPRING_BOOT_SHIPMENT_URL=http://localhost:8081
   ```
3. When that is set, tms-api forwards every shipment request to this Java service:
   - List → `GET http://localhost:8081/api/shipments?page=...&size=...`
   - Get one → `GET http://localhost:8081/api/shipments/{id}`
   - Create → `POST http://localhost:8081/api/shipments`
   - Update → `PATCH http://localhost:8081/api/shipments/{id}`
   - Delete → `DELETE http://localhost:8081/api/shipments/{id}`

So: **Frontend → tms-api → (HTTP) → this shipment-service (Java) → H2/Postgres.**

See the [root README](../../README.md) section **“How tms-api and shipment-service (Java backend) interact”** for the full flow.

---

## Build & test

```bash
# Build (compile)
mvn compile

# Package (jar)
mvn package -DskipTests

# Run tests
mvn test
```

From repo root with Nx:

```bash
npx nx run shipment-service:build
npx nx run shipment-service:test
```

---

## Configuration summary

| Key | Default | Description |
|-----|--------|-------------|
| `server.port` | 8081 | HTTP port. |
| `spring.datasource.url` | `jdbc:h2:mem:shipments` | H2 in-memory DB. |
| `spring.h2.console.enabled` | true | Enable H2 web console. |
| `spring.jpa.hibernate.ddl-auto` | create-drop | Schema created on start, dropped on shutdown. |

All config is in `src/main/resources/application.yml`. Use profiles (e.g. `application-prod.yml`) or env for different environments.
