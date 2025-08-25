# Task Schedule

Uma plataforma moderna para gerenciamento de tarefas com controle de prazos, status, prioridades e visualização em quadro Kanban e calendário.

## 🚀 Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **Pinia** - Gerenciamento de estado
- **TailwindCSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI modernos
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server

## ✨ Funcionalidades

- ✅ **Setup do Projeto** - Estrutura base com Vue 3, Pinia e TailwindCSS
- ✅ **Tema Claro/Escuro** - Suporte completo a temas com persistência
- ✅ **Interface Responsiva** - Design mobile-first
- ✅ **Componentização** - Estrutura escalável de componentes
- 🔄 **Quadro Kanban** - Organização de tarefas por status
- 🔄 **Calendário** - Visualização temporal das tarefas
- 🔄 **Gerenciamento de Tarefas** - CRUD completo
- 🔄 **Responsáveis** - Atribuição e controle por usuários

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do shadcn/ui
│   ├── calendar/       # Componentes específicos do calendário
│   ├── kanban/         # Componentes específicos do Kanban
│   ├── forms/          # Componentes de formulário
│   └── common/         # Componentes comuns
├── composables/        # Composables Vue
├── stores/             # Stores do Pinia
├── views/              # Páginas/Views da aplicação
├── lib/                # Utilitários e configurações
└── types/              # Definições de tipos TypeScript
```

## 🎨 Design System

O projeto utiliza o design system do shadcn/ui com:

- **Cores**: Sistema de cores HSL com suporte a tema escuro
- **Tipografia**: Escala tipográfica consistente
- **Espaçamento**: Sistema de espaçamento baseado em TailwindCSS
- **Componentes**: Biblioteca de componentes acessíveis e customizáveis

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linting do código
- `npm run format` - Formatação do código
- `npm run stylelint` - Linting de estilos

## 📝 Próximos Passos

1. **Step 2** - Implementação do Quadro Kanban
2. **Step 3** - Implementação do Calendário
3. **Step 4** - Sistema de Gerenciamento de Tarefas
4. **Step 5** - Sistema de Responsáveis
5. **Step 6** - Funcionalidades Avançadas

## 🤝 Contribuição

Este projeto segue as melhores práticas de desenvolvimento frontend:

- **Clean Code** - Código limpo e legível
- **Componentização** - Componentes pequenos e focados
- **TypeScript** - Tipagem estática para maior segurança
- **Acessibilidade** - Componentes acessíveis por padrão
- **Performance** - Otimizações de performance
