<template>
  <label
    :class="labelVariants({ class: className })"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {},
    defaultVariants: {},
  }
)

interface Props {
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

const className = computed(() => cn(props.className))
</script>
