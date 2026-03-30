# 7. Deployment view

## 7.1 Infrastructure level 1

> Stub — DevDiary is a local-only development tool. There is no staging or production environment; both processes run on
> the developer's laptop.

```
Developer laptop
├── JVM process (Spring Boot, port 8081)
│   └── devdiary.db  ← SQLite file at project root
└── Node.js process (Vite dev server, port 5173)
    └── Proxies /api/* → http://localhost:8081
```

<!-- TODO: add a diagram if a hosted/containerised deployment is introduced in the future -->

## Done-when

- [ ] Deployment nodes are listed.
- [ ] Port assignments and process boundaries are clear.
- [ ] Any environment-specific configuration differences are noted.

