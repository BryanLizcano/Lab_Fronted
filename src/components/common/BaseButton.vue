<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    block?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
    block: false,
  }
);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-block': block, 'btn-loading': loading }
    ]"
  >
    <svg
      v-if="loading"
      class="btn-spinner"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span class="btn-content" :class="{ 'opacity-0': loading }">
      <slot name="prefix" />
      <slot />
      <slot name="suffix" />
    </span>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;
  user-select: none;
  position: relative;
}

.btn-block {
  width: 100%;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Tamaños */
.btn-sm {
  font-size: 12px;
  padding: 6px 12px;
  height: 32px;
}

.btn-md {
  font-size: 14px;
  padding: 8px 16px;
  height: 38px;
}

.btn-lg {
  font-size: 15px;
  padding: 10px 20px;
  height: 44px;
}

/* Variantes monocromáticas */
.btn-primary {
  background-color: var(--color-black);
  color: var(--text-inverse);
  border-color: var(--color-black);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-black-hover);
  border-color: var(--color-black-hover);
}

.btn-secondary {
  background-color: var(--bg-subtle);
  color: var(--text-main);
  border-color: var(--border-default);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-hover);
}

.btn-outline {
  background-color: transparent;
  color: var(--text-main);
  border-color: var(--border-default);
}

.btn-outline:hover:not(:disabled) {
  background-color: var(--bg-subtle);
  border-color: var(--border-dark);
}

.btn-danger {
  background-color: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}

.btn-danger:hover:not(:disabled) {
  background-color: #000000;
  border-color: #000000;
}

.btn-ghost {
  background-color: transparent;
  color: var(--text-secondary);
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.btn-spinner {
  position: absolute;
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.opacity-0 {
  opacity: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
