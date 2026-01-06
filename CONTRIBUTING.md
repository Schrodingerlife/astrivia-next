# Contribuindo para Astrivia AI

## 🌿 Branches

| Branch | Propósito |
|--------|-----------|
| `master` | Produção (auto-deploy para Vercel) |
| `develop` | Desenvolvimento |
| `feature/*` | Novas funcionalidades |
| `fix/*` | Correções de bugs |

---

## 🔄 Workflow

### 1. Criar branch de feature

```bash
git checkout -b feature/nome-da-feature
```

### 2. Fazer alterações e commit

```bash
git add .
git commit -m "feat: descrição da mudança"
```

### 3. Push e PR

```bash
git push origin feature/nome-da-feature
```

Criar Pull Request para `master` no GitHub.

---

## 📝 Padrão de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação |
| `style:` | Formatação, sem mudança de código |
| `refactor:` | Refatoração |
| `test:` | Testes |
| `chore:` | Manutenção |

**Exemplos:**

```
feat: add MedSafe demo button to products
fix: resolve login popup closing immediately
docs: update README with project structure
```

---

## 🧪 Testes Locais

Antes de fazer PR:

```bash
# Build de produção
npm run build

# Verificar lint
npm run lint
```

---

## 🚀 Deploy

- Push para `master` = deploy automático no Vercel
- Para deploy manual: `npx vercel --prod`

---

## 📁 Adicionando Produtos

Para adicionar um novo produto, edite:

1. `src/app/page.tsx` - Array `products` (cards na home)
2. `src/app/products/page.tsx` - Array `products` (detalhes)

---

## 🔐 Firebase

Para modificar configurações Firebase:

1. Edite `src/lib/firebase.ts`
2. Para adicionar admins, adicione email ao array `ADMIN_EMAILS`

---

## 📧 Contato

Dúvidas sobre contribuição: <nicollas@astrivia.ai>
