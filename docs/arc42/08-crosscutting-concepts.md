# 8. Cross-cutting concepts

> Stub — add one section per reusable concept, pattern, or convention that applies across multiple building blocks.

## Date and time serialisation

> Stub — `LocalDate` fields serialise as ISO-8601 strings (`YYYY-MM-DD`). `OffsetDateTime` fields use a custom Jackson
> module configured in `JacksonConfig.java`. Document exact formats and any frontend parsing assumptions here.

## Error handling

> Stub — the backend uses Spring Boot's default error format (`timestamp`, `status`, `message`). Document how the
> frontend handles 4xx/5xx responses and any user-visible error states.

## CORS

> Stub — `@CrossOrigin(origins = "*")` is applied to all REST controllers. This is intentional for a local dev tool.
> Document here if this changes (e.g. when a hosted environment is introduced).

## Full-text search (FTS5)

> Stub — a SQLite FTS5 virtual table indexes the `content` field of diary entries. The service layer keeps the FTS index
> in sync on create, update, and delete. Document the index schema and any known limitations (e.g. minimum token length,
> stop words) here.

## Persistence and schema management

> Stub — Hibernate `ddl-auto=update` manages schema creation and migration automatically on startup. Document any manual
> migration steps required for breaking schema changes here.

