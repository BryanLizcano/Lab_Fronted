<script setup lang="ts">
import { computed } from 'vue';
import type { Charla } from '@/types/charla';

const props = defineProps<{
  charlas: Charla[];
  loading?: boolean;
}>();

const totalCharlas = computed(() => props.charlas.length);

const expositoresUnicos = computed(() => {
  const set = new Set<string>();
  for (const c of props.charlas) {
    if (c.expositor?.nombre?.trim()) {
      set.add(c.expositor.nombre.trim());
    }
  }
  return set.size;
});

const especialidadesUnicas = computed(() => {
  const set = new Set<string>();
  for (const c of props.charlas) {
    if (c.expositor?.especialidad?.trim()) {
      set.add(c.expositor.especialidad.trim());
    }
  }
  return set.size;
});
</script>

<template>
  <div class="stats-grid">
    <!-- Card 1 -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Total de Conferencias</span>
        <div class="stat-icon-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
      </div>
      <div class="stat-value">
        <span v-if="loading" class="stat-skeleton">--</span>
        <span v-else>{{ totalCharlas }}</span>
      </div>
      <p class="stat-hint">Charlas almacenadas en MongoDB</p>
    </div>

    <!-- Card 2 -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Expositores Únicos</span>
        <div class="stat-icon-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      </div>
      <div class="stat-value">
        <span v-if="loading" class="stat-skeleton">--</span>
        <span v-else>{{ expositoresUnicos }}</span>
      </div>
      <p class="stat-hint">Ponentes con contacto directo</p>
    </div>

    <!-- Card 3 -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Áreas Temáticas</span>
        <div class="stat-icon-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
        </div>
      </div>
      <div class="stat-value">
        <span v-if="loading" class="stat-skeleton">--</span>
        <span v-else>{{ especialidadesUnicas }}</span>
      </div>
      <p class="stat-hint">Especialidades distintas registradas</p>
    </div>

    <!-- Card 4 -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Base de Datos</span>
        <div class="stat-icon-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
        </div>
      </div>
      <div class="stat-value stat-status">
        <span class="live-dot"></span>
        <span>Atlas Cloud</span>
      </div>
      <p class="stat-hint">Colección: charlas (Mongoose)</p>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: var(--shadow-xs);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stat-label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
}

.stat-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.02em;
  line-height: 1;
}

.stat-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
}

.live-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #10b981;
}

.stat-hint {
  font-size: 11.5px;
  color: var(--text-muted);
}
</style>
