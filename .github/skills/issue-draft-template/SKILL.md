---
name: issue-draft-template
description: Draft GitHub issues using the StudyBuddy+ User Story format. Use this whenever the user asks to create, draft, or refine an issue so the output always follows the same title, user story, acceptance criteria, technical notes, task breakdown, and testing structure.
---

# Issue Draft Template

Use this skill whenever you are drafting an issue document for this repository.

## Goal

Produce a consistent issue draft in `issues/` using a standard structure that is easy to review, test, and hand off to
the task-planning and implementation agents.

## Workflow

1. Gather missing requirements before drafting if the request is ambiguous.
2. Draft the issue in markdown with the exact section order from this skill.
3. Save the draft under `issues/` with a short kebab-case name.
4. Present the draft to the user for approval before creating a GitHub issue.

## Title Rules

- Keep title under 60 characters.
- Start with a verb: `Add`, `Fix`, `Update`, `Implement`, `Refactor`, `Improve`.
- Make the scope specific and actionable.

## Required Output Format

Always use this exact structure:

```markdown
# <Action-oriented title>

## User Story
As a [user type],
I want [goal],
so that [benefit].

## Description
<2-3 sentences describing context, intent, dependencies, and constraints>

## Acceptance Criteria
- [ ] <Specific, testable outcome>
- [ ] <Specific, testable outcome including an edge case>
- [ ] <Specific, testable outcome including validation behavior>

## Technical Notes

### Affected Components

| Component | Layer | Change Description |
|-----------|-------|--------------------|
| ...       | ...   | ...                |

### Data Model Changes

<Describe new or modified entities/fields. State "No data model changes required" if none.>

### API Changes

| Endpoint | Method | Notes |
|----------|--------|-------|
| ...      | ...    | ...   |

### Frontend Changes

<Describe new or modified pages/components and api/client.ts additions. State "No frontend changes required" if none.>

## Task Breakdown

<Ordered task list. Tasks must be ordered by dependency: model → repository → service → controller → frontend.
Each task must be self-contained enough to hand to the task-planning agent individually.
Keep the total between 3 and 7 tasks.>

1. **<Task title>** — <One sentence describing what this task delivers.>
2. **<Task title>** — <One sentence describing what this task delivers.>

## Stacked PR Breakdown

<Group the tasks above into sequential, independently-mergeable PRs.
Each PR must leave the codebase in a passing, deployable state.
Aim for 1–4 tasks per PR; split along natural seams (e.g. backend → frontend).
The final PR merges into `main`; intermediate PRs merge into the PR below them.
Name branches: `feature/{name}/part-{N}-{short-label}`.>

| PR | Branch | Tasks | Merges into |
|----|--------|-------|-------------|
| PR 1 | `feature/<name>/part-1-<label>` | 1, 2 | PR 2's branch |
| PR 2 | `feature/<name>/part-2-<label>` | 3, 4 | `main` |

## Testing Considerations
- Unit tests: <what logic/components/services need unit tests>
- Integration tests: <what end-to-end workflow needs integration coverage>
- Edge cases: <boundary/error/empty-state scenarios to validate>
```

## Task Breakdown Rules

- Order by dependency: entity/migration → repository → service → controller → frontend
- 3–7 tasks total; if more are needed, split the feature into two issues
- No task may mix concerns (e.g. entity creation and controller logic in the same task)
- Each task title must be specific enough to serve as the sole input to the task-planning agent

## Stacked PR Breakdown Rules

- Each PR must build on the previous one (PR 2 branches from PR 1's branch, etc.)
- Each PR must leave the codebase in a passing, deployable state (all tests green)
- Aim for 1–4 tasks per PR; split along natural seams (e.g. backend → frontend → tests)
- The final PR in the stack merges into `main`; intermediate PRs merge into the PR below them
- Branch naming: `feature/{name}/part-{N}-{short-label}`

## Quality Checklist

Before presenting the draft, verify:

- User story clearly states who, what, and why.
- Acceptance criteria are observable and measurable.
- Affected Components table covers all touched layers.
- Data Model Changes, API Changes, and Frontend Changes are filled in or explicitly marked "None".
- Task Breakdown is ordered by dependency and each task is single-concern.
- Stacked PR Breakdown groups tasks into independently-mergeable PRs with correct branch names.
- Testing considerations include happy path and edge cases.
- Any unknowns are listed as explicit assumptions.

## Handling Missing Information

If details are missing, include short assumptions at the end:

```markdown
## Assumptions
- <assumption 1>
- <assumption 2>
```

Keep assumptions minimal and ask the user to confirm them during review.
