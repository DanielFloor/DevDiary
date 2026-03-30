# 5. Building block view

## 5.1 Level 1: White-box overall system

DevDiary is a two-tier web application. The frontend is a single-page app served by Vite; the backend is a Spring Boot
REST API backed by a local SQLite file.

```
┌──────────────────────────────────────────────────────────────────┐
│  DevDiary                                                        │
│                                                                  │
│  ┌──────────────────────────┐    HTTP/JSON    ┌───────────────┐  │
│  │  Frontend (React + Vite) │ ◄────────────► │    Backend    │  │
│  │  localhost:5173          │                │  Spring Boot  │  │
│  │                          │                │  localhost:   │  │
│  │  Pages                   │                │    8081       │  │
│  │  ├─ DiaryList            │                │               │  │
│  │  ├─ DiaryEntry (form)    │                │  Controllers  │  │
│  │  ├─ SearchResults        │                │  Services     │  │
│  │  ├─ ProjectsManager      │                │  Repositories │  │
│  │  └─ TagsManager          │                │  Entities     │  │
│  │                          │                └──────┬────────┘  │
│  │  Components              │                       │ JDBC      │
│  │  ├─ EntryCard            │                       ▼           │
│  │  ├─ FilterPanel          │                ┌──────────────┐   │
│  │  ├─ MoodBadge            │                │ devdiary.db  │   │
│  │  ├─ LinkList             │                │ (SQLite)     │   │
│  │  └─ MultiSelectDropdown  │                └──────────────┘   │
│  │                          │                                   │
│  │  api/client.ts           │                                   │
│  └──────────────────────────┘                                   │
└──────────────────────────────────────────────────────────────────┘
```

| Building block                 | Responsibility                                                     | Depends on                            | Notes                                                                    |
|:-------------------------------|:-------------------------------------------------------------------|:--------------------------------------|:-------------------------------------------------------------------------|
| **Frontend / Pages**           | Render UI, manage local state, call API                            | `api/client.ts`, shadcn/ui components | React Router v6 handles navigation                                       |
| **Frontend / `api/client.ts`** | Axios instance; all API functions and shared TypeScript types      | Axios, `VITE_API_URL` env var         | Single source of truth for types and API calls                           |
| **Backend / Controllers**      | Accept HTTP requests, delegate to service, return responses        | Service layer                         | `@CrossOrigin(origins = "*")`; entities returned directly                |
| **Backend / Services**         | Business logic — filtering, FTS search, entity assembly            | Repositories, FTS5 virtual table      | FTS index kept in sync on create/update/delete                           |
| **Backend / Repositories**     | Spring Data JPA queries against SQLite                             | JPA entities, SQLite driver           | Custom JPQL queries for filtering                                        |
| **Backend / Entities**         | JPA-mapped domain objects (`DiaryEntry`, `Tag`, `Link`, `Project`) | Hibernate / SQLite dialect            | `Mood` is a `@Enumerated(STRING)` field                                  |
| **`devdiary.db`**              | Persistent storage (SQLite file at project root)                   | —                                     | Auto-created by Hibernate `ddl-auto=update`; includes FTS5 virtual table |

## 5.2 Level 2: Backend internals

| Package        | Contents                                                     | Role                                                    |
|:---------------|:-------------------------------------------------------------|:--------------------------------------------------------|
| `controller`   | `DiaryEntryController`, `ProjectController`, `TagController` | REST endpoints, request/response mapping                |
| `service`      | `DiaryEntryService`, `ProjectService`, `TagService`          | Business logic, FTS index management                    |
| `repository`   | `DiaryEntryRepository`, `ProjectRepository`, `TagRepository` | Spring Data JPA interfaces                              |
| `model/entity` | `DiaryEntry`, `Tag`, `Link`, `Project`                       | JPA entities                                            |
| `model/enums`  | `Mood`                                                       | Enum: `GREAT`, `GOOD`, `NEUTRAL`, `TIRED`, `FRUSTRATED` |
| `config`       | `JacksonConfig`, `DataBackfillRunner`                        | Jackson date serialisation; startup data migration      |

## Done-when

- [ ] Level 1 includes all neighbors from chapter 3.
- [ ] Each building block has a clear responsibility in one sentence.
- [ ] A new team member can explain "what lives where" after reading this chapter.

