---
name: arc42-bootstrap
description: Bootstrap a complete arc42 architecture baseline with an index page, all 12 chapter files, and supporting project files (editorconfig, markdownlint config, agent guardrail, README link). Use when starting architecture docs for a greenfield or brownfield project.
---

# arc42 Bootstrap

Use this skill when a user asks to start architecture documentation from scratch or to establish a usable arc42
baseline.

## Required inputs

- **System title**: the name of the system being documented.
- **One-sentence description**: what the system does and why it exists.

Everything else is optional. If not supplied, chapters start as stubs. Do not invent content to fill gaps — a stub is
always better than incorrect information. Additional context (stakeholders, constraints, quality goals, neighboring
systems, known decisions) can be supplied and will be used to populate the relevant chapters.

## Workflow

### Phase 1: Confirm inputs and format

1. Collect the two required inputs if not already provided. Ask for both in one message, not one by one.
2. Determine the documentation format:
  - On **brownfield** projects, detect from existing docs: inspect file extensions (`.md`, `.adoc`, `.rst`) and content
    markers (AsciiDoc `=` headings and `|===` tables; reStructuredText underline-style headings `====` / `----`).
  - On **greenfield** projects, ask before generating any files:
    > "What format should architecture docs use? (Markdown, AsciiDoc, reStructuredText, or other)"
  - An explicit format statement from the user overrides detection.
3. Set the documentation home. Default to `docs/arc42/` unless the project already uses a different docs root. In-repo
   docs are preferred for PR-based review loops and traceability.

### Phase 2: Create the arc42 files

Generate files in this order: index first, then chapters 1–12.

Adapt file extensions to the chosen format (`.md` for Markdown, `.adoc` for AsciiDoc, etc.). Use the chosen format
consistently across all files: headings, tables, code blocks, admonitions, and cross-references.

Files to create:

```
docs/arc42/index.md
docs/arc42/01-introduction-and-goals.md
docs/arc42/02-architecture-constraints.md
docs/arc42/03-context-and-scope.md
docs/arc42/04-solution-strategy.md
docs/arc42/05-building-block-view.md
docs/arc42/06-runtime-view.md
docs/arc42/07-deployment-view.md
docs/arc42/08-crosscutting-concepts.md
docs/arc42/09-architectural-decisions.md
docs/arc42/10-quality-requirements.md
docs/arc42/11-risks-and-technical-debt.md
docs/arc42/12-glossary.md
```

Never omit a chapter. An honest stub is better than a missing file.

Apply the "minimal but honest" rule throughout:

- Keep content concise.
- Never fake certainty or invent content.
- Mark unknowns explicitly.
- Link related chapters when statements have cross-chapter impact.

**Heading numbering rule:**

- **Markdown**: include the chapter and section number in every heading text (e.g. `# 1. Introduction and goals`,
  `## 1.1 Requirements overview`). Markdown has no automatic numbering, so numbers must be explicit to be present at
  all.
- **AsciiDoc**: omit all numbers from heading text. The master index document uses `:sectnums:` to generate numbering
  automatically. Chapter files contain plain titles only (e.g. `= Introduction and goals`, `== Requirements overview`).
  This allows numbering to be toggled or reformatted without editing any chapter file. **Exception:** headings that must
  not appear as numbered sections (e.g. `Done-when` checklists) must be prefixed with `[discrete]`, which excludes them
  from both numbering and the TOC.

The skeletons below use Markdown notation. For AsciiDoc, strip all numeric prefixes from headings and convert Markdown
syntax to AsciiDoc equivalents (`#` → `=`, `##` → `==`, etc.). Additionally, prefix every `== Done-when` heading with
`[discrete]` so it is excluded from section numbering and the TOC.

**Starter pack chapters** (1, 2, 3, 5, 6, 9, 10): generate the correct heading hierarchy and named subsections using the
skeletons below. Populate only from supplied input. Leave `<!-- TODO: ... -->` placeholders for anything not supplied.
Do not fill placeholders with invented content.

