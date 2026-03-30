# 11. Risks and technical debt

## 11.1 Known risks

> Stub — list risks with an impact and likelihood estimate. Update regularly.

| Risk                                                                                           | Impact                                           | Likelihood              | Mitigation                                                                                                          |
|:-----------------------------------------------------------------------------------------------|:-------------------------------------------------|:------------------------|:--------------------------------------------------------------------------------------------------------------------|
| SQLite FTS5 index gets out of sync with entry data (e.g. bug in service layer skips an update) | Medium — search returns stale or missing results | Low                     | Service layer explicitly updates FTS on every mutation; add integration tests for search after create/update/delete |
| `ddl-auto=update` silently fails to apply a breaking schema change                             | Medium — runtime errors or data loss             | Low                     | Test schema migrations manually after any entity model change; consider Flyway if migrations become complex         |
| `@CrossOrigin(origins = "*")` exposes the API to any origin                                    | Low — local tool, no sensitive data, no auth     | Medium (if ever hosted) | Restrict CORS origins before any hosted or shared deployment                                                        |

## 11.2 Technical debt

> Stub — list known shortcuts or deferred work that affect the architecture.

| Item                                                       | Impact                                                      | Priority | Notes                                                                                               |
|:-----------------------------------------------------------|:------------------------------------------------------------|:---------|:----------------------------------------------------------------------------------------------------|
| No DTO layer — entities returned directly from controllers | Medium — entity changes immediately affect the API contract | Low      | Acceptable at current scale; revisit if the API is consumed by external clients                     |
| No automated tests                                         | High — regressions are not caught automatically             | High     | Add unit tests for `DiaryEntryService` (especially FTS sync) and integration tests for the REST API |
| No authentication or authorisation                         | High — if ever hosted, any user can read/modify all entries | Medium   | Add auth before any non-local deployment                                                            |
| `spring.jpa.show-sql=true` in production config            | Low — performance overhead and log noise                    | Low      | Move to a dev-only profile                                                                          |

