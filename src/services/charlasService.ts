import { api } from './api';
import type { Charla, CharlaPayload } from '@/types/charla';

export const charlasService = {
  /**
   * Obtiene la lista completa de charlas registradas en el backend
   * Endpoint: GET /charlas
   */
  async getAll(): Promise<Charla[]> {
    return api.get<Charla[]>('/charlas');
  },

  /**
   * Obtiene una charla específica por su ID de MongoDB
   * Endpoint: GET /charlas/:id
   */
  async getById(id: string): Promise<Charla> {
    return api.get<Charla>(`/charlas/${id}`);
  },

  /**
   * Registra una nueva charla en el backend
   * Endpoint: POST /charlas
   * Espera en req.body: { titulo, descripcion, fecha, hora, expositor_nombre, expositor_especialidad, expositor_correo }
   */
  async create(data: CharlaPayload): Promise<Charla> {
    return api.post<Charla>('/charlas', data);
  },

  /**
   * Actualiza una charla existente por su ID
   * Endpoint: PUT /charlas/:id
   */
  async update(id: string, data: CharlaPayload): Promise<Charla> {
    return api.put<Charla>(`/charlas/${id}`, data);
  },

  /**
   * Elimina una charla por su ID
   * Endpoint: DELETE /charlas/:id
   */
  async delete(id: string): Promise<{ mensaje: string }> {
    return api.delete<{ mensaje: string }>(`/charlas/${id}`);
  },

  /**
   * Comprueba el estado general de la API de Lab_ServiciosWeb
   * Endpoint: GET /
   */
  async checkHealth(): Promise<{ mensaje: string }> {
    return api.get<{ mensaje: string }>('/');
  },
};
