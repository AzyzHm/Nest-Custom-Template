# Contributing

Thanks for your interest in improving this template! Contributions of all sizes are welcome,
from fixing a typo to proposing a new architectural convention.

## Getting Started

1. Fork the repository and clone your fork
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and adjust it for your local setup:
   ```bash
   cp .env.example .env
   ```
4. Create a branch for your change:
   ```bash
   git checkout -b feat/short-description
   ```

## Development Workflow

- Start the app in watch mode: `npm run start:dev`
- Run the full test suite: `bash scripts/test.sh` (or individually: `npm run test:unit`,
  `npm run test:integration`, `npm run test:e2e`)
- Lint and format before committing: `bash scripts/lint.sh`

## Commit Messages

Please use clear, descriptive commit messages. [Conventional Commits](https://www.conventionalcommits.org/)
(`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`) are encouraged but not strictly
required.

## Pull Requests

- Keep PRs focused on a single change where possible
- Add or update tests for any behavior change
- Make sure CI passes (lint + unit + integration + e2e)
- Fill out the PR template - it's there to save reviewers time, not to slow you down
- Link any related issues

## Code Style

- Follow the existing layered structure: controllers stay thin, business logic lives in
  services, data access lives in repositories, and entity/DTO/mapper boundaries stay
  separate. See the README's "Adding a New Resource" section for the expected shape of a
  new feature.
- Run `npm run lint` before pushing; CI enforces the same checks (ESLint + Prettier).

## Reporting Bugs & Requesting Features

Please use the issue templates provided under **Issues → New Issue** so we get the context
needed to help quickly.

## Code of Conduct

This project follows a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree
to uphold it.

## Questions

Feel free to open a discussion or issue, or reach out at elhammemi001@gmail.com.
