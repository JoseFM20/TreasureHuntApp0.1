/**
 * @file src/hooks/useFoundItems.ts
 * Hook personalizado para manejo de items encontrados
 */

import { useState, useEffect, useCallback } from 'react';
import { FoundItem } from '../types';
import { getFoundItems, saveFoundItem, removeFoundItem } from '../services';

export const useFoundItems = () => {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getFoundItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(
    async (item: FoundItem) => {
      try {
        await saveFoundItem(item);
        setItems(prev => [item, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al guardar');
        throw err;
      }
    },
    []
  );

  const deleteItem = useCallback(async (id: string) => {
    try {
      await removeFoundItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return { items, loading, error, addItem, deleteItem, reload: loadItems };
};
