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
- **Gerenciador de Pacotes:** Yarn
- **Validação:** class-validator, class-transformer
- **Autenticação:** JWT via `@nestjs/jwt` + `@nestjs/passport` (módulo `auth` dedicado, guard global + decorator `@Public()`)
- **Senhas:** bcrypt hash (salt rounds 10)
- **Filtro Global de Erros:** `GlobalExceptionFilter` para respostas sanitizadas

### Frontend
- **Framework:** [Ionic Framework](https://ionicframework.com/) 8.x
- **Base:** JavaScript Vanilla (Web Components)
- **Bundler:** [Vite](https://vitejs.dev/) 7.x
- **Plataforma Mobile:** [Capacitor](https://capacitorjs.com/) 8.x (Android/iOS)
- **Gerenciador de Pacotes:** npm

## 📊 Status do Projeto

### Backend (132 testes, 17 suítes)
- [x] Módulo de Produtos (CRUD + imagens)
- [x] Módulo de Usuários (CRUD + login + change-password)
- [x] Módulo de Mesas (CRUD + reserva + mapa)
- [x] Módulo de Comandas (CRUD)
- [x] Módulo de Itens de Comanda (CRUD + status entrega/pagamento)
- [x] Módulo Auth (JWT + Passport + RolesGuard global)
- [x] RBAC: 5 perfis (Admin, Atendente, Cliente, Barista, Cozinheiro)
- [x] Validação global (whitelist + transform)
- [x] Tratamento global de exceções
- [x] Paginação em todos os services
- [x] Seed: 21 usuários, 18 mesas, 66 produtos

### Frontend (89 testes, 7 suítes)
- [x] CRUD de Produtos, Usuários, Mesas, Comandas
- [x] Tela de Login + Route Guard global
- [x] Cozinha (Home) com status de entrega
- [x] Menu lateral filtrado por perfil
- [x] Tela de Perfil do Usuário (avatar, dados, troca de senha)
- [x] Tela de Configurações (acessibilidade, tema, áudio)
- [x] Mapa interativo de mesas (SVG + reserva)
- [x] Cardápio digital (filtro por categoria)
- [x] Paginação (20/página) + skeleton loading
- [x] Acessibilidade: 4 presets de fonte, alto contraste, reduzir animações
- [x] Modo Claro toggle
- [x] Sistema de áudio: SFX (6 sons) + music player com playlist
- [x] Build para Android (Capacitor)

## 📂 Estrutura de Pastas

```
quero-cafe-bar/
├── backend/           # API REST — NestJS 11.x
│   └── src/
│       ├── modules/   # auth, comanda, comanda-item, mesa, produto, usuario
│       ├── config/    # TypeORM config
│       ├── database/  # migrations + seed
│       └── main.ts
│
├── frontend/          # App mobile/web — Ionic + Vite
│   └── src/
│       ├── pages/     # login, home, produto, usuario, mesa, comanda, profile, settings, menu, mapa, music
│       ├── services/  # api.js, audio.js
│       ├── shared/    # Header.js, overlay.js, auth.js, util.js
│       └── environments/
│
├── AGENTS.md          # Documentação para agentes de IA
└── README.md
```

## 🚀 Setup

### Backend
```bash
cd backend
yarn install
# Configure .env (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, PORT=3001)
yarn migrate          # Executa migrations
yarn seed             # Popula o banco
yarn start:dev        # Servidor na porta 3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev           # Vite na porta 5173
```

## 🔑 Credenciais (Seed)

| Usuário | Senha | Perfil |
|---------|-------|--------|
| admin | admin | Administrador (0) |
| rodrigo | rodrigo | Administrador (0) |
| carlos | carlos | Atendente (1) |
| ana | ana | Atendente (1) |
| pedro | pedro | Atendente (1) |
| juliana | juliana | Atendente (1) |
| maria | maria | Cliente (2) |
| lucas | lucas | Cliente (2) |
| barista | barista | Barista (3) |
| cozinha | cozinha | Cozinheiro (4) |

**Perfis:** 0=Admin, 1=Atendente, 2=Cliente, 3=Barista, 4=Cozinheiro

## 🎨 Funcionalidades

### Cozinha (Home)
- Lista comandas em cards com status visual (vermelho = pendente, verde = entregue)
- Select para alterar status de entrega

### Mapa Interativo
- Layout SVG: Bar, Salão, Externa
- Clique para reservar/liberar mesas
- Cores: verde (disponível), amarela (reservada), vermelha (ocupada)

### Cardápio Digital
- Busca produtos da API, filtro por categoria com emojis
- Cards com imagem, nome e preço

### Controle de Acesso (RBAC)
- **Backend**: `RolesGuard` global + `@Roles()` decorator
- **Frontend**: menu e rotas filtrados por perfil

### Acessibilidade
- 4 presets de tamanho de fonte (85%, 100%, 120%, 140%)
- Escala global proporcional (`--app-font-scale`)
- Alto contraste (preto/branco com bordas visíveis)
- Reduzir animações

### Áudio
- **SFX**: 6 sons sintéticos (click, sucesso, erro, notificação, reservar, liberar)
- **Música**: player global com playlist, play/pause, next/prev, volume
- Adicionar músicas: colocar MP3s em `frontend/public/assets/audio/music/` e editar `playlist.json`

## 🤖 Scripts Disponíveis

### Backend (yarn)
| Comando | Descrição |
|---------|-----------|
| `yarn start:dev` | Servidor com hot-reload |
| `yarn build` | Build de produção |
| `yarn lint` | ESLint + Prettier |
| `yarn test` | 132 testes, 17 suítes |
| `yarn migrate` | Executar migrations |
| `yarn migrate:rollback` | Reverter última migration |
| `yarn make:migration <nome>` | Gerar migration |
| `yarn seed` | Popula o banco |
| `yarn seed:run` | Migrate + Seed |

### Frontend (npm)
| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor Vite |
| `npm run build` | Build web |
| `npm run build:prod` | Build de produção |
| `npm test` | 89 testes, 7 suítes |
| `npx cap copy` | Sincronizar com Capacitor |
| `npx cap build android` | Gerar APK |

## 🔧 Pré-requisitos

- **Node.js** >= 18.x
- **MySQL** 8.x
- **Yarn** >= 1.22 (backend)
- **npm** >= 9.x (frontend)
- **Java JDK** 17+ + **Android Studio** (para builds mobile)

## 👥 Equipe

| Nome | Função |
|------|--------|
| Rodrigo Pereira | Desenvolvedor Full Stack |
| Bruno Henrique Oliveira Capra | Desenvolvedor |
| Miguel da Silva Bernades | Desenvolvedor |
| Felix Renato Marques Junior | Desenvolvedor |

---

*Projeto desenvolvido para fins educacionais - ETEC e FATEC.*
