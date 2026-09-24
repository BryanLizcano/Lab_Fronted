<script setup lang="ts">
import BaseBadge from '@/components/common/BaseBadge.vue';
import type { Charla } from '@/types/charla';

defineProps<{
  charla: Charla;
}>();

const emit = defineEmits<{
  (e: 'view', charla: Charla): void;
  (e: 'edit', charla: Charla): void;
  (e: 'delete', charla: Charla): void;
}>();
</script>

<template>
  <div class="charla-card">
    <div class="card-header">
      <div class="badge-group">
        <BaseBadge v-if="charla.expositor?.especialidad" variant="subtle">
          {{ charla.expositor.especialidad }}
        </BaseBadge>
        <BaseBadge v-if="charla.fecha" variant="outline">
          {{ charla.fecha }}
        </BaseBadge>
      </div>

      <div class="header-menu">
        <button
          type="button"
          class="card-action-icon"
          title="Editar charla"
          @click="emit('edit', charla)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>
        <button
          type="button"
          class="card-action-icon delete-icon"
          title="Eliminar charla"
          @click="emit('delete', charla)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="card-content" @click="emit('view', charla)">
      <h3 class="card-title">{{ charla.titulo || 'Sin título definido' }}</h3>
      <p class="card-description">
        {{ charla.descripcion || 'Sin descripción detallada para esta presentación.' }}
      </p>
    </div>

    <div class="card-footer">
      <div class="speaker-meta">
        <div class="speaker-avatar-sm">
          {{ (charla.expositor?.nombre || 'E').slice(0, 1).toUpperCase() }}
        </div>
        <div class="speaker-details">
          <span class="speaker-name">{{ charla.expositor?.nombre || 'Expositor por asignar' }}</span>
          <span v-if="charla.hora" class="talk-time">{{ charla.hora }}</span>
        </div>
      </div>

      <button
        type="button"
        class="card-btn-view"
        @click="emit('view', charla)"
      >
        Detalles
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.charla-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.15s ease-in-out;
  position: relative;
}

.charla-card:hover {
  border-color: var(--border-dark);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.badge-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.header-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-action-icon {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.card-action-icon:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.delete-icon:hover {
  background-color: var(--color-black);
  color: #ffffff;
}

.card-content {
  flex: 1;
  cursor: pointer;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.35;
  margin-bottom: 6px;
}

.card-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.speaker-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.speaker-avatar-sm {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-main);
  flex-shrink: 0;
}

.speaker-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.speaker-name {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.talk-time {
  font-size: 11px;
  color: var(--text-muted);
}

.card-btn-view {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-main);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.card-btn-view:hover {
  background-color: var(--bg-subtle);
}
</style>
