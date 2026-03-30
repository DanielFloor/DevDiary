# 6. Runtime view

## 6.1 Create a diary entry

The most important flow — a developer fills in the entry form and saves it.

```
Browser (DiaryEntry page)          api/client.ts       Spring Boot backend      SQLite
        │                               │                       │                  │
        │  User fills form,             │                       │                  │
        │  clicks "Save"                │                       │                  │
        │──── createEntry(entry) ──────►│                       │                  │
        │                               │── POST /api/entries ─►│                  │
        │                               │                       │── INSERT diary ──►│
        │                               │                       │   entries         │
        │                               │                       │── INSERT/update ──►│
        │                               │                       │   FTS5 index      │
        │                               │                       │◄─ saved entity ───│
        │                               │◄── 201 Created ───────│                  │
        │◄─── DiaryEntryType ───────────│                       │                  │
        │  Navigate to DiaryList        │                       │                  │
```

**Notes:**

- Tags sent as objects `{ name: "java" }` — the service resolves or creates tag rows.
- FTS5 index is updated in the service layer on every create, update, and delete.
- `createdAt` / `updatedAt` are set by Hibernate `@CreationTimestamp` / `@UpdateTimestamp`.

## 6.2 Search entries

```
Browser (SearchResults page)       api/client.ts       Spring Boot backend      SQLite
        │                               │                       │                  │
        │  User types query,            │                       │                  │
        │  submits search               │                       │                  │
        │──── searchEntries(q) ────────►│                       │                  │
        │                               │── GET /api/entries ──►│                  │
        │                               │   /search?q=...       │                  │
        │                               │                       │── FTS5 MATCH ───►│
        │                               │                       │◄─ matching rows ─│
        │                               │◄── 200 OK ────────────│                  │
        │◄─── DiaryEntryType[] ─────────│                       │                  │
        │  Render result list           │                       │                  │
```

**Notes:**

- FTS5 `MATCH` query runs against the `content` field index.
- Results are returned as the same `DiaryEntry` entity shape used by list and detail endpoints.

## 6.3 Filter entries

```
Browser (DiaryList page)           api/client.ts       Spring Boot backend      SQLite
        │                               │                       │                  │
        │  User selects project/tag/    │                       │                  │
        │  date range in FilterPanel    │                       │                  │
        │──── getEntries(filters) ─────►│                       │                  │
        │                               │── GET /api/entries ──►│                  │
        │                               │   ?project=&tag=&     │                  │
        │                               │   from=&to=           │                  │
        │                               │                       │── JPQL query ───►│
        │                               │                       │◄─ filtered rows ─│
        │                               │◄── 200 OK ────────────│                  │
        │◄─── DiaryEntryType[] ─────────│                       │                  │
        │  Re-render entry feed         │                       │                  │
```

**Notes:**

- All filter parameters are optional; absent params are ignored in the service query.
- Project and tag filters both accept multiple values (multi-select).

## Done-when

- [ ] The most important end-to-end flow is documented.
- [ ] Each scenario has a diagram and a short narrative.
- [ ] Error paths and degraded modes are noted where they matter.

