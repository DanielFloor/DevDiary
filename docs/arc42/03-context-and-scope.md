# 3. Context and scope

## 3.1 Business context

DevDiary sits between a developer using a browser and a local SQLite file on disk. There are no external services, SaaS
integrations, or shared databases.

```
┌────────────────────────────────────────────────────────────────┐
│                          Developer                             │
│                    (browser, localhost:5173)                   │
└───────────────────────────┬────────────────────────────────────┘
                            │ HTTP (REST + JSON)
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                         DevDiary                               │
│         React frontend  ◄────►  Spring Boot backend            │
│         (port 5173)              (port 8081)                   │
└───────────────────────────┬────────────────────────────────────┘
                            │ JDBC (SQLite driver)
                            ▼
                   ┌─────────────────┐
                   │  devdiary.db    │
                   │  (SQLite file)  │
                   └─────────────────┘
```

| Neighbor                    | Direction  | Exchanged value / data                                               |
|:----------------------------|:-----------|:---------------------------------------------------------------------|
| Developer (browser)         | → DevDiary | Create / update / delete / search / filter diary entries             |
| Developer (browser)         | ← DevDiary | Entry lists, single entry details, search results, project/tag lists |
| `devdiary.db` (SQLite file) | ← DevDiary | Persistent storage of entries, tags, projects, links                 |

## 3.2 Technical context

| Interface                                         | Neighbor               | Protocol / format          | Where documented                                                                                    |
|:--------------------------------------------------|:-----------------------|:---------------------------|:----------------------------------------------------------------------------------------------------|
| `/api/entries` REST API                           | React frontend         | HTTP/JSON over localhost   | [DiaryEntryController.java](../../src/main/java/org/dev/diary/controller/DiaryEntryController.java) |
| `/api/projects` REST API                          | React frontend         | HTTP/JSON over localhost   | [ProjectController.java](../../src/main/java/org/dev/diary/controller/ProjectController.java)       |
| `/api/tags` REST API                              | React frontend         | HTTP/JSON over localhost   | [TagController.java](../../src/main/java/org/dev/diary/controller/TagController.java)               |
| Vite dev proxy (`/api` → `http://localhost:8081`) | Vite dev server        | Internal proxy             | [vite.config.ts](../../frontend/vite.config.ts)                                                     |
| SQLite JDBC connection                            | devdiary.db            | JDBC via `org.sqlite.JDBC` | [application.properties](../../src/main/resources/application.properties)                           |
| SQLite FTS5 virtual table                         | SQLite full-text index | SQL `MATCH` queries        | [DiaryEntryService.java](../../src/main/java/org/dev/diary/service/DiaryEntryService.java)          |

## Done-when

- [ ] The system boundary is clear.
- [ ] All external actors and neighboring systems are named.
- [ ] Interfaces are listed with protocol and direction.

