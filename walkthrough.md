# Walkthrough - Header/Nav/Footer e Design System

## 1) Auditoria rapida (estado anterior)

### Estrutura global
- `Header` e `Footer` ja eram globais via `src/components/client-layout.tsx`.
- Existia duplicacao de `Header` (`<Navbar />`) nas rotas:
  - `src/app/tools/pharmaroleplay/training/page.tsx`
  - `src/app/tools/pharmaroleplay/dashboard/page.tsx`
  - `src/app/tools/pharmaroleplay/history/page.tsx`
  - `src/app/tools/pharmaroleplay/session/[id]/page.tsx`

### Inconsistencias e UX do menu
- Menu de produtos sem fechamento por `ESC`.
- Sem fechamento por clique fora.
- Sem fechamento automatico ao trocar rota.
- Sem `aria-expanded`, `aria-controls`, `aria-label` no gatilho do mega menu.
- Sem estado ativo por rota.
- Mobile sem accordion para subitens e sem CTA persistente no rodape do drawer.
- Header com estado `scrolled` basico, sem tratamento mais premium de blur/sombra.

## 2) O que foi implementado

### Brand system (tokens e estados)
- Expansao de tokens em `src/app/globals.css`:
  - cores auxiliares, espacamentos, radius, sombras, altura de header, container.
- Inclusao de foco visivel global para acessibilidade (`:focus-visible`).
- Inclusao de `prefers-reduced-motion`.
- Ajustes de estado para `btn-primary`, `btn-outline`, `glass-card`:
  - `hover`, `active`, `disabled` mais consistentes.

### Navegacao premium enterprise
- Reescrita de `src/components/navbar.tsx` com:
  - Header sticky com estado `scrolled` sutil e sem CLS (altura fixa).
  - Mega menu rico com grupos:
    - Demos disponiveis: PharmaRoleplay, Social Vigilante, MedSafe
    - Em breve: InternMatch, SciGen
    - Links rapidos: Produtos, Como funciona, Docs, Contato
  - Hover-intent (delay curto para abrir) e debounce no mouseleave.
  - Fecha com `ESC`, clique fora, troca de rota.
  - Estado ativo por rota.
  - Suporte de teclado no trigger do menu (Enter/Espaco/ArrowDown).
  - `aria-*` no trigger e no conteudo do menu.
- Mobile:
  - Drawer lateral.
  - Accordion para "Demos disponiveis".
  - CTA "Testar Gratis" fixo no rodape do drawer.

### Footer consistente
- Reescrita de `src/components/footer.tsx`:
  - Consome config unica de ferramentas.
  - Separa "Demos", "Em breve", "Empresa", "Recursos".
  - Mantem links institucionais e contato.

### Aplicacao global (sem duplicacao)
- Remocao das `Navbar` duplicadas nas rotas de Pharma:
  - `training`, `dashboard`, `history`, `session/[id]`
- Header/Footer passam a aparecer uma unica vez em todas as rotas (via `ClientLayout`).

### Config unica de ferramentas
- Novo `src/lib/tools-config.ts`:
  - Demos disponiveis (slug, nome, categoria, headline, descricao curta, chips, imagem, tema/accent, rotas landing/demo).
  - "Em breve" (InternMatch e SciGen).

### Rotas de demo adicionadas
- `src/app/tools/pharmaroleplay/demo/page.tsx` (redirect para `/tools/pharmaroleplay/training`)
- `src/app/tools/social-vigilante/demo/page.tsx`
- `src/app/tools/medsafe/demo/page.tsx`

### Recuperacao do MedSafeApp
- Recriado `src/components/tools/medsafe/MedSafeApp.tsx` (arquivo estava deletado localmente):
  - Input + upload
  - Chamada para `/api/medsafe`
  - Fallback local quando API indisponivel
  - Painel de score e lista de violacoes

## 3) Arquivos alterados

- `src/app/globals.css`
- `src/components/navbar.tsx`
- `src/components/footer.tsx`
- `src/lib/tools-config.ts`
- `src/components/tools/medsafe/MedSafeApp.tsx`
- `src/app/tools/pharmaroleplay/training/page.tsx`
- `src/app/tools/pharmaroleplay/dashboard/page.tsx`
- `src/app/tools/pharmaroleplay/history/page.tsx`
- `src/app/tools/pharmaroleplay/session/[id]/page.tsx`
- `src/app/tools/pharmaroleplay/demo/page.tsx`
- `src/app/tools/social-vigilante/demo/page.tsx`
- `src/app/tools/medsafe/demo/page.tsx`

## 4) Validacao executada

- Lint:
  - `C:\Progra~1\nodejs\node.exe node_modules\next\dist\bin\next lint`
  - Resultado: sem warnings/erros.
- Build:
  - `C:\Progra~1\nodejs\node.exe node_modules\next\dist\bin\next build`
  - Resultado: build concluido com sucesso.

## 5) Como testar (desktop/mobile/teclado)

### Desktop
1. Abrir o site e rolar a pagina:
   - validar estado `scrolled` do header (blur/sombra sem pulo de layout).
2. Passar o mouse em "Ferramentas":
   - validar abertura com hover-intent e fechamento suave.
3. Validar grupos no mega menu:
   - Demos disponiveis / Em breve / Links rapidos.
4. Clicar fora e pressionar `ESC`:
   - menu deve fechar.
5. Trocar de rota:
   - menu deve fechar automaticamente.

### Mobile
1. Abrir drawer pelo botao de menu.
2. Expandir/recolher accordion "Demos disponiveis".
3. Validar CTA "Testar Gratis" no rodape do drawer.
4. Navegar por links e confirmar fechamento do drawer ao clicar.

### Teclado
1. Focar "Ferramentas" com `Tab`.
2. Usar `Enter` ou `ArrowDown` para abrir menu.
3. Pressionar `ESC` para fechar.
4. Verificar foco visivel em links/botoes/inputs.
