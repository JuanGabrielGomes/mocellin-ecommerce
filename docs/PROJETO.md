# Mocellin Joias — Documentação Técnica

---

## 1. Visão Geral

**Cliente:** Priscila Mocellin — Mocellin Joias  
**Agência:** glim. — Juan Gabriel Gomes  
**Tipo:** E-commerce de joias e semijoias  
**Modelo de negócio:** Vitrine online com carrinho; pedido finalizado via WhatsApp (sem gateway de pagamento nativo). A loja exibe produtos, o comprador monta o carrinho, preenche dados de entrega/pagamento e é redirecionado para o WhatsApp da loja com a mensagem do pedido já formatada.  
**Fase atual:** Fase 1 — Conclusão / últimos detalhes e ajustes (iniciado em 2026-04-27)  
**URL de produção:** `https://mocellinjoias.com.br` (configurada em `src/lib/config.ts`; deploy pendente de ativação)

---

## 2. Stack e Dependências

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Next.js | 16.2.6 | Framework principal — App Router, SSR, RSC, routes |
| React | 19.2.4 | Camada de UI |
| react-dom | 19.2.4 | Renderização DOM |
| TypeScript | ^5 | Tipagem estática em todo o projeto |
| Tailwind CSS | ^4 | Utilitários CSS — tokens de design via `@theme` |
| @tailwindcss/postcss | ^4 | Integração PostCSS para Tailwind v4 |
| Zustand | ^5.0.13 | Estado global do carrinho (client-side, com `persist`) |
| @supabase/supabase-js | ^2.104.1 | SDK Supabase — queries, auth, storage |
| @supabase/ssr | ^0.10.2 | Helpers SSR para cookies — Server e Browser Client |
| lucide-react | ^1.9.0 | Ícones SVG (ShoppingBag, X, ChevronDown, etc.) |
| Julius Sans One | Google Fonts | Tipografia display — títulos e logotipo |
| Mulish | Google Fonts | Tipografia corpo — textos, labels, botões |
| eslint | ^9 | Linting |
| eslint-config-next | 16.2.4 | Regras ESLint específicas do Next.js |

---

## 3. Estrutura de Pastas

```
mocellin-ecommerce/
├── app/                         # Next.js App Router — rotas e layouts
│   ├── (public)/                # Grupo de rotas públicas (sem prefixo na URL)
│   │   ├── layout.tsx           # Layout público: Header, Footer, WhatsAppFloat, CampaignBanner
│   │   ├── page.tsx             # Homepage: hero, categorias, destaques, sobre
│   │   ├── catalogo/
│   │   │   └── page.tsx         # Catálogo com filtro por categoria
│   │   ├── produto/[id]/
│   │   │   └── page.tsx         # Página de detalhe do produto (PDP)
│   │   └── checkout/
│   │       └── page.tsx         # Checkout: dados, frete, pagamento → WhatsApp
│   ├── (admin)/                 # Grupo de rotas do painel admin (sem prefixo na URL)
│   │   └── admin/
│   │       ├── layout.tsx       # Layout do admin: sidebar + main
│   │       ├── page.tsx         # Listagem de produtos
│   │       ├── login/page.tsx   # Autenticação via Supabase Auth
│   │       ├── produtos/
│   │       │   ├── novo/page.tsx      # Criar produto
│   │       │   └── [id]/page.tsx      # Editar produto
│   │       └── campanhas/
│   │           ├── page.tsx           # Listagem de campanhas
│   │           ├── nova/page.tsx      # Criar campanha
│   │           └── [id]/page.tsx      # Editar campanha
│   ├── api/
│   │   └── frete/route.ts       # Route Handler POST — consulta Superfrete API
│   ├── globals.css              # Reset Tailwind + @theme tokens de cor e fonte
│   ├── layout.tsx               # Root layout: <html>, fontes Google, metadata base
│   ├── not-found.tsx            # Página 404 global
│   ├── error.tsx                # Boundary de erro global (client component)
│   ├── robots.ts                # Gerador de robots.txt
│   └── sitemap.ts               # Gerador de sitemap.xml dinâmico
│
├── src/
│   ├── types/
│   │   └── index.ts             # Todos os tipos TypeScript do projeto
│   ├── lib/
│   │   ├── config.ts            # Constantes da loja (phone, email, url, instagram)
│   │   ├── campaign.ts          # getActiveCampaign() com React cache()
│   │   ├── supabase/
│   │   │   ├── server.ts        # createClient() para Server Components / Route Handlers
│   │   │   └── client.ts        # createClient() para Client Components
│   │   └── cart/
│   │       ├── store.ts         # Zustand store do carrinho (persist em localStorage)
│   │       └── whatsapp.ts      # buildWhatsAppUrl() — formata mensagem do pedido
│   ├── hooks/
│   │   ├── useFreteSimulator.ts # Hook: consulta /api/frete com debounce de 600ms
│   │   └── useCepLookup.ts      # Hook: consulta ViaCEP e preenche endereço
│   └── components/
│       ├── product/
│       │   ├── ProductCard.tsx   # Card do produto com hover crossfade e add-to-cart
│       │   ├── ProductGallery.tsx # Galeria com lightbox, swipe e miniaturas
│       │   └── ProductActions.tsx # Seletor de tamanho + botões Adicionar / Comprar agora
│       ├── admin/
│       │   ├── ProductForm.tsx   # Formulário completo de criação/edição de produto
│       │   ├── CampaignForm.tsx  # Formulário de criação/edição de campanha com presets
│       │   ├── CampaignToggle.tsx # Botão toggle ativar/desativar campanha
│       │   ├── FeaturedToggle.tsx # Toggle destaque do produto na listagem admin
│       │   ├── DeleteProductButton.tsx # Botão de exclusão com confirmação
│       │   └── AdminSidebar.tsx  # Sidebar de navegação do painel admin
│       ├── cart/
│       │   └── CartDrawer.tsx    # Drawer lateral do carrinho
│       └── ui/
│           ├── Header.tsx        # Header fixo com logo, nav, ícone carrinho
│           ├── Footer.tsx        # Footer com links de navegação e contato
│           ├── CampaignBanner.tsx # Banner top fixo da campanha (dismissível via sessionStorage)
│           ├── WhatsAppFloat.tsx  # Botão flutuante do WhatsApp
│           ├── RichText.tsx       # Renderizador de texto com **negrito** e parágrafos
│           └── Accordion.tsx      # Accordion animado por grid-template-rows
│
├── proxy.ts                     # Middleware de autenticação — protege /admin/*
├── next.config.ts               # Configuração do Next.js
├── tsconfig.json                # TypeScript — alias @/ → ./src/
├── postcss.config.mjs           # PostCSS com @tailwindcss/postcss
└── package.json                 # Dependências e scripts
```

