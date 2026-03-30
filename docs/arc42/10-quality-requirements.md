# 10. Quality requirements

Quality goals from [chapter 1](01-introduction-and-goals.md) are made concrete here as testable scenarios.

## 10.1 Quality tree

```
Quality
├── Usability
│   └── Fast entry creation
├── Simplicity
│   └── Zero-infrastructure local setup
├── Maintainability
│   ├── AI-assisted onboarding
│   └── Consistent conventions
└── Correctness
    └── Accurate full-text search results
```

## 10.2 Quality scenarios

| ID   | Quality         | Stimulus                                                                                                              | Response                                                                          | Metric / target                                                               | Chapter 1 goal               |
|:-----|:----------------|:----------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------|:------------------------------------------------------------------------------|:-----------------------------|
| Q-01 | Usability       | Developer opens the entry form and fills in date, project, mood, content, and one tag                                 | Entry is saved and visible in the feed                                            | Complete in under 60 seconds with no documentation                            | Priority 1 — Usability       |
| Q-02 | Simplicity      | Developer clones the repo on a fresh laptop with Java 21 and Node.js 20 installed                                     | Full stack running with `mvn spring-boot:run` + `pnpm dev`, no extra config steps | Zero manual DB setup steps; app starts in under 30 seconds                    | Priority 2 — Simplicity      |
| Q-03 | Maintainability | Developer unfamiliar with the codebase reads `copilot-instructions.md` and asks Copilot to add a new filter parameter | Copilot produces a correct, compiling implementation following existing patterns  | Copilot generates correct code on the first attempt without manual correction | Priority 3 — Maintainability |
| Q-04 | Correctness     | Developer searches for a word that appears in exactly three entry bodies                                              | Search returns those three entries and no others                                  | 100% recall; 0 false positives for exact-word queries                         | Priority 4 — Correctness     |
| Q-05 | Maintainability | A new entity field is added to `DiaryEntry`                                                                           | Field appears in API responses and frontend type definitions                      | No runtime errors; TypeScript compilation passes                              | Priority 3 — Maintainability |

## Done-when

- [ ] Each quality goal from chapter 1 has at least one scenario.
- [ ] Each scenario has a measurable metric or acceptance criterion.
- [ ] Scenarios link back to the relevant chapter 1 quality goal.

