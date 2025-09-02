# Task Schedule

Uma aplicação moderna para gerenciamento de tarefas com controle de prazos, status e prioridades, desenvolvida com Vue 3, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### ✨ Funcionalidades Principais
- **Criação e Gerenciamento de Tarefas**: Sistema completo de CRUD para tarefas
- **Controle de Prazos**: Cálculo automático de datas finais considerando apenas dias úteis
- **Sistema de Status**: Kanban board com drag & drop para controle de progresso
- **Gestão de Responsáveis**: Atribuição de tarefas a diferentes perfis (DEV, QA, UX, etc.)
- **Controle de Prioridades**: Sistema de priorização numérica (menor = mais prioritária)
- **Tarefas Urgentes**: Sistema de marcação de urgência com bloqueio automático
- **Execução Paralela**: Suporte a tarefas que podem ser executadas simultaneamente

### 🗓️ Calendário de Dias Úteis
- **Renderização Inteligente**: Tarefas são exibidas apenas em dias úteis (segunda a sexta)
- **Múltiplas Tarefas por Dia**: Suporte a várias tarefas no mesmo dia
- **Alocação Sequencial**: Lógica automática para evitar conflitos de agenda
- **Visualização por Semana**: Layout semanal com indicação de fins de semana
- **Estatísticas de Alocação**: Métricas de distribuição de trabalho por responsável
- **Detecção de Conflitos**: Identificação automática de sobreposições de tarefas

### 🔄 Sistema de Edição
- **Edição Completa**: Formulário que se auto-preenche com dados da tarefa
- **CRUD Integrado**: Mesmo formulário para criação e edição
- **Validação Inteligente**: Verificações automáticas de conflitos e disponibilidade
- **Histórico de Alterações**: Log completo de todas as modificações

### 📊 Dashboard e Relatórios
- **Estatísticas Gerais**: Total de tarefas, dias úteis, média por dia
- **Distribuição por Responsável**: Visão detalhada da carga de trabalho
- **Análise de Conflitos**: Identificação de problemas de alocação
- **Filtros Avançados**: Busca por responsável, status e período

## 🛠️ Tecnologias

- **Frontend**: Vue 3 + TypeScript + Composition API
- **Estilização**: Tailwind CSS
- **Estado**: Pinia
- **Roteamento**: Vue Router 4
- **Ícones**: Lucide Vue
- **Build Tool**: Vite

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── forms/          # Formulários
│   ├── ui/             # Componentes de interface
│   └── BusinessDaysCalendar.vue  # Calendário de dias úteis
├── composables/         # Composables Vue
│   ├── useBusinessDaysRendering.ts  # Lógica de renderização
│   ├── useTasksAllocation.ts        # Alocação de tarefas
│   └── useCalendarMapping.ts        # Mapeamento do calendário
├── stores/              # Stores Pinia
│   └── task.store.ts    # Store principal de tarefas
├── types/               # Definições de tipos TypeScript
├── utils/               # Utilitários e helpers
└── views/               # Páginas da aplicação
    ├── HomeView.vue     # Página inicial
    ├── TaskCreateView.vue  # Criação/edição de tarefas
    ├── TasksBoardView.vue  # Quadro Kanban
    └── BusinessDaysCalendarView.vue  # Calendário de dias úteis
```

## 🚀 Como Usar

### 1. Instalação
```bash
npm install
```

### 2. Execução em Desenvolvimento
```bash
npm run dev
```

### 3. Build para Produção
```bash
npm run build
```

## 📋 Funcionalidades do Calendário de Dias Úteis

### Renderização Inteligente
- **Dias Úteis**: Tarefas são renderizadas apenas de segunda a sexta
- **Fins de Semana**: Sábados e domingos são automaticamente pulados
- **Múltiplas Tarefas**: Suporte a várias tarefas no mesmo dia
- **Indicadores Visuais**: Cores diferentes para status, prioridade e urgência

### Alocação Automática
- **Sequencial**: Tarefas não-paralelas são alocadas sequencialmente
- **Conflitos**: Detecção automática de sobreposições
- **Reorganização**: Botão para reorganizar agenda de um responsável
- **Estatísticas**: Métricas de distribuição de trabalho

### Filtros e Visualização
- **Por Responsável**: Filtrar tarefas por pessoa responsável
- **Layout Semanal**: Visualização organizada por semanas
- **Modal de Detalhes**: Clique na tarefa para ver informações completas
- **Navegação**: Links diretos para edição e visualização no quadro

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_APP_TITLE=Task Schedule
VITE_APP_DESCRIPTION=Sistema de gerenciamento de tarefas
```

### Personalização de Cores
As cores dos status e prioridades podem ser personalizadas no arquivo `src/composables/useCalendarMapping.ts`.

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando Vue 3 e TypeScript**
