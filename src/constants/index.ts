/**
 * @file src/constants/index.ts
 * Constantes globales de la aplicación
 */

import { Target } from '../types';

/**
 * Objetivos de búsqueda definidos
 */
export const TREASURE_TARGETS: Target[] = [
  {
    id: 'leaf',
    name: 'Hoja Roja',
    description: 'Encuentra una hoja roja en la naturaleza',
    category: 'nature',
    icon: 'leaf',
    expectedColor: 'red' // Debe ser roja específicamente
  },
  {
    id: 'blue-door',
    name: 'Puerta Azul',
    description: 'Busca una puerta pintada de azul',
    category: 'architecture',
    icon: 'square-outline',
    expectedColor: 'blue' // Debe ser azul
  },
  {
    id: 'big-tree',
    name: 'Árbol Grande',
    description: 'Captura un árbol de gran tamaño',
    category: 'nature',
    icon: 'leaf',
    expectedColor: 'green' // Preferentemente verde
  },
  {
    id: 'water',
    name: 'Cuerpo de Agua',
    description: 'Un río, lago o fuente',
    category: 'nature',
    icon: 'water',
    expectedColor: 'blue' // Preferentemente azul
  },
  {
    id: 'animal',
    name: 'Animal Salvaje',
    description: 'Fotografía de un animal en su hábitat',
    category: 'wildlife',
    icon: 'paw'
    // Sin expectedColor - el color no importa
  }
];

/**
 * Clave de AsyncStorage para guardar items encontrados
 */
export const STORAGE_KEY = '@treasure_hunt_found_items';

/**
 * Duración máxima de video en segundos
 */
export const MAX_VIDEO_DURATION = 10;

/**
 * Calidad de foto por defecto (0-1)
 */
export const DEFAULT_PHOTO_QUALITY = 0.6;

/**
 * Temas de colores - Palette moderna y vibrante
 */
export const COLORS = {
  // Primario - Azul vibrante
  primary: '#0066FF',
  primaryLight: '#E6F0FF',
  primaryDark: '#0047B2',
  
  // Secundario - Verde
  secondary: '#00D98E',
  secondaryLight: '#E8F9F3',
  
  // Éxito - Verde brillante
  success: '#10B981',
  successLight: '#ECFDF5',
  
  // Advertencia - Naranja
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  
  // Peligro - Rojo
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  
  // Neutral
  dark: '#1F2937',
  darkSecondary: '#374151',
  gray: '#9CA3AF',
  grayLight: '#F3F4F6',
  border: '#E5E7EB',
  
  // Texto
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#F9FAFB',
  
  // Especiales
  white: '#FFFFFF',
  transparent: 'transparent',
  
  // Gradientes
  gradientStart: '#0066FF',
  gradientEnd: '#00D98E'
};

/**
 * Estilos de tipografía - Moderna y clara
 */
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  title: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  subtitle: { fontSize: 18, fontWeight: '500' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  smallBold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 }
};

/**
 * Espaciado estándar - Escala generosa
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48
};

/**
 * Sombras sutiles - Elevación moderna
 */
export const SHADOWS = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8
  }
};

/**
 * Esquinas redondeadas - Consistentes
 */
export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999
};