**Stub chapters** (4, 7, 8, 11): generate the chapter heading with its standard sub-headings, each containing only a
stub notice. Use the per-chapter skeletons below.

**Chapter 12** is also a stub but always includes the table structure; see its dedicated section below.

**Brownfield adjustment:** on brownfield projects, chapters 5, 6, 7, and 12 often have content available immediately.
Capture whatever the team can provide before writing. Chapter 12 should be populated early if the team uses heavy domain
jargon.

#### Index page (index)

The index is the navigation entry point. It contains:

- System name (from required input) as a heading
- One-paragraph purpose statement (from required input) if possible, write this as a scene-setting description.
- Owner field (leave blank if not supplied)
- Last-reviewed date (leave blank; the user sets this after the first review)
- Chapter table

Chapter table shape — no number column; chapter names link to files:

```markdown
| Chapter | Status | Description |
| :------ | :----- | :---------- |
| [Introduction and goals](01-introduction-and-goals.md) | stub | |
| [Architecture constraints](02-architecture-constraints.md) | stub | |
| [Context and scope](03-context-and-scope.md) | stub | |
| [Solution strategy](04-solution-strategy.md) | stub | |
| [Building block view](05-building-block-view.md) | stub | |
| [Runtime view](06-runtime-view.md) | stub | |
| [Deployment view](07-deployment-view.md) | stub | |
| [Cross-cutting concepts](08-crosscutting-concepts.md) | stub | |
| [Architectural decisions](09-architectural-decisions.md) | stub | |
| [Quality requirements](10-quality-requirements.md) | stub | |
| [Risks and technical debt](11-risks-and-technical-debt.md) | stub | |
| [Glossary](12-glossary.md) | stub | |
```

Status values: `stub` (placeholder only), `draft` (in progress, may have gaps), `current` (reasonably complete and up to
date). Set status to `stub` for all chapters unless sufficient input was supplied to write real content, in which case
set `draft`.

**AsciiDoc index:** When the format is AsciiDoc, the index is a master document. Use `:sectnums:` so AsciiDoc generates
chapter and section numbers automatically — do not hard-code numbers into any heading in any file. Numbers can then be
toggled or reformatted without touching the chapter files. Use `include::` directives with `leveloffset=+1` so each
chapter's top-level heading renders as a numbered section within the master doc. The status overview table uses plain
text (no `xref:` links since content is embedded inline):

```asciidoc
= <System Title>
:toc:
:toc-title: Table of Contents
:sectnums:
:sectnumlevels: 3

<One-paragraph purpose statement>

Owner: ::
Last reviewed: ::

== Documentation overview

[cols="2,1,3",options="header"]
|===
| Chapter | Status | Description
| Introduction and goals | stub |
| Architecture constraints | stub |
| Context and scope | stub |
| Solution strategy | stub |
| Building block view | stub |
| Runtime view | stub |
| Deployment view | stub |
| Cross-cutting concepts | stub |
| Architectural decisions | stub |
| Quality requirements | stub |
| Risks and technical debt | stub |
| Glossary | stub |
|===

include::01-introduction-and-goals.adoc[leveloffset=+1]
include::02-architecture-constraints.adoc[leveloffset=+1]
include::03-context-and-scope.adoc[leveloffset=+1]
include::04-solution-strategy.adoc[leveloffset=+1]
include::05-building-block-view.adoc[leveloffset=+1]
include::06-runtime-view.adoc[leveloffset=+1]
include::07-deployment-view.adoc[leveloffset=+1]
include::08-crosscutting-concepts.adoc[leveloffset=+1]
include::09-architectural-decisions.adoc[leveloffset=+1]
include::10-quality-requirements.adoc[leveloffset=+1]
include::11-risks-and-technical-debt.adoc[leveloffset=+1]
include::12-glossary.adoc[leveloffset=+1]
```

Note: `:sectnums:` set at the top of the master document remains active through all `include::` directives. AsciiDoc
numbers the included sections as part of the master document's own numbering pass — do not insert `:!sectnums:` before
the includes.

#### Chapter 1: Introduction and goals

