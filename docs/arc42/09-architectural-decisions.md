# 9. Architectural decisions

Significant decisions are captured here. The timeline table is the index; inline ADR sections provide the detail.

| Date       | Decision                                                              | Status   |
|:-----------|:----------------------------------------------------------------------|:---------|
| 2025-01-01 | ADR-001: Use SQLite as the only data store                            | Accepted |
| 2025-01-01 | ADR-002: Return JPA entities directly from controllers (no DTO layer) | Accepted |
| 2025-01-01 | ADR-003: React + Vite (SPA) over Next.js or server-rendered approach  | Accepted |
| 2025-01-01 | ADR-004: shadcn/ui + Tailwind CSS for the component library           | Accepted |
| 2025-01-01 | ADR-005: SQLite FTS5 for full-text search                             | Accepted |

---

### ADR-001 Use SQLite as the only data store

- **Date:** 2025-01-01
- **Status:** Accepted
- **Decision makers:** Project author

#### Context

DevDiary is a single-developer, local tool. Running PostgreSQL or MySQL adds operational overhead (install, start
service, create user, create DB) that conflicts with the quality goal of zero-infrastructure setup.

#### Decision

Use SQLite via Spring Data JPA (`org.sqlite.JDBC`) with a file-based database (`devdiary.db`) at the project root.
Hibernate's `ddl-auto=update` creates and migrates the schema automatically.

#### Consequences

- Starting the app requires only `mvn spring-boot:run` — no external database setup.
- The SQLite file can be committed, backed up, or deleted as a plain file.
- Concurrent write access is limited by SQLite's file-level locking — acceptable for a single developer.
- Migrating to a server-based database in the future would require updating `application.properties`, swapping the JDBC
  driver, and replacing the SQLite community Hibernate dialect.

#### Considered options

1. **SQLite** ✓ — zero setup, file-based, sufficient for single-user workloads.
2. **H2 in-file mode** — similar simplicity but data lost on schema changes with `ddl-auto=create-drop`.
3. **PostgreSQL** — full-featured but requires a running server process.

#### References

- Affects: [chapter 2](02-architecture-constraints.md) (technical constraints), [chapter 7](07-deployment-view.md)

---

### ADR-002 Return JPA entities directly from controllers (no DTO layer)

- **Date:** 2025-01-01
- **Status:** Accepted
- **Decision makers:** Project author

#### Context

Adding a DTO layer (separate request/response objects, mapper classes) adds boilerplate without clear benefit at this
scale. The entity model is simple and stable; the demo audience benefits from seeing concise, navigable code.

#### Decision

Controllers return JPA entity objects directly. Jackson serialises them to JSON. The `Mood` enum is serialised as its
uppercase string name.

#### Consequences

- Less code — no mapper classes, no separate DTO interfaces.
- Jackson annotations on entities serve double duty as persistence and serialisation config.
- If the entity model diverges significantly from the desired API contract, a DTO layer will be needed. This decision
  should be revisited if the API becomes a public interface.

#### Considered options

1. **Entities directly** ✓ — simplest approach; appropriate for an internal tool.
2. **MapStruct DTOs** — clean separation but significant boilerplate for a small model.

#### References

- Affects: [chapter 5](05-building-block-view.md), [chapter 8](08-crosscutting-concepts.md)

---

### ADR-003 React + Vite (SPA) over Next.js

- **Date:** 2025-01-01
- **Status:** Accepted
- **Decision makers:** Project author

#### Context

The frontend is a pure client-side app — no SEO requirements, no server-side rendering needed. Next.js would add
complexity (file-system routing, SSR concepts) that obscures the demo value of the codebase.

#### Decision

Use React 18 + Vite with React Router v6 for client-side routing. TypeScript throughout. Vite proxies `/api` calls to
the Spring Boot backend in local development.

#### Consequences

- Simple, predictable SPA architecture that Copilot and junior developers can navigate easily.
- No SSR, no static generation — the frontend requires a running backend to be useful.
- Vite's dev proxy means no CORS or port configuration is needed for local development (backend still uses
  `@CrossOrigin` as a safety net).

#### Considered options

1. **React + Vite** ✓ — minimal, familiar, well-supported by Copilot.
2. **Next.js** — adds SSR/SSG complexity without benefit for this use case.
3. **Plain HTML + fetch** — simpler but loses the TypeScript type safety that is valuable for the demo.

---

### ADR-004 shadcn/ui + Tailwind CSS for the component library

- **Date:** 2025-01-01
- **Status:** Accepted
- **Decision makers:** Project author

#### Context

The UI needs to look polished enough for a demo but not consume significant development time on custom styling. A
component library with accessible primitives accelerates development.

#### Decision

Use shadcn/ui (Radix UI primitives) with Tailwind CSS utility classes. Components are copied into the project (not a
runtime dependency) and can be customised freely.

#### Consequences

- Fast, accessible UI with minimal custom CSS.
- Components live in the repo and can be modified; no dependency on a shadcn release cycle.
- Tailwind's utility-class approach works well with Copilot completions.

---

### ADR-005 SQLite FTS5 for full-text search

- **Date:** 2025-01-01
- **Status:** Accepted
- **Decision makers:** Project author

#### Context

Diary entries need to be searchable by content. SQL `LIKE '%query%'` is slow on large datasets and does not support
tokenisation. Elasticsearch or similar is excessive overhead.

#### Decision

Create a SQLite FTS5 virtual table that mirrors the `content` field of `diary_entries`. The service layer updates the
FTS index on every create, update, and delete operation.

#### Consequences

- Fast tokenised full-text search with no external search service.
- FTS index must be kept in sync manually in the service layer — a bug there can cause stale results.
- FTS5 is a SQLite extension; it must be present in the SQLite binary used at runtime (it is included in the standard
  SQLite distribution).

#### References

- Affects: [chapter 6](06-runtime-view.md) (search flow), [chapter 8](08-crosscutting-concepts.md) (FTS5 concept)

---

## Done-when

- [ ] A scan-friendly timeline table exists.
- [ ] Each entry has at least the decision and a short motivation.
- [ ] Decisions with real trade-offs have considered options recorded.
- [ ] Decisions link to where they show up (chapters 4–8).

