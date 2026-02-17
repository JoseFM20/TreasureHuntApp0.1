/**
 * @file src/config/index.ts
 * Configuración centralizada de APIs y credenciales
 * Punto único de gestión de API keys
 */

/**
 * Google Gemini Vision API
 * IA para detección de objetos y análisis de colores
 */
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

/**
 * Configuración de modelos de IA
 */
export const AI_MODELS = {
  GEMINI_MODEL: 'gemini-2.5-flash',
  GEMINI_VISION_MODEL: 'gemini-2.5-flash-vision'
};

/**
 * Timeouts (en ms)
 */
export const TIMEOUTS = {
  GEMINI_REQUEST: 30000, // 30 segundos para Gemini Vision (imágenes grandes)
  DEFAULT: 10000 // 10 segundos por defecto
};

/**
 * Límites de API
 */
export const API_LIMITS = {
  GEMINI_FREE_TIER: {
    REQUESTS_PER_DAY: 20,
    REQUESTS_PER_MINUTE: 10
  }
};

/**
 * Configuración de compresión
 */
export const IMAGE_CONFIG = {
  MAX_SIZE_MB: 10,
  COMPRESSION_QUALITY: 0.7
};

console.log('[Config] ✅ Configuración centralizada cargada');
