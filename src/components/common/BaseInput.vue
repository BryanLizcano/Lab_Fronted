<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | number;
    label?: string;
    placeholder?: string;
    type?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    id?: string;
  }>(),
  {
    type: 'text',
    required: false,
    disabled: false,
    rows: 3,
  }
);

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="form-group" :class="{ 'has-error': !!error, 'is-disabled': disabled }">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>

    <div class="input-wrapper">
      <textarea
        v-if="type === 'textarea'"
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        class="form-control form-textarea"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />

      <input
        v-else
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="form-control"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <div v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="error" class="form-error">{{ error }}</p>
    <p v-else-if="hint" class="form-hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main);
}

.required-indicator {
  color: var(--text-main);
  font-weight: 700;
  margin-left: 2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-main);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-control:focus {
  border-color: var(--color-black);
  box-shadow: 0 0 0 1px var(--color-black);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.input-suffix {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  pointer-events: none;
  color: var(--text-muted);
}

.has-error .form-control {
  border-color: #000000;
  background-color: #fafafa;
}

.has-error .form-control:focus {
  box-shadow: 0 0 0 2px #000000;
}

.form-error {
  font-size: 12px;
  color: #09090b;
  font-weight: 500;
}

.form-hint {
  font-size: 12px;
  color: var(--text-muted);
}

.is-disabled .form-control {
  background-color: var(--bg-subtle);
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