---

## 4. Design System

### 4.1 Tokens de Cor

Definidos em `app/globals.css` via `@theme` do Tailwind v4. Tokens base são fixos; tokens semânticos podem ser sobrescritos por campanhas (via `<style>` injetado no `(public)/layout.tsx`).

**Paleta base (fixa):**

| Token CSS | Valor hex | Uso semântico |
|---|---|---|
| `--color-mj-black` | `#000000` | Preto puro |
| `--color-mj-beige` | `#D5B39A` | Bege dourado |
| `--color-mj-brown` | `#7B4A34` | Marrom escuro — hover de botões |
| `--color-mj-brown-light` | `#8B5A44` | Marrom médio |
| `--color-mj-teal` | `#003430` | Verde petróleo |
| `--color-mj-taupe` | `#968A7A` | Taupe — textos secundários no admin |
| `--color-mj-cream` | `#FAFAF8` | Creme — fundo de página |
| `--color-mj-white` | `#FFFFFF` | Branco puro |
| `--color-mj-border` | `#E8E0D8` | Borda padrão |

**Tokens semânticos (sobrescritíveis por campanha):**

| Token CSS | Valor padrão | Uso semântico |
|---|---|---|
| `--color-mj-text` | `#000000` | Texto principal (títulos, preços) |
| `--color-mj-text-muted` | `#968A7A` | Texto secundário (categorias, legendas) |
| `--color-mj-text-accent` | `#D5B39A` | Destaque / italic / accent |
| `--color-mj-surface` | `#FFFFFF` | Fundo de cards, inputs, header scrollado |
| `--color-mj-page` | `#FAFAF8` | Fundo geral da página |
| `--color-mj-overlay` | `#000000` | Gradiente hero / backdrop |
| `--color-mj-btn` | `#000000` | Fundo do botão primário |
| `--color-mj-btn-text` | `#FFFFFF` | Texto do botão primário |
| `--color-mj-btn-hover` | `#7B4A34` | Hover do botão primário |

**Uso nas classes Tailwind:** `bg-mj-btn`, `text-mj-text-muted`, `border-mj-border`, etc.

### 4.2 Tipografia

| Fonte | Família CSS | Pesos | Onde é usada |
|---|---|---|---|
| Julius Sans One | `font-julius` / `--font-family-julius` | 400 | Títulos de seção, logotipo, headings de produtos, nav admin |
| Mulish | `font-mulish` / `--font-family-mulish` | 200, 300, 400, 500, 600 | Corpo de texto, labels, botões, preços, textos auxiliares |

Ambas as fontes são carregadas via `next/font/google` no `app/layout.tsx`, com as variáveis CSS `--font-julius` e `--font-mulish` injetadas no `<html>`.

### 4.3 Convenções de Classe

- Todos os tokens de cor usam o prefixo `mj-` — ex: `bg-mj-btn`, `text-mj-text`, `border-mj-border`.
- Tokens semânticos (sem sufixo como `brown` ou `cream`) são os corretos para componentes: sempre preferir `text-mj-text` em vez de `text-mj-black`, pois os semânticos são sobrescritos por campanhas.
- Tipografia por classes utilitárias: `font-julius` e `font-mulish` mapeiam para as variáveis CSS declaradas no `@theme`.
- Layout mobile-first: breakpoints em `sm:`, `md:`, `lg:` conforme necessário.
- Inputs, labels e botões seguem classes reutilizadas localmente (`inputClass`, `labelClass`) para consistência visual dentro de cada formulário.

