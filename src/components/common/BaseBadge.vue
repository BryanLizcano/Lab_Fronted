<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'dark' | 'outline' | 'subtle';
    size?: 'sm' | 'md';
  }>(),
  {
    variant: 'subtle',
    size: 'sm',
  }
);
</script>

<template>
  <span :class="['badge', `badge-${variant}`, `badge-${size}`]">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  border-radius: var(--radius-full);
  line-height: 1;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.badge-sm {
  font-size: 11px;
  padding: 3px 8px;
}

.badge-md {
  font-size: 12px;
  padding: 4px 10px;
}

.badge-subtle {
  background-color: var(--bg-subtle);
  color: var(--text-main);
  border: 1px solid var(--border-default);
}

.badge-outline {
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-dark);
}

.badge-dark {
  background-color: var(--color-black);
  color: var(--text-inverse);
  border: 1px solid var(--color-black);
}

.badge-default {
  background-color: var(--color-gray-ultra);
  color: var(--text-main);
  border: 1px solid var(--border-default);
}
</style>
