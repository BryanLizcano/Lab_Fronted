<script setup lang="ts">
import { ref } from 'vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import AppHeader from '@/components/common/AppHeader.vue';
import ToastContainer from '@/components/common/ToastContainer.vue';
import CharlaFormModal from '@/components/charlas/CharlaFormModal.vue';
import { useCharlas } from '@/composables/useCharlas';

const isSidebarOpen = ref(false);
const isCreateModalOpen = ref(false);

const { createCharla } = useCharlas();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const handleCreateSubmit = async (formData: any) => {
  const result = await createCharla(formData);
  if (result) {
    isCreateModalOpen.value = false;
  }
};
</script>

<template>
  <div class="main-layout">
    <!-- Barra lateral -->
    <AppSidebar :is-open="isSidebarOpen" @close="closeSidebar" />

    <!-- Área principal -->
    <div class="main-content-wrapper">
      <!-- Encabezado superior -->
      <AppHeader
        @toggle-sidebar="toggleSidebar"
        @open-create="isCreateModalOpen = true"
      />

      <!-- Contenedor del contenido -->
      <main class="page-content">
        <slot />
      </main>
    </div>

    <!-- Modal global de creación rápida -->
    <CharlaFormModal
      :is-open="isCreateModalOpen"
      title="Registrar Nueva Charla"
      description="Ingresa los datos de la charla y el expositor para sincronizar con la base de datos."
      @close="isCreateModalOpen = false"
      @submit="handleCreateSubmit"
    />

    <!-- Contenedor de notificaciones Toast -->
    <ToastContainer />
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: var(--bg-app);
}

.main-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: padding-left 0.25s ease;
}

.page-content {
  flex: 1;
  padding: 24px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

@media (min-width: 1025px) {
  .main-content-wrapper {
    padding-left: var(--sidebar-width);
  }
}

@media (max-width: 640px) {
  .page-content {
    padding: 16px;
  }
}
</style>