---

## 5. Banco de Dados (Supabase)

### 5.1 Tabela `products`

| Coluna | Tipo TypeScript | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` (uuid) | sim | Identificador único gerado pelo Supabase |
| `name` | `string` | sim | Nome do produto |
| `code` | `string \| null` | não | Código/SKU do produto (ex: `MJ-001`) |
| `description` | `string \| null` | não | Descrição em texto com suporte a `**negrito**` e parágrafos |
| `details` | `string \| null` | não | Detalhes técnicos (materiais, cuidados) — exibido no Accordion da PDP |
| `price` | `number` | sim | Preço de venda em BRL |
| `compare_at_price` | `number \| null` | não | Preço original (riscado); quando maior que `price`, exibe badge de desconto |
| `category` | `ProductCategory` | sim | Enum: `'brincos' \| 'aneis' \| 'relogios' \| 'colares' \| 'oculos' \| 'masculino' \| 'pulseiras' \| 'berloques'` |
| `status` | `ProductStatus` | sim | `'disponivel' \| 'esgotado'` |
| `featured` | `boolean` | sim | Se `true`, aparece na seção "Em Destaque" da homepage (máx. 6) |
| `images` | `string[]` | sim | Array de URLs públicas de imagens (bucket `product-images`) |
| `image_positions` | `string[] \| null` | não | Ponto focal de cada imagem — valores CSS `object-position` (ex: `'top center'`). Índices espelham `images[]` |
| `sizes` | `string[] \| null` | não | Tamanhos disponíveis (ex: `['18', '19', '20']` para anéis, ou `['P', 'M', 'G']`) |
| `videos` | `string[] \| null` | não | Array de URLs públicas de vídeos (bucket `product-videos`) |
| `related_ids` | `string[] \| null` | não | IDs de produtos relacionados exibidos na seção "Você também pode gostar" |
| `created_at` | `string` (ISO) | sim | Timestamp de criação (gerado pelo Supabase) |
| `updated_at` | `string` (ISO) | sim | Timestamp de última atualização |

### 5.2 Tabela `campaigns`

| Coluna | Tipo TypeScript | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` (uuid) | sim | Identificador único |
| `name` | `string` | sim | Nome interno da campanha (ex: "Dia dos Namorados 2026") |
| `slug` | `string` | sim | Slug URL-friendly (gerado automaticamente pelo nome) |
| `active` | `boolean` | sim | Apenas uma campanha pode estar ativa por vez. Quando ativada, o sistema desativa todas as demais |
| `banner_text` | `string \| null` | não | Texto do banner fixo no topo. Se `null`, o banner não é exibido |
| `banner_bg` | `string` | sim | Cor de fundo do banner (hex) |
| `banner_text_color` | `string` | sim | Cor do texto do banner (hex) |
| `colors` | `Record<string, string>` | sim | Mapa de tokens semânticos sobrescritos: `mj-text`, `mj-text-muted`, `mj-text-accent`, `mj-surface`, `mj-page`, `mj-overlay`, `mj-btn`, `mj-btn-text`, `mj-btn-hover`, `mj-border` |
| `hero_image` | `string \| null` | não | URL da imagem de fundo do hero da homepage |
| `hero_label` | `string \| null` | não | Etiqueta pequena acima do título do hero (ex: "Nova Coleção") |
| `hero_title` | `string \| null` | não | Título principal do hero |
| `hero_subtitle` | `string \| null` | não | Subtítulo do hero |
| `created_at` | `string` (ISO) | sim | Timestamp de criação |
| `updated_at` | `string` (ISO) | sim | Timestamp de última atualização |

### 5.3 Storage Buckets

| Bucket | Acesso | Uso |
|---|---|---|
| `product-images` | Público | Imagens de produtos. Path: `{timestamp}-{random}.{ext}`. Upload via ProductForm (admin) |
| `product-videos` | Público | Vídeos de produtos. Mesmo padrão de path. Upload via ProductForm (admin) |
| `campaign-images` | Público | Imagem hero das campanhas. Path: `hero-{timestamp}.{ext}`. Upload via CampaignForm (admin) |

Todos os buckets retornam URLs públicas via `supabase.storage.from(bucket).getPublicUrl(path)`.

### 5.4 Autenticação e RLS

**Autenticação admin:**
- Supabase Auth com `signInWithPassword(email, password)`.
- O middleware em `proxy.ts` (exportado como `proxy` e `config`) intercepta todas as rotas `/admin/*`.
- Em cada requisição, `supabase.auth.getUser()` valida o token no servidor (nunca confia só no cookie local).
- Se a área admin for acessada sem sessão válida → redirect para `/admin/login`.
- Se `/admin/login` for acessado com sessão válida → redirect para `/admin`.
- O `matcher` cobre `/admin/:path*`.

