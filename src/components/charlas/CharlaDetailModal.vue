<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseBadge from '@/components/common/BaseBadge.vue';
import type { Charla } from '@/types/charla';

defineProps<{
  isOpen: boolean;
  charla: Charla | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', charla: Charla): void;
  (e: 'delete', charla: Charla): void;
}>();
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    title="Detalles de la Charla"
    max-width="560px"
    @close="emit('close')"
  >
    <div v-if="charla" class="detail-container">
      <div class="detail-main-header">
        <div class="title-wrap">
          <h3 class="detail-title">{{ charla.titulo || 'Sin título definido' }}</h3>
          <div class="badges-row">
            <BaseBadge v-if="charla.expositor?.especialidad" variant="subtle">
              {{ charla.expositor.especialidad }}
            </BaseBadge>
            <BaseBadge v-if="charla.fecha" variant="outline">
              📅 {{ charla.fecha }}
            </BaseBadge>
            <BaseBadge v-if="charla.hora" variant="outline">
              ⏰ {{ charla.hora }}
            </BaseBadge>
          </div>
        </div>
      </div>

      <div class="detail-field">
        <label class="field-label">Descripción</label>
        <p class="field-value description-text">
          {{ charla.descripcion || 'Sin descripción disponible para esta conferencia.' }}
        </p>
      </div>

      <!-- Sección Expositor -->
      <div class="detail-speaker-card">
        <div class="speaker-avatar">
          {{ (charla.expositor?.nombre || 'E').slice(0, 2).toUpperCase() }}
        </div>
        <div class="speaker-info">
          <h4 class="speaker-name">{{ charla.expositor?.nombre || 'Expositor no asignado' }}</h4>
          <span class="speaker-spec">{{ charla.expositor?.especialidad || 'Especialidad no especificada' }}</span>
          <a
            v-if="charla.expositor?.correo"
            :href="`mailto:${charla.expositor.correo}`"
            class="speaker-email-link"
          >
            ✉️ {{ charla.expositor.correo }}
          </a>
        </div>
      </div>

      <!-- Metadatos de MongoDB -->
      <div class="metadata-section">
        <div class="metadata-item">
          <span class="metadata-label">ID de Base de Datos:</span>
          <code class="metadata-code">{{ charla._id }}</code>
        </div>
        <div v-if="charla.__v !== undefined" class="metadata-item">
          <span class="metadata-label">Versión de Documento:</span>
          <span class="metadata-value">v{{ charla.__v }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer-actions">
        <BaseButton
          variant="danger"
          size="sm"
          @click="charla && emit('delete', charla)"
        >
          Eliminar
        </BaseButton>
        <div class="footer-right-actions">
          <BaseButton
            variant="outline"
            size="sm"
            @click="emit('close')"
          >
            Cerrar
          </BaseButton>
          <BaseButton
            variant="primary"
            size="sm"
            @click="charla && emit('edit', charla)"
          >
            Editar
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.3;
}

.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.description-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
}

.detail-speaker-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}

.speaker-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--color-black);
  color: var(--text-inverse);
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.speaker-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.speaker-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.speaker-spec {
  font-size: 12.5px;
  color: var(--text-secondary);
}

.speaker-email-link {
  font-size: 12px;
  color: var(--text-main);
  text-decoration: underline;
  margin-top: 2px;
}

.metadata-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border-light);
}

.metadata-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11.5px;
}

.metadata-label {
  color: var(--text-muted);
}

.metadata-code {
  font-family: monospace;
  background-color: var(--bg-subtle);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  color: var(--text-main);
}

.metadata-value {
  color: var(--text-secondary);
  font-weight: 500;
}

.modal-footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.footer-right-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
