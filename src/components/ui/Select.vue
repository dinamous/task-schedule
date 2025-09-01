<template>
  <select
    :class="selectVariants({ size, class: className })"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    v-bind="$attrs"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const selectVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10',
        sm: 'h-9',
        lg: 'h-11',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

interface Props {
  size?: 'default' | 'sm' | 'lg'
  className?: string
  modelValue?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  modelValue: ''
})

const className = computed(() => cn(props.className))

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>
