# Arquitetura do Projeto

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Next.js 14                            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │   SSR    │  │   SSG    │  │   API    │              │ │
│  │  │  Pages   │  │  Pages   │  │  Routes  │              │ │
│  │  └──────────┘  └──────────┘  └──────────┘              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │    Firebase     │
                    │  ┌───────────┐  │
                    │  │   Auth    │  │
                    │  └───────────┘  │
                    │  ┌───────────┐  │
                    │  │ Firestore │  │
                    │  └───────────┘  │
                    └─────────────────┘
```

---

## Stack Tecnológica

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Next.js | 14.x | Framework React com SSR/SSG |
| React | 18.x | UI Library |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 3.x | Styling utility-first |
| Framer Motion | 11.x | Animações |
| Lucide React | - | Ícones |

### Backend

| Serviço | Propósito |
|---------|-----------|
| Firebase Auth | Autenticação Google |
| Firebase Firestore | Banco de dados NoSQL |
| Vercel Edge Functions | API Routes |

### Infraestrutura

| Serviço | Propósito |
|---------|-----------|
| Vercel | Hosting e CI/CD |
| GitHub | Versionamento |

---

## Estrutura de Páginas

```
/                   → Home (SSG)
/products           → Produtos (SSG)
/technology         → Tecnologia (SSG)
/team               → Time (SSR - Firestore)
/docs               → Documentação (SSG)
/status             → Status (SSG)
/contact            → Contato (SSG + API)
/admin              → Admin Panel (CSR - Auth required)
```

---

## Firebase Collections

### Collection: `team`

```typescript
{
  name: string,
  role: string,
  image: string,
  bio: string,
  experience: string[],
  quote: string,
  linkedin: string
}
```

### Collection: `products`

```typescript
{
  id: string,
  title: string,
  category: string,
  badge: string,
  description: string,
  benefits: string[]
}
```

### Collection: `settings`

```typescript
// Document: "home"
{
  heroTitle: string,
  heroHighlight: string,
  heroSubtitle: string,
  stats: Array<{
    value: string,
    prefix: string,
    suffix: string,
    label: string
  }>
}
```

---

## API Routes

### POST `/api/contact`

Recebe formulário de contato e pode ser integrado com email service.

```typescript
{
  name: string,
  email: string,
  company: string,
  message: string
}
```

### POST `/api/newsletter`

Inscrição na newsletter.

```typescript
{
  email: string
}
```

---

## Fluxo de Deploy

```
Developer Push
      │
      ▼
┌─────────────┐
│   GitHub    │
│   master    │
└─────────────┘
      │
      ▼ (Webhook)
┌─────────────┐
│   Vercel    │
│   Build     │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Production  │
│   Deploy    │
└─────────────┘
```

---

## Segurança

### Firebase Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Authorized Domains (Firebase Auth)

- `localhost`
- `astrivia-next.vercel.app`
- `*.vercel.app`
