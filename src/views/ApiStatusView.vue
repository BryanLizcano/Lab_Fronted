<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { charlasService } from '@/services/charlasService';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseBadge from '@/components/common/BaseBadge.vue';

interface EndpointCheck {
  path: string;
  method: string;
  description: string;
  status: 'pending' | 'success' | 'error';
  latency: number | null;
  statusCode: number | null;
  response: any;
}

const checking = ref(false);
const serverUrl = ref(import.meta.env.VITE_API_URL || '/api (Proxy a http://localhost:3000)');

const checks = ref<EndpointCheck[]>([
  {
    path: '/',
    method: 'GET',
    description: 'Ruta principal y comprobación de salud del servidor Express',
    status: 'pending',
    latency: null,
    statusCode: null,
    response: null,
  },
  {
    path: '/charlas',
    method: 'GET',
    description: 'Conexión a MongoDB Atlas y obtención de colección de charlas',
    status: 'pending',
    latency: null,
    statusCode: null,
    response: null,
  },
]);

const runDiagnostics = async () => {
  checking.value = true;

  const checkRoot = checks.value[0];
  const checkCharlas = checks.value[1];

  // 1. Probar GET /
  if (checkRoot) {
    checkRoot.status = 'pending';
    const start1 = performance.now();
    try {
      const res = await charlasService.checkHealth();
      checkRoot.latency = Math.round(performance.now() - start1);
      checkRoot.statusCode = 200;
      checkRoot.response = res;
      checkRoot.status = 'success';
    } catch (err: any) {
      checkRoot.latency = Math.round(performance.now() - start1);
      checkRoot.statusCode = err.status || 500;
      checkRoot.response = err.data || err.message;
      checkRoot.status = 'error';
    }
  }

  // 2. Probar GET /charlas
  if (checkCharlas) {
    checkCharlas.status = 'pending';
    const start2 = performance.now();
    try {
      const res = await charlasService.getAll();
      checkCharlas.latency = Math.round(performance.now() - start2);
      checkCharlas.statusCode = 200;
      checkCharlas.response = {
        totalRecibidos: res.length,
        muestra: res.slice(0, 2),
      };
      checkCharlas.status = 'success';
    } catch (err: any) {
      checkCharlas.latency = Math.round(performance.now() - start2);
      checkCharlas.statusCode = err.status || 500;
      checkCharlas.response = err.data || err.message;
      checkCharlas.status = 'error';
    }
  }

  checking.value = false;
};

onMounted(() => {
  runDiagnostics();
});
</script>

