/**
 * @file src/services/objectDetectionService.ts
 * Orquestador de detección de objetos
 * Usa Google Gemini Vision API para validar fotos
 */

import { Target } from '../types';
import { validatePhotoWithGemini } from './geminiVisionService';

/**
 * Descriptor simples para cada objetivo
 * Usado para validación secundaria y búsqueda de palabras clave
 */
interface ObjectDescriptor {
  targetId: string;
  keywords: string[];
  confidence: number; // 0-1
}

/**
 * Base de descriptores de objetos
 */
const OBJECT_DESCRIPTORS: ObjectDescriptor[] = [
  {
    targetId: 'leaf',
    keywords: ['red', 'leaf', 'autumn', 'plant', 'foliage', 'colors'],
    confidence: 0.7
  },
  {
    targetId: 'blue-door',
    keywords: ['door', 'blue', 'entrance', 'architecture', 'wooden', 'painted'],
    confidence: 0.8
  },
  {
    targetId: 'big-tree',
    keywords: ['tree', 'large', 'forest', 'trunk', 'branches', 'nature', 'green'],
    confidence: 0.75
  },
  {
    targetId: 'water',
    keywords: ['water', 'river', 'lake', 'fountain', 'drops', 'liquid', 'blue'],
    confidence: 0.7
  },
  {
    targetId: 'animal',
    keywords: ['animal', 'wildlife', 'deer', 'mammal', 'nature', 'wild', 'forest'],
    confidence: 0.65
  }
];

/**
 * Genera un ID único para una foto basado en metadatos
 */
export const generatePhotoIdentifier = (uri: string): string => {
  // En una app real, esto extraería metadatos EXIF
  return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Valida si una foto contiene el objeto correcto
 * Utiliza Google Gemini Vision API para análisis de IA
 */
export const validatePhotoAgainstTarget = async (
  photoUri: string,
  target: Target
): Promise<{
  isValid: boolean;
  confidence: number;
  message: string;
  detectionData: any;
}> => {
  try {
    console.log('[objectDetectionService] Validating with Gemini Vision:', target.id);
    console.log('[objectDetectionService] Target full object:', JSON.stringify(target));
    console.log('[objectDetectionService] expectedColor:', target.expectedColor);
    
    const validation = await validatePhotoWithGemini(photoUri, target.id, target.expectedColor);

    return {
      isValid: validation.isValid,
      confidence: validation.confidence,
      message: validation.message,
      detectionData: {
        detectedClasses: validation.detectedClasses,
        processor: validation.processor,
        timestamp: Date.now()
      }
    };
  } catch (error) {
    console.error('[objectDetectionService] Error validating photo:', error);
    
    // Detectar si es error de límite de API
    const errorMessage = error instanceof Error ? error.message : 'desconocido';
    const isApiLimitError = errorMessage.includes('quota') || 
                           errorMessage.includes('RESOURCE_EXHAUSTED') ||
                           errorMessage.includes('límite');
    
    const userMessage = isApiLimitError 
      ? 'Se alcanzó el límite diario de análisis. Por favor intenta mañana.'
      : `Error al analizar la foto. Por favor intenta de nuevo.`;

    return {
      isValid: false,
      confidence: 0,
      message: userMessage,
      detectionData: null
    };
  }
};

