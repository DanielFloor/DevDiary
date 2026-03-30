# DevDiary — AI Coding Agent Instructions

## Project Overview
DevDiary is a personal developer changelog/diary app. Developers log daily work entries tagged by project, searchable by content, and filterable by date range, project, or tag. It also serves as a demo app for GitHub Copilot and Claude Code presentations.

**Stack:**
- **Backend**: Spring Boot (Java, Maven), SQLite via Spring Data JPA + Hibernate, port `8081`
- **Frontend**: React 18 + TypeScript, Vite, Axios, shadcn/ui + Tailwind CSS, port `5173`

## Architecture & Data Flow

### Backend (Spring Boot)
- **Entry Point**: [src/main/java/org/dev/diary/DevDiaryApplication.java](src/main/java/org/dev/diary/DevDiaryApplication.java)
- **Controller**: [src/main/java/org/dev/diary/controller/DiaryEntryController.java](src/main/java/org/dev/diary/controller/DiaryEntryController.java) — standard `@RestController` with `@RequestMapping("/api/entries")`
- **Service Layer**: [src/main/java/org/dev/diary/service/DiaryEntryService.java](src/main/java/org/dev/diary/service/DiaryEntryService.java)
- **Repositories**: [DiaryEntryRepository.java](src/main/java/org/dev/diary/repository/DiaryEntryRepository.java), [TagRepository.java](src/main/java/org/dev/diary/repository/TagRepository.java)
- **Data Storage**: SQLite file (`devdiary.db`) — persistent on disk, no database server required
- **Config**: [src/main/resources/application.properties](src/main/resources/application.properties)
- **CORS**: `@CrossOrigin(origins = "*")` on the controller

### Frontend (React + Vite)
- **API Client**: [frontend/src/api/client.ts](frontend/src/api/client.ts) — Axios instance reading `VITE_API_URL` env var
- **Pages**: `DiaryList` (feed + filter sidebar), `DiaryEntry` (create/edit form), `SearchResults`
- **Components**: `EntryCard`, `FilterPanel`, `MoodBadge`, `LinkList`
- **Routing**: React Router v6 defined in [frontend/src/App.tsx](frontend/src/App.tsx)
- **State Management**: React `useState` only — no Redux/Zustand

## Running Locally

```bash
# Terminal 1: Backend (runs on http://localhost:8081)
mvn spring-boot:run

# Terminal 2: Frontend (runs on http://localhost:5173)
cd frontend
pnpm install
pnpm dev
```

## Data Model

### DiaryEntry
| Field     | Type            | Notes                                        |
|-----------|-----------------|----------------------------------------------|
| id        | Long            | Auto-generated primary key                   |
| date      | LocalDate       | Date the work was done                       |
| project   | String          | Free-text project name / category            |
| tags      | List\<Tag\>     | Many-to-many relationship                    |
| content   | String (TEXT)   | Main body — what you worked on               |
| mood      | Mood (enum)     | GREAT / GOOD / NEUTRAL / TIRED / FRUSTRATED  |
| links     | List\<Link\>    | One-to-many: associated URLs                 |
| createdAt | OffsetDateTime  | Auto-set on creation                         |
| updatedAt | OffsetDateTime  | Auto-set on update                           |

### Tag
| Field | Type   | Notes              |
|-------|--------|--------------------|
| id    | Long   | Auto-generated     |
| name  | String | Unique tag name    |

### Link
| Field   | Type   | Notes                  |
|---------|--------|------------------------|
| id      | Long   | Auto-generated         |
| url     | String | The URL                |
| label   | String | Optional display label |
| entryId | Long   | FK to DiaryEntry       |

## API Endpoints

| Method | Path                      | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/api/entries`            | List entries (supports filter params)|
| GET    | `/api/entries/search?q=`  | Full-text search via SQLite FTS5     |
| GET    | `/api/entries/{id}`       | Get a single entry                   |
| POST   | `/api/entries`            | Create a new entry                   |
| PUT    | `/api/entries/{id}`       | Update an existing entry             |
| DELETE | `/api/entries/{id}`       | Delete an entry                      |

### Filter params for `GET /api/entries`
| Param   | Example               |
|---------|-----------------------|
| project | `?project=matrixmind` |
| tag     | `?tag=java`           |
| from    | `?from=2026-01-01`    |
| to      | `?to=2026-03-29`      |

## Project-Specific Conventions

### Backend Patterns
- **Standard MVC**: Use `@RestController` + `@RequestMapping` — no Minimal API / MapGet patterns
- **Entities directly returned**: No separate DTO layer currently — controllers return entity objects
- **Date serialization**: Handled via [JacksonConfig.java](src/main/java/org/dev/diary/config/JacksonConfig.java)
- **Enum values**: `Mood` values are UPPERCASE in both API and Java (`GREAT`, `GOOD`, etc.)
- **Error responses**: Spring Boot default error format (`timestamp`, `status`, `message`)

### Frontend Patterns
- **API Calls**: Always use functions from [frontend/src/api/client.ts](frontend/src/api/client.ts), never inline Axios calls
- **Types**: All shared types (`DiaryEntryType`, `TagType`, `LinkType`, `Mood`, `EntryFilters`) are defined in [client.ts](frontend/src/api/client.ts)
- **UI Components**: shadcn/ui primitives (Radix UI) styled with Tailwind — no custom component library
- **Base URL**: Set via `VITE_API_URL` env var (defaults to `''` which proxies through Vite dev server, or set to `http://localhost:8081` directly)

## When Adding New Features

1. **Backend**: Add/update method in `DiaryEntryService`, expose via `DiaryEntryController` (or new controller), update entity/repository if model changes
2. **Frontend**: Add/update function in `frontend/src/api/client.ts`, update page/component logic
3. **Types**: Keep `DiaryEntryType` and related interfaces in `client.ts` in sync with backend entity fields

## Common Gotchas

- Backend runs on port `8081` (not 8080) — set `VITE_API_URL=http://localhost:8081` in `frontend/.env.local` if not using Vite proxy
- SQLite `devdiary.db` file lives at project root — `spring.jpa.hibernate.ddl-auto=update` auto-creates/migrates tables on startup
- Date fields: `date` is `LocalDate` (ISO string `YYYY-MM-DD`), `createdAt`/`updatedAt` are `OffsetDateTime` — Jackson serialization configured in `JacksonConfig.java`
- Tags are a many-to-many relationship — send full tag objects `{ name: "java" }` in requests, not just strings
- Full-text search uses SQLite FTS5 on the `content` field — keep FTS index in sync on create/update/delete in the service layer

## Architecture guardrails

Before you propose or implement changes:

- Read the arc42 documentation in `docs/arc42/`.
- Treat it as the source of truth for constraints, decisions, and concepts.
- If a request conflicts with the docs, do not "pick a side".
  Explain the conflict and propose a change to the docs (ADR), the code, or both.

