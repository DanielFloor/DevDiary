# 12. Glossary

| Term                  | Definition                                                                                                                                                                                  |
|:----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Diary entry**       | A single record capturing what a developer worked on on a given day. Contains date, project, mood, content, tags, and optional links.                                                       |
| **Project**           | A free-text name grouping related entries (e.g. `matrixmind`, `devdiary`). Projects are managed in a dedicated `projects` table with active/archived status.                                |
| **Tag**               | A short label attached to one or more entries (e.g. `java`, `bugfix`). Tags are many-to-many with entries and stored in a dedicated `tags` table.                                           |
| **Link**              | A URL with an optional display label, attached to a single diary entry (one-to-many).                                                                                                       |
| **Mood**              | An enum rating the developer's experience on the day: `GREAT`, `GOOD`, `NEUTRAL`, `TIRED`, `FRUSTRATED`.                                                                                    |
| **FTS5**              | SQLite Full-Text Search version 5 — a built-in SQLite extension that tokenises text and supports fast `MATCH` queries. Used to index the `content` field of diary entries.                  |
| **ADR**               | Architecture Decision Record — a short document capturing a significant architectural choice, its context, and its consequences. See [chapter 9](09-architectural-decisions.md).            |
| **Vite proxy**        | A dev-time feature of Vite that forwards requests matching `/api` from the frontend dev server (port 5173) to the Spring Boot backend (port 8081), avoiding CORS issues during development. |
| **shadcn/ui**         | A component library built on Radix UI primitives, styled with Tailwind CSS. Components are copied into the project rather than installed as a runtime dependency.                           |
| **`ddl-auto=update`** | A Hibernate setting that automatically creates or alters database tables to match the JPA entity model on application startup.                                                              |
| **`VITE_API_URL`**    | An environment variable read by the frontend Axios client to determine the backend base URL. Defaults to `''` (uses Vite proxy) for local development.                                      |

