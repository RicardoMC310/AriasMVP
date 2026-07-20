<h1 align="center">Arias MVP</h1>

<p align="center">
  ERP platform designed to help small and medium-sized businesses manage their daily operations — products, customers, orders, suppliers, and financial data.
</p>

<p align="center">
  This repository contains the <strong>MVP version</strong>, focused on validating the product idea and delivering a stable foundation for future improvements.
</p>

---

## Tech Stack

![Node.JS](https://img.shields.io/badge/Node.JS-%23?style=flat-square&logo=nodedotjs&color=%235FA04E&logoColor=%23FFF) ![Postgres](https://img.shields.io/badge/PostgreSQL-%23?style=flat-square&color=%234169E1&logo=postgresql&logoColor=%23FFF) ![Static Badge](https://img.shields.io/badge/Typescript-%2523?style=flat-square&logo=typescript&logoColor=%23FFF&color=%233178C6) ![Static Badge](https://img.shields.io/badge/Kysely%20ORM-%2523?style=flat-square&logoColor=%23FFF&color=%23FF7900) ![Static Badge](https://img.shields.io/badge/Express-%2523?style=flat-square&logo=express&logoColor=%23FFF&color=%230A0A0A) ![Static Badge](https://img.shields.io/badge/Argon2id-%2523?style=flat-square&logoColor=%23FFF&color=%23F4F2E9) ![Static Badge](https://img.shields.io/badge/HandleBars-%2523?style=flat-square&logo=handlebarsdotjs&logoColor=%23FFF&color=%23000000) ![Static Badge](https://img.shields.io/badge/Docker-%2523?style=flat-square&logo=docker&logoColor=%23FFF&color=%232496ED) ![Static Badge](https://img.shields.io/badge/Test%20Containers-%2523?style=flat-square&logo=developmentcontainers&logoColor=%23FFF&color=%232753E3) ![Static Badge](https://img.shields.io/badge/Nodemailer-%2523?style=flat-square&logo=gmail&logoColor=%23FFF&color=%23EA4335) ![Static Badge](https://img.shields.io/badge/Zod-%2523?style=flat-square&logo=zod&logoColor=%23FFF&color=%23408AFF) ![Static Badge](https://img.shields.io/badge/Jest-%2523?style=flat-square&logo=jest&logoColor=%23FFF&color=%23C21325)

---

## Features

- [x] Email verification (code generation, expiration, attempt limiting, token verification)
- [x] User registration with email validation and password hashing
- [x] User authentication with JWT (access token via httpOnly cookie)
- [x] Email sending via SMTP (Nodemailer + Handlebars templates)
- [ ] Role-based access control (RBAC)
- [ ] Product management
- [ ] Customer management
- [ ] Order management
- [ ] Financial module
- [ ] Inventory management

---

## Architecture

The project follows a **modular architecture** inspired by Clean Architecture / Hexagonal Architecture principles. The main goal is delivering a stable and functional product — not over-engineered patterns or micro-optimizations.

### Layer Overview

```
src/
├── core/               Shared domain building blocks (VOs, exceptions, policies, specifications)
├── modules/            Feature modules (user, auth, email-verification, mailer)
│   ├── domain/         Entities, value objects, exceptions, repository interfaces
│   ├── application/    Use cases, ports (interfaces), DTOs (Zod schemas)
│   ├── infrastructure/ Concrete implementations (Kysely repos, Argon2, JWT, Nodemailer)
│   └── presentation/   Express controllers
├── compositor/         Manual dependency injection (factory functions wiring infra → app)
├── platform/           Cross-cutting infrastructure (database, env, Express utils, Zod, mailer)
├── router.ts           Root Express router
└── index.ts            Application entrypoint
```

### Key Architectural Decisions

#### 1. Compositor Pattern (Manual DI)

There is **no DI container** (no InversifyJS, tsyringe, etc.). Instead, each feature module has **compositor factory functions** that manually instantiate infrastructure classes and inject them into use-cases via constructor arguments. The `Kysely<DB>` instance is threaded through from the top-level router factory down to each module.

```
router.compositor.ts
  └─ controller.compositor.ts
       └─ use-case.compositor.ts
            └─ repository.compositor.ts / hasher.compositor.ts / ...
```

This keeps things explicit and avoids framework magic — every dependency is traceable through a single chain of factory calls.

#### 2. Observer Pattern (Cross-Module Side Effects)

Use-cases support `registerObserver()` and `notifyAll()`. This decouples modules that need to react to events from other modules. Each observer type is defined as a dedicated port interface:

- `IEmailVerificationUpdateObserver` — reacts to code creation/resend (triggers email sending)
- `IEmailVerificationVerifyObserver` — reacts to successful verification (triggers user state transition)

**Observer chains:**

- `RegisterUserUseCase` → `CreateEmailVerificationUseCase` (via `IEmailVerificationUpdateObserver`)
- `CreateEmailVerificationUseCase` → `SendMailVerificationUseCase` (via `IEmailVerificationUpdateObserver`)
- `VerifyEmailVerificationUseCase` → state transition observer (via `IEmailVerificationVerifyObserver`)

No event bus needed — observers are registered at composition time.

#### 3. Specification + Policy Pattern

A full specification pattern (`AbstractSpecification<T>`, `And`, `Or`, `Not`) is used for business rule evaluation. `LoginPolicy` wraps `UserActiveSpecification` to determine if a user can log in, keeping domain rules composable and testable.

#### 4. Builder Pattern

All entities use fluent builders (`UserEntityBuilder`, `EmailVerificationEntityBuilder`, `MailEntityBuilder`) with `create()` static factory and `build()` for construction.

#### 5. Value Object Pattern

The `Email` value object wraps email strings with private constructor, static `create()` factory, Zod-based validation, `equals()`, and `toString()`. Used across modules to enforce email validity at the domain level.

#### 6. Port/Adapter Pattern

Application layers define **port interfaces** (`IUserRepository`, `IUserHasher`, `IAuthHasher`, `IMailerTransporter`, `IEmailVerificationCodeGenerator`). Infrastructure provides **adapters**. Domain and application layers never import from infrastructure directly.

#### 7. Standard Response Shape

All API responses follow a consistent structure:

```json
{
  "message": "Human-readable message",
  "code": "SUCCESSFULY",
  "statusCode": 200,
  "data": [],
  "meta": []
}
```

#### 8. Error Handling

Domain exceptions extend `DomainException` with a `CategoryError` enum that maps to HTTP status codes, plus a machine-readable `code` and optional `meta` with contextual data:

| CategoryError  | HTTP Status |
|----------------|-------------|
| `VALIDATION`   | 400         |
| `AUTENTICATE`  | 401         |
| `AUTHORIZATION`| 403         |
| `NOT_FOUND`    | 404         |
| `CONFLICT`     | 409         |
| `RESTORE`      | 502         |

**Error response example:**

```json
{
  "message": "Invalid \"not-an-email\". Please enter a valid email.",
  "code": "INVALID_EMAIL",
  "statusCode": 400,
  "data": [],
  "meta": { "email": "not-an-email is invalid" }
}
```

Unhandled exceptions return **500** with `code: "INTERNAL_ERROR"` and the stack trace logged to the server console.

---

## Running Locally

### Prerequisites

| Tool     | Minimum Version | Purpose                            |
|----------|-----------------|------------------------------------|
| Node.js  | >= 24           | Runtime                            |
| pnpm     | >= 11.12.0      | Package manager                    |
| Docker   | latest          | Postgres, Mailpit, pgAdmin, tests |

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/RicardoMC310/AriasMVP.git
cd AriasMVP

# 2. Install dependencies
cd backend
pnpm install

# 3. Start infrastructure services (Postgres, Mailpit, pgAdmin)
docker compose up -d

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# 5. Run database migrations
pnpm db:migrate

# 6. Generate type
pnpm db:generate

# 7. Build the project
pnpm build

# 8. Start the server
pnpm start
```

The server starts at `http://0.0.0.0:8080` by default.

### Development Mode

For development with hot-reload:

```bash
cd backend
pnpm install
docker compose up -d
pnpm db:migrate
pnpm db:generate
pnpm dev
```

The `pnpm dev` command uses `tsx watch` to automatically restart the server on file changes.

### Running Tests

#### Unit Tests

Unit tests use **in-memory fakes** implementing port interfaces — no external services needed.

```bash
cd backend
pnpm test:unit
```

- Test files match `**/*.unit.test.ts`
- Located alongside source files (co-located)
- Uses Jest with ESM support via `ts-jest`

#### Integration Tests

Integration tests use **Testcontainers** to spin up real PostgreSQL and Mailpit instances in Docker. Migrations are run automatically before tests.

```bash
cd backend
pnpm test:integration
```

- Test files match `**/*.integration.test.ts`
- Automatically starts/stops Docker containers via global setup/teardown
- Writes test database URLs to `.integration.env`

> **Note:** Integration tests require Docker to be running.

### Database Migrations

```bash
# Run all pending migrations
pnpm db:migrate

# Generate TypeScript types from the database schema
pnpm db:generate
```

Migrations are located at `src/platform/database/migrations/` and use Kysely's migration system.

### Docker Services

The `docker-compose.yml` starts three services:

| Service  | Container              | Port(s)    | Purpose                            |
|----------|------------------------|------------|------------------------------------|
| Postgres | `arias-postgres-mvp`   | `5432`     | Database                           |
| pgAdmin  | `arias-pgadmin-mvp`    | `5050`     | Database UI (`admin@admin.com` / `admin`) |
| Mailpit  | `arias-mailpit-mvp`    | `8025` (UI), `1025` (SMTP) | Email testing inbox |

Access the Mailpit inbox at `http://localhost:8025` to view sent emails during development.

---

## Environment Variables

All variables are configured in the `.env` file at the backend root.

| Variable        | Required | Default     | Description                                      |
|-----------------|----------|-------------|--------------------------------------------------|
| `SERVER_HOST`   | No       | `0.0.0.0`   | Server bind address                              |
| `SERVER_PORT`   | No       | `8080`       | Server listen port                               |
| `DATABASE_URL`  | Yes      | -           | PostgreSQL connection string (e.g. `postgresql://postgres:postgres@localhost:5432/arias-erp`) |
| `CORS_ORIGIN`   | No       | `*`         | Allowed CORS origin(s)                           |
| `CORS_METHODS`  | No       | -           | Allowed HTTP methods for CORS                    |
| `CORS_HEADERS`  | No       | -           | Allowed headers for CORS                         |
| `COOKIE_SECRET` | Yes      | -           | Secret for signing cookies                       |
| `COOKIE_SECURE` | Yes      | -           | Set to `true` for HTTPS-only cookies             |
| `JWT_SECRET`    | Yes      | -           | Secret for signing JWT tokens                    |
| `SMTP_HOST`     | Yes      | -           | SMTP server host (e.g. `localhost` for Mailpit)  |
| `SMTP_PORT`     | Yes      | -           | SMTP server port (e.g. `1025` for Mailpit)       |
| `SMTP_SECURE`   | Yes      | -           | Use TLS for SMTP (`true`/`false`)                |
| `SMTP_USER`     | No       | -           | SMTP auth username                               |
| `SMTP_KEY`      | No       | -           | SMTP auth password/key                           |
| `SMTP_FROM_NAME`| Yes      | -           | Sender display name (e.g. `Arias ERP`)           |
| `SMTP_FROM`     | Yes      | -           | Sender email address (e.g. `noreply@arias.com`)  |

---

## Database Schema

PostgreSQL with the following tables (managed by Kysely migrations):

```sql
-- Enum
CREATE TYPE user_state_enum AS ENUM ('VERIFICATION_PENDING', 'ACTIVE', 'BLOCKED');

-- Users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(64) NOT NULL,
  email         VARCHAR(320) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  state         user_state_enum NOT NULL DEFAULT 'VERIFICATION_PENDING'
);

-- Refresh Tokens
CREATE TABLE refresh_token (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refresh_token_hash  TEXT UNIQUE NOT NULL,
  user_id             UUID NOT NULL REFERENCES users(id),
  expires_at          TIMESTAMPTZ NOT NULL
);

-- Email Verification
CREATE TABLE email_verification (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID UNIQUE NOT NULL REFERENCES users(id),
  code_hash TEXT UNIQUE NOT NULL,
  expiresAt TIMESTAMPTZ NOT NULL,
  verified  BOOLEAN DEFAULT false,
  attempts  INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0)
);
```

TypeScript types are auto-generated by `kysely-codegen` into `src/platform/database/db.ts`.

---

## Project Structure (Detailed)

```
backend/
├── .config/
├── src/
│   ├── compositor/                          Dependency injection (manual factories)
│   │   ├── shared/                          Cross-cutting factories
│   │   │   ├── database.compositor.ts
│   │   │   ├── html-compile.compositor.ts
│   │   │   └── mailer-transporter.compositor.ts
│   │   ├── user/
│   │   │   ├── dependencies/
│   │   │   │   ├── hasher.compositor.ts
│   │   │   │   └── repository.compositor.ts
│   │   │   ├── use-cases/
│   │   │   │   ├── register/register.compositor.ts
│   │   │   │   └── find-user-by-email/find-user-by-email.compositor.ts
│   │   │   ├── controller/controller.compositor.ts
│   │   │   └── router/router.compositor.ts
│   │   ├── auth/
│   │   │   ├── dependencies/
│   │   │   │   ├── hasher.compositor.ts
│   │   │   │   └── token-generator.compositor.ts
│   │   │   ├── use-case/login/login.compositor.ts
│   │   │   ├── controller/controller.compositor.ts
│   │   │   └── router/router.compositor.ts
│   │   ├── email-verification/
│   │   │   ├── dependencies/
│   │   │   │   ├── repository.compositor.ts
│   │   │   │   └── code-generator.compositor.ts
│   │   │   ├── use-cases/
│   │   │   │   ├── create-email-verification/create-email-verification.compositor.ts
│   │   │   │   ├── resend-email-verification/resend-email-verification.compositor.ts
│   │   │   │   └── verify-email-verification/verify-email-verification.compositor.ts
│   │   │   ├── controller/controller.compositor.ts
│   │   │   └── router/router.compositor.ts
│   │   └── mailer/
│   │       └── use-case/send-email-verification/send-email-verification.compositor.ts
│   ├── core/domain/                         Shared domain building blocks
│   │   ├── vo/email.vo.ts                   Email Value Object
│   │   ├── exception/                       Base DomainException + shared exceptions
│   │   ├── policies/policy.policy.ts        Policy<T> interface
│   │   └── specifications/                  Full Specification pattern (And, Or, Not)
│   ├── modules/
│   │   ├── user/
│   │   │   ├── domain/                      UserEntity, builder, repository interface, exceptions
│   │   │   ├── application/                 RegisterUserUseCase, FindUserByEmailUseCase, ports, DTOs
│   │   │   ├── infrastructure/              KyselyUserRepository, ArgonUserHasher
│   │   │   └── presentation/                UserController
│   │   ├── auth/
│   │   │   ├── domain/                      LoginPolicy, UserActiveSpecification, exceptions
│   │   │   ├── application/                 AuthLoginUseCase, ports, DTOs
│   │   │   ├── infrastructure/              ArgonAuthHasher, JWTAuthTokenGenerator
│   │   │   └── presentation/                AuthController
│   │   ├── email-verification/
│   │   │   ├── domain/                      EmailVerificationEntity, builder, repository, exceptions
│   │   │   ├── application/                 Create/Resend/Verify EmailVerificationUseCases, ports, DTOs
│   │   │   │   └── port/observers/          IEmailVerificationUpdateObserver, IEmailVerificationVerifyObserver
│   │   │   ├── infrastructure/              KyselyEmailVerificationRepository, EmailVericationCodeGenerator
│   │   │   ├── tests/fakes/                 Fake repository, fake code generator
│   │   │   └── presentation/                EmailVericationController
│   │   └── mailer/
│   │       ├── domain/                      MailEntity, MailEntityBuilder
│   │       ├── application/                 SendMailVerificationUseCase, ports, DTOs
│   │       └── presentation/templates/      Handlebars email templates (.hbs)
│   ├── platform/                            Cross-cutting infrastructure
│   │   ├── database/                        Kysely connection, generated types, migrations
│   │   ├── env/                             Environment variable loader
│   │   ├── express/                         HttpController type, response builder, error middleware
│   │   ├── html-compiler/                   Handlebars template compiler
│   │   ├── mailer/                          Nodemailer connection and transporter
│   │   └── zod/                             Zod result unwrap helper
│   ├── router.ts                            Root Express router
│   └── index.ts                             Application entrypoint
├── tests/                                   Integration test infrastructure
│   └── setup/
│       ├── global-setup.ts
│       ├── global-teardown.ts
│       ├── global-after-env.ts
│       ├── integration-environments.ts
│       ├── containers/                      Testcontainers (Postgres, Mailpit)
│       ├── services/                        Database and mailpit test services
│       └── helpers/                         Migration helpers
├── docker-compose.yml
├── Dockerfile
├── jest.config.unit.mjs
├── jest.config.integration.mjs
├── package.json
├── tsconfig.json
└── .env.example
```

---

## License

MIT
