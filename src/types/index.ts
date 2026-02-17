/**
 * @file src/types/index.ts
 * Archivo central de tipos TypeScript para la aplicación
 */

/**
 * Representa un objetivo de búsqueda en la aplicación
 */
export interface Target {
  id: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  expectedColor?: string; // Color esperado para la validación (ej: "red", "blue")
}

/**
 * Representa un elemento encontrado por el usuario
 */
export interface FoundItem {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  targetId: string;
  targetName: string;
  timestamp: number;
  latitude?: number;
  longitude?: number;
  metadata?: Record<string, any>;
}

/**
 * Estado de la pantalla actual
 */
export type ScreenState = 'home' | 'camera' | 'found' | 'details' | 'stats' | 'scoreboard';

/**
 * Respuesta de la cámara
 */
export interface CameraResponse {
  uri: string;
  width?: number;
  height?: number;
}

/**
 * Estado de permiso de cámara
 */
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

/**
 * Contexto de la aplicación
 */
export interface AppContextType {
  found: FoundItem[];
  targets: Target[];
  currentScreen: ScreenState;
  selectedTarget: Target | null;
  setCurrentScreen: (screen: ScreenState) => void;
  setSelectedTarget: (target: Target | null) => void;
  addFoundItem: (item: FoundItem) => Promise<void>;
  removeFoundItem: (id: string) => Promise<void>;
  loadFoundItems: () => Promise<void>;
}
