<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const route = useRoute();

const currentPath = computed(() => route.path);

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'dashboard',
  },
  {
    name: 'Charlas',
    path: '/charlas',
    icon: 'mic',
  },
  {
    name: 'Diagnóstico API',
    path: '/api-status',
    icon: 'activity',
  },
];
</script>

<template>
  <!-- Overlay en móviles -->
  <div
    v-if="isOpen"
    class="sidebar-backdrop"
    @click="emit('close')"
  ></div>

  <aside class="app-sidebar" :class="{ 'is-open': isOpen }">
    <!-- Brand / Logotipo -->
    <div class="sidebar-brand">
      <div class="brand-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      </div>
      <div class="brand-text">
        <span class="brand-name">Charlas Admin</span>
        <span class="brand-badge">API REST</span>
      </div>
      <button
        type="button"
        class="sidebar-close-mobile"
        aria-label="Cerrar menú"
        @click="emit('close')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Navegación -->
    <nav class="sidebar-nav">
      <div class="nav-section-label">PRINCIPAL</div>
      <RouterLink
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        :class="{ 'is-active': currentPath === item.path }"
        @click="emit('close')"
      >
        <div class="nav-icon">
          <!-- Icono Dashboard -->
          <svg
            v-if="item.icon === 'dashboard'"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>

          <!-- Icono Mic/Charlas -->
          <svg
            v-else-if="item.icon === 'mic'"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>

          <!-- Icono Activity/Diagnóstico -->
          <svg
            v-else
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <span class="nav-text">{{ item.name }}</span>
      </RouterLink>
    </nav>

    <!-- Footer del Sidebar -->
    <div class="sidebar-footer">
      <div class="system-status-card">
        <div class="status-indicator-dot"></div>
        <div class="system-info">
          <p class="system-title">Lab_ServiciosWeb</p>
          <span class="system-desc">MongoDB Atlas conectado</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(9, 9, 11, 0.4);
  backdrop-filter: blur(2px);
  z-index: 99;
  display: block;
}

.app-sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-brand {
  height: var(--header-height);
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-light);
}

.brand-icon {
  width: 34px;
  height: 34px;
  background-color: var(--color-black);
  color: var(--text-inverse);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: -0.01em;
}

.brand-badge {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.sidebar-close-mobile {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  color: var(--text-muted);
  padding: 4px;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 0.06em;
  padding: 8px 12px 6px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.nav-link:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.nav-link.is-active {
  background-color: var(--color-black);
  color: var(--text-inverse);
}

.nav-link.is-active .nav-icon {
  color: var(--text-inverse);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-light);
}

.system-status-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-default);
}

.status-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.system-info {
  display: flex;
  flex-direction: column;
}

.system-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
}

.system-desc {
  font-size: 10.5px;
  color: var(--text-muted);
}

/* Responsividad */
@media (max-width: 1024px) {
  .app-sidebar {
    transform: translateX(-100%);
  }

  .app-sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-close-mobile {
    display: flex;
  }
}

@media (min-width: 1025px) {
  .sidebar-backdrop {
    display: none !important;
  }
}
</style>
