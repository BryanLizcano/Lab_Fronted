<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts, remove } = useToast();
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast-item', `toast-${toast.type}`]"
        role="alert"
      >
        <div class="toast-icon">
          <!-- Check icon for success -->
          <svg
            v-if="toast.type === 'success'"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>

          <!-- Alert circle for error -->
          <svg
            v-else-if="toast.type === 'error'"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>

          <!-- Info icon for info/warning -->
          <svg
            v-else
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>

        <div class="toast-content">
          <h5 class="toast-title">{{ toast.title }}</h5>
          <p class="toast-message">{{ toast.message }}</p>
        </div>

        <button
          type="button"
          class="toast-close"
          aria-label="Cerrar notificación"
          @click="remove(toast.id)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  width: calc(100% - 48px);
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  transition: all 0.25s ease;
}

.toast-success {
  border-left: 4px solid var(--color-black);
}

.toast-error {
  background-color: #09090b;
  color: #ffffff;
  border-color: #27272a;
}

.toast-error .toast-title {
  color: #ffffff;
}

.toast-error .toast-message {
  color: #a1a1aa;
}

.toast-error .toast-icon,
.toast-error .toast-close {
  color: #ffffff;
}

.toast-info,
.toast-warning {
  border-left: 4px solid var(--color-gray-medium);
}

.toast-icon {
  margin-top: 1px;
  color: var(--text-main);
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 2px;
}

.toast-message {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  word-break: break-word;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  margin: -4px -4px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: color 0.15s ease;
}

.toast-close:hover {
  color: var(--text-main);
}

/* Animaciones */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
