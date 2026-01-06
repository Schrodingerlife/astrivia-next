# 🚀 Astrivia AI - Website

Sistema Operacional de Agentes Autônomos para Life Sciences

**Live Site:** <https://astrivia-next.vercel.app>

---

## 📋 Sobre o Projeto

Astrivia AI é uma startup de tecnologia focada em resolver os gargalos operacionais da indústria farmacêutica através de agentes de IA autônomos.

Este repositório contém o **site institucional** da Astrivia, desenvolvido com:

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Firebase** (Auth + Firestore)
- **Framer Motion** (animações)

---

## 🛠️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/Schrodingerlife/astrivia-next.git

# Instalar dependências
cd astrivia-next
npm install

# Rodar localmente
npm run dev
```

Acesse: <http://localhost:3000>

---

## 📁 Estrutura do Projeto

```
astrivia-next/
├── src/
│   ├── app/                    # Páginas (App Router)
│   │   ├── page.tsx            # Home
│   │   ├── products/           # Produtos
│   │   ├── technology/         # Tecnologia
│   │   ├── team/               # Time
│   │   ├── docs/               # Documentação
│   │   ├── status/             # Status dos sistemas
│   │   ├── contact/            # Contato
│   │   ├── admin/              # Painel Admin
│   │   └── api/                # API Routes
│   ├── components/             # Componentes reutilizáveis
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── client-layout.tsx
│   └── lib/
│       └── firebase.ts         # Configuração Firebase
├── public/
│   ├── images/                 # Imagens do site
│   └── assets/                 # Assets estáticos
├── DEPLOY.md                   # Instruções de deploy
└── astrivia-knowledge-base.md  # Base de conhecimento (para IA)
```

---

## 🔥 Firebase

O site utiliza Firebase para:

- **Authentication:** Login com Google (para painel admin)
- **Firestore:** Armazenamento de dados editáveis (time, produtos, etc.)

### Configuração

O arquivo `.env` deve conter:

```env
# Já configurado no projeto
NEXT_PUBLIC_FIREBASE_API_KEY=...
```

---

## 🎨 Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Home - Hero, produtos, arquitetura |
| `/products` | Detalhes dos 6 produtos |
| `/technology` | Stack técnica e arquitetura |
| `/team` | Membros fundadores |
| `/docs` | Documentação da plataforma |
| `/status` | Status dos sistemas |
| `/contact` | Formulário de contato |
| `/admin` | Painel administrativo |

---

## 📦 Produtos Astrivia

1. **PharmaRoleplay** - Treinamento de vendas por voz com IA ([Demo](https://pharmaroleplay-frontend-gzsqkmnyna-uc.a.run.app))
2. **Social Vigilante** - Farmacovigilância em redes sociais ([Demo Funcional IA](/tools/social-vigilante))
3. **MedSafe AI** - Auditoria regulatória automática ([Demo](https://medsafe-backend-759156439718.us-central1.run.app/))
4. **LetterFix** - Edição generativa de materiais ([Demo Funcional IA](/tools/letterfix))
5. **InternMatch** - Plataforma de recrutamento para universitários ([Demo](https://intermatch-5051b.web.app/))
6. **SciGen** - Geração de conteúdo científico

---

## 🚀 Deploy

### Vercel (Produção)

O repositório está conectado ao Vercel. Qualquer push para `master` dispara o deploy automático.
**Status:** Build configurado para ignorar linting e garantir disponibilidade contínua.

---

## 👤 Painel Admin

Acesse `/admin` para editar membros do time e conteúdos dinâmicos via Firebase.

---

## 🤝 Time

- **Nícollas Braga** - CEO & Founder
- **André Guilherme** - CSO & Co-Founder
- **Gabriel Katakura** - CCO & Co-Founder

---

## 📄 Licença

Proprietary - Astrivia AI © 2025

---

## 🔗 Links

- **Site:** <https://astrivia-next.vercel.app>
- **LinkedIn:** [Astrivia AI](https://www.linkedin.com/in/astrivia-ai-96933b3a3/)
- **GitHub:** <https://github.com/Schrodingerlife/astrivia-next>