**RLS (Row Level Security):** a configuração das políticas RLS é feita diretamente no Supabase Dashboard. O código assume que:
- Leitura de `products` (status `disponivel`) e `campaigns` (todas) é pública.
- Escrita (insert/update/delete) em `products` e `campaigns` exige usuário autenticado.
- Storage buckets são públicos para leitura; upload restrito a usuários autenticados.

---

## 6. Módulos da Loja (rotas públicas)

### 6.1 Homepage (`/`)

**URL:** `/`  
**Componentes principais:** `ProductCard`, `next/image`  
**Fonte de dados:** `supabase.from('products').eq('status', 'disponivel').eq('featured', true).limit(6)` + `getActiveCampaign()`  
**Carregamento:** `Promise.all([getActiveCampaign(), supabase...])` em paralelo no Server Component  
**Seções:**
1. **Hero** — imagem de fundo full-screen com gradiente multi-stop. Textos e imagem sobrescritos pela campanha ativa.
2. **Categorias** — grid 4 colunas (mobile) / 8 colunas (desktop) com links para `/catalogo?categoria=<value>`. Imagens fixas (Unsplash) — a confirmar substituição por fotos reais.
3. **Em Destaque** — grid de `ProductCard` com os produtos `featured: true` mais recentes (máx. 6).
4. **Sobre** — seção de branding com foto da fundadora (`/priscila.jpg`) e texto institucional.

### 6.2 Catálogo (`/catalogo`)

**URL:** `/catalogo` ou `/catalogo?categoria=<value>`  
**Componentes principais:** `ProductCard`  
**Fonte de dados:** `supabase.from('products').eq('status', 'disponivel').order('created_at', {ascending: false})` — com filtro opcional `.eq('category', activeCategory)`  
**Estado gerenciado:** `searchParams.categoria` via URL (sem estado client-side)  
**Comportamento:** O filtro de categoria é validado contra `VALID_CATEGORIES` (Set). Categoria inválida na URL equivale a "todos". Metadata dinâmica por categoria ativa.

### 6.3 Página de Produto — PDP (`/produto/[id]`)

**URL:** `/produto/[id]`  
**Componentes principais:** `ProductGallery`, `ProductActions`, `RichText`, `Accordion`, `ProductCard` (relacionados)  
**Fonte de dados:**
- `getProduct(id)` — função `cache()` que deduplica a query entre `generateMetadata` e o Page Component dentro do mesmo request.
- Produtos relacionados: `supabase.from('products').in('id', product.related_ids).eq('status', 'disponivel')`  
**SEO:** `generateMetadata` produz title, description, og:image, og:url, twitter:card com dados reais do produto.  
**Comportamento:** `notFound()` se o ID não existir. Galeria sticky no desktop (`lg:sticky lg:top-28`). Exibe preço com desconto se `compare_at_price > price`. Seção de relacionados renderizada somente se houver itens.

### 6.4 Checkout (`/checkout`)

**URL:** `/checkout`  
**Tipo:** Client Component (`'use client'`)  
**Componentes principais:** `useCartStore`, `useFreteSimulator`, `useCepLookup`, `buildWhatsAppUrl`  
**Estado gerenciado (local):**
- `form: CheckoutFormType` — dados do comprador
- `selectedFreteId` — opção de frete selecionada
- Erros de validação por campo

**Comportamento:**
- Se o carrinho estiver vazio após montagem, redireciona para `/catalogo`.
- CEP preenchido → `useCepLookup` preenche rua, bairro, cidade, estado automaticamente.
- CEP com 8 dígitos + delivery `'envio'` → `useFreteSimulator` consulta `/api/frete` com debounce de 600ms.
- Submit: valida campos obrigatórios → monta `OrderPayloadType` → `buildWhatsAppUrl` → abre WhatsApp em nova aba → `clearCart()` → redireciona para `/catalogo`.

---

## 7. Painel Administrativo

### 7.1 Autenticação (`/admin/login`)

Formulário simples (email + senha). Usa `createClient()` do lado do cliente (`src/lib/supabase/client.ts`) para chamar `supabase.auth.signInWithPassword`. Em caso de erro, exibe "E-mail ou senha incorretos." Em caso de sucesso, `router.push('/admin')`. O middleware (`proxy.ts`) já garante que usuário autenticado não veja a tela de login.

### 7.2 Listagem de Produtos (`/admin`)

Server Component que busca todos os produtos (`select('*').order('created_at', {ascending: false})`). Tabela com colunas: imagem + nome, categoria, preço, status (badge colorido), destaque (`FeaturedToggle`), ações (editar via link, excluir via `DeleteProductButton`).

### 7.3 Criar / Editar Produto

**Rotas:** `/admin/produtos/novo` e `/admin/produtos/[id]`  
**Componente central:** `ProductForm` (Client Component)

Campos do formulário:

