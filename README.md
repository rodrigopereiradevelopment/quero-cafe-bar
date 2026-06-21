# Quero Café Bar ☕

Sistema de gerenciamento para o estabelecimento "Quero Café Bar", desenvolvido como material didático para as aulas dos cursos de Informática (Desenvolvimento de Sistemas e Informática para Internet).

## 🚀 Sobre o Projeto

O projeto visa simular um cenário real de desenvolvimento de software, abrangendo desde a criação de uma API robusta até a interface mobile/web responsiva. O sistema permitirá o controle de pedidos, produtos e atendimento, com visualização específica para a cozinha.

## 🛠️ Tecnologias Utilizadas

### Banco de Dados
- **Tipo:** Relacional
- **Framework de ORM:** [TypeORM](https://typeorm.io/) (TypeScript)
- **Banco de Dados:** [MySQL](https://www.mysql.com) 8.x

### Backend
- **Framework:** [NestJS](https://nestjs.com/) 11.x (Node.js)
- **Linguagem:** TypeScript
- **Gerenciador de Pacotes:** npm
- **Validação:** class-validator, class-transformer
- **Autenticação:** JWT via `@nestjs/jwt` + `@nestjs/passport` (módulo `auth` dedicado, guard global + decorator `@Public()`)
- **Senhas:** bcrypt hash (substituiu o AES-256-CTR anterior)
- **Filtro Global de Erros:** `GlobalExceptionFilter` para respostas sanitizadas

### Frontend
- **Framework:** [Ionic Framework](https://ionicframework.com/) 8.x
- **Base:** JavaScript Vanilla (Web Components)
- **Bundler:** [Vite](https://vitejs.dev/) 7.x
- **Plataforma Mobile:** [Capacitor](https://capacitorjs.com/) 8.x (Android/iOS)
- **Gerenciador de Pacotes:** npm

## 📊 Status do Projeto

### Backend
- [x] Configuração inicial do ambiente NestJS 11.x
- [x] Estrutura básica do projeto (modular)
- [x] Implementação do módulo de Produtos (CRUD)
- [x] Implementação do módulo de Usuários (CRUD + Login)
- [x] Implementação do módulo de Mesas (CRUD)
- [x] Implementação do módulo de Comandas (CRUD)
- [x] Implementação do módulo de Itens de Comanda (CRUD)
- [x] Integração com Banco de Dados (TypeORM + MySQL)
- [x] Autenticação JWT implementada (módulo `auth` com `@nestjs/jwt` + Passport)
- [x] Guard global `JwtAuthGuard` + decorator `@Public()` para rotas abertas
- [x] Senhas com bcrypt hash (substituiu AES-256-CTR)
- [x] Route guards no frontend (páginas protegidas por autenticação)
- [x] Utilitários de autenticação (`shared/auth.js`)
- [x] Relacionamentos entre entidades configurados
- [x] Testes unitários completos (146 testes, 19 suítes)
- [x] Tratamento global de exceções
- [x] Validação global (whitelist + transform)
- [x] **Seed turbinado**: 5 usuários, 5 mesas, 11 produtos + comanda de exemplo
- [x] **Perfil Cliente (2)** adicionado ao sistema
- [x] CORS lê `CORS_ORIGIN` do .env (fallback `*` com warning)
- [x] Warnings para fallback de `JWT_SECRET` e `ENCRYPTION_KEY`
- [x] `localStorage.removeItem('token')` em vez de `clear()` no 401
- [x] Correção: `ListUsuarioDto` com `@Type(() => Number)` para query params
- [x] Correção: `POST /usuario/login` não retorna mais a senha
- [x] Correção: scripts migratórios usam `npx` em vez de `yarn`

### Frontend
- [x] Configuração inicial do ambiente Ionic + Vite
- [x] Estrutura básica do projeto (Web Components)
- [x] Implementação das páginas de Produtos (List, Register, Update)
- [x] Implementação das páginas de Usuários (List, Register, Update)
- [x] Implementação das páginas de Mesas (List, Register, Update)
- [x] Implementação das páginas de Comandas (List, Register, Update)
- [x] Tela de Login funcional
- [x] Tela da Cozinha (Home) com status de entrega
- [x] Menu lateral de navegação
- [x] Integração com a API (Serviço singleton)
- [x] Feedback visual (toast, alert, loading)
- [x] Build para Android configurado (Capacitor)
- [x] Correção: token JWT enviado corretamente após login (`api.setToken`)
- [x] Correção: roteamento sem hash (`/login` em vez de `#/login`)
- [ ] Temas personalizados
- [x] Testes unitários (89 testes, 7 suítes)
- [x] **Perfil Cliente (2)** nas telas de cadastro/edição/lista
- [x] **Busca de imagens Pexels** no cadastro de produtos
- [x] **Thumbnails** na lista de produtos
- [x] `localStorage.removeItem` no 401 (em vez de `clear()`)
- [x] Testes adaptados para jsdom (location + localStorage.assert)

## 📂 Estrutura de Pastas

```
quero-cafe-bar/
├── /backend          # API REST desenvolvida em NestJS 11.x
│   ├── src/
│   │   ├── modules/      # Módulos: auth, comanda, comanda-item, mesa, produto, usuario
│   │   ├── config/       # Configuração TypeORM
│   │   └── main.ts       # Entry point
│   └── package.json
│
├── /frontend         # Aplicação mobile/web desenvolvida em Ionic + Vite
│   ├── src/
│   │   ├── pages/        # Páginas (Web Components)
│   │   ├── services/     # API service
│   │   ├── shared/       # Header, auth, utilitários
│   │   └── environments/ # Configurações dev/prod
│   └── package.json
│
├── setup.ps1          # Script de setup one-click
├── AGENTS.md          # Documentação para agentes de IA
└── STEPS.md           # Guia de configuração passo a passo
```

## 🚀 Setup Automático (Recomendado)

Execute o script `setup.ps1` na raiz do projeto que faz tudo de uma vez:

```powershell
.\setup.ps1
```

Ele inicia o MySQL, instala dependências, roda migrations, seed, e sobe ambos os servidores.

---

## 💻 Como executar manualmente

### Backend

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências (nota: usa **npm**, **não** yarn):
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` (já incluso no repositório, ajuste se necessário).

4. Execute as migrations e seed do banco de dados:
   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource src/config/orm.config.ts migration:run
   npx ts-node -r tsconfig-paths/register src/database/seed.ts
   ```

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```

O backend estará disponível em `http://localhost:3001`.

### Frontend (Web)

1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento (Vite):
   ```bash
   npm run dev
   ```

A aplicação web estará disponível em `http://localhost:5173`.

### Gerando Build para Android

1. Realize o build de produção:
   ```bash
   npm run build:prod
   ```

2. Sincronize os arquivos com o Capacitor:
   ```bash
   npx cap sync android
   ```

3. Abra no Android Studio ou execute diretamente:
   ```bash
   npx cap open android
   # ou
   npx cap run android
   ```

4. Para gerar o APK diretamente:
   ```bash
   npx cap build android
   ```

## 🤖 Agentes Disponíveis

Este projeto possui configurações para agentes de IA no arquivo [AGENTS.md](./AGENTS.md).

| Agente | Função | Modelo |
|--------|--------|--------|
| `explore` | Exploração rápida de código, busca de arquivos e padrões | opencode/big-pickle |
| `general` | Pesquisa geral e tarefas multi-step | opencode/big-pickle |
| `exception-treatment-agent` | Auditoria de tratamento de exceções e resiliência | opencode/big-pickle |
| `qa-agent` | Geração e análise de testes unitários (NestJS + Ionic) | opencode/big-pickle |
| `security-audit-agent` | Análise de segurança SAST (SQLi, segredos, CORS) | opencode/big-pickle |
| `ux-agent` | Auditoria de UX/UI e acessibilidade (WCAG/W3C) | opencode/big-pickle |

## 🔑 Credenciais Padrão (Seed)

| Usuário | Senha | Perfil |
|---------|-------|--------|
| admin | admin | Administrador |
| garcom | garcom | Atendente |
| atendente | atendente | Atendente |
| rodrigo | rodrigo | Cliente |
| maria | maria | Cliente |

**Perfis:** 0 = Administrador, 1 = Atendente, 2 = Cliente

---

## 🔧 Pré-requisitos

- **Node.js** >= 18.x
- **MySQL** 8.x (XAMPP ou servidor próprio)
- **npm** >= 9.x (para backend e frontend)
- **Java JDK** 17+ + **Android Studio** (para builds mobile)
- **Git** para controle de versão

## 📝 Scripts Disponíveis

### Raiz
| Comando | Descrição |
|---------|-----------|
| `.\setup.ps1` | Setup completo one-click (MySQL + deps + migrate + seed + servidores) |

### Backend (npm — yarn não está disponível)
| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Servidor com hot-reload |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint + Prettier |
| `npm test` | Jest unit tests (146 testes) |
| `npx ts-node src/database/seed.ts` | Seed: cria usuários, mesas, produtos e comanda exemplo |
| `npx ts-node src/database/seed-mesas.ts --qtd 10 --cadeiras 4` | Adicionar mesas customizadas |

### Frontend (npm)
| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor Vite (desenvolvimento) |
| `npm run build` | Build web |
| `npm run build:prod` | Build de produção |
| `npm test` | Jest unit tests (89 testes) |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npx cap sync` | Sincronizar com Capacitor |

## 🎨 Funcionalidades da Cozinha

A página inicial (Home) serve como visualização da cozinha:
- Lista todas as comandas em formato de cards
- Exibe número da comanda, mesa e lista de itens
- **Status visual**: Itens pendentes (vermelho) e entregues (verde)
- Select boxes para alterar status de entrega
- Ícone dinâmico: muda quando todos os itens são entregues

---

## 👥 Equipe de Desenvolvimento

| Nome | Função |
|------|--------|
| Rodrigo Pereira | Desenvolvedor Full Stack |
| Bruno Henrique Oliveira Capra | Desenvolvedor |
| Miguel da Silva Bernades | Desenvolvedor |
| Felix Renato Marques Junior | Desenvolvedor |

---

*Projeto desenvolvido para fins educacionais - ETEC e FATEC.*