# AGENTS.md

## Project Overview
- **Name**: Quero Café Bar
- **Purpose**: Educational system for order management (products, tables, users, kitchen view).
- **Stack**: NestJS 11.x (Backend) + Ionic 8.x Vanilla JS + Vite (Frontend) + MySQL 8.x (DB).
- **Main Workflow**: Admin/Waiters manage products and tables, opening "comandas" (orders) for customers. Kitchen views orders and updates delivery status.

## Dev Commands

### Backend (NestJS)
```bash
cd backend
yarn install
yarn start:dev          # dev server with watch (port 3001)
yarn build              # production build
yarn lint               # ESLint + Prettier
yarn test               # Jest unit tests
yarn make:migration <name>  # Generate migration
yarn migrate            # Run migrations
yarn migrate:rollback   # Revert last migration
yarn seed               # Seed: cria usuarios, mesas, produtos, comanda exemplo
yarn seed:run           # Migrate + Seed
```

### Frontend (Ionic + Vite)
```bash
cd frontend
npm install              # Note: uses npm, not yarn
npm run dev              # dev server (Vite)
npm run build            # web build (outputs to dist/)
npm run build:prod       # production build
npx cap copy             # sync to Android
npx cap open android     # open Android Studio
npx cap run android      # run on device/emulator
npx cap build android    # build APK directly
```

## Architecture

- **Backend**: `backend/src/` - NestJS modules under `src/modules/`
  - Modules: `comanda`, `comanda-item`, `mesa`, `produto`, `usuario`
  - Entry: `src/main.ts`, root module: `src/app.module.ts`
  - Logic: Controllers handle routes, Services handle business logic, Entities define DB schema.
  - Config: `src/config/orm.config.ts` (TypeORM + MySQL)

- **Frontend**: `frontend/src/` - Vanilla JS with Ionic web components
  - Entry: `src/main.js`
  - API service: `src/services/api.js` (singleton with JWT auth)
  - Pages: `src/pages/` (login, home/cozinha, produto, usuario, mesa, comanda)
    - Pages are **Custom Elements** (Web Components) extending `HTMLElement`
    - Home page = Kitchen view with delivery status updates
  - Environments: `src/environments/environment.js` (dev), `environment.prod.js`
  - Shared: `src/shared/Header.js` (menu + header), `src/shared/util.js`

## Available Subagents

Custom subagents configured in `.opencode/agents/`:

| Agent Type | Function | Model |
|------------|----------|-------|
| `exception-treatment-agent` | Audits error handling, try-catch coverage, and HTTP status consistency | opencode/big-pickle |
| `qa-agent` | Generates and analyzes unit tests for NestJS and Ionic | opencode/big-pickle |
| `security-audit-agent` | SAST analysis: SQL injection, hardcoded secrets, CORS, dependency vulnerabilities | opencode/big-pickle |
| `ux-agent` | UX/UI audit, accessibility (WCAG/W3C), mobile-first design patterns | opencode/big-pickle |

Built-in agent types also available:

| Agent Type | Function | Model |
|------------|----------|-------|
| `explore` | Fast codebase exploration, file search, code patterns | opencode/big-pickle |
| `general` | General-purpose research and multi-step tasks | opencode/big-pickle |

Custom slash commands configured in `.opencode/commands/`:

| Command | Function | Model |
|---------|----------|-------|
| `analyze-coverage` | Analyzes test coverage reports and suggests new test cases | opencode/big-pickle |
| `review-changes` | Reviews recent git changes and suggests improvements | opencode/big-pickle |
| `run-tests` | Executes full test suite and fixes failures | opencode/big-pickle |
| `update-docs` | Syncs AGENTS.md and README.md with project state | opencode/big-pickle |

## Important Quirks

- **Package managers differ**: Backend uses `yarn`, frontend uses `npm`
- **Port configuration**: Frontend calls `localhost:3001`, backend configured in `PORT=3001` in `.env`
- **DB migrations required**: `synchronize: false` - always use `migration:generate` before `migration:run`
- **CORS enabled**: Backend allows all origins (`*`) in `main.ts` - configure for production
- **ESLint rule**: `prettier/prettier` uses `endOfLine: "auto"` - do not change line endings manually
- **Ionic loading**: Vite copies Ionic from `node_modules/@ionic/core/dist/ionic/` to `dist/` via `vite-plugin-static-copy`
- **Mobile Development**: Uses Capacitor 8.x for Android. Backend URL in `environment.prod.js` uses `ngrok` or `10.0.2.2` for emulator access.
- **Authentication**: JWT-based using `jsonwebtoken` library (signed with `JWT_SECRET`, 24h expiry). Token stored in `localStorage` and sent in `Authorization: Bearer <token>` header.
- **Password encryption**: AES-256-CTR via `EncryptionTransformer` (TypeORM column transformer) — transparent encrypt/decrypt at ORM level.
- **Global validation**: `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true` — unknown fields rejected with 400.
- **Global exception filter**: `GlobalExceptionFilter` catches unhandled errors and returns sanitized 500 responses.
- **Kitchen View**: Home page displays comandas with item delivery status (red = pending, green = delivered).
- **Perfis**: 0 = Administrador, 1 = Atendente, 2 = Cliente
- **Seed**: Cria 5 usuários, 5 mesas, 11 produtos, e uma comanda de exemplo (Cliente Rodrigo na Mesa 2)

## Test Status

```bash
# Backend — 17 suites, 132 tests passing
cd backend && yarn test

# Frontend — 7 suites, 89 tests passing
cd frontend && npm test
```

## Prerequisites

- Node.js >= 18.x
- MySQL 8.x (or compatible)
- npm >= 9.x
- Java JDK 17+ + Android Studio (for mobile builds)

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **quero-cafe-bar** (4390 symbols, 10871 relationships, 300 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/quero-cafe-bar/context` | Codebase overview, check index freshness |
| `gitnexus://repo/quero-cafe-bar/clusters` | All functional areas |
| `gitnexus://repo/quero-cafe-bar/processes` | All execution flows |
| `gitnexus://repo/quero-cafe-bar/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
