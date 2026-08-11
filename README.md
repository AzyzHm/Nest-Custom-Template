![Nest Template Banner](public/banner.png)

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="https://nestjs.com"><img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"></a>
  <a href="https://typeorm.io"><img src="https://img.shields.io/badge/TypeORM-0.3-D71F00?style=for-the-badge" alt="TypeORM"></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="https://jestjs.io"><img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest"></a>
  <a href="https://github.com/features/actions"><img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions"></a>
</p>

A minimal, well-structured, production-ready **NestJS** backend template layered
(controllers / services / repositories / entities), test-covered, and CI-ready out of the box.

> This is a custom template made by **AzyzHm**.

## Features

- **NestJS 11** with a fully modular, dependency-injected architecture
- **PostgreSQL** via **TypeORM**
- **TypeORM migrations** pre-wired with a standalone CLI data source
- **Layered architecture**: controllers → services (business logic) → repositories (data
  access) → entities
- **DTOs separated from ORM entities**, with a dedicated mapper layer translating between them
- **Centralized exception handling** via a global HTTP exception filter, plus a request
  logging interceptor
- **Environment validation** at bootstrap time (Joi), so missing/malformed config fails fast
- **Full test suite**: unit, integration, and e2e tests in separate folders, with
  integration/e2e backed by an isolated in-memory SQLite database (no external DB needed to
  run tests)
- **GitHub Actions CI**: lint (ESLint + Prettier) + all three test suites on every push/PR
- **No authentication included**: kept minimal on purpose, so you can plug in whatever auth
  strategy fits your project (JWT, sessions, OAuth2, etc.)

## Project Structure

```
nest-custom-template/
├── .github/
│   ├── workflows/ci.yml          # CI: lint + unit/integration/e2e tests + build
│   ├── ISSUE_TEMPLATE/           # Bug report / feature request forms
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml            # Grouped dependency updates
├── src/
│   ├── main.ts                   # App bootstrap: global pipes, filters, prefix
│   ├── app.module.ts             # Root module wiring config, database, and feature modules
│   ├── config/                   # Typed configuration factory + env validation schema
│   ├── common/
│   │   ├── filters/               # Global HTTP exception filter
│   │   ├── interceptors/          # Request logging interceptor
│   │   ├── exceptions/            # Shared domain exceptions
│   │   └── dto/                   # Cross-module shared DTOs (e.g. pagination)
│   ├── database/
│   │   ├── database.module.ts     # TypeORM async registration
│   │   ├── data-source.ts         # Standalone DataSource for the TypeORM CLI
│   │   └── migrations/            # Generated migration files
│   └── modules/
│       └── tasks/                 # Example resource module
│           ├── dto/                # Create / Update / Response DTOs
│           ├── entities/           # TypeORM entity
│           ├── mappers/            # Entity <-> DTO translation
│           ├── tasks.controller.ts
│           ├── tasks.service.ts
│           ├── tasks.repository.ts
│           └── tasks.module.ts
├── test/
│   ├── unit/                     # Isolated logic tests - mocked repositories
│   ├── integration/              # Module-level tests against the in-memory test DB
│   ├── e2e/                      # Full HTTP-stack tests via supertest
│   ├── utils/                    # Shared test helpers (in-memory DB module)
│   └── jest/                     # Per-suite Jest configs
├── public/                       # README banner asset
├── scripts/                      # lint.sh, test.sh helper scripts
├── package.json
├── tsconfig.json / tsconfig.build.json
├── eslint.config.mjs             # Flat config, unified typescript-eslint package
└── .env.example
```

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/AzyzHm/Nest-Custom-Template.git
cd Nest-Custom-Template
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# then edit .env with your local database credentials, etc.
```

### 3. Run database migrations

Make sure PostgreSQL is running and reachable via the `DATABASE_*` variables in your `.env`,
then:

```bash
npm run migration:run
```

To generate a new migration after changing entities:

```bash
npm run migration:generate -- src/database/migrations/DescribeYourChange
```

### 4. Run the app

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1` by default.

## Running Tests

Integration and e2e tests run against an isolated in-memory SQLite database so no external
services needed.

```bash
# By type
npm run test:unit
npm run test:integration
npm run test:e2e

# All three, in order
npm test

# With coverage (same as CI)
bash scripts/test.sh
```

## Linting & Formatting

```bash
bash scripts/lint.sh
```

This runs `eslint` and `prettier --check` and the same checks are enforced in CI.

## Continuous Integration

Every push and pull request to `main` triggers `.github/workflows/ci.yml`, which:

1. Installs dependencies
2. Runs lint checks (ESLint, Prettier)
3. Runs the full test suite (unit → integration → e2e) with coverage, uploaded as a build
   artifact
4. Builds the project to confirm it compiles cleanly

## Adding a New Resource

A typical new resource (e.g. `Product`) touches these layers:

1. `src/modules/product/entities/product.entity.ts`: TypeORM entity
2. `src/modules/product/dto/` — `CreateProductDto` / `UpdateProductDto` / `ProductResponseDto`
3. `src/modules/product/mappers/product.mapper.ts`: entity ↔ DTO translation
4. `src/modules/product/product.repository.ts`: data access, wrapping the TypeORM repository
5. `src/modules/product/product.service.ts`: business logic beyond plain CRUD
6. `src/modules/product/product.controller.ts`: route handlers
7. `src/modules/product/product.module.ts`: wire it together, register with `AppModule`
8. Add the entity to `src/database/database.module.ts` and `src/database/data-source.ts`
9. Add tests under `test/unit`, `test/integration`, and `test/e2e`

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for setup steps
and PR guidelines, and note that this project follows a [Code of Conduct](./CODE_OF_CONDUCT.md).

## Security

Found a vulnerability? Please see [SECURITY.md](./SECURITY.md) for how to report it
responsibly.

## License

This project is licensed under the [MIT License](./LICENSE).

---

Made with care by **AzyzHm**.
