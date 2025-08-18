# 🚀 Social Feed - Plataforma de Feed Social

Uma aplicação moderna de feed social construída com Next.js 14, TypeScript, Tailwind CSS e Prisma. A aplicação oferece uma experiência de usuário elegante e responsiva para visualizar posts, comentários e atividades de diferentes entidades.

## ✨ Características

- **Design Moderno**: Interface elegante com gradientes, animações suaves e tema escuro/claro
- **Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop
- **Performance Otimizada**: Carregamento rápido com Next.js 14 e otimizações de imagem
- **Sistema de Entidades**: Suporte para diferentes tipos de entidades (pessoas, organizações, etc.)
- **Comentários Inteligentes**: Sistema de comentários com suporte a IA
- **Animações Fluidas**: Transições e animações suaves para melhor UX
- **Tema Escuro/Claro**: Suporte completo para ambos os temas

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: Prisma ORM
- **UI Components**: Shadcn/ui
- **Ícones**: Lucide React
- **Animações**: CSS Custom Properties + Tailwind

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── _components/          # Componentes específicos da aplicação
│   │   ├── actions/          # Ações do servidor
│   │   ├── activity-sidebar.tsx
│   │   ├── comment-item.tsx
│   │   ├── comment-section.tsx
│   │   ├── floating-mentions.tsx
│   │   ├── post-actions.tsx
│   │   └── post-card.tsx
│   ├── admin/               # Página administrativa
│   ├── api/                 # Rotas da API
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página inicial
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes de UI base
│   ├── avata_block.tsx
│   └── avatar_entity.tsx
└── lib/                     # Utilitários e configurações
    ├── formattimeago.ts
    ├── getpostdescription.ts
    ├── newsapi.ts
    ├── prisma.ts
    └── utils.ts
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Banco de dados (PostgreSQL recomendado)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd two
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas configurações:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/social_feed"
   NEXTAUTH_SECRET="seu-secret-aqui"
   ```

4. **Configure o banco de dados**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Execute a aplicação**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

6. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🎨 Componentes Principais

### HomePage (`src/app/page.tsx`)
- Página principal com feed de posts
- Sidebar de atividades
- Design responsivo com gradientes
- Animações de carregamento

### PostCard (`src/app/_components/post-card.tsx`)
- Card individual para cada post
- Informações da entidade
- Contador de comentários
- Design moderno com hover effects

### ActivitySidebar (`src/app/_components/activity-sidebar.tsx`)
- Lista de entidades ativas
- Navegação entre entidades
- Botão de voltar quando filtrado
- Animações de hover

### CommentSection (`src/app/_components/comment-section.tsx`)
- Seção de comentários
- Linha conectora visual
- Limite de 3 comentários visíveis
- Botão "Ver mais"

### CommentItem (`src/app/_components/comment-item.tsx`)
- Item individual de comentário
- Avatar da entidade
- Badge para comentários de IA
- Timestamp formatado

## 🎯 Funcionalidades

### Feed Principal
- Visualização de posts em tempo real
- Filtro por entidade específica
- Carregamento lazy de conteúdo
- Estados de loading elegantes

### Sistema de Entidades
- Suporte para diferentes tipos de entidades
- Avatares personalizados
- Navegação entre entidades
- Menções flutuantes

### Comentários
- Sistema de comentários aninhados
- Suporte para comentários de IA
- Formatação de tempo relativo
- Interface intuitiva

### Design System
- Tema escuro/claro automático
- Gradientes modernos
- Animações CSS personalizadas
- Componentes reutilizáveis

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter
npm run type-check   # Verifica tipos TypeScript

# Banco de dados
npx prisma generate  # Gera cliente Prisma
npx prisma db push   # Sincroniza schema com banco
npx prisma studio    # Abre interface do Prisma
```

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Breakpoints Utilizados
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🎨 Personalização

### Cores e Temas
As cores são definidas usando CSS Custom Properties no arquivo `globals.css`:

```css
:root {
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  --accent: oklch(0.97 0 0);
  /* ... mais variáveis */
}
```

### Animações
Animações customizadas estão definidas em `globals.css`:

```css
@keyframes slide-in-from-bottom-4 {
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
A aplicação pode ser deployada em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Abra uma [issue](https://github.com/seu-usuario/seu-repo/issues)
2. Verifique a [documentação](https://github.com/seu-usuario/seu-repo/wiki)
3. Entre em contato: seu-email@exemplo.com

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Tailwind CSS**
