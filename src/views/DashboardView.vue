<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCharlas } from '@/composables/useCharlas';
import CharlaStats from '@/components/charlas/CharlaStats.vue';
import CharlaTable from '@/components/charlas/CharlaTable.vue';
import CharlaCard from '@/components/charlas/CharlaCard.vue';
import CharlaDetailModal from '@/components/charlas/CharlaDetailModal.vue';
import CharlaFormModal from '@/components/charlas/CharlaFormModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import SkeletonLoader from '@/components/common/SkeletonLoader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import type { Charla, CharlaFormData, SortField } from '@/types/charla';

const {
  charlas,
  loading,
  error,
  filter,
  fetchCharlas,
  createCharla,
  updateCharla,
  deleteCharla,
  setSort,
} = useCharlas();

const viewMode = ref<'table' | 'cards'>('cards');
const isDetailModalOpen = ref(false);
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const selectedCharla = ref<Charla | null>(null);
const charlaToDelete = ref<Charla | null>(null);
const actionLoading = ref(false);

const openDetail = (charla: Charla) => {
  selectedCharla.value = charla;
  isDetailModalOpen.value = true;
};

const openCreate = () => {
  selectedCharla.value = null;
  isFormModalOpen.value = true;
};

const openEdit = (charla: Charla) => {
  selectedCharla.value = charla;
  isDetailModalOpen.value = false;
  isFormModalOpen.value = true;
};

const openDelete = (charla: Charla) => {
  charlaToDelete.value = charla;
  isDetailModalOpen.value = false;
  isDeleteModalOpen.value = true;
};

const handleFormSubmit = async (formData: CharlaFormData) => {
  actionLoading.value = true;
  try {
    if (selectedCharla.value) {
      await updateCharla(selectedCharla.value._id, formData);
    } else {
      await createCharla(formData);
    }
    isFormModalOpen.value = false;
  } finally {
    actionLoading.value = false;
  }
};

const handleConfirmDelete = async () => {
  if (!charlaToDelete.value) return;
  actionLoading.value = true;
  try {
    await deleteCharla(charlaToDelete.value._id);
    isDeleteModalOpen.value = false;
    charlaToDelete.value = null;
  } finally {
    actionLoading.value = false;
  }
};

// Primeras 6 charlas para el dashboard
const recentCharlas = computed(() => charlas.value.slice(0, 6));

onMounted(() => {
  fetchCharlas();
});
</script>

<template>
  <div class="dashboard-page">
    <!-- Banner de Bienvenida Minimalista -->
    <div class="welcome-banner">
      <div class="banner-text">
        <h2 class="banner-title">Panel de Control de Conferencias</h2>
        <p class="banner-subtitle">
          Administración centralizada de ponencias, expositores y fechas sincronizada con la API REST.
        </p>
      </div>

      <div class="banner-actions">
        <BaseButton variant="outline" size="sm" :loading="loading" @click="fetchCharlas">
          <template #prefix>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"></path>
            </svg>
          </template>
          Actualizar
        </BaseButton>

        <BaseButton variant="primary" size="sm" @click="openCreate">
          <template #prefix>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </template>
          Nueva Charla
        </BaseButton>
      </div>
    </div>

    <!-- Error Alert si falló la carga -->
    <div v-if="error" class="error-banner">
      <div class="error-content">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ error }}</span>
      </div>
      <BaseButton variant="outline" size="sm" @click="fetchCharlas">Reintentar</BaseButton>
    </div>

    <!-- Tarjetas de Métricas -->
    <section class="section-stats">
      <CharlaStats :charlas="charlas" :loading="loading" />
    </section>

    <!-- Sección de Conferencias Recientes -->
    <section class="section-content">
      <div class="section-header">
        <div class="header-titles">
          <h3 class="section-title">Conferencias Registradas</h3>
          <span class="section-badge">{{ charlas.length }} en total</span>
        </div>

        <div class="section-controls">
          <div class="view-toggle">
            <button
              type="button"
              class="toggle-btn"
              :class="{ 'is-active': viewMode === 'cards' }"
              title="Vista de Tarjetas"
              @click="viewMode = 'cards'"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              type="button"
              class="toggle-btn"
              :class="{ 'is-active': viewMode === 'table' }"
              title="Vista de Tabla"
              @click="viewMode = 'table'"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>

          <RouterLink to="/charlas" class="link-view-all">
            Ver todas
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </RouterLink>
        </div>
      </div>

      <!-- Estado de Carga -->
      <div v-if="loading && charlas.length === 0" class="loading-wrap">
        <SkeletonLoader :type="viewMode === 'cards' ? 'card' : 'table'" :rows="3" />
      </div>

      <!-- Estado Vacío -->
      <EmptyState
        v-else-if="!loading && charlas.length === 0"
        title="Sin conferencias registradas"
        description="Actualmente no existen charlas registradas en el backend. Puedes crear la primera ahora."
        action-text="Registrar Primera Charla"
        @action="openCreate"
      />

      <!-- Lista de Charlas -->
      <div v-else>
        <!-- Modo Cards -->
        <div v-if="viewMode === 'cards'" class="cards-grid">
          <CharlaCard
            v-for="charla in recentCharlas"
            :key="charla._id"
            :charla="charla"
            @view="openDetail"
            @edit="openEdit"
            @delete="openDelete"
          />
        </div>

        <!-- Modo Tabla -->
        <CharlaTable
          v-else
          :charlas="recentCharlas"
          :sort-by="filter.sortBy"
          :sort-order="filter.sortOrder"
          @sort="(field: SortField) => setSort(field)"
          @view="openDetail"
          @edit="openEdit"
          @delete="openDelete"
        />
      </div>
    </section>

    <!-- Modales de CRUD -->
    <CharlaDetailModal
      :is-open="isDetailModalOpen"
      :charla="selectedCharla"
      @close="isDetailModalOpen = false"
      @edit="openEdit"
      @delete="openDelete"
    />

    <CharlaFormModal
      :is-open="isFormModalOpen"
      :title="selectedCharla ? 'Editar Charla' : 'Registrar Nueva Charla'"
      :description="selectedCharla ? 'Actualiza los datos de la conferencia seleccionada.' : 'Ingresa la información requerida.'"
      :initial-data="selectedCharla"
      :loading="actionLoading"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <ConfirmModal
      :is-open="isDeleteModalOpen"
      title="Eliminar Conferencia"
      :message="`¿Estás seguro de que deseas eliminar permanentemente la charla '${charlaToDelete?.titulo || 'seleccionada'}'? Esta acción no se puede deshacer en la base de datos.`"
      confirm-text="Sí, eliminar"
      cancel-text="Cancelar"
      :loading="actionLoading"
      @confirm="handleConfirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-banner {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: var(--shadow-xs);
}

.banner-title {
  font-size: 19px;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}

.banner-subtitle {
  font-size: 13.5px;
  color: var(--text-secondary);
  max-width: 600px;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 18px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  color: #991b1b;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 500;
}

.section-stats {
  width: 100%;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-titles {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}

.section-badge {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
}

.section-controls {
  display: flex;
  align-items: center;
  gap: 14px;
}

.view-toggle {
  display: flex;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface);
  padding: 2px;
}

.toggle-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.toggle-btn:hover {
  color: var(--text-main);
}

.toggle-btn.is-active {
  background-color: var(--color-black);
  color: var(--text-inverse);
}

.link-view-all {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.link-view-all:hover {
  color: var(--color-black-hover);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.loading-wrap {
  width: 100%;
}

@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
