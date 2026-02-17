/**
 * @file src/utils/index.ts
 * Funciones utilitarias generales
 */

import { FoundItem } from '../types';

/**
 * Generar un ID único
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formatear fecha a formato legible
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('es-ES');
};

/**
 * Formatear fecha corta
 */
export const formatDateShort = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('es-ES');
};

/**
 * Formatear hora
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('es-ES');
};

/**
 * Obtener estadísticas de items encontrados
 */
export const getStats = (items: FoundItem[]) => {
  const total = items.length;
  const photos = items.filter(i => i.type === 'photo').length;
  const videos = items.filter(i => i.type === 'video').length;

  const byTarget = items.reduce((acc, item) => {
    if (!acc[item.targetId]) {
      acc[item.targetId] = { name: item.targetName, count: 0 };
    }
    acc[item.targetId].count++;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  return { total, photos, videos, byTarget };
};

/**
 * Agrupar items por día
 */
export const groupByDay = (items: FoundItem[]): Record<string, FoundItem[]> => {
  return items.reduce((acc, item) => {
    const day = formatDateShort(item.timestamp);
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {} as Record<string, FoundItem[]>);
};

/**
 * Validar que uri sea válido
 */
export const isValidUri = (uri: string): boolean => {
  return uri.startsWith('file://') || uri.startsWith('http');
};

/**
 * Calcular tamaño de lista de items
 */
export const estimateStorageSize = (items: FoundItem[]): string => {
  const bytes = JSON.stringify(items).length;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
