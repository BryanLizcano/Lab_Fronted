<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';

withDefaults(
  defineProps<{
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
  }>(),
  {
    title: 'Confirmar Acción',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    loading: false,
  }
);

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    :title="title"
    max-width="440px"
    @close="$emit('cancel')"
  >
    <div class="confirm-body">
      <div class="confirm-icon-box">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <p class="confirm-message">{{ message }}</p>
    </div>

    <template #footer>
      <BaseButton
        variant="secondary"
        size="md"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        {{ cancelText }}
      </BaseButton>
      <BaseButton
        variant="danger"
        size="md"
        :loading="loading"
        @click="$emit('confirm')"
      >
        {{ confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.confirm-body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.confirm-icon-box {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  flex-shrink: 0;
}

.confirm-message {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  padding-top: 4px;
}
</style>
