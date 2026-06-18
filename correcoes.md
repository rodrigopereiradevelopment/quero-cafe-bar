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

---

## 🚨 A Corrigir (Prioridade)

### Críticos
- [ ] **Nenhum guard de autenticação no backend** — todas as rotas são públicas. Aplicar `@UseGuards(JwtAuthGuard)` nos controllers.
- [ ] **Senhas criptografadas (AES) em vez de hash (bcrypt)** — são reversíveis. Trocar `EncryptionTransformer` por bcrypt.

### Alto
- [ ] **CORS com wildcard `*`** — configurar origens permitidas em produção.
- [ ] **Hardcoded fallback secrets** — `JWT_SECRET` e `ENCRYPTION_KEY` com fallback em texto puro no código.
- [ ] **`localStorage.clear()` apaga todos os dados do app** — substituir por `removeItem` específico.
- [ ] **Build Android falha** — `invalid source release: 21` (JDK incompatível). Requer JDK 21+ ou configurar `compileSdk`/`sourceCompatibility` no Gradle.

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
