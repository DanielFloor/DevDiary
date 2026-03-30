# DevDiary — Design Spec

**Date:** 2026-03-29
**Purpose:** Personal developer changelog / diary app. Serves as a pet project and as a demo app for GitHub Copilot and
Claude Code presentations.

---

## Overview

DevDiary lets developers log what they worked on each day. Entries are tagged by project, searchable by content, and
filterable by date range, project, or tag. The app also demonstrates AI-assisted development using both GitHub Copilot (
in-editor) and Claude Code (CLI).

Future scope (not in initial build): Claude API integration inside the app for features like AI-generated summaries and
tag suggestions.
---

## Stack

| Layer         | Technology                                   |
|---------------|----------------------------------------------|
| Backend       | Spring Boot, Java, Maven                     |
| Database      | SQLite (single `devdiary.db` file)           |
| ORM           | Spring Data JPA + Hibernate (SQLite dialect) |
| Search        | SQLite FTS5 (full-text search)               |
| Frontend      | React + TypeScript, Vite                     |
| UI components | shadcn/ui + Tailwind CSS                     |
| HTTP client   | Axios                                        |

The SQLite `.db` file is persistent on disk — no database server required. Copy or move the file to migrate data.

---

## Data Model

### DiaryEntry

| Field     | Type           | Notes                                       |
|-----------|----------------|---------------------------------------------|
| id        | Long           | Auto-generated primary key                  |
| date      | LocalDate      | Date the work was done                      |
| project   | String         | Free-text project name / category           |
| tags      | List\<Tag\>    | Many-to-many relationship                   |
| content   | String (TEXT)  | Main body — what you worked on              |
| mood      | Mood (enum)    | GREAT / GOOD / NEUTRAL / TIRED / FRUSTRATED |
| links     | List\<Link\>   | One-to-many: associated URLs                |
| createdAt | OffsetDateTime | Auto-set on creation                        |
| updatedAt | OffsetDateTime | Auto-set on update                          |

### Tag

| Field | Type   | Notes                         |
|-------|--------|-------------------------------|
| id    | Long   | Auto-generated                |
| name  | String | Unique tag name (e.g. "java") |

### Link

| Field   | Type   | Notes                  |
|---------|--------|------------------------|
| id      | Long   | Auto-generated         |
| url     | String | The URL                |
| label   | String | Optional display label |
| entryId | Long   | FK to DiaryEntry       |

### Mood (enum)

`GREAT`, `GOOD`, `NEUTRAL`, `TIRED`, `FRUSTRATED`

---

## API Endpoints

| Method | Path                     | Description                           |
|--------|--------------------------|---------------------------------------|
| GET    | `/api/entries`           | List entries (supports filter params) |
| GET    | `/api/entries/search?q=` | Full-text search via SQLite FTS5      |
| GET    | `/api/entries/{id}`      | Get a single entry                    |
| POST   | `/api/entries`           | Create a new entry                    |
| PUT    | `/api/entries/{id}`      | Update an existing entry              |
| DELETE | `/api/entries/{id}`      | Delete an entry                       |

### Filter params for `GET /api/entries`

| Param   | Type   | Example               |
|---------|--------|-----------------------|
| project | String | `?project=matrixmind` |
| tag     | String | `?tag=java`           |
| from    | Date   | `?from=2026-01-01`    |
| to      | Date   | `?to=2026-03-29`      |

---

## Backend Structure

```
backend/
  src/main/java/com/example/devdiary/
    DevDiaryApplication.java
    controller/
      DiaryEntryController.java
    service/
      DiaryEntryService.java
    repository/
      DiaryEntryRepository.java
      TagRepository.java
    model/
      entity/
        DiaryEntry.java
        Tag.java
        Link.java
      enums/
        Mood.java
  src/main/resources/
    application.properties       ← SQLite datasource config
    application-local.properties ← local overrides
```

---

## Frontend Structure

```
frontend/
  src/
    main.tsx
    App.tsx                      ← route definitions
    api/
      client.ts                  ← axios instance
    pages/
      DiaryList/                 ← browseable feed + filter sidebar
      DiaryEntry/                ← create / edit form
      SearchResults/             ← full-text search results
    components/
      EntryCard/                 ← shadcn/ui Card-based entry preview
      FilterPanel/               ← project / tag / date range filters
      MoodBadge/                 ← colored badge for mood value
      LinkList/                  ← render list of links per entry
```

---

## Search

Full-text search is powered by SQLite FTS5. A virtual FTS table mirrors the `content` field of `DiaryEntry`. On
create/update/delete, the FTS index is kept in sync via service logic (or triggers).

Filter queries use standard JPA `Specification` or JPQL with `WHERE` clauses on `project`, tag join, and `date` range.

---

## Future Scope (not in initial build)

- **Claude API integration:** AI-generated daily summary, auto-suggested tags based on content
- **Export:** Markdown or PDF export of entries
- **Stats view:** entries per day/week, mood over time chart
- **Auth:** if self-hosted and shared (basic token auth or local password)
