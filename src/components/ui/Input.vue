<template>
  <input
    :class="inputVariants({ size, class: className })"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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