| Campo | Tipo de input | Observações |
|---|---|---|
| Nome | `text` | Obrigatório |
| Código (SKU) | `text` | Opcional, convertido para maiúsculas automaticamente |
| Descrição | `textarea` | Suporte a `**negrito**` e parágrafos; mostra prévia em tempo real |
| Detalhes (materiais, cuidados) | `textarea` | Mesmo suporte de formatação da descrição; prévia em tempo real |
| Preço (R$) | `number` | Obrigatório, > 0 |
| Preço original (R$) | `number` | Opcional; quando preenchido e maior que `price`, exibe badge de desconto |
| Categoria | `select` | Valores: brincos, aneis, relogios, colares, oculos, masculino, pulseiras, berloques |
| Status | botões toggle | `disponivel` (verde) / `esgotado` (vermelho) |
| Destaque na home | botão toggle | Inclui/exclui da seção "Em Destaque" da homepage |
| Imagens | `file` (multiple) | JPG, PNG, WEBP. Upload em paralelo para bucket `product-images`. Cada imagem tem seletor de **ponto focal** (grade 3×3 com 9 posições CSS object-position) |
| Vídeos | `file` (multiple) | MP4, MOV, WEBM. Upload para bucket `product-videos` |
| Tamanhos | `text` + Enter/vírgula | Entrada livre de tags. Atalhos rápidos de numeração brasileira de anéis (10–30) |
| Produtos relacionados | busca com dropdown | Pesquisa por nome nos outros produtos; seleciona por ID; múltiplos |

**Fluxo de save:** valida → `Promise.all([uploadImages, uploadVideos])` em paralelo → monta payload → `supabase.from('products').insert()` ou `.update()` → redireciona para `/admin` após 1,5s de feedback de sucesso.

### 7.4 Campanhas

**O que é uma campanha:** conjunto de customizações visuais e textuais que sobrescreve o visual padrão do site enquanto estiver ativa. Apenas uma campanha pode estar ativa por vez.

**Como afeta a loja:**
- `(public)/layout.tsx` chama `getActiveCampaign()` a cada request. Se há campanha ativa, injeta um bloco `<style>` com os tokens semânticos sobrescritos (`:root { --color-mj-btn: #E0003A; ... }`).
- Exibe `CampaignBanner` no topo (se `banner_text` preenchido) — fixo, dismissível por sessão via `sessionStorage`.
- Homepage (`page.tsx`) usa `hero_image`, `hero_label`, `hero_title`, `hero_subtitle` da campanha se disponíveis.

**Campos do formulário de campanha:**

| Campo | Descrição |
|---|---|
| Nome | Nome interno (ex: "Dia dos Namorados 2026") |
| Slug | URL-friendly, gerado automaticamente pelo nome |
| Status (ativa/inativa) | Toggle. Ativar desativa todas as demais automaticamente |
| Texto do banner | Texto exibido no topo. Vazio = sem banner |
| Fundo do banner | Cor hex (color picker + input texto) |
| Texto do banner (cor) | Cor hex |
| Imagem hero | Upload para `campaign-images` ou URL externa |
| Etiqueta hero | Label pequeno acima do título (ex: "Nova Coleção") |
| Título principal hero | Título em destaque |
| Subtítulo hero | Texto de apoio |
| Tema de cores | 10 tokens semânticos editáveis com color picker. Presets prontos: Dia dos Namorados, Black Friday, Natal, Dia das Mães, Padrão |

---

## 8. Componentes Chave

### ProductCard

**Arquivo:** `src/components/product/ProductCard.tsx`  
**Tipo:** Client Component  
**Props:** `{ product: ProductType }`  
**Comportamento notável:**
- Hover crossfade: se o produto tiver 2 ou mais imagens, a segunda aparece em fade ao fazer hover.
- Ponto focal: `object-position` de cada imagem é lido de `image_positions[]`.
- Se o produto tiver `sizes`, o botão exibe "Escolher tamanho" e leva para a PDP (não adiciona direto ao carrinho).
- Se não tiver `sizes`, o botão "Adicionar ao carrinho" chama `addItem()` do Zustand sem abrir a PDP.
- Badge de desconto (`-X%`) exibido se `compare_at_price > price`.
- Badge "Esgotado" sobreposto se `status === 'esgotado'`.

### ProductGallery

**Arquivo:** `src/components/product/ProductGallery.tsx`  
**Tipo:** Client Component  
**Props:** `{ images: string[], videos: string[], imagePositions?: string[] | null }`  
**Comportamento notável:**
- Monta `MediaItem[]` combinando imagens e vídeos em ordem.
- Desktop: miniaturas clicáveis abaixo da imagem principal; setas de navegação aparecem no hover.
- Mobile: dots indicadores; navegação por swipe (touch start/end com delta mínimo de 50px).
- Lightbox ao clicar na imagem: overlay preto, imagem em 85vh×85vw, teclas ← → e Esc, swipe, dots. Bloqueia `overflow` do body enquanto aberto.
- Vídeos exibidos com `<video controls>` — sem lightbox para vídeo.

### ProductActions

**Arquivo:** `src/components/product/ProductActions.tsx`  
**Tipo:** Client Component  
**Props:** `{ product: ProductType }`  
**Comportamento notável:**
- Renderiza seletor de tamanho se `product.sizes` não for vazio.
- Botão "Adicionar ao carrinho" desabilitado se esgotado ou se tamanho é obrigatório mas não selecionado.
- Botão "Comprar agora": adiciona ao carrinho e redireciona imediatamente para `/checkout`.

