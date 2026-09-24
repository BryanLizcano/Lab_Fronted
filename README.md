# Sistema de Gestión de Charlas y Conferencias

Frontend desarrollado con **Vue 3** y **TypeScript** para la administración de charlas y conferencias, conectado a la API REST de `Lab_ServiciosWeb` y base de datos MongoDB Atlas.

---

## Funcionalidades Principales

- **Dashboard:** Métricas en tiempo real con total de charlas, expositores registrados y áreas temáticas.
- **Gestión Completa (CRUD):**
  - Listar conferencias.
  - Ver detalle completo de la charla y su expositor.
  - Registrar nuevas charlas con validaciones.
  - Editar conferencias existentes.
  - Eliminar registros con ventana de confirmación.
- **Filtros y Búsqueda:** Buscador reactivo, filtro por especialidad y ordenamiento múltiple.
- **Vistas Alternativas:** Cambia fácilmente entre vista de **Tabla** y vista de **Tarjetas**.
- **Diagnóstico de API:** Monitoreo en vivo de la conexión con el servidor backend y la base de datos.
- **Diseño Moderno:** Estilo minimalista profesional (blanco, negro y gris), rápido y adaptable a dispositivos móviles.

---

## Tecnologías

- **Vue 3** (Composition API)
- **TypeScript**
- **Vite**
- **Vue Router**

---

## Cómo Ejecutar el Proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el frontend
```bash
npm run dev
```
Abre en tu navegador: [http://localhost:5173](http://localhost:5173)

> **Importante:** Asegúrate de tener corriendo el backend (`Lab_ServiciosWeb`) en el puerto `3000` para que las peticiones se sincronicen con la base de datos.

### 3. Compilar para producción
```bash
npm run build
```
