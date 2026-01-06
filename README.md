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

1. **PharmaRoleplay** - Treinamento de vendas por voz com IA
2. **Social Vigilante** - Farmacovigilância em redes sociais
3. **MedSafe AI** - Auditoria regulatória automática ([Demo](https://medsafe-backend-759156439718.us-central1.run.app/))
4. **LetterFix** - Edição generativa de materiais
5. **InternMatch** - Plataforma de recrutamento para universitários
6. **SciGen** - Geração de conteúdo científico

---

## 🚀 Deploy

### Vercel (Produção)

```bash
# Deploy manual
npx vercel --prod

# Ou automático via GitHub (já configurado)
git push origin master
```

### Deploy Automático

O repositório está conectado ao Vercel. Qualquer push para `master` dispara deploy automático.

---

## 👤 Painel Admin

Acesse `/admin` para editar conteúdo do site.

**Funcionalidades:**

- Login com Google
- Editar membros do time
- Editar conteúdo da Home
- Editar descrições de produtos

**Emails autorizados:** Configurados em `src/lib/firebase.ts`

---

## 📚 Documentação Adicional

- [DEPLOY.md](./DEPLOY.md) - Instruções detalhadas de deploy
- [astrivia-knowledge-base.md](./astrivia-knowledge-base.md) - Knowledge base para IA/NotebookLM

---

## 🤝 Time

- **Nícollas Braga** - CEO & Founder
- **André Guilherme** - CSO
- **Gabriel Katakura** - CCO

---

## 📄 Licença

Proprietary - Astrivia AI © 2024

---

## 🔗 Links

- **Site:** <https://astrivia-next.vercel.app>
- **GitHub:** <https://github.com/Schrodingerlife/astrivia-next>
- **MedSafe Demo:** <https://medsafe-backend-759156439718.us-central1.run.app/>
