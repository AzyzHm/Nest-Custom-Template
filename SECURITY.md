# Security Policy

## Supported Versions

This is a template repository intended as a starting point for new projects, rather than a
long-running published package with versioned releases. Security fixes are applied to the
`main` branch; downstream projects are responsible for pulling in updates from this template
as needed.

| Branch | Supported |
| ------ | --------- |
| main   | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability in this template (for example, in how
authentication hooks, validation, or database access are structured), please **do not**
open a public issue.

Instead, report it privately by emailing **elhammemi001@gmail.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce it, if possible
- Any suggested remediation

You should expect an initial response within **5 business days**. Once a fix is available,
a note will be added to the release/commit history and, where relevant, this document will
be updated.

## Scope

This template ships without any authentication layer by default, by design, so that
consumers can plug in the strategy that fits their project. If you deploy a project based on
this template, review and harden the following before going to production:

- Environment variable handling and secrets management (`.env` is git-ignored by default so
  keep it that way)
- Database credentials and connection settings
- CORS configuration in `src/main.ts`
- Input validation on any new DTOs you add
- Dependency versions (Dependabot is pre-configured to help keep these current)

Thank you for helping keep this project and the people who build on it safe.
