<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number;
    type?: 'table' | 'card' | 'line';
  }>(),
  {
    rows: 4,
    type: 'line',
  }
);
</script>

<template>
  <div v-if="type === 'table'" class="skeleton-table">
    <div class="skeleton-header">
      <div v-for="i in 5" :key="i" class="skeleton-cell skeleton-pulse"></div>
    </div>
    <div v-for="r in rows" :key="r" class="skeleton-row">
      <div v-for="c in 5" :key="c" class="skeleton-cell skeleton-pulse"></div>
    </div>
  </div>

  <div v-else-if="type === 'card'" class="skeleton-grid">
    <div v-for="r in rows" :key="r" class="skeleton-card">
      <div class="skeleton-line w-60 skeleton-pulse"></div>
      <div class="skeleton-line w-90 skeleton-pulse"></div>
      <div class="skeleton-line w-40 skeleton-pulse"></div>
    </div>
  </div>

  <div v-else class="skeleton-lines">
    <div
      v-for="r in rows"
      :key="r"
      class="skeleton-line skeleton-pulse"
      :style="{ width: `${95 - (r % 3) * 15}%` }"
    ></div>
  </div>
</template>

<style scoped>
.skeleton-pulse {
  background: linear-gradient(
    90deg,
    var(--bg-subtle) 25%,
    var(--bg-hover) 37%,
    var(--bg-subtle) 63%
  );
  background-size: 400% 100%;
  animation: skeletonPulse 1.4s ease infinite;
}

@keyframes skeletonPulse {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.skeleton-line {
  height: 14px;
  border-radius: var(--radius-sm);
}

.w-40 { width: 40%; }
.w-60 { width: 60%; }
.w-90 { width: 90%; }

.skeleton-table {
  width: 100%;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--bg-surface);
}

.skeleton-header {
  display: grid;
  grid-template-columns: 2fr 3fr 1.5fr 1.5fr 1fr;
  gap: 16px;
  padding: 14px 20px;
  background-color: var(--bg-subtle);
  border-bottom: 1px solid var(--border-default);
}

.skeleton-row {
  display: grid;
  grid-template-columns: 2fr 3fr 1.5fr 1.5fr 1fr;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.skeleton-cell {
  height: 14px;
  border-radius: var(--radius-sm);
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.skeleton-card {
  padding: 20px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