### CartDrawer

**Arquivo:** `src/components/cart/CartDrawer.tsx`  
**Tipo:** Client Component  
**Props:** `{ open: boolean, onClose: () => void }`  
**Comportamento notável:**
- Slide-in da direita com `translate-x`. Overlay com blur.
- Controles de quantidade (+/−) usando `addItem` e `updateQuantity` do store.
- Remoção por item individual (`removeItem`).
- Chave do item no DOM: `product.id + (size ?? '')` — garantindo unicidade entre o mesmo produto em tamanhos diferentes.
- Footer com subtotal e botão "Finalizar pedido" → `/checkout`.

### RichText

**Arquivo:** `src/components/ui/RichText.tsx`  
**Tipo:** Server Component (sem diretiva)  
**Props:** `{ text: string, className?: string }`  
**Comportamento notável:**
- Parser de markdown mínimo: `\n\n` separa parágrafos (`<p>`); `\n` simples vira `<br />`; `**texto**` vira `<strong>`.
- Sem dependências externas de markdown.
- Mesma lógica de parsing replicada inline no `ProductForm` (componente `RichPreview`) para mostrar prévia em tempo real ao admin.

### CampaignToggle

**Arquivo:** `src/components/admin/CampaignToggle.tsx`  
**Tipo:** Client Component  
**Props:** `{ id: string, active: boolean }`  
**Comportamento notável:**
- Ao ativar: primeiro desativa todas as outras campanhas (`.update({active: false}).neq('id', id)`), depois ativa a campanha alvo.
- Ao desativar: apenas atualiza a campanha alvo para `active: false`.
- Após a operação, chama `router.refresh()` para revalidar os Server Components da listagem.

---

## 9. Carrinho e Fluxo de Pedido

### Fluxo completo

```
ProductCard / ProductActions
  └─ addItem(product, size?)          ← Zustand store (persist: 'mocellin-cart')
       └─ sameItem() helper           ← garante unicidade por (productId + size)
            └─ CartDrawer (Header)    ← contador + slide-in
                 └─ Link /checkout
                      └─ CheckoutPage (Client)
                           ├─ useCepLookup(cep)   → ViaCEP → preenche endereço
                           ├─ useFreteSimulator(cep) → POST /api/frete → Superfrete
                           └─ handleSubmit()
                                └─ buildWhatsAppUrl(OrderPayloadType)
                                     └─ window.open(url, '_blank')  → WhatsApp
                                          └─ clearCart() + router.replace('/catalogo')
```

### sameItem helper

```typescript
function sameItem(item: CartItemType, productId: string, size?: string) {
  return item.product.id === productId && item.size === size
}
```

Um anel tamanho 18 e o mesmo anel tamanho 20 são itens distintos no carrinho porque `size` difere. Um produto sem tamanho é identificado apenas pelo `productId` (ambos `size` são `undefined`).

### Formato da mensagem WhatsApp

```
🛍 *Novo Pedido — Mocellin Joias*

*Itens:*
• Brinco Dourado Gotas x2 — R$ 299,80
• Anel Prata Fina (Tam. 18) x1 — R$ 189,90

*Subtotal:* R$ 489,70
*Frete:* SEDEX — Correios — R$ 28,50
*Total:* R$ 518,20

*Pagamento:* Pix

*Cliente:* Maria Silva
*Telefone:* (54) 99999-0000

*Endereço de entrega:*
Rua das Flores, 123 — Apto 5
Centro — Caxias do Sul/RS
CEP: 95010-001
```

Para retirada no local, a linha de frete é substituída por `*Entrega:* Retirada no local` e o bloco de endereço não é incluído.

### API de Frete (`/api/frete`)

Route Handler POST que repassa a consulta para a **Superfrete API** (`https://api.superfrete.com/api/v0/calculator`). Parâmetros fixos do pacote: `weight: 0.3kg`, `width: 12cm`, `height: 4cm`, `length: 17cm`, serviços `1,2,3,4` (PAC, SEDEX e outros). CEP de origem configurável via variável de ambiente.

---

## 10. SEO e Performance

### Metadata e OG Tags

- `metadataBase: new URL('https://mocellinjoias.com.br')` definida no root layout.
- Template de título: `'%s | Mocellin Joias'` — cada page.tsx preenche `%s`.
- PDP: `generateMetadata` com `og:title`, `og:description`, `og:url`, `og:image` (1200×1200), `twitter:card: summary_large_image` usando dados reais do produto.
- Catálogo: metadata dinâmica por categoria ativa via `generateMetadata`.

### Sitemap Dinâmico

`app/sitemap.ts` gera `sitemap.xml` com:
- Homepage: priority 1, changeFrequency `daily`
- `/catalogo`: priority 0.9, changeFrequency `daily`
- Uma entrada por produto `status: 'disponivel'` com `lastModified` do campo `updated_at`, priority 0.8, changeFrequency `weekly`

