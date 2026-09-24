import { ref, computed } from 'vue';
import { charlasService } from '@/services/charlasService';
import { useToast } from './useToast';
import type {
  Charla,
  CharlaFormData,
  CharlaPayload,
  CharlaFilter,
  SortField,
  SortOrder,
} from '@/types/charla';

// Estado compartido a nivel de módulo para mantener reactividad coherente
const charlas = ref<Charla[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const selectedCharla = ref<Charla | null>(null);

const filter = ref<CharlaFilter>({
  search: '',
  especialidad: '',
  sortBy: 'fecha',
  sortOrder: 'asc',
});

export function useCharlas() {
  const toast = useToast();

  const fetchCharlas = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const data = await charlasService.getAll();
      charlas.value = Array.isArray(data) ? data : [];
    } catch (err: any) {
      const message = err.message || 'Error al obtener la lista de charlas';
      error.value = message;
      toast.error('Error de conexión', message);
    } finally {
      loading.value = false;
    }
  };

  const getCharlaById = async (id: string): Promise<Charla | null> => {
    loading.value = true;
    error.value = null;
    try {
      const data = await charlasService.getById(id);
      selectedCharla.value = data;
      return data;
    } catch (err: any) {
      const message = err.message || 'Error al consultar la charla';
      error.value = message;
      toast.error('Error', message);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createCharla = async (formData: CharlaFormData): Promise<Charla | null> => {
    loading.value = true;
    error.value = null;
    try {
      const payload: CharlaPayload = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion?.trim() || '',
        fecha: formData.fecha?.trim() || '',
        hora: formData.hora?.trim() || '',
        expositor_nombre: formData.expositor_nombre?.trim() || '',
        expositor_especialidad: formData.expositor_especialidad?.trim() || '',
        expositor_correo: formData.expositor_correo?.trim() || '',
      };

      const nuevaCharla = await charlasService.create(payload);
      charlas.value.unshift(nuevaCharla);
      toast.success('Charla Creada', `"${nuevaCharla.titulo || 'Nueva Charla'}" ha sido registrada con éxito.`);
      return nuevaCharla;
    } catch (err: any) {
      const message = err.message || 'No fue posible registrar la charla en el backend';
      error.value = message;
      toast.error('Error al Guardar', message);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateCharla = async (
    id: string,
    formData: CharlaFormData
  ): Promise<Charla | null> => {
    loading.value = true;
    error.value = null;
    try {
      const payload: CharlaPayload = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion?.trim() || '',
        fecha: formData.fecha?.trim() || '',
        hora: formData.hora?.trim() || '',
        expositor_nombre: formData.expositor_nombre?.trim() || '',
        expositor_especialidad: formData.expositor_especialidad?.trim() || '',
        expositor_correo: formData.expositor_correo?.trim() || '',
      };

      const actualizada = await charlasService.update(id, payload);
      const index = charlas.value.findIndex((c) => c._id === id);
      if (index !== -1) {
        charlas.value[index] = actualizada;
      }
      if (selectedCharla.value && selectedCharla.value._id === id) {
        selectedCharla.value = actualizada;
      }

      toast.success(
        'Charla Actualizada',
        `Los cambios en "${actualizada.titulo || 'la charla'}" se guardaron correctamente.`
      );
      return actualizada;
    } catch (err: any) {
      const message = err.message || 'No fue posible actualizar la charla';
      error.value = message;
      toast.error('Error al Actualizar', message);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteCharla = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
      await charlasService.delete(id);
      charlas.value = charlas.value.filter((c) => c._id !== id);
      if (selectedCharla.value && selectedCharla.value._id === id) {
        selectedCharla.value = null;
      }
      toast.success('Charla Eliminada', 'La charla fue eliminada del sistema.');
      return true;
    } catch (err: any) {
      const message = err.message || 'No fue posible eliminar la charla seleccionada';
      error.value = message;
      toast.error('Error al Eliminar', message);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Especialidades únicas disponibles para filtro
  const especialidades = computed(() => {
    const list = new Set<string>();
    for (const c of charlas.value) {
      if (c.expositor?.especialidad?.trim()) {
        list.add(c.expositor.especialidad.trim());
      }
    }
    return Array.from(list).sort();
  });

  // Lista filtrada y ordenada
  const filteredCharlas = computed(() => {
    let result = [...charlas.value];

    // Búsqueda por texto libre
    if (filter.value.search.trim()) {
      const q = filter.value.search.toLowerCase().trim();
      result = result.filter((item) => {
        const titulo = (item.titulo || '').toLowerCase();
        const desc = (item.descripcion || '').toLowerCase();
        const expNombre = (item.expositor?.nombre || '').toLowerCase();
        const expEsp = (item.expositor?.especialidad || '').toLowerCase();
        const expEmail = (item.expositor?.correo || '').toLowerCase();
        const fecha = (item.fecha || '').toLowerCase();
        const hora = (item.hora || '').toLowerCase();

        return (
          titulo.includes(q) ||
          desc.includes(q) ||
          expNombre.includes(q) ||
          expEsp.includes(q) ||
          expEmail.includes(q) ||
          fecha.includes(q) ||
          hora.includes(q)
        );
      });
    }

    // Filtro por especialidad
    if (filter.value.especialidad) {
      result = result.filter(
        (item) => item.expositor?.especialidad === filter.value.especialidad
      );
    }

    // Ordenamiento
    result.sort((a, b) => {
      let valA = '';
      let valB = '';

      if (filter.value.sortBy === 'titulo') {
        valA = a.titulo || '';
        valB = b.titulo || '';
      } else if (filter.value.sortBy === 'expositor') {
        valA = a.expositor?.nombre || '';
        valB = b.expositor?.nombre || '';
      } else if (filter.value.sortBy === 'hora') {
        valA = a.hora || '';
        valB = b.hora || '';
      } else {
        // default: fecha
        valA = a.fecha || '';
        valB = b.fecha || '';
      }

      const cmp = valA.localeCompare(valB, undefined, { numeric: true });
      return filter.value.sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  });

  const setSort = (field: SortField) => {
    if (filter.value.sortBy === field) {
      filter.value.sortOrder = filter.value.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      filter.value.sortBy = field;
      filter.value.sortOrder = 'asc';
    }
  };

  const resetFilters = () => {
    filter.value.search = '';
    filter.value.especialidad = '';
    filter.value.sortBy = 'fecha';
    filter.value.sortOrder = 'asc';
  };

  return {
    charlas,
    loading,
    error,
    selectedCharla,
    filter,
    especialidades,
    filteredCharlas,
    fetchCharlas,
    getCharlaById,
    createCharla,
    updateCharla,
    deleteCharla,
    setSort,
    resetFilters,
  };
}
