# Correcoes Pendentes

## Corrigidos (17/06/2026)

| # | Bug | Arquivo | Status |
|---|-----|---------|--------|
| 1 | Token JWT nunca enviado apos login | `frontend/src/pages/login/LoginPage.js:65` | ok |
| 2 | Roteamento hash vs history (redirect usa `#/login`) | `frontend/src/services/api.js:55`, `frontend/src/shared/util.js:5` | ok |
| 3 | `ListUsuarioDto` sem `@Type(() => Number)` - query params falham | `backend/src/modules/usuario/dto/list-usuario.dto.ts` | ok |
| 4 | `POST /usuario/login` retorna senha no response | `backend/src/modules/usuario/usuario.controller.ts:59` | ok |
| 5 | Scripts npm usam `yarn` em vez de `npx`/`npm run` | `backend/package.json` | ok |
| 6 | `findByPerfil` usa `findOne` em vez de `find` | `backend/src/modules/usuario/usuario.service.ts` | ok |
| 7 | `IUsuarioUpdateInput.id` obrigatorio mas deveria ser opcional | `backend/src/modules/usuario/interfaces/usuario.interface.ts` | ok |
| 8 | Event listener `ionInput` duplicado a cada abertura de modal | `frontend/src/pages/produto/RegProdutoPage.js`, `UpdateProdutoPage.js` | ok |
| 9 | Acesso a `comanda.mesa.id` e `item.produto.dsc_produto` sem null check | `frontend/src/pages/home/HomePage.js` | ok |

## Corrigidos (20/06/2026)

| # | Bug | Arquivo | Status |
|---|-----|---------|--------|
| 10 | Nenhum guard de autenticacao no backend | `backend/src/modules/auth/jwt-auth.guard.ts` + `APP_GUARD` global + `@Public()` decorator | ok |
| 11 | Senhas com AES reversivel em vez de bcrypt hash | `backend/src/modules/usuario/entities/usuario.entity.ts` -> bcrypt.hash/compare | ok |
| 12 | CORS com wildcard `*` sem controle | `backend/src/main.ts` -> le `CORS_ORIGIN` do .env | ok |
| 13 | Hardcoded fallback secrets sem aviso | `backend/src/modules/auth/auth.module.ts`, `jwt.strategy.ts` -> warnings | ok |
| 14 | `localStorage.clear()` apagando tudo | `frontend/src/services/api.js` -> `removeItem('token')` + `removeItem('user')` | ok |
| 15 | Testes frontend quebrando (jsdom location + clear) | `api.spec.js`, `util.spec.js` | ok |
| 16 | Testes backend (produto.service, usuario.service, usuario.controller) | `*.spec.ts` - mocks ConfigService, findByPerfil retorna array | ok |
| 17 | Testes de rota (hash `#/login` -> `/login`) | `api.spec.js`, `util.spec.js` | ok |
| 18 | `.env.example` desatualizado (PORT=3000, sem CORS_ORIGIN) | `backend/.env.example` | ok |
| 19 | XSS via innerHTML nos cards de imagem Pexels | `RegProdutoPage.js`, `UpdateProdutoPage.js` -> `document.createElement('img')` | ok |
| 20 | `valor_unit` e `qtd_item` sem validacao NaN | `RegProdutoPage.js`, `UpdateProdutoPage.js`, `UpdateComandaPage.js` -> `isNaN()` | ok |
| 21 | Testes mockando propriedades erradas | `LoginPage.spec.js` (`token` -> `access_token`), `ListProdutoPage.spec.js` (`vlr_produto` -> `valor_unit`) | ok |
| 22 | Navegacao FAB com reload completo (quebra SPA) | `ListProdutoPage.js`, `ListUsuarioPage.js`, `ListComandaPage.js`, `ListMesaPage.js` -> `router.push()` | ok |
| 23 | `connectedCallback` sem protecao contra multiplas chamadas | 4 list pages + adicionado flag `_initialized` | ok |
| 24 | `ngrok-skip-browser-warning` incondicional | `api.js` -> condicional a `apiUrl.includes('ngrok')` | ok |
| 25 | Pexels errors com `NotFoundException` (404) em vez de `InternalServerError` | `produto.service.ts` | ok |
| 26 | `POST /usuario/login` sem validacao (usava interface) | `usuario.controller.ts` -> `LoginDto` (classe com decorators) | ok |
| 27 | DOM leak: toasts/alert/loading sem remove() apos dismiss | `shared/overlay.js` (helper) + 12 pages com `showToast/showAlert/showLoading` | ok |
| 28 | `h3` globais vazando em ListProdutoPage.css e ListUsuarioPage.css | Escopado com `.list-produto-container h3` e `.list-usuario-container h3` | ok |
| 29 | `Comanda.findOne()` sem relations (inconsistente com findAll) | `comanda.service.ts` + `.spec.ts` | ok |
| 30 | Build Android (JDK 21 + `npx cap add android`) | `android/` criado, Gradle compila, so falta keystore | ok |
| 31 | Dead files: `EncryptionTransformer`, `encryption.utils`, `LoginUsuarioDto` | Removidos `src/common/encryption/` (4 arquivos) e `login-usuario.dto.ts` | ok |

---

## Pendentes

### Build Android
- [ ] **Build Android falha** -- `invalid source release: 21` (JDK). Pendente de `npx cap add android` e decisao de equipe sobre JDK.

### Medio
- [ ] **Toasts e alerts acumulam-se no DOM (memory leak)** -- 40+ instancias, criar helper ou remover apos dismiss.
- [ ] **Estilos globais `h3` vazam para toda aplicacao** -- escopar com classes.

### Baixo
- [ ] **`Comanda.findOne()` nao carrega relations** -- inconsistente com `findAll()`.
- [ ] **`LoginUsuarioDto` possui campos errados** (`username`/`password` em vez de `usuario`/`senha`).
- [ ] **Porta `PORT` e `DB_PORT` diferentes entre `.env.example` e `.env`** -- sincronizar (verificar se ainda esta pendente).

---

## project-name (Angular) -- Nao relacionado ao Quero Cafe Bar

---

