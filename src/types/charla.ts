export interface Expositor {
  nombre: string;
  especialidad: string;
  correo: string;
}

export interface Charla {
  _id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  expositor?: Expositor;
  __v?: number;
}

/**
 * Payload exacto que espera el backend de Lab_ServiciosWeb
 * en req.body para POST y PUT.
 */
export interface CharlaPayload {
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  expositor_nombre: string;
  expositor_especialidad: string;
  expositor_correo: string;
}

export interface CharlaFormData {
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  expositor_nombre: string;
  expositor_especialidad: string;
  expositor_correo: string;
}

export type SortField = 'fecha' | 'titulo' | 'expositor' | 'hora';
export type SortOrder = 'asc' | 'desc';

export interface CharlaFilter {
  search: string;
  especialidad: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface ApiStatus {
  online: boolean;
  message: string;
  latencyMs: number | null;
  lastChecked: Date | null;
  error?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
