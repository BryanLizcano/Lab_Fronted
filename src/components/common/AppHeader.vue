<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { charlasService } from '@/services/charlasService';
import BaseButton from './BaseButton.vue';

const emit = defineEmits<{
  (e: 'toggleSidebar'): void;
  (e: 'openCreate'): void;
}>();

const route = useRoute();
const apiOnline = ref<boolean | null>(null);
const checking = ref(false);

const checkBackendStatus = async () => {
  checking.value = true;
  try {
    const res = await charlasService.checkHealth();
    apiOnline.value = !!res?.mensaje;
  } catch {
    apiOnline.value = false;
  } finally {
    checking.value = false;
  }
};

const routeTitle = computed(() => {
  if (route.path === '/') return 'Dashboard';
  if (route.path === '/charlas') return 'Gestión de Charlas';
  if (route.path === '/api-status') return 'Diagnóstico de la API';
  return 'Administración';
});

onMounted(() => {
  checkBackendStatus();
});
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button
        type="button"
        class="menu-toggle-btn"
        aria-label="Abrir menú"
        @click="emit('toggleSidebar')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <div class="header-title-box">
        <div class="breadcrumbs">
          <RouterLink to="/" class="breadcrumb-item">Sistema</RouterLink>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ routeTitle }}</span>
        </div>
        <h1 class="page-title">{{ routeTitle }}</h1>
      </div>
    </div>

    <div class="header-right">
      <!-- Indicador de conexión con Backend -->
      <div
        class="api-indicator"
        :class="{
          'is-online': apiOnline === true,
          'is-offline': apiOnline === false,
          'is-checking': checking
        }"
        :title="apiOnline ? 'Conectado a Lab_ServiciosWeb' : 'Desconectado del backend'"
      >
        <span class="indicator-dot"></span>
        <span class="indicator-text">
          {{ apiOnline === true ? 'Backend Activo' : apiOnline === false ? 'Sin Conexión' : 'Verificando...' }}
        </span>
      </div>

      <!-- Botón de acción rápida Crear Charla -->
      <BaseButton
        variant="primary"
        size="sm"
        @click="emit('openCreate')"
      >
        <template #prefix>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </template>
        Nueva Charla
      </BaseButton>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle-btn {
  display: none;
  background: none;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: 6px;
  color: var(--text-main);
  cursor: pointer;
}

.header-title-box {
  display: flex;
  flex-direction: column;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.breadcrumb-item:hover {
  color: var(--text-main);
}

.breadcrumb-separator {
  color: var(--text-light);
}

.breadcrumb-current {
  color: var(--text-secondary);
  font-weight: 500;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.2;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.api-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text-secondary);
}

.indicator-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--text-muted);
}

.api-indicator.is-online .indicator-dot {
  background-color: #10b981;
}

.api-indicator.is-offline .indicator-dot {
  background-color: #ef4444;
}

@media (max-width: 1024px) {
  .menu-toggle-btn {
    display: flex;
  }
}

@media (max-width: 640px) {
  .api-indicator {
    display: none;
  }
}
</style>
