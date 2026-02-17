/**
 * @file src/services/storageService.ts
 * Servicio para manejo de almacenamiento local con AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoundItem } from '../types';
import { STORAGE_KEY } from '../constants';

/**
 * Obtener todos los items encontrados
 */
export const getFoundItems = async (): Promise<FoundItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error obteniendo items encontrados:', error);
    return [];
  }
};

/**
 * Guardar un nuevo item encontrado
 */
export const saveFoundItem = async (item: FoundItem): Promise<void> => {
  try {
    const items = await getFoundItems();
    const updated = [item, ...items];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error guardando item:', error);
    throw error;
  }
};

/**
 * Eliminar un item encontrado
 */
export const removeFoundItem = async (id: string): Promise<void> => {
  try {
    const items = await getFoundItems();
    const filtered = items.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error eliminando item:', error);
    throw error;
  }
};

/**
 * Limpiar todo el almacenamiento
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error limpiando almacenamiento:', error);
    throw error;
  }
};

/**
 * Exportar items como JSON
 */
export const exportItems = async (): Promise<string> => {
  try {
    const items = await getFoundItems();
    return JSON.stringify(items, null, 2);
  } catch (error) {
    console.error('Error exportando items:', error);
    throw error;
  }
};
