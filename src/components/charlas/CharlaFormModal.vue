<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import type { Charla, CharlaFormData } from '@/types/charla';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    title?: string;
    description?: string;
    initialData?: Charla | null;
    loading?: boolean;
  }>(),
  {
    title: 'Registrar Charla',
    initialData: null,
    loading: false,
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: CharlaFormData): void;
}>();

const form = ref<CharlaFormData>({
  titulo: '',
  descripcion: '',
  fecha: '',
  hora: '',
  expositor_nombre: '',
  expositor_especialidad: '',
  expositor_correo: '',
});

const errors = ref<Record<string, string>>({});

const validate = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!form.value.titulo.trim()) {
    errors.value.titulo = 'El título de la charla es obligatorio.';
    isValid = false;
  }

  if (!form.value.expositor_nombre.trim()) {
    errors.value.expositor_nombre = 'El nombre del expositor es obligatorio.';
    isValid = false;
  }

  if (form.value.expositor_correo.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.value.expositor_correo.trim())) {
      errors.value.expositor_correo = 'Ingresa un formato de correo electrónico válido.';
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = () => {
  if (validate()) {
    emit('submit', { ...form.value });
  }
};

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      errors.value = {};
      if (props.initialData) {
        form.value = {
          titulo: props.initialData.titulo || '',
          descripcion: props.initialData.descripcion || '',
          fecha: props.initialData.fecha || '',
          hora: props.initialData.hora || '',
          expositor_nombre: props.initialData.expositor?.nombre || '',
          expositor_especialidad: props.initialData.expositor?.especialidad || '',
          expositor_correo: props.initialData.expositor?.correo || '',
        };
      } else {
        form.value = {
          titulo: '',
          descripcion: '',
          fecha: '',
          hora: '',
          expositor_nombre: '',
          expositor_especialidad: '',
          expositor_correo: '',
        };
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    :title="title"
    :description="description"
    max-width="580px"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="charla-form">
      <div class="form-section">
        <h4 class="section-heading">Información de la Charla</h4>
        <BaseInput
          id="titulo"
          v-model="form.titulo"
          label="Título de la Conferencia"
          placeholder="Ej: Inteligencia Artificial en la Práctica"
          :required="true"
          :error="errors.titulo"
        />

        <BaseInput
          id="descripcion"
          v-model="form.descripcion"
          label="Descripción"
          type="textarea"
          :rows="3"
          placeholder="Resumen temático de los puntos clave a exponer..."
        />

        <div class="form-row">
          <BaseInput
            id="fecha"
            v-model="form.fecha"
            label="Fecha programada"
            placeholder="Ej: 15 de Octubre, 2026 o 2026-10-15"
          />

          <BaseInput
            id="hora"
            v-model="form.hora"
            label="Hora"
            placeholder="Ej: 10:00 AM o 14:30"
          />
        </div>
      </div>

      <div class="form-section">
        <h4 class="section-heading">Datos del Expositor</h4>
        <BaseInput
          id="expositor_nombre"
          v-model="form.expositor_nombre"
          label="Nombre completo"
          placeholder="Ej: Dra. Elena Rostova"
          :required="true"
          :error="errors.expositor_nombre"
        />

        <div class="form-row">
          <BaseInput
            id="expositor_especialidad"
            v-model="form.expositor_especialidad"
            label="Especialidad / Cargo"
            placeholder="Ej: Machine Learning & Cloud"
          />

          <BaseInput
            id="expositor_correo"
            v-model="form.expositor_correo"
            type="email"
            label="Correo electrónico"
            placeholder="nombre@empresa.com"
            :error="errors.expositor_correo"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <BaseButton
        variant="outline"
        size="md"
        :disabled="loading"
        @click="emit('close')"
      >
        Cancelar
      </BaseButton>

      <BaseButton
        variant="primary"
        size="md"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ initialData ? 'Guardar Cambios' : 'Registrar Charla' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.charla-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-heading {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-light);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
