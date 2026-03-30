# 1. Introduction and goals

DevDiary is a personal developer changelog and diary app. It lets individual developers keep a structured record of what
they worked on each day — capturing mood, project context, tags, links, and free-text notes — so they can look back,
search, and filter their history without relying on memory or scattered notes. The app also serves as a live demo for
GitHub Copilot and Claude Code presentations, demonstrating AI-assisted development on a real, working codebase.

## 1.1 Requirements overview

The most important requirements:

- Developers can create, edit, and delete diary entries with a date, project name, mood, free-text content, tags, and
  attached URLs.
- Entries can be browsed in a filterable feed (filter by project, tag, and/or date range).
- Full-text search across entry content returns matching entries immediately.
- Projects and tags are managed independently (create, archive, restore) so that entry forms offer consistent, reusable
  values.
- The app runs locally with zero external infrastructure — no database server, no cloud account required.
- The codebase is kept clean and well-structured so it can serve as a demonstration of AI-assisted development
  practices.

Explicit non-goals:

- Multi-user support or authentication — this is a single-developer, local-only tool.
- Cloud sync or remote hosting — the SQLite file stays on disk.
- Mobile app — a responsive web UI in the browser is sufficient.
- Real-time collaboration or notifications.

## 1.2 Quality goals

| Priority | Quality         | Scenario (short)           | Acceptance criteria                                                                                                            |
|---------:|:----------------|:---------------------------|:-------------------------------------------------------------------------------------------------------------------------------|
|        1 | Usability       | Developer logs a new entry | A new entry can be created, tagged, and saved in under 60 seconds with no instructions needed                                  |
|        2 | Simplicity      | Running locally            | `mvn spring-boot:run` + `pnpm dev` is enough to run the full stack — no database setup, no environment variables required      |
|        3 | Maintainability | Adding a new feature       | A developer unfamiliar with the codebase can add a new API endpoint and matching UI within a single session, guided by Copilot |
|        4 | Correctness     | Search results             | Full-text search returns all entries that contain the query term in their content, with no false positives                     |

## 1.3 Stakeholders

| Stakeholder                               | Expectations                                                                                              |
|:------------------------------------------|:----------------------------------------------------------------------------------------------------------|
| Developer (primary user)                  | Quickly capture and retrieve daily work entries; low friction, fast load                                  |
| Demo audience (conference / presentation) | See a realistic, non-trivial app that demonstrates meaningful Copilot and Claude Code interactions        |
| Future contributors                       | Clear project structure, consistent conventions, and AI-assisted onboarding via `copilot-instructions.md` |

## Done-when

- [ ] A new team member can explain the system after reading this chapter.
- [ ] Non-goals are explicit.
- [ ] There are 3–5 quality goals with at least one measurable criterion each.
- [ ] Stakeholders are mapped to expectations, not just listed.