<template>
  <div class="api-status-page">
    <!-- Header -->
    <div class="status-top">
      <div>
        <h2 class="status-title">Diagnóstico de la API REST</h2>
        <p class="status-subtitle">
          Supervisa en tiempo real el enlace de comunicación entre el frontend y el backend en Node.js.
        </p>
      </div>

      <BaseButton
        variant="primary"
        size="sm"
        :loading="checking"
        @click="runDiagnostics"
      >
        <template #prefix>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </template>
        Ejecutar Pruebas
      </BaseButton>
    </div>

    <!-- Info del entorno -->
    <div class="env-info-card">
      <div class="env-item">
        <span class="env-label">Destino de la API:</span>
        <code class="env-code">{{ serverUrl }}</code>
      </div>
      <div class="env-item">
        <span class="env-label">Motor Backend:</span>
        <span class="env-text">Express 5.2.1 en Node.js v24</span>
      </div>
      <div class="env-item">
        <span class="env-label">Base de Datos:</span>
        <span class="env-text">MongoDB Atlas Cluster (Mongoose 9.9.4)</span>
      </div>
    </div>

    <!-- Resultados de los Endpoints -->
    <div class="checks-list">
      <div
        v-for="check in checks"
        :key="check.path"
        class="check-card"
        :class="[`check-${check.status}`]"
      >
        <div class="check-header">
          <div class="check-info">
            <div class="method-path">
              <span class="http-badge">{{ check.method }}</span>
              <span class="path-text">{{ check.path }}</span>
            </div>
            <p class="check-desc">{{ check.description }}</p>
          </div>

          <div class="check-meta">
            <BaseBadge
              :variant="check.status === 'success' ? 'dark' : check.status === 'error' ? 'default' : 'subtle'"
            >
              {{ check.status === 'success' ? 'Operativo' : check.status === 'error' ? 'Error' : 'Verificando...' }}
            </BaseBadge>

            <span v-if="check.latency !== null" class="latency-tag">
              {{ check.latency }} ms
            </span>
          </div>
        </div>

        <div v-if="check.response" class="response-viewer">
          <span class="response-label">Respuesta del servidor:</span>
          <pre class="json-box"><code>{{ JSON.stringify(check.response, null, 2) }}</code></pre>
        </div>
      </div>
    </div>

    <!-- Referencia de Endpoints del Backend -->
    <div class="reference-card">
      <h3 class="reference-title">Endpoints de Lab_ServiciosWeb Implementados</h3>
      <table class="ref-table">
        <thead>
          <tr>
            <th>Método</th>
            <th>Ruta</th>
            <th>Función</th>
            <th>Cuerpo de Petición (Payload)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>GET</code></td>
            <td><code>/</code></td>
            <td>Mensaje de bienvenida y health check</td>
            <td>Ninguno</td>
          </tr>
          <tr>
            <td><code>GET</code></td>
            <td><code>/charlas</code></td>
            <td>Obtener listado completo de charlas</td>
            <td>Ninguno</td>
          </tr>
          <tr>
            <td><code>GET</code></td>
            <td><code>/charlas/:id</code></td>
            <td>Obtener detalle de charla por ObjectId</td>
            <td>Parámetro en URL</td>
          </tr>
          <tr>
            <td><code>POST</code></td>
            <td><code>/charlas</code></td>
            <td>Crear una nueva charla</td>
            <td><code>{ titulo, descripcion, fecha, hora, expositor_nombre, expositor_especialidad, expositor_correo }</code></td>
          </tr>
          <tr>
            <td><code>PUT</code></td>
            <td><code>/charlas/:id</code></td>
            <td>Actualizar una charla existente</td>
            <td><code>{ titulo, descripcion, fecha, hora, expositor_nombre, expositor_especialidad, expositor_correo }</code></td>
          </tr>
          <tr>
            <td><code>DELETE</code></td>
            <td><code>/charlas/:id</code></td>
            <td>Eliminar una charla de MongoDB</td>
            <td>Parámetro en URL</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.api-status-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.status-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.status-title {
  font-size: 19px;
  font-weight: 600;
  color: var(--text-main);
}

.status-subtitle {
  font-size: 13.5px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.env-info-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.env-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.env-label {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.env-code {
  font-family: monospace;
  font-size: 12.5px;
  background-color: var(--bg-subtle);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  color: var(--text-main);
  word-break: break-all;
}

.env-text {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-main);
}

.checks-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.check-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.check-success {
  border-left: 4px solid var(--color-black);
}

.check-error {
  border-left: 4px solid #ef4444;
}

.check-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.check-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.method-path {
  display: flex;
  align-items: center;
  gap: 8px;
}

.http-badge {
  font-size: 11px;
  font-weight: 700;
  background-color: var(--color-black);
  color: var(--text-inverse);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.05em;
}

.path-text {
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.check-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

.check-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.latency-tag {
  font-size: 12px;
  font-family: monospace;
  color: var(--text-muted);
}

.response-viewer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.response-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.json-box {
  background-color: #09090b;
  color: #f4f4f5;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  overflow-x: auto;
  max-height: 220px;
}

.reference-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-x: auto;
}

.reference-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

.ref-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.ref-table th {
  text-align: left;
  padding: 10px 14px;
  background-color: var(--bg-subtle);
  border-bottom: 1px solid var(--border-default);
  font-size: 11.5px;
  color: var(--text-light);
  text-transform: uppercase;
}

.ref-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-secondary);
}

.ref-table code {
  background-color: var(--bg-subtle);
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-main);
}
</style>
