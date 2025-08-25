<template>
  <div class="flex items-center space-x-2">
    <input
      type="checkbox"
      :class="checkboxVariants({ class: className })"
      v-bind="$attrs"
    />
    <label v-if="$slots.default" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
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