### robots.txt

`app/robots.ts` gera:
- Permite `/` para todos os user agents
- Bloqueia `/admin/` e `/api/` para todos os user agents
- Aponta para `https://mocellinjoias.com.br/sitemap.xml`

### Deduplicação de Queries com `cache()`

`src/lib/campaign.ts` usa `cache()` do React para `getActiveCampaign()`. Isso evita que a mesma query seja executada duas vezes no mesmo request quando chamada pelo `(public)/layout.tsx` e pela `page.tsx` simultaneamente.

Na PDP (`/produto/[id]/page.tsx`), a função `getProduct(id)` também é envolta em `cache()`, garantindo que `generateMetadata` e o Page Component compartilhem uma única query ao banco.

### Carregamento Paralelo

- Homepage: `Promise.all([getActiveCampaign(), supabase...featured])` — campanha e produtos em paralelo.
- Edit produto (`/admin/produtos/[id]`): `Promise.all([produto, allProducts])` — produto a editar e lista de relacionados em paralelo.
- Upload de imagens/vídeos no `ProductForm`: `Promise.all([uploadImages, uploadVideos])` — buckets em paralelo.

### Imagens

`next/image` em todos os componentes com imagens externas (`ProductCard`, `ProductGallery`, `CartDrawer`, homepage hero, seção categorias). Cada uso define `sizes` correto para evitar imagens superdimensionadas.

### Tratamento de Erros

- `app/error.tsx`: `GlobalError` boundary com botão "Tentar novamente" (`reset()`) e link para homepage.
- `app/not-found.tsx`: página 404 com links para homepage e catálogo.
- Catálogo: estado de erro inline se a query Supabase falhar.
- Admin listagem: bloco de erro inline com mensagem do Supabase.

---

## 11. Configuração e Deploy

### Variáveis de Ambiente

| Chave | Onde é usada | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `proxy.ts` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | idem | Chave pública (anon key) do Supabase |
| `SUPERFRETE_TOKEN` | `app/api/frete/route.ts` | Token Bearer da API Superfrete |
| `SUPERFRETE_CEP_ORIGEM` | `app/api/frete/route.ts` | CEP de origem para cálculo de frete (CEP do estoque/loja física) |

Criar `.env.local` na raiz do projeto com essas chaves. O `.env.example` deve ser documentado com as chaves (sem valores).

### `src/lib/config.ts` — Fonte Única de Constantes

Toda configuração da loja (telefone WhatsApp, email, Instagram, URL de produção) vive exclusivamente em `src/lib/config.ts`. Nunca repetir esses valores diretamente em componentes.

```typescript
export const STORE = {
  name: 'Mocellin Joias',
  phone: '5554991379272',        // E.164 sem +
  email: 'mocellinjoias@gmail.com',
  instagram: 'mocellinjoias',
  instagramUrl: 'https://instagram.com/mocellinjoias',
  whatsappUrl: 'https://wa.me/5554991379272',
  url: 'https://mocellinjoias.com.br',
  description: '...',
} as const
```

### Deploy na Vercel

1. Conectar o repositório ao projeto Vercel.
2. Configurar as variáveis de ambiente no painel Vercel (Settings → Environment Variables).
3. Framework preset: Next.js (detectado automaticamente).
4. O domínio `mocellinjoias.com.br` deve ser apontado para a Vercel (DNS CNAME/A).
5. Deploy automático a cada push na branch principal.

---

## 12. Padrões e Convenções do Código

### Checklist Pré-Commit

- Zero ocorrências de `any` — todos os tipos explicitados via `interface` ou `type`
- `interface Props` tipada em todos os componentes com props
- Mobile-first: estilos base para mobile, breakpoints `sm:` / `md:` / `lg:` para desktop
- Estados de loading e error tratados em todos os componentes assíncronos
- Sem `console.log` no código commitado (exceto `error.tsx` que usa `console.error`)
- `next/image` em todos os usos de `<img>` externos (exceção documentada com `// eslint-disable-next-line` no ProductForm para previews de blob URL)
- `next/link` em todos os `<a>` internos
- `metadata` ou `generateMetadata` em cada `page.tsx`
- `.env.example` atualizado se nova variável for adicionada

### Convenção de Nomes de Arquivos

- Componentes React: PascalCase — `ProductCard.tsx`, `CartDrawer.tsx`
- Hooks: camelCase com prefixo `use` — `useFreteSimulator.ts`, `useCepLookup.ts`
- Libs/utilitários: camelCase — `config.ts`, `campaign.ts`, `whatsapp.ts`
- Rotas App Router: `page.tsx`, `layout.tsx`, `route.ts` (convenção Next.js)

### Server vs Client Components

Regra aplicada no projeto:

- **Server Component (padrão):** qualquer componente que apenas recebe dados e renderiza HTML. Sem interatividade, sem hooks de browser, sem estado local. Ex.: layouts, páginas de listagem, `ProductGallery` — a confirmar; `RichText`, `Footer`, `WhatsAppFloat`.
- **Client Component (`'use client'`):** qualquer componente que usa `useState`, `useEffect`, `useRouter`, `usePathname`, event handlers ou acessa `window`/`document`. Ex.: `ProductCard`, `ProductActions`, `CartDrawer`, `Header`, `CheckoutPage`, `CampaignBanner`, todos os formulários admin.