```markdown
# 1. Introduction and goals

<scene-setting description>

> Known unknowns: requirements, quality goals, and stakeholder expectations are not yet documented.

## 1.1 Requirements overview

The most important requirements:

- <!-- TODO: add key requirements -->

Explicit non-goals:

- <!-- TODO: add what this system does NOT do -->

## 1.2 Quality goals

| Priority | Quality | Scenario (short) | Acceptance criteria |
| -------: | :------ | :--------------- | :------------------ |
| <!-- TODO --> | | | |

## 1.3 Stakeholders

| Stakeholder | Expectations |
| :---------- | :----------- |
| <!-- TODO --> | |

## Done-when

- [ ] A new team member can explain the system after reading this chapter.
- [ ] Non-goals are explicit.
- [ ] There are 3–5 quality goals with at least one measurable criterion each.
- [ ] Stakeholders are mapped to expectations, not just listed.
```

#### Chapter 2: Architecture constraints

```markdown
# 2. Architecture constraints

> Known unknowns: constraints have not yet been captured. Add organizational, technical, and integration constraints as
they are identified.

## Organizational constraints

| Constraint | Rationale |
| :--------- | :-------- |
| <!-- TODO --> | |

## Technical constraints

| Constraint | Rationale |
| :--------- | :-------- |
| <!-- TODO --> | |

## Conventions

| Convention | Scope |
| :--------- | :---- |
| <!-- TODO --> | |

## Done-when

- [ ] All non-negotiable constraints are listed.
- [ ] Each constraint has a rationale or source.
- [ ] Constraints that conflict with each other are called out explicitly.
```

#### Chapter 3: Context and scope

```markdown
# 3. Context and scope

> Known unknowns: the system boundary and neighboring systems have not yet been drawn.

## 3.1 Business context

<!-- TODO: diagram showing the system and its business actors or neighboring systems -->

| Neighbor | Direction | Exchanged value / data |
| :------- | :-------- | :--------------------- |
| <!-- TODO --> | | |

## 3.2 Technical context

| Interface | Neighbor | Protocol / format | Where documented |
| :-------- | :------- | :---------------- | :--------------- |
| <!-- TODO --> | | | |

## Done-when

- [ ] The system boundary is clear.
- [ ] All external actors and neighboring systems are named.
- [ ] Interfaces are listed with protocol and direction.
```

#### Chapter 5: Building block view

```markdown
# 5. Building block view

> Known unknowns: the internal structure has not yet been documented.

## 5.1 Level 1: White-box overall system

<!-- TODO: diagram showing main building blocks and their dependencies on external neighbors from chapter 3 -->

| Building block | Responsibility | Depends on | Notes |
| :------------- | :------------- | :--------- | :---- |
| <!-- TODO --> | | | |

## Done-when

- [ ] Level 1 includes all neighbors from chapter 3.
- [ ] Each building block has a clear responsibility in one sentence.
- [ ] A new team member can explain "what lives where" after reading this chapter.
```

#### Chapter 6: Runtime view

```markdown
# 6. Runtime view

> Known unknowns: no runtime scenarios have been documented yet.

## 6.1 <!-- TODO: name the most important flow -->

<!-- TODO: sequence or flow diagram for the most important end-to-end scenario -->

<!-- Add one subsection per scenario that matters. Start with the one scenario everyone must understand. -->

## Done-when

- [ ] The most important end-to-end flow is documented.
- [ ] Each scenario has a diagram and a short narrative.
- [ ] Error paths and degraded modes are noted where they matter.
```

#### Chapter 9: Architectural decisions

