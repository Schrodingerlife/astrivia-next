# Astrivia Next - Guia de Deploy e Manutenção

## 🌐 Links Importantes

| Recurso | URL |
|---------|-----|
| **Site Produção** | <https://astrivia-next.vercel.app> |
| **Repositório GitHub** | <https://github.com/Schrodingerlife/astrivia-next> |
| **Vercel Dashboard** | <https://vercel.com/nicollass-projects/astrivia-next> |

---

## 📁 Estrutura do Site

```
src/app/
├── page.tsx              → Home (/)
├── products/page.tsx     → Produtos (/products)
├── technology/page.tsx   → Tecnologia (/technology)
├── team/page.tsx         → Time (/team)
├── docs/page.tsx         → Documentação (/docs)
├── status/page.tsx       → Status (/status)
├── contact/page.tsx      → Contato (/contact)
└── api/
    ├── contact/route.ts  → API de Contato
    └── newsletter/route.ts → API de Newsletter

src/components/
├── navbar.tsx            → Barra de navegação
└── footer.tsx            → Rodapé
```

---

## 🚀 Como Fazer Alterações

### Passo 1: Edite os arquivos

Faça as alterações desejadas nos arquivos do projeto.

### Passo 2: Teste localmente (opcional)

```bash
cd n:\astrivia-website\astrivia-next
npm run dev
```

Acesse <http://localhost:3000> para ver as mudanças.

### Passo 3: Commit e Push para o GitHub

```bash
cd n:\astrivia-website\astrivia-next
git add .
git commit -m "Descrição da sua mudança"
git push
```

### Passo 4: Deploy no Vercel

```bash
npx vercel --prod
```

---

## ⚡ Deploy Automático (Recomendado)

Para que o site atualize automaticamente a cada `git push`:

1. Acesse <https://vercel.com/nicollass-projects/astrivia-next/settings/git>
2. Conecte ao repositório `Schrodingerlife/astrivia-next`
3. Pronto! Todo push fará deploy automático.

---

## 📝 Exemplos de Alterações Comuns

### Alterar texto/conteúdo de uma página

1. Abra o arquivo da página (ex: `src/app/team/page.tsx`)
2. Edite o texto desejado
3. Siga os passos de deploy

### Adicionar um novo membro ao time

1. Abra `src/app/team/page.tsx`
2. Adicione um novo objeto no array `team`:

```tsx
{
    name: "Nome da Pessoa",
    role: "Cargo",
    image: "/images/nome-da-pessoa.jpg",
    bio: "Descrição...",
    experience: ["Experiência 1", "Experiência 2"],
    quote: "Frase inspiradora",
    linkedin: "https://linkedin.com/in/perfil",
},
```

### Alterar estilos globais

Edite o arquivo `src/app/globals.css`

---

## 🛠️ Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila o projeto para produção |
| `npx vercel --prod` | Deploy para produção no Vercel |
| `git status` | Ver arquivos modificados |
| `git log -5` | Ver últimos 5 commits |

---

## 📅 Última Atualização

- **Data:** 31/12/2024
- **Alteração:** Adicionados links do LinkedIn para o time
