<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Nome da Tarefa -->
      <div class="md:col-span-2">
        <Label for="nome">Nome da Tarefa *</Label>
        <Input
          id="nome"
          v-model="form.nome"
          type="text"
          placeholder="Digite o nome da tarefa"
          required
        />
      </div>

      <!-- Link -->
      <div class="md:col-span-2">
        <Label for="link">Link</Label>
        <Input
          id="link"
          v-model="form.link"
          type="url"
          placeholder="https://..."
        />
      </div>

      <!-- Data de Início -->
      <div>
        <Label for="dataInicio">Data de Início *</Label>
        <Input
          id="dataInicio"
          v-model="form.dataInicio"
          type="date"
          required
        />
      </div>

      <!-- Prazo em Dias -->
      <div>
        <Label for="prazoDias">Prazo (dias úteis) *</Label>
        <Input
          id="prazoDias"
          v-model.number="form.prazoDias"
          type="number"
          min="1"
          placeholder="5"
          required
        />
      </div>

      <!-- Responsável -->
      <div>
        <Label for="responsavel">Responsável *</Label>
        <Select id="responsavel" v-model="form.responsavel" required>
          <option value="">Selecione...</option>
          <option value="DEV">DEV</option>
          <option value="QA">QA</option>
          <option value="UX">UX</option>
          <option value="DESIGNER">DESIGNER</option>
          <option value="PM">PM</option>
          <option value="PO">PO</option>
        </Select>
      </div>

      <!-- Gerente -->
      <div>
        <Label for="gerente">Gerente *</Label>
        <Input
          id="gerente"
          v-model="form.gerente"
          type="text"
          placeholder="Nome do gerente"
          required
        />
      </div>

      <!-- Status -->
      <div>
        <Label for="status">Status Inicial</Label>
        <Select id="status" v-model="form.status">
          <option value="A FAZER">A FAZER</option>
          <option value="FAZENDO">FAZENDO</option>
          <option value="AGUARDANDO APROVAÇÃO">AGUARDANDO APROVAÇÃO</option>
          <option value="QA">QA</option>
          <option value="APROVADO">APROVADO</option>
        </Select>
      </div>

      <!-- Prioridade -->
      <div>
        <Label for="prioridade">Prioridade</Label>
        <Input
          id="prioridade"
          v-model.number="form.prioridade"
          type="number"
          min="1"
          placeholder="1 (mais alta)"
        />
      </div>
    </div>

    <!-- Opções -->
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <Checkbox
          id="urgente"
          v-model:checked="form.urgente"
        >
          Urgente
        </Checkbox>
        
        <Checkbox
          id="paralelo"
          v-model:checked="form.paralelo"
        >
          Permite execução paralela
        </Checkbox>
      </div>
    </div>

    <!-- Data Fim Calculada -->
    <div v-if="dataFimCalculada" class="p-4 bg-muted rounded-lg">
      <div class="text-sm text-muted-foreground">
        <strong>Data de Fim Calculada:</strong> {{ formatDate(dataFimCalculada) }}
        <span class="ml-2 text-xs">({{ form.prazoDias }} dias úteis a partir de {{ formatDate(form.dataInicio) }})</span>
      </div>
    </div>

    <!-- Botões -->
    <div class="flex justify-end space-x-4">
      <Button
        type="button"
        variant="outline"
        @click="$emit('cancel')"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Criando...' : 'Criar Tarefa' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import  Button  from '@/components/ui/Button.vue'
import  Input  from '@/components/ui/Input.vue'
import  Select  from '@/components/ui/Select.vue'
import  Checkbox from '@/components/ui/Checkbox.vue'
import  Label  from '@/components/ui/Label.vue'
import { useTaskStore } from '@/stores/task.store'
import { useUIStore } from '@/stores/ui.store'
import { calculateDataFim, formatDate } from '@/utils/date'
import type { TaskCreateInput } from '@/types/task'

const emit = defineEmits<{
  cancel: []
  created: [task: any]
}>()

const taskStore = useTaskStore()
const uiStore = useUIStore()

const isSubmitting = ref(false)

const form = ref<TaskCreateInput>({
  nome: '',
  link: '',
  dataInicio: new Date().toISOString().split('T')[0],
  prazoDias: 5,
  responsavel: '',
  gerente: '',
  status: 'A FAZER',
  prioridade: undefined,
  urgente: false,
  paralelo: false
})

const dataFimCalculada = computed(() => {
  if (form.value.dataInicio && form.value.prazoDias) {
    return calculateDataFim(form.value.dataInicio, form.value.prazoDias)
  }
  return null
})

async function handleSubmit() {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const task = await taskStore.createTask(form.value)
    
    uiStore.addNotification({
      type: 'success',
      message: `Tarefa "${task.nome}" criada com sucesso!`,
      duration: 5000
    })

    emit('created', task)
    
    // Reset form
    form.value = {
      nome: '',
      link: '',
      dataInicio: new Date().toISOString().split('T')[0],
      prazoDias: 5,
      responsavel: '',
      gerente: '',
      status: 'A FAZER',
      prioridade: undefined,
      urgente: false,
      paralelo: false
    }
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
    
    uiStore.addNotification({
      type: 'error',
      message: error instanceof Error ? error.message : 'Erro ao criar tarefa',
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