```markdown
# 9. Architectural decisions

Significant decisions are captured here. The timeline table is the index; link to inline ADR sections for decisions that
need detail.

| Date | Decision | Status |
| :--- | :------- | :----- |
| <!-- TODO --> | | |

<!-- ADR template — copy for each decision that warrants one:

### ADR-XXX <Decision statement>

- **Date:** YYYY-MM-DD
- **Status:** Pending | Accepted | Superseded by ADR-YYY
- **Decision makers:** <names or roles>

#### Context

<What problem or constraint triggered this decision?>

#### Decision

<One short paragraph: what did we decide?>

#### Consequences

- <what gets better>
- <what gets harder>
- <follow-up work / migration notes>

#### Considered options

1. <option A>
   - **Pros**: <reason>
   - **Cons**: <reason>
2. <option B>
   - **Pros**: <reason>
   - **Cons**: <reason>

#### References

- Affects: chapter 4/5/6/7/8 (optional)
- Related concept: chapter 8.n (optional)
- Related code: <path or repo link> (optional)

-->

## Done-when

- [ ] A scan-friendly timeline table exists.
- [ ] Each entry has at least the decision and a short motivation.
- [ ] Decisions with real trade-offs have considered options recorded.
- [ ] Decisions link to where they show up (chapters 4–8).
```

#### Chapter 10: Quality requirements

```markdown
# 10. Quality requirements

Quality goals from chapter 1 are made concrete here as testable scenarios.

> Known unknowns: quality scenarios have not yet been defined.

## 10.1 Quality tree

<!-- TODO: optional — a tree or map grouping quality goals by category (e.g. reliability > consistency, resilience). Add when the number of quality goals grows beyond ~5. -->

## 10.2 Quality scenarios

| ID | Quality | Stimulus | Response | Metric / target | Chapter 1 goal |
| :- | :------ | :------- | :------- | :-------------- | :------------- |
| Q-01 | <!-- TODO --> | | | | |

## Done-when

- [ ] Each quality goal from chapter 1 has at least one scenario.
- [ ] Each scenario has a measurable metric or acceptance criterion.
- [ ] Scenarios link back to the relevant chapter 1 quality goal.
```

#### Chapter 4: Solution strategy (stub)

arc42 does not define fixed sub-headings for chapter 4. Solution strategy is typically a short narrative that emerges
from the decisions in chapter 9; add structure when the content warrants it.

```markdown
# 4. Solution strategy

> Stub — solution strategy often emerges from early decisions in chapter 9. Add content when the overall approach
becomes clear.
```

#### Chapter 7: Deployment view (stub)

```markdown
# 7. Deployment view

## 7.1 Infrastructure level 1

> Stub — add an overview diagram of the deployment infrastructure and its main nodes (servers, containers, cloud
regions, etc.).

<!-- TODO: diagram showing infrastructure nodes and how the system's building blocks are mapped to them -->
```

#### Chapter 8: Cross-cutting concepts (stub)

arc42 does not mandate fixed sub-headings here; concepts vary by system. Add one subsection per concept area that
matters (e.g. domain model, error handling, persistence, security, observability).

```markdown
# 8. Cross-cutting concepts

> Stub — add one section per reusable concept, pattern, or convention that applies across multiple building blocks.

## <!-- TODO: concept name, e.g. "Error handling" -->

> Stub — describe the concept and how it applies across the system.
```

#### Chapter 11: Risks and technical debt (stub)

```markdown
# 11. Risks and technical debt

## 11.1 Known risks

> Stub — list risks with an impact and likelihood estimate. Update regularly.

| Risk | Impact | Likelihood | Mitigation |
| :--- | :----- | :--------- | :--------- |
| <!-- TODO --> | | | |

## 11.2 Technical debt

> Stub — list known shortcuts or deferred work that affect the architecture.

| Item | Impact | Priority | Notes |
| :--- | :----- | :------- | :---- |
| <!-- TODO --> | | | |
```

#### Chapter 12: Glossary (brownfield priority)

For brownfield projects with heavy domain jargon, populate this chapter early even if other chapters stay as stubs. The
stub version still includes the table structure:

```markdown
# 12. Glossary

| Term | Definition |
| :--- | :--------- |
| <!-- TODO --> | |

> On brownfield projects with heavy domain jargon, populate this chapter early.
> Teams with years of accumulated jargon often have the most misunderstandings around what words mean.
```

### Phase 3: Create config files

#### `.editorconfig`

Check if `.editorconfig` exists at the repo root.

**If it does not exist:** create a repo-wide `.editorconfig`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2
tab_width = 2

