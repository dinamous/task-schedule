<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="md:col-span-2">
        <Label for="nome">Nome da Tarefa *</Label>
        <Input
          id="nome"
          :value="taskStore.formData.nome || ''"
          @input="(e) => {
            const value = (e.target as HTMLInputElement).value;
            taskStore.updateFormField('nome', value);
          }"
          type="text"
          placeholder="Digite o nome da tarefa"
          required
        />
      </div>

      <div class="md:col-span-2">
        <Label for="link">Link</Label>
        <Input
          id="link"
          :value="taskStore.formData.link || ''"
          @input="(e) => {
            const value = (e.target as HTMLInputElement).value;
            taskStore.updateFormField('link', value === '' ? undefined : value);
          }"
          type="url"
          placeholder="https://..."
        />
      </div>

      <div>
        <Label for="dataInicio">Data de Início *</Label>
        <Input
          id="dataInicio"
          :value="taskStore.formData.dataInicio || new Date().toISOString().split('T')[0]"
          @input="(e) => {
            const value = (e.target as HTMLInputElement).value;
            taskStore.updateFormField('dataInicio', value);
          }"
          type="date"
          required
        />
      </div>

      <div>
        <Label for="prazoDias">Prazo (dias úteis) *</Label>
        <Input
          id="prazoDias"
          :value="taskStore.formData.prazoDias || 5"
          @input="(e) => {
            const value = (e.target as HTMLInputElement).value;
            taskStore.updateFormField('prazoDias', Number(value) || 5);
          }"
          type="number"
          min="1"
          placeholder="5"
          required
        />
      </div>

      <div>
        <Label for="responsavel">Responsável *</Label>
        <Select 
          id="responsavel" 
          :value="taskStore.formData.responsavel || ''" 
          @change="(e) => {
            const value = (e.target as HTMLSelectElement).value;
            taskStore.updateFormField('responsavel', value);
          }"
          required
        >
          <option value="">Selecione...</option>
          <option value="DEV">DEV</option>
          <option value="QA">QA</option>
          <option value="UX">UX</option>
          <option value="DESIGNER">DESIGNER</option>
          <option value="PM">PM</option>
          <option value="PO">PO</option>
        </Select>
      </div>

      <div>
        <Label for="gerente">Gerente *</Label>
        <Input
          id="gerente"
          :value="taskStore.formData.gerente || ''"
          @input="(e) => {
            const value = (e.target as HTMLInputElement).value;
            taskStore.updateFormField('gerente', value);
          }"
          type="text"
          placeholder="Nome do gerente"
          required
        />
      </div>

      <div>
        <Label for="status">Status Inicial</Label>
        <Select 
          id="status" 
          :value="taskStore.formData.status || 'A FAZER'"
          @change="(e) => {
            const value = (e.target as HTMLSelectElement).value;
            taskStore.updateFormField('status', value);
          }"
        >
          <option value="A FAZER">A FAZER</option>
          <option value="FAZENDO">FAZENDO</option>
          <option value="AGUARDANDO APROVAÇÃO">AGUARDANDO APROVAÇÃO</option>
          <option value="QA">QA</option>
          <option value="APROVADO">APROVADO</option>
        </Select>
      </div>

      <div>
        <Label for="prioridade">Prioridade</Label>
        <Input
          id="prioridade"
          :value="taskStore.formData.prioridade || ''"
          @input="(e) => {
            const value = (e.target as HTMLInputElement).value;
            taskStore.updateFormField('prioridade', value === '' ? undefined : Number(value));
          }"
          type="number"
          min="1"
          placeholder="1 (mais alta)"
        />
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <Checkbox
          id="urgente"
          :checked="taskStore.formData.urgente"
          @change="(e) => taskStore.updateFormField('urgente', (e.target as HTMLInputElement).checked)"
        >
          Urgente
        </Checkbox>
        
        <Checkbox
          id="paralelo"
          :checked="taskStore.formData.paralelo"
          @change="(e) => taskStore.updateFormField('paralelo', (e.target as HTMLInputElement).checked)"
        >
          Permite execução paralela
        </Checkbox>
      </div>
    </div>

    <div v-if="dataFimCalculada" class="p-4 bg-muted rounded-lg">
      <div class="text-sm text-muted-foreground">
        <div class="flex items-center gap-2 mb-1">
          <strong>📅 Data de Fim Calculada:</strong>
          <span class="font-mono text-foreground">{{ formatDate(dataFimCalculada) }}</span>
        </div>
        <div class="text-xs opacity-75">
          {{ taskStore.formData.prazoDias }} dias úteis a partir de {{ formatDate(taskStore.formData.dataInicio) }}
          <span class="ml-2">(excluindo sábados e domingos)</span>
        </div>
      </div>
    </div>
    
    <div v-if="taskStore.formData.nome && taskStore.formData.responsavel && taskStore.formData.gerente" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="text-sm">
        <div class="font-medium text-blue-800 dark:text-blue-200 mb-2">👀 Preview da Tarefa:</div>
        <div class="space-y-1 text-blue-700 dark:text-blue-300">
          <div><strong>Nome:</strong> {{ taskStore.formData.nome }}</div>
          <div><strong>Responsável:</strong> {{ taskStore.formData.responsavel }}</div>
          <div><strong>Gerente:</strong> {{ taskStore.formData.gerente }}</div>
          <div v-if="taskStore.formData.link"><strong>Link:</strong> {{ taskStore.formData.link }}</div>
          <div><strong>Status:</strong> {{ taskStore.formData.status }}</div>
          <div v-if="taskStore.formData.prioridade"><strong>Prioridade:</strong> {{ taskStore.formData.prioridade }}</div>
          <div v-if="taskStore.formData.urgente" class="text-red-600 font-medium">🚨 URGENTE</div>
          <div v-if="taskStore.formData.paralelo" class="text-blue-600 font-medium">🔄 EXECUÇÃO PARALELA</div>
        </div>
      </div>
    </div>

    <div class="flex justify-between">
      <Button
        type="button"
        variant="outline"
        @click="handleReset"
      >
        Limpar Formulário
      </Button>
      <Button
        type="submit"
        :loading="isSubmitting"
      >
        Criar Tarefa
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Label from '@/components/ui/Label.vue'
import { useTaskStore } from '@/stores/task.store'
import { useUIStore } from '@/stores/ui.store'
import { calculateDataFim, formatDate } from '@/utils/date'

const emit = defineEmits<{
  cancel: []
  created: [task: any]
}>()

const taskStore = useTaskStore()
const uiStore = useUIStore()

const isSubmitting = ref(false)

const dataFimCalculada = computed(() => {
  if (taskStore.formData.dataInicio && taskStore.formData.prazoDias && Number(taskStore.formData.prazoDias) > 0) {
    return calculateDataFim(taskStore.formData.dataInicio, Number(taskStore.formData.prazoDias))
  }
  return null
})

function handleReset() {
  taskStore.resetForm()
}

async function handleSubmit() {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    // Usar a função submitForm da store que já faz toda a validação
    const task = await taskStore.submitForm()

    uiStore.addNotification({
      type: 'success',
      message: `Tarefa "${task.nome}" criada com sucesso!`,
      duration: 5000
    })

    emit('created', task)
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