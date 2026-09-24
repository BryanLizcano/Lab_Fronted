<script setup lang="ts">
import BaseBadge from '@/components/common/BaseBadge.vue';
import type { Charla, SortField, SortOrder } from '@/types/charla';

defineProps<{
  charlas: Charla[];
  sortBy: SortField;
  sortOrder: SortOrder;
}>();

const emit = defineEmits<{
  (e: 'sort', field: SortField): void;
  (e: 'view', charla: Charla): void;
  (e: 'edit', charla: Charla): void;
  (e: 'delete', charla: Charla): void;
}>();
</script>

<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th class="th-sortable" @click="emit('sort', 'titulo')">
            <div class="th-content">
              <span>Conferencia</span>
              <span v-if="sortBy === 'titulo'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>

          <th class="th-sortable" @click="emit('sort', 'expositor')">
            <div class="th-content">
              <span>Expositor & Especialidad</span>
              <span v-if="sortBy === 'expositor'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>

          <th class="th-sortable" @click="emit('sort', 'fecha')">
            <div class="th-content">
              <span>Fecha & Hora</span>
              <span v-if="sortBy === 'fecha'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>

          <th>Contacto</th>

          <th class="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="charla in charlas" :key="charla._id" class="table-row">
          <!-- Conferencia -->
          <td class="cell-main" @click="emit('view', charla)">
            <div class="talk-title-box">
              <span class="talk-title">{{ charla.titulo || 'Sin título' }}</span>
              <span v-if="charla.descripcion" class="talk-desc-preview">
                {{ charla.descripcion }}
              </span>
            </div>
          </td>

          <!-- Expositor -->
          <td>
            <div class="speaker-cell">
              <span class="speaker-name-cell">{{ charla.expositor?.nombre || 'No asignado' }}</span>
              <BaseBadge v-if="charla.expositor?.especialidad" variant="subtle" size="sm">
                {{ charla.expositor.especialidad }}
              </BaseBadge>
            </div>
          </td>

          <!-- Fecha y Hora -->
          <td>
            <div class="schedule-cell">
              <span class="date-text">{{ charla.fecha || 'Sin fecha' }}</span>
              <span v-if="charla.hora" class="time-text">{{ charla.hora }}</span>
            </div>
          </td>

          <!-- Contacto -->
          <td>
            <a
              v-if="charla.expositor?.correo"
              :href="`mailto:${charla.expositor.correo}`"
              class="email-link"
              :title="charla.expositor.correo"
            >
              {{ charla.expositor.correo }}
            </a>
            <span v-else class="text-muted-dash">—</span>
          </td>

          <!-- Acciones -->
          <td class="text-right">
            <div class="actions-group">
              <button
                type="button"
                class="action-btn"
                title="Ver detalle"
                @click="emit('view', charla)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>

              <button
                type="button"
                class="action-btn"
                title="Editar"
                @click="emit('edit', charla)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>

              <button
                type="button"
                class="action-btn action-btn-danger"
                title="Eliminar"
                @click="emit('delete', charla)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
}

thead th {
  padding: 12px 18px;
  background-color: var(--bg-subtle);
  border-bottom: 1px solid var(--border-default);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}

.th-sortable {
  cursor: pointer;
  user-select: none;
}

.th-sortable:hover {
  color: var(--text-main);
}

.th-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sort-icon {
  font-size: 12px;
  color: var(--text-main);
}

tbody tr {
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.1s ease;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background-color: #fafafa;
}

td {
  padding: 14px 18px;
  vertical-align: middle;
  color: var(--text-secondary);
}

.cell-main {
  cursor: pointer;
}

.talk-title-box {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 320px;
}

.talk-title {
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.3;
}

.talk-desc-preview {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.speaker-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.speaker-name-cell {
  font-weight: 500;
  color: var(--text-main);
}

.schedule-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: nowrap;
}

.date-text {
  font-weight: 500;
  color: var(--text-main);
}

.time-text {
  font-size: 11.5px;
  color: var(--text-muted);
}

.email-link {
  color: var(--text-secondary);
  font-size: 12.5px;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.email-link:hover {
  color: var(--text-main);
}

.text-muted-dash {
  color: var(--text-light);
}

.text-right {
  text-align: right;
}

.actions-group {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  background: none;
  border: 1px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background-color: var(--bg-subtle);
  border-color: var(--border-default);
  color: var(--text-main);
}

.action-btn-danger:hover {
  background-color: var(--color-black);
  border-color: var(--color-black);
  color: #ffffff;
}
</style>
