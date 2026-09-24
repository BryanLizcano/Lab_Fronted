<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    title?: string;
    description?: string;
    maxWidth?: string;
  }>(),
  {
    isOpen: false,
    maxWidth: '540px',
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
};

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-dialog" :style="{ maxWidth: maxWidth }">
          <div class="modal-header">
            <div>
              <h3 v-if="title" class="modal-title">{{ title }}</h3>
              <p v-if="description" class="modal-desc">{{ description }}</p>
            </div>
            <button
              type="button"
              class="modal-close-btn"
              aria-label="Cerrar modal"
              @click="emit('close')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(9, 9, 11, 0.6);
  backdrop-filter: blur(4px);
  padding: 16px;
}

.modal-dialog {
  width: 100%;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
  animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: -0.01em;
}

.modal-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 6px;
  margin: -6px -6px 0 0;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.modal-close-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 24px;
  background-color: var(--bg-subtle);
  border-top: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

/* Animaciones */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes modalPop {
  0% {
    transform: scale(0.96);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