A diretiva `'use client'` deve estar na primeira linha do arquivo — apenas quando necessária.

### Como Adicionar Uma Nova Categoria de Produto

1. **`src/types/index.ts`** — adicionar o novo valor ao union type `ProductCategory`.
2. **`app/(public)/page.tsx`** — adicionar o objeto `{value, label, image}` ao array `CATEGORIES`.
3. **`app/(public)/catalogo/page.tsx`** — adicionar `{value, label}` ao array `CATEGORIES` e ao `categoryLabel` record.
4. **`app/(public)/produto/[id]/page.tsx`** — adicionar a entrada ao record `categoryLabel`.
5. **`src/components/product/ProductCard.tsx`** — adicionar ao record `categoryLabel`.
6. **`src/components/admin/ProductForm.tsx`** — adicionar ao array `CATEGORIES`.
7. **`app/(admin)/admin/page.tsx`** — adicionar ao record `CATEGORY_LABEL`.
8. **Supabase:** executar migration para atualizar o enum `category` na tabela `products`.

---

## 13. Escalabilidade — O Que Pode Ser Adicionado

A arquitetura atual é preparada para as seguintes extensões sem quebrar o que já existe:

| Extensão | O que envolve |
|---|---|
| **Controle de estoque** | Adicionar coluna `stock_quantity: number` à tabela `products`. Lógica de decremento em trigger Supabase ou Server Action no checkout |
| **Tabela de pedidos** | Criar tabelas `orders`, `order_items` e `payments` no Supabase. O `OrderPayloadType` já tem toda a estrutura necessária para popular essas tabelas |
| **Checkout nativo com gateway** | Substituir o redirect WhatsApp por uma chamada a Stripe/Pagar.me. O formulário de checkout já coleta todos os dados necessários |
| **Emissão de NF** | Integrar com API de NF-e (ex: Nuvem Fiscal) disparada em webhook após confirmação de pagamento |
| **Categorias dinâmicas** | Criar tabela `categories` no Supabase substituindo o enum hardcoded `ProductCategory`. Exige migration e refatoração dos arrays `CATEGORIES` nas páginas |
| **Login do cliente** | Ativar Supabase Auth para compradores (atualmente apenas admin usa auth). Adicionar tabelas `wishlists` e `orders` vinculadas ao `user.id` |
| **Histórico de pedidos** | Depende de login do cliente + tabela `orders`. Painel do cliente em `/conta/pedidos` |
| **Busca full-text** | Supabase suporta `fts` (full-text search) nativamente. Adicionar coluna `fts tsvector` gerada e índice GIN na tabela `products` |
| **Campanhas por categoria** | Adicionar campo `target_categories: ProductCategory[]` à tabela `campaigns` para filtrar o catálogo durante a campanha |

---

## 14. Referências Rápidas

| O que fazer | Arquivo(s) a editar |
|---|---|
| Mudar telefone, email ou Instagram da loja | `src/lib/config.ts` |
| Mudar URL de produção | `src/lib/config.ts` → `STORE.url` |
| Adicionar nova categoria de produto | Ver seção 12 — "Como Adicionar Uma Nova Categoria" (8 arquivos + migration) |
| Criar novo token de cor base | `app/globals.css` → bloco `@theme` |
| Adicionar token semântico sobrescritível por campanha | `app/globals.css` (declarar padrão) + `src/components/admin/CampaignForm.tsx` (tipo `SemanticColors` + campo no formulário) |
| Adicionar campo ao produto | `src/types/index.ts` + migration Supabase + `src/components/admin/ProductForm.tsx` |
| Ativar/desativar campanha | Painel admin → `/admin/campanhas` → botão toggle |
| Mudar pacote padrão de frete (peso/dimensões) | `app/api/frete/route.ts` → objeto `package` |
| Mudar CEP de origem do frete | Variável de ambiente `SUPERFRETE_CEP_ORIGEM` |
| Ajustar textos padrão do hero (sem campanha) | `app/(public)/page.tsx` → seção Hero (fallbacks do operador `??`) |
| Alterar preset de cores de campanha | `src/components/admin/CampaignForm.tsx` → array `PRESETS` |
| Adicionar nova rota protegida ao admin | O middleware `proxy.ts` cobre automaticamente qualquer `/admin/*` |
| Adicionar item de navegação ao footer | `src/components/ui/Footer.tsx` → array do bloco "Navegação" |
| Adicionar item de navegação ao header | `src/components/ui/Header.tsx` → bloco `<nav>` |
| Mudar formato da mensagem WhatsApp | `src/lib/cart/whatsapp.ts` → função `buildWhatsAppUrl` |
| Adicionar novo atalho de tamanho no ProductForm | `src/components/admin/ProductForm.tsx` → array de numeração (seção Tamanhos) |
