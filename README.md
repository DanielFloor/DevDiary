# 📓 DevDiary

Personal developer changelog / diary app. Log what you worked on each day, tag entries by project, search by content, and filter by date range, project, or tag.

Built with **Spring Boot** (Java backend) + **React + Vite** (TypeScript frontend), and used as a live demo app for **GitHub Copilot** and **Claude Code** presentations.

---

## Features

- ✍️ Log daily work entries with mood, tags, links, and free-text content
- 🗂️ Manage projects and tags with **active / archived** status
- 🔍 Full-text search across entry content
- 🎛️ Filter by project (multi-select), tag (multi-select), or date range
- 🔗 Attach URLs with optional labels to any entry

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Java | 21+ |
| Maven | 3.9+ |
| Node.js | 20+ |
| pnpm | 9+ (or npm) |

### 1 — Backend

```bash
# From project root
mvn spring-boot:run
```

- Runs on **http://localhost:8081**
- Auto-creates `devdiary.db` (SQLite) in the project root on first run
- Schema is auto-managed by Hibernate (`ddl-auto=update`)
- On startup, existing project names and tags are automatically backfilled into the managed tables

### 2 — Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

- Runs on **http://localhost:5173**
- Proxies `/api` calls to `http://localhost:8081` via Vite (no `.env` needed for local dev)

To point at a different backend, create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8081
```

---

## Project Structure

```
DevDiary/
├── .github/
│   ├── copilot-instructions.md   # Copilot workspace context
│   ├── agents/                   # Custom Copilot agent definitions
│   ├── prompts/                  # Reusable prompt files
│   └── skills/                   # Copilot skill definitions
├── src/                          # Spring Boot backend
│   └── main/java/org/dev/diary/
│       ├── DevDiaryApplication.java
│       ├── config/               # Jackson, CORS, startup backfill
│       ├── controller/           # REST controllers
│       ├── service/              # Business logic
│       ├── repository/           # Spring Data JPA repositories
│       └── model/                # Entities + enums
├── frontend/                     # React + Vite frontend
│   └── src/
│       ├── api/client.ts         # Axios API client + shared types
│       ├── components/           # EntryCard, FilterPanel, MoodBadge, MultiSelectDropdown …
│       └── pages/                # DiaryList, DiaryEntry, SearchResults, ProjectsManager, TagsManager
├── pom.xml
└── devdiary.db                   # Created at runtime (gitignored)
```

---

## API Reference

### Entries — `/api/entries`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/entries` | List entries (filter params below) |
| GET | `/api/entries?project=x&project=y` | Filter by one or more projects |
| GET | `/api/entries?tag=java&tag=spring` | Filter by one or more tags |
| GET | `/api/entries?from=2026-01-01&to=2026-03-31` | Filter by date range |
| GET | `/api/entries/search?q=` | Full-text search on content |
| GET | `/api/entries/{id}` | Get a single entry |
| POST | `/api/entries` | Create a new entry |
| PUT | `/api/entries/{id}` | Update an existing entry |
| DELETE | `/api/entries/{id}` | Delete an entry |

### Projects — `/api/projects`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects?status=ACTIVE` | List active projects only |
| POST | `/api/projects` | Create a project `{ "name": "..." }` |
| PUT | `/api/projects/{id}` | Update name or status |
| DELETE | `/api/projects/{id}` | Delete a project |

### Tags — `/api/tags`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tags` | List all tags |
| GET | `/api/tags?status=ACTIVE` | List active tags only |
| POST | `/api/tags` | Create a tag `{ "name": "..." }` |
| PUT | `/api/tags/{id}` | Update name or status (ACTIVE / ARCHIVED) |

---

## Data Model

### DiaryEntry

| Field | Type | Notes |
|---|---|---|
| id | Long | Auto-generated |
| date | LocalDate | ISO `YYYY-MM-DD` |
| project | String | Free-text name, linked to managed Project by convention |
| content | TEXT | Main body |
| mood | Mood | `GREAT` / `GOOD` / `NEUTRAL` / `TIRED` / `FRUSTRATED` |
| tags | List\<Tag\> | Many-to-many |
| links | List\<Link\> | One-to-many (url + optional label) |
| createdAt | OffsetDateTime | Auto-set |
| updatedAt | OffsetDateTime | Auto-set |

### Project / Tag

Both have `id`, `name` (unique), and `status` (`ACTIVE` / `ARCHIVED`).  
Archived items are hidden from filter dropdowns and entry forms but existing entries remain unchanged.

---

## Working with GitHub Copilot

This repo is set up as a demonstration of an **AI-assisted development workflow** using GitHub Copilot in agent mode. The `.github/` folder contains everything Copilot needs to work effectively on this codebase.

### Workspace Context — `copilot-instructions.md`

`.github/copilot-instructions.md` gives Copilot a full picture of the project: stack, architecture, data model, API surface, coding conventions, and common gotchas. Copilot reads this automatically in every conversation, so you never have to re-explain the project.

### Custom Agents

Defined in `.github/agents/` — each agent has a focused role in the development lifecycle:

| Agent | Role |
|---|---|
| **Plan** | Researches a GitHub issue and produces a detailed implementation plan |
| **Implementation** | Implements a feature from a plan document; hands off to Testing when done |
| **Refinement** | Drafts well-structured GitHub issues in User Story format |
| **Review** | Performs a code review against issue requirements and best practices |
| **Testing** | Writes tests targeting ≥80% coverage on new/modified files |
| **Task Planning** | Breaks work into an ordered task list for a given feature |

**Typical flow:**

```
Refinement → Plan → Implementation → Testing → Review
```

### Reusable Prompts

Stored in `.github/prompts/` — attach them in Copilot Chat via `#` to run a structured task:

| Prompt | Purpose |
|---|---|
| `generate-plan.prompt.md` | Research a GitHub issue and generate an implementation plan |
| `execute-plan.prompt.md` | Execute an existing implementation plan |
| `generate-test-plan.prompt.md` | Generate a test plan for a feature |
| `generate-code-review-document.prompt.md` | Produce a structured code review document |

### Skills

Stored in `.github/skills/` — Copilot automatically invokes these for matching tasks:

| Skill | Triggered when… |
|---|---|
| `issue-draft-template` | Asked to draft or create a GitHub issue |
| `github-issue-publisher` | Asked to publish an approved issue draft to GitHub |
| `skill-creator` | Asked to create, edit, or evaluate a skill |

### Example: adding a new feature with Copilot

```
1. Ask the Refinement agent to draft a GitHub issue for the feature
2. Publish the issue via the github-issue-publisher skill
3. Ask the Plan agent to research the issue and write an implementation plan
4. Ask the Implementation agent to execute the plan
5. Ask the Testing agent to write tests based on the HANDOFF.md
6. Ask the Review agent to review the changes against the issue requirements
```

All context about the codebase — entities, API patterns, frontend conventions — is already in `copilot-instructions.md`, so each agent starts with full project awareness.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3, Java 21, Spring Data JPA, Hibernate |
| Database | SQLite (file-based, no server required) |
| Frontend | React 18, TypeScript, Vite, Axios |
| UI | shadcn/ui (Radix UI primitives) + Tailwind CSS |
| Routing | React Router v6 |
