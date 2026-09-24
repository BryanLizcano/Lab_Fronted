<script setup lang="ts">
import BaseButton from './BaseButton.vue';

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    actionText?: string;
  }>(),
  {
    title: 'No se encontraron registros',
    description: 'No hay elementos para mostrar con los filtros aplicados.',
  }
);

defineEmits<{
  (e: 'action'): void;
}>();
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon-wrap">
      <slot name="icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </slot>
    </div>
    <h4 class="empty-title">{{ title }}</h4>
    <p class="empty-desc">{{ description }}</p>
    <div v-if="actionText || $slots.action" class="empty-action">
      <slot name="action">
        <BaseButton variant="primary" size="md" @click="$emit('action')">
          {{ actionText }}
        </BaseButton>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
  background-color: var(--bg-surface);
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-lg);
  margin: 16px 0;
}

.empty-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 13px;
  color: var(--text-secondary);
  max-width: 380px;
  margin-bottom: 20px;
}

.empty-action {
  display: flex;
  gap: 12px;
}
</style>
