# Correções Pendentes

## ✅ Corrigidos (17/06/2026)

| # | Bug | Arquivo | Status |
|---|-----|---------|--------|
| 1 | Token JWT nunca enviado após login | `frontend/src/pages/login/LoginPage.js:65` | ✅ |
| 2 | Roteamento hash vs history (redirect usa `#/login`) | `frontend/src/services/api.js:55`, `frontend/src/shared/util.js:5` | ✅ |
| 3 | `ListUsuarioDto` sem `@Type(() => Number)` — query params falham | `backend/src/modules/usuario/dto/list-usuario.dto.ts` | ✅ |
| 4 | `POST /usuario/login` retorna senha no response | `backend/src/modules/usuario/usuario.controller.ts:59` | ✅ |
| 5 | Scripts npm usam `yarn` em vez de `npx`/`npm run` | `backend/package.json` | ✅ |
| 6 | `findByPerfil` usa `findOne` em vez de `find` | `backend/src/modules/usuario/usuario.service.ts` | ✅ |
| 7 | `IUsuarioUpdateInput.id` obrigatório mas deveria ser opcional | `backend/src/modules/usuario/interfaces/usuario.interface.ts` | ✅ |
| 8 | Event listener `ionInput` duplicado a cada abertura de modal | `frontend/src/pages/produto/RegProdutoPage.js`, `UpdateProdutoPage.js` | ✅ |
| 9 | Acesso a `comanda.mesa.id` e `item.produto.dsc_produto` sem null check | `frontend/src/pages/home/HomePage.js` | ✅ |

## ✅ Corrigidos (20/06/2026)

| # | Bug | Arquivo | Status |
|---|-----|---------|--------|
| 10 | Nenhum guard de autenticação no backend | `backend/src/modules/auth/jwt-auth.guard.ts` + `APP_GUARD` global + `@Public()` decorator | ✅ |
| 11 | Senhas com AES reversível em vez de bcrypt hash | `backend/src/modules/usuario/entities/usuario.entity.ts` → bcrypt.hash/compare | ✅ |
| 12 | CORS com wildcard `*` sem controle | `backend/src/main.ts` → lê `CORS_ORIGIN` do .env | ✅ |
| 13 | Hardcoded fallback secrets sem aviso | `backend/src/modules/auth/auth.module.ts`, `jwt.strategy.ts` → warnings | ✅ |
| 14 | `localStorage.clear()` apagando tudo | `frontend/src/services/api.js` → `removeItem('token')` + `removeItem('user')` | ✅ |
| 15 | Testes frontend quebrando (jsdom location + clear) | `api.spec.js`, `util.spec.js` | ✅ |
| 16 | Testes backend (produto.service, usuario.service, usuario.controller) | `*.spec.ts` — mocks ConfigService, findByPerfil retorna array | ✅ |
| 17 | Testes de rota (hash `#/login` → `/login`) | `api.spec.js`, `util.spec.js` | ✅ |

---

## 🚨 Pendentes

### ⏳ Build Android
- [ ] **Build Android falha** — `invalid source release: 21` (JDK). Pendente de `npx cap add android` e decisão de equipe sobre JDK.

### Médio
- [ ] **XSS via innerHTML** — URLs de imagem interpoladas em `innerHTML` sem sanitização.
- [ ] **`valor_unit` e `qtd_item` podem ser `NaN`** — validar com `isNaN()` antes de enviar à API.
- [ ] **Toasts e alerts acumulam-se no DOM (memory leak)** — remover elementos após dismiss.
- [ ] **Testes mockando métodos errados** — `ListProdutoPage.spec.js` usa `vlr_produto`, `LoginPage.spec.js` usa `response.token` (API retorna `access_token`).
- [ ] **Navegação com reload completo em FABs (quebra SPA)** — usar `router.push()` em vez de `window.location.href`.
- [ ] **`connectedCallback` pode ser chamado múltiplas vezes** — adicionar flag `_initialized`.

### Baixo
- [ ] **`ngrok-skip-browser-warning` em produção** — remover ou condicionar ao ambiente dev.
- [ ] **`POST /usuario/login` sem validação de body** — usar `LoginUsuarioDto`.
- [ ] **`Comanda.findOne()` não carrega relations** — inconsistente com `findAll()`.
- [ ] **Pexels errors lançam `NotFoundException` (404) em vez de `InternalServerError`**.
- [ ] **Estilos globais `h3` vazam para toda aplicação** — escopar com classes.
- [ ] **Porta `PORT` e `DB_PORT` diferentes entre `.env.example` e `.env`** — sincronizar.

---

## 🔶 project-name (Angular) — Não relacionado ao Quero Café Bar

---


### Médio
- [ ] **XSS via innerHTML** — URLs de imagem interpoladas diretamente em `innerHTML` sem sanitização.
- [ ] **`valor_unit` e `qtd_item` podem ser `NaN`** — validar com `isNaN()` antes de enviar à API.
- [ ] **Toasts e alerts acumulam-se no DOM (memory leak)** — remover elementos após dismiss.
- [ ] **Testes mockando métodos errados** — `ListProdutoPage.spec.js` usa `vlr_produto` (inexistente), `LoginPage.spec.js` usa `response.token` (API retorna `access_token`).
- [ ] **Navegação com reload completo em FABs (quebra SPA)** — usar `router.push()` em vez de `window.location.href`.
- [ ] **`connectedCallback` pode ser chamado múltiplas vezes (duplicação de listeners)** — adicionar flag `_initialized`.

### Baixo
- [ ] **`ngrok-skip-browser-warning` em produção** — remover ou condicionar ao ambiente dev.
- [ ] **`POST /usuario/login` sem validação de body (usa interface, não classe)** — usar `LoginUsuarioDto`.
- [ ] **`Comanda.findOne()` não carrega relations** — inconsistente com `findAll()`.
- [ ] **Pexels errors lançam `NotFoundException` (404) em vez de `InternalServerError`**.
- [ ] **Estilos globais `h3` vazam para toda aplicação** — escopar com classes.
- [ ] **Porta `PORT` e `DB_PORT` diferentes entre `.env.example` e `.env`** — sincronizar.

---

## 🔶 project-name (Angular)

- [ ] **Server startup frágil** — `throw` dentro do callback do `listen()` (anti-pattern).
- [ ] **Rotas vazias** — `RouterOutlet` importado mas `routes: []` (dead code).
- [ ] **`provideBrowserGlobalErrorListeners` vaza para SSR** via `mergeApplicationConfig`.
- [ ] **`import.meta.dirname` sem fallback** — funciona só no Node 21.2+.

---

**Total de pendências: ~50 itens**
