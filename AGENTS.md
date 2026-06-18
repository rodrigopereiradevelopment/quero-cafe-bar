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
npm install
npm run start:dev      # dev server with watch (port 3001)
npm run build          # production build
npm run lint           # ESLint + Prettier
npm run test           # Jest unit tests
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource src/config/orm.config.ts migration:generate src/database/migrations/<name>
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource src/config/orm.config.ts migration:run
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource src/config/orm.config.ts migration:revert
npx ts-node -r tsconfig-paths/register src/database/seed.ts  # Seed: cria usuarios, mesas, produtos, comanda exemplo
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

- **Package managers**: Both backend and frontend use `npm` (yarn não está disponível)
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
# Backend — 18 suites, 136 tests passing
cd backend && yarn test

# Frontend — 6 suites, 64 tests passing
cd frontend && npm test
```

## Prerequisites

- Node.js >= 18.x
- MySQL 8.x (or compatible)
- npm >= 9.x
- Java JDK 17+ + Android Studio (for mobile builds)
