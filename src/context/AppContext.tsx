/**
 * @file src/context/AppContext.tsx
 * Contexto global de la aplicación
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppContextType, Target, FoundItem, ScreenState } from '../types';
import { TREASURE_TARGETS } from '../constants';
import { useFoundItems } from '../hooks';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items: found, addItem, deleteItem, reload } = useFoundItems();
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);

  useEffect(() => {
    reload();
  }, [reload]);

  const addFoundItem = useCallback(
    async (item: FoundItem) => {
      await addItem(item);
    },
    [addItem]
  );

  const removeFoundItem = useCallback(
    async (id: string) => {
      await deleteItem(id);
    },
    [deleteItem]
  );

  const loadFoundItems = useCallback(async () => {
    await reload();
  }, [reload]);

  const value: AppContextType = {
    found,
    targets: TREASURE_TARGETS,
    currentScreen,
    selectedTarget,
    setCurrentScreen,
    setSelectedTarget,
    addFoundItem,
    removeFoundItem,
    loadFoundItems
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider');
  }
  return context;
};
