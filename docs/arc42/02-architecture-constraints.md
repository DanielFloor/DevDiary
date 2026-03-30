# 2. Architecture constraints

## Organizational constraints

| Constraint                            | Rationale                                                                                                                                       |
|:--------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------|
| Open-source, single-developer project | No team processes, no enterprise governance — conventions are set by the project author                                                         |
| Serves as a live demo app             | Code quality and structure matter beyond just "working" — it must be readable and demonstrable in presentations                                 |
| AI-assisted development workflow      | GitHub Copilot and Claude Code are first-class tools; conventions must be consistent enough for AI agents to follow without constant correction |

## Technical constraints

| Constraint                                      | Rationale                                                                                                        |
|:------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------|
| SQLite as the only data store                   | No external database server — the app must run on a developer's laptop with a single file (`devdiary.db`)        |
| Java 21 + Spring Boot 3                         | Chosen backend stack; must stay within Spring Boot 3's dependency and API surface                                |
| Maven 3.9+ as the build tool                    | Project uses Maven; no Gradle or alternative build systems                                                       |
| Node.js 20+ / pnpm 9+                           | Frontend toolchain constraint; pnpm is the package manager of record                                             |
| React 18 + Vite + TypeScript                    | Frontend stack; no Next.js, no server-side rendering                                                             |
| Runs on `localhost` only                        | No TLS, no reverse proxy, no container orchestration assumed for local development                               |
| Backend on port `8081`, frontend on port `5173` | Port assignments are fixed and referenced in `application.properties` and Vite proxy config                      |
| No separate DTO layer                           | Entities are returned directly from controllers — a DTO layer would add complexity without benefit at this scale |

## Conventions

| Convention                                                     | Scope                                                                                                       |
|:---------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------|
| `VITE_API_URL` environment variable                            | Frontend reads API base URL from this env var; defaults to `''` (Vite proxy) for local dev                  |
| `@CrossOrigin(origins = "*")` on all controllers               | CORS is fully open — acceptable for a local-only dev tool                                                   |
| Mood enum values are UPPERCASE everywhere                      | `GREAT`, `GOOD`, `NEUTRAL`, `TIRED`, `FRUSTRATED` — consistent in Java, API responses, and TypeScript types |
| All shared frontend types live in `frontend/src/api/client.ts` | Single source of truth for `DiaryEntryType`, `TagType`, `LinkType`, `Mood`, `EntryFilters`                  |
| All API calls go through `client.ts`                           | No inline Axios calls in components or pages                                                                |

## Done-when

- [ ] All non-negotiable constraints are listed.
- [ ] Each constraint has a rationale or source.
- [ ] Constraints that conflict with each other are called out explicitly.