[*.md]
trim_trailing_whitespace = false

[*.adoc]
trim_trailing_whitespace = false
```

`trim_trailing_whitespace = false` on `.md` and `.adoc` is intentional: trailing spaces are meaningful in both formats (
Markdown hard line break, AsciiDoc line continuation).

**If it exists:** check whether `.md` or docs files are already covered. If the existing file adequately covers
documentation files, skip and note it to the user. If not, add a `[docs/arc42/**]` section as an override. Do not
overwrite the existing file.

#### `.markdownlint.yaml`

Check if `.markdownlint.yaml`, `.markdownlint.json`, or `.markdownlintrc` exists at the repo root.

**If one already exists:** do not overwrite. Note the existing config to the user and skip creation.

**If none exists:** create `.markdownlint.yaml` at the repo root:

```yaml
MD004:
  style: dash
MD013:
  enabled: false
MD024:
  siblings_only: true
MD029:
  style: ordered
MD049:
  style: underscore
MD050:
  style: asterisk
```

If the chosen format is AsciiDoc: skip `.markdownlint.yaml` entirely and note that markdownlint does not apply to
AsciiDoc files.

### Phase 4: Update or create the agent instruction file

Check for `AGENTS.md`, `CLAUDE.md`, or a `.claude/` directory with an instruction file. Check in this order:
`AGENTS.md`, `CLAUDE.md`, `.claude/AGENTS.md`, `.claude/instructions.md`, `.github/copilot-instructions.md`. Use the
first one found.

**If an instruction file already exists:** read it, then find a logical location for the new section. Prefer adding
after the last top-level `##` section, but before any "General rules" or "Miscellaneous" catch-all section. Do not
remove or overwrite any existing content.

**If no instruction file exists:** create `AGENTS.md` at the repo root containing only the section below. Do not invent
other content.

Section to add:

```markdown
## Architecture guardrails

Before you propose or implement changes:

- Read the arc42 documentation in `docs/arc42/`.
- Treat it as the source of truth for constraints, decisions, and concepts.
- If a request conflicts with the docs, do not "pick a side".
  Explain the conflict and propose a change to the docs (ADR), the code, or both.
```

### Phase 5: Update or create the README

Check for `README.md`, `README.adoc`, or `README.rst` at the repo root.

**If no README exists:** create `README.md` with the system title as an `#` heading, the one-paragraph description, and
the section below. Do not invent other content.

**If a README exists:** search for an existing section that mentions architecture, documentation, or docs. If found,
update it in place to reference the arc42 index. If not found, insert the new section before the first of these
headings (case-insensitive): "Contributing", "License", "Changelog", "Development". If none of those exist, append at
the end. Do not overwrite existing content.

Section to add:

```markdown
## Architecture documentation

This project uses [arc42](https://arc42.org/) to document the software architecture.

Start here: [Architecture documentation](docs/arc42/index.md)
```

### Phase 6: Format generated files

After all files are written, check whether a formatter is configured for the project:

- **Prettier**: look for `.prettierrc`, `.prettierrc.yaml`, `.prettierrc.json`, `.prettierrc.js`, or `prettier` key in
  `package.json`. If found, run Prettier on the generated documentation files. Prettier supports Markdown natively; for
  AsciiDoc, only run it if a Prettier AsciiDoc plugin is listed in the project dependencies.
- **Other formatters**: look for tool-specific config files (e.g. `dprint.json` for dprint). If a formatter is
  configured and covers the generated file types, run it.
- **If no formatter is found**: skip this phase and note it to the user. Do not install a formatter as part of
  bootstrap.

Run the formatter only on the files generated in Phase 2–5. Do not reformat unrelated project files.

## Guardrails

- Do not turn arc42 into a final report produced too late.
- Do not block progress waiting for perfect detail.
- Do not leave constraints or decisions implicit.
- Prefer a stub over invented content at every point in the workflow.
- Every architecture-impacting change should result in a docs update, ADR update, or both.
- Never fake certainty. Mark unknowns explicitly with `<!-- TODO: ... -->` or `> Known unknowns:` notices.
