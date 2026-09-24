<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue';
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-box">
      <span class="code-badge">404</span>
      <h2 class="not-found-title">Página No Encontrada</h2>
      <p class="not-found-desc">
        La ruta a la que intentas acceder no existe en la consola administrativa.
      </p>
      <RouterLink to="/">
        <BaseButton variant="primary" size="md">
          Volver al Dashboard
        </BaseButton>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.not-found-box {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: 48px 32px;
  text-align: center;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
}

.code-badge {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  background-color: var(--bg-subtle);
  border: 1px solid var(--border-default);
  color: var(--text-main);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.not-found-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-main);
}

.not-found-desc {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
}
</style>
