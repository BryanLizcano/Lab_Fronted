<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useCharlas } from '@/composables/useCharlas';
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
  especialidades,
  filteredCharlas,
  fetchCharlas,
  createCharla,
  updateCharla,
  deleteCharla,
  setSort,
  resetFilters,
} = useCharlas();

const viewMode = ref<'table' | 'cards'>('table');
const isDetailModalOpen = ref(false);
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const selectedCharla = ref<Charla | null>(null);
const charlaToDelete = ref<Charla | null>(null);
const actionLoading = ref(false);

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(8);

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredCharlas.value.length / itemsPerPage.value));
});

const paginatedCharlas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCharlas.value.slice(start, start + itemsPerPage.value);
});

// Reiniciar a página 1 cuando cambia el filtro
watch([() => filter.value.search, () => filter.value.especialidad, () => filter.value.sortBy, () => filter.value.sortOrder], () => {
  currentPage.value = 1;
});

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

onMounted(() => {
  fetchCharlas();
});
</script>

<template>
  <div class="charlas-page">
    <!-- Encabezado de la Sección -->
    <div class="page-top-bar">
      <div>
        <h2 class="top-title">Conferencias y Charlas</h2>
        <p class="top-subtitle">
          Administra el catálogo completo de ponencias registradas en la base de datos.
        </p>
      </div>

      <div class="top-actions">
        <BaseButton variant="outline" size="sm" :loading="loading" @click="fetchCharlas">
          <template #prefix>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"></path>
            </svg>
          </template>
          Recargar
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

    <!-- Barra de Filtros y Búsqueda -->
    <div class="toolbar-card">
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          v-model="filter.search"
          type="text"
          class="search-input"
          placeholder="Buscar por título, expositor, tema o correo..."
        />
        <button
          v-if="filter.search"
          type="button"
          class="clear-search-btn"
          aria-label="Borrar búsqueda"
          @click="filter.search = ''"
        >
          ✕
        </button>
      </div>

      <div class="filters-row">
        <!-- Filtro Especialidad -->
        <div class="select-wrap">
          <label class="select-label">Especialidad:</label>
          <select v-model="filter.especialidad" class="toolbar-select">
            <option value="">Todas las áreas</option>
            <option v-for="esp in especialidades" :key="esp" :value="esp">
              {{ esp }}
            </option>
          </select>
        </div>

        <!-- Ordenamiento -->
        <div class="select-wrap">
          <label class="select-label">Ordenar:</label>
          <select
            :value="filter.sortBy"
            class="toolbar-select"
            @change="filter.sortBy = ($event.target as HTMLSelectElement).value as SortField"
          >
            <option value="fecha">Fecha</option>
            <option value="titulo">Título</option>
            <option value="expositor">Expositor</option>
            <option value="hora">Hora</option>
          </select>

          <button
            type="button"
            class="sort-direction-btn"
            :title="filter.sortOrder === 'asc' ? 'Ascendente (clic para cambiar a Descendente)' : 'Descendente (clic para cambiar a Ascendente)'"
            @click="filter.sortOrder = filter.sortOrder === 'asc' ? 'desc' : 'asc'"
          >
            {{ filter.sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A' }}
          </button>
        </div>

        <!-- Selector de Vista: Tabla o Tarjetas -->
        <div class="view-switch">
          <button
            type="button"
            class="switch-btn"
            :class="{ 'is-selected': viewMode === 'table' }"
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
          <button
            type="button"
            class="switch-btn"
            :class="{ 'is-selected': viewMode === 'cards' }"
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
        </div>

        <button
          v-if="filter.search || filter.especialidad"
          type="button"
          class="reset-filters-btn"
          @click="resetFilters"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="error-banner">
      <p>{{ error }}</p>
      <BaseButton variant="outline" size="sm" @click="fetchCharlas">Reintentar</BaseButton>
    </div>

    <!-- Contenido Principal -->
    <div v-if="loading && charlas.length === 0">
      <SkeletonLoader :type="viewMode === 'table' ? 'table' : 'card'" :rows="4" />
    </div>

    <!-- Sin resultados -->
    <EmptyState
      v-else-if="filteredCharlas.length === 0"
      :title="filter.search || filter.especialidad ? 'No hay resultados para la búsqueda' : 'No hay charlas registradas'"
      :description="filter.search || filter.especialidad ? 'Intenta modificar los términos de búsqueda o restablecer los filtros.' : 'Comienza registrando tu primera conferencia.'"
      :action-text="filter.search || filter.especialidad ? 'Limpiar Filtros' : 'Crear Charla'"
      @action="filter.search || filter.especialidad ? resetFilters() : openCreate()"
    />

    <!-- Listado con Datos -->
    <div v-else class="list-wrapper">
      <!-- Tabla -->
      <CharlaTable
        v-if="viewMode === 'table'"
        :charlas="paginatedCharlas"
        :sort-by="filter.sortBy"
        :sort-order="filter.sortOrder"
        @sort="(field: SortField) => setSort(field)"
        @view="openDetail"
        @edit="openEdit"
        @delete="openDelete"
      />

      <!-- Cards Grid -->
      <div v-else class="cards-grid">
        <CharlaCard
          v-for="charla in paginatedCharlas"
          :key="charla._id"
          :charla="charla"
          @view="openDetail"
          @edit="openEdit"
          @delete="openDelete"
        />
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination-bar">
        <span class="pagination-info">
          Mostrando {{ paginatedCharlas.length }} de {{ filteredCharlas.length }} conferencias
        </span>

        <div class="pagination-controls">
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            ← Anterior
          </button>

          <span class="page-current">Página {{ currentPage }} de {{ totalPages }}</span>

          <button
            type="button"
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>

    <!-- Modales -->
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
      :description="selectedCharla ? 'Actualiza los datos de la conferencia.' : 'Completa los campos para guardar la nueva conferencia.'"
      :initial-data="selectedCharla"
      :loading="actionLoading"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <ConfirmModal
      :is-open="isDeleteModalOpen"
      title="Eliminar Conferencia"
      :message="`¿Deseas eliminar la conferencia '${charlaToDelete?.titulo || 'seleccionada'}'? Los cambios se aplicarán inmediatamente en la base de datos.`"
      confirm-text="Sí, eliminar"
      cancel-text="Cancelar"
      :loading="actionLoading"
      @confirm="handleConfirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<style scoped>
.charlas-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-top-bar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.top-title {
  font-size: 19px;
  font-weight: 600;
  color: var(--text-main);
}

.top-subtitle {
  font-size: 13.5px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.toolbar-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 260px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 8px 34px 8px 36px;
  font-size: 13.5px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  background-color: var(--bg-subtle);
  outline: none;
  transition: all 0.15s ease;
}

.search-input:focus {
  background-color: var(--bg-surface);
  border-color: var(--color-black);
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.select-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.select-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.toolbar-select {
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface);
  color: var(--text-main);
  outline: none;
  cursor: pointer;
}

.toolbar-select:focus {
  border-color: var(--color-black);
}

.sort-direction-btn {
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface);
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.15s ease;
}

.sort-direction-btn:hover {
  background-color: var(--bg-subtle);
}

.view-switch {
  display: flex;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface);
  padding: 2px;
}

.switch-btn {
  background: none;
  border: none;
  padding: 5px 8px;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.switch-btn.is-selected {
  background-color: var(--color-black);
  color: var(--text-inverse);
}

.reset-filters-btn {
  background: none;
  border: none;
  font-size: 12.5px;
  color: var(--text-main);
  text-decoration: underline;
  cursor: pointer;
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  color: #991b1b;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}

.pagination-info {
  font-size: 12.5px;
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-current {
  font-size: 12.5px;
  color: var(--text-main);
  font-weight: 500;
}

.page-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface);
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--bg-subtle);
  border-color: var(--border-dark);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-top-bar {
    flex-direction: column;
  }

  .toolbar-card {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-row {
    justify-content: space-between;
  }
}
</style>
