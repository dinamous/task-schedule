<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-foreground mb-4">
        Bem-vindo ao Task Schedule
      </h1>
             <p class="text-muted-foreground mb-8">
         Sua plataforma para gerenciar tarefas com controle de prazos, status e prioridades
       </p>
       <div class="flex justify-center">
         <router-link to="/create">
           <Button size="lg">
             Criar Nova Tarefa
           </Button>
         </router-link>
       </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div class="bg-card border border-border rounded-lg p-6">
        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <Kanban class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">Quadro Kanban</h3>
        <p class="text-muted-foreground text-sm">
          Organize suas tarefas por status com drag and drop
        </p>
      </div>
      
      <div class="bg-card border border-border rounded-lg p-6">
        <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <Calendar class="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">Calendário</h3>
        <p class="text-muted-foreground text-sm">
          Visualize suas tarefas em formato de calendário
        </p>
      </div>
      
      <div class="bg-card border border-border rounded-lg p-6">
        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <Users class="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">Responsáveis</h3>
        <p class="text-muted-foreground text-sm">
          Gerencie tarefas por responsáveis e equipes
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Kanban, Calendar, Users } from 'lucide-vue-next'
import  Button from '@/components/ui/Button.vue'
</script>
