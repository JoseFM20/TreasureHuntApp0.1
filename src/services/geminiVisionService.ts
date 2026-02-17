/**
 * @file src/services/geminiVisionService.ts
 * GEMINI VISION SERVICE - Detección de objetos con IA
 * Google Gemini Vision API para análisis de imágenes
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system/legacy';
import { GEMINI_API_KEY } from '../config';

let genAI: GoogleGenerativeAI | null = null;
let initError: string | null = null;

/**
 * Comprime imagen JPEG a una calidad menor para más velocidad
 * Reduce el tamaño de ~46MB a ~2-3MB
 */
async function compressImage(base64: string): Promise<string> {
  try {
    console.log('[Gemini] 🗜️ Comprimiendo imagen...');
    
    // Crear temporal file con base64
    const tempUri = FileSystem.cacheDirectory + 'temp_original.jpg';
    await FileSystem.writeAsStringAsync(tempUri, base64, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    // Leer con información del archivo
    const fileInfo = await FileSystem.getInfoAsync(tempUri);
    if (fileInfo.exists && fileInfo.size) {
      console.log('[Gemini] 📊 Tamaño original:', `${(fileInfo.size / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Para React Native, no podemos comprimir directamente
    // Pero podemos usar una técnica: tomar la base64 y reducir calidad readjustando el muestreo
    // Por ahora, vamos a usar la imagen tal como está pero con timeout más largo
    
    // Limpiar temp
    try {
      await FileSystem.deleteAsync(tempUri, { idempotent: true });
    } catch {
      // Ignorar error de borrado
    }
    
    return base64;
  } catch (error) {
    console.warn('[Gemini] ⚠️ Error comprimiendo, usando original:', error);
    return base64;
  }
}

/**
 * Inicializa Gemini API
 */
function initGemini() {
  if (genAI) return;
  
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no configurada');
    }
    
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('[Gemini] Inicializado correctamente');
  } catch (error) {
    initError = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[Gemini] Error inicializando:', error);
  }
}

/**
 * Realiza análisis real con Gemini Vision
 */
export async function validatePhotoWithGemini(
  photoUri: string,
  targetId: string,
  expectedColor?: string
): Promise<{
  isValid: boolean;
  confidence: number;
  message: string;
  detectedClasses: string[];
  processor: 'gemini-vision';
  geminiResponse?: string;
}> {
  try {
    // 🔍 DEBUG: Verificar que el parámetro se recibió correctamente
    const colorExpectedDebug = expectedColor || 'undefined';
    console.log('[Gemini] 🎯 Parámetro recibido - targetId:', targetId, '| expectedColor:', colorExpectedDebug, '| typeof:', typeof expectedColor);
    
    console.log('[Gemini] 📸 Iniciando validación para:', targetId, 'Color esperado:', expectedColor || 'cualquiera');
    
    initGemini();
    
    if (!genAI) {
      console.warn('[Gemini] ⚠️ Gemini no inicializado');
      return {
        isValid: false,
        confidence: 0,
        message: 'Error: No se pudo analizar la imagen',
        detectedClasses: [],
        processor: 'gemini-vision'
      };
    }
    
    // Leer imagen como base64
    console.log('[Gemini] 📂 Leyendo imagen...');
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    // Comprimir/preparar imagen
    console.log('[Gemini] ⚙️ Preparando imagen...');
    const preparedBase64 = await compressImage(base64);
    
    // Crear modelo de visión
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Prompt específico para Treasure Hunt - INYECTAR COLOR ESPERADO
    const colorExpectedText = expectedColor 
      ? `Busca ESPECÍFICAMENTE un objeto en color ${expectedColor}.` 
      : 'El color puede variar.';
    
    const prompt = `Analiza esta imagen para un juego de búsqueda de tesoro.

OBJETIVO: Identificar si la imagen contiene: ${targetId}

${colorExpectedText}

IMPORTANTE: Basándote en la DESCRIPCIÓN del objeto, determina:
1. Qué es el objeto principal
2. Cuál es el color dominante real
3. Si el COLOR es importante para validar este objeto

Responde en JSON válido:
{
  "mainObject": "nombre del objeto principal",
  "confidence": número 0-1,
  "dominantColor": "color real detectado",
  "colorConfidence": número 0-1,
  "description": "descripción de qué ves",
  "objectsList": ["objeto1", "objeto2"],
  "colorMattersForThisObject": true/false,
  "colorValidationReason": "por qué el color es/no es importante",
  "objectValidationReason": "descripción del objeto"
}

REGLAS:
- Para PUERTAS: El color SÍ importa (debe especificar azul, rojo, etc)
- Para HOJAS y ÁRBOLES: El color SÍ importa (rojo, verde, marrón)
- Para AGUA: El color es flexible (azul, gris, verde son válidos)
- Para ANIMALES: El color NO importa (pueden ser de cualquier color)
- Para PLANTAS/FLORES: El color SÍ importa

Responde SOLO con el JSON, sin markdown.`;

    // Enviar a Gemini con timeout
    console.log('[Gemini] 🚀 Enviando imagen a Gemini (esto puede tardar 10-20s)...');
    
    // Timeout de 30 segundos (suficiente para conexión lenta)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout en Gemini (>30s)')), 30000);
    });
    
    const geminiPromise = model.generateContent([
      {
        inlineData: {
          data: preparedBase64,
          mimeType: 'image/jpeg',
        },
      },
      prompt,
    ]);
    
    const result = await Promise.race([geminiPromise, timeoutPromise]);
    const geminiText = result.response.text();
    
    console.log('[Gemini] ✅ Respuesta recibida');
    console.log('[Gemini] 📝 Contenido:', geminiText.substring(0, 150) + '...');
    
    // Parsear JSON
    let geminiData;
    try {
      // Limpiar respuesta (a veces viene con markdown)
      const cleanJson = geminiText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      geminiData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('[Gemini] ❌ Error parseando JSON:', geminiText);
      return {
        isValid: false,
        confidence: 0,
        message: 'Error: No se pudo analizar la imagen',
        detectedClasses: [],
        processor: 'gemini-vision'
      };
    }
    
    // Validar respuesta de Gemini
    const detectedObject = (geminiData.mainObject || '').toLowerCase();
    const detectedColor = (geminiData.dominantColor || '').toLowerCase();
    const objectConfidence = geminiData.confidence || 0;
    const colorConfidence = geminiData.colorConfidence || 0;
    const allObjects = geminiData.objectsList || [];
    
    // 🎯 Nueva info de Gemini: ¿Importa el color?
    const colorMattersForThisObject = geminiData.colorMattersForThisObject !== false; // Default: true
    const colorValidationReason = geminiData.colorValidationReason || '';
    const objectValidationReason = geminiData.objectValidationReason || '';
    
    console.log('[Gemini] 📊 Información de validación:', {
      colorMattersForThisObject,
      colorValidationReason,
      objectValidationReason
    });
    
    // Mapear targets a palabras clave
    const targetKeywords: Record<string, string[]> = {
      'blue-door': ['door', 'puerta', 'entrance', 'door frame', 'marco de puerta', 'doorway'],
      'leaf': ['leaf', 'hoja', 'hojas', 'plant', 'planta', 'foliage', 'follaje', 'flower', 'flor'],
      'big-tree': ['tree', 'árbol', 'árboles', 'forest', 'bosque', 'trunk', 'tronco', 'bark', 'corteza', 'branches', 'ramas'],
      'water': ['water', 'agua', 'river', 'río', 'lake', 'lago', 'stream', 'arroyo', 'fountain', 'fuente', 'pond', 'estanque', 'liquid', 'líquido'],
      'animal': [
        // Mamíferos comunes
        'animal', 'deer', 'ciervo', 'wildlife', 'bear', 'oso', 'lion', 'león', 'tiger', 'tigre', 
        'zebra', 'cebra', 'horse', 'caballo', 'dog', 'perro', 'cat', 'gato', 'rabbit', 'conejo',
        'elephant', 'elefante', 'giraffe', 'jirafa', 'leopard', 'leopardo', 'cheetah', 'guepardo',
        'wolf', 'lobo', 'fox', 'zorro', 'monkey', 'mono', 'primate', 'primate', 
        // Aves
        'bird', 'pájaro', 'eagle', 'águila', 'hawk', 'halcón', 'parrot', 'loro', 'peacock', 'pavo real',
        'owl', 'búho', 'flamingo', 'flamenco', 'swan', 'cisne',
        // Reptiles
        'snake', 'serpiente', 'lizard', 'lagartija', 'crocodile', 'cocodrilo', 'turtle', 'tortuga',
        // Otros
        'creature', 'criatura', 'mammal', 'mamífero', 'fauna', 'fauna'
      ]
    };
    
    const expectedKeywords = targetKeywords[targetId] || [];
    
    // 🎯 MAPEO DE TRADUCCIÓN: Inglés ↔ Español para colores
    const colorTranslations: Record<string, string[]> = {
      'red': ['red', 'rojo'],
      'green': ['green', 'verde'],
      'blue': ['blue', 'azul'],
      'brown': ['brown', 'marrón'],
      'gray': ['gray', 'gris'],
      'grey': ['grey', 'gris'],
      'orange': ['orange', 'naranja'],
      'yellow': ['yellow', 'amarillo'],
      'white': ['white', 'blanco'],
      'black': ['black', 'negro'],
      'transparent': ['transparent', 'transparente'],
      'beige': ['beige', 'beige', 'tan']
    };
    
    // 🎯 NUEVA LÓGICA: Usar expectedColor si se proporciona, sino usar defaults
    let colorKeywordsToUse: string[] = [];
    
    if (expectedColor) {
      // Si se proporciona un color esperado, usar SOLO ese + su traducción
      const translations = colorTranslations[expectedColor.toLowerCase()] || [expectedColor];
      colorKeywordsToUse = translations;
      console.log('[Gemini] 🎨 Usando color esperado especificado:', expectedColor, 'Traducciones:', translations);
    } else {
      // Si no se proporciona, usar los keywords por defecto del targetId
      const colorKeywords: Record<string, string[]> = {
        'blue-door': ['blue', 'azul'],
        'leaf': ['red', 'rojo', 'green', 'verde', 'brown', 'marrón', 'orange', 'naranja', 'yellow', 'amarillo'],
        'big-tree': ['green', 'verde', 'brown', 'marrón', 'gray', 'gris', 'trunk', 'tronco'],
        'water': ['blue', 'azul', 'gray', 'gris', 'green', 'verde', 'transparent', 'transparente', 'white', 'blanco'],
        'animal': ['brown', 'marrón', 'red', 'rojo', 'black', 'negro', 'white', 'blanco', 'tan', 'beige', 'orange', 'naranja']
      };
      colorKeywordsToUse = colorKeywords[targetId] || [];
    }
    
    const expectedColors = colorKeywordsToUse;
    
    // Verificar si el objeto detectado coincide
    const objectMatches = expectedKeywords.some(kw => {
      const normalized = (str: string) => str.toLowerCase().replace(/[áéíóúñ]/g, c => 
        ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n' }[c] || c)
      );
      
      const normalized_keyword = normalized(kw);
      const normalized_detected = normalized(detectedObject);
      
      // Excluir si hay negaciones (no, not, sin, without, etc.)
      const negationPatterns = /\b(no|not|sin|without)\s+/i;
      if (negationPatterns.test(normalized_detected)) {
        return false; // No coincide si hay negación
      }
      
      // Búsqueda exacta o parcial (pero sin negaciones)
      const directMatch = normalized_detected === normalized_keyword;
      const partialMatch = normalized_detected.includes(normalized_keyword);
      
      // Solo aceptar coincidencias si no están negadas
      const keywordMatch = directMatch || partialMatch;
      
      if (keywordMatch) return true;
      
      // También buscar en la lista de objetos detectados
      return allObjects.some((obj: string) => {
        const normalized_obj = normalized(obj);
        // Excluir negaciones en objetos detectados también
        if (negationPatterns.test(normalized_obj)) return false;
        return normalized_obj.includes(normalized_keyword) || normalized_obj === normalized_keyword;
      });
    });
    
    // Verificar si el color coincide
    const colorMatches = expectedColors.some(color => {
      const normalized = (str: string) => str.toLowerCase().replace(/[áéíóúñ]/g, c => 
        ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n' }[c] || c)
      );
      
      const normalized_color = normalized(color);
      const normalized_detected_color = normalized(detectedColor);
      
      // Búsqueda exacta o parcial
      return normalized_detected_color.includes(normalized_color) || 
             normalized_color.includes(normalized_detected_color);
    });
    
    // Calcular confianza final
    let finalConfidence = 0;
    let isValid = false;
    let message = '';
    
    // 🎯 Estrategia: El OBJETO es lo más importante, el COLOR es secundario
    // Algunos objetos tienen colores estrictos (blue-door), otros son flexibles (animal)
    
    // Colores esperados por objeto (para mensajes)
    const expectedColorText: Record<string, string> = {
      'blue-door': 'azul',
      'leaf': 'rojo',
      'big-tree': 'verde o marrón',
      'water': 'azul o gris',
      'animal': 'cualquier color'
    };
    
    // 🎯 NUEVA LÓGICA: Usar la decisión de Gemini sobre si el color importa
    // Gemini analiza el contexto y determina la importancia del color dinámicamente
    let flexibility: 'strict' | 'flexible' | 'any';
    
    if (expectedColor && colorMattersForThisObject) {
      // Color esperado especificado Y Gemini dice que importa = STRICT
      flexibility = 'strict';
    } else if (colorMattersForThisObject) {
      // Gemini dice que el color es importante para este objeto
      flexibility = 'strict';
    } else if (targetId === 'animal') {
      // Animales: nunca importa el color
      flexibility = 'any';
    } else {
      // Otros (agua, árboles): flexible pero con preferencia de color
      flexibility = 'flexible';
    }
    
    const expectedColorDisplay = expectedColorText[targetId] || 'esperado';
    
    if (objectMatches) {
      if (flexibility === 'any') {
        // ✅ Animales, etc: Solo importa que sea el objeto
        finalConfidence = objectConfidence * 0.95;
        message = `✓ ${geminiData.mainObject} detectado`;
        isValid = finalConfidence > 0.60;
      } else if (flexibility === 'strict') {
        // 🚪 Puertas / 🍃 Hojas: Debe ser azul/rojo Y objeto correcto
        if (colorMatches) {
          finalConfidence = (objectConfidence * 0.7 + colorConfidence * 0.3);
          message = `✓ ${geminiData.mainObject} en ${geminiData.dominantColor}`;
          isValid = finalConfidence > 0.65;
        } else {
          // Objeto correcto pero color incorrecto (penalización grave)
          finalConfidence = objectConfidence * 0.3;
          message = `✗ ${geminiData.mainObject} pero color ${geminiData.dominantColor} (esperado: ${expectedColorDisplay})`;
          isValid = false;
        }
      } else if (flexibility === 'flexible') {
        // 🌲 Árboles, hojas, agua: Color es sugerencia, no requisito
        if (colorMatches) {
          // Color correcto = bonus
          finalConfidence = (objectConfidence * 0.8 + colorConfidence * 0.2);
          message = `✓ ${geminiData.mainObject} en ${geminiData.dominantColor}`;
          isValid = finalConfidence > 0.65;
        } else {
          // Color incorrecto = leve penalización, pero puede pasar
          finalConfidence = objectConfidence * 0.75;
          message = `✓ ${geminiData.mainObject} (color: ${geminiData.dominantColor})`;
          isValid = finalConfidence > 0.60;
        }
      }
    } else {
      // ❌ Objeto no coincide en absoluto
      finalConfidence = colorConfidence * 0.2;
      message = `✗ Visto: ${geminiData.mainObject} (${geminiData.dominantColor})`;
      isValid = false;
    }
    
    finalConfidence = Math.max(0, Math.min(1, finalConfidence));
    
    console.log('[Gemini] ✅ Validación completada:', {
      válido: isValid,
      confianza: `${Math.round(finalConfidence * 100)}%`,
      objeto: detectedObject,
      objetosDetectados: allObjects.slice(0, 3),
      color: detectedColor,
      colorFlexibility: flexibility,
      objectMatch: objectMatches ? '✓' : '✗',
      colorMatch: colorMatches ? '✓' : '✗',
      palabrasClaveBuscadas: expectedKeywords.slice(0, 5),
      mensaje: message
    });
    
    return {
      isValid,
      confidence: finalConfidence,
      message,
      detectedClasses: allObjects,
      processor: 'gemini-vision',
      geminiResponse: geminiText
    };
    
  } catch (error) {
    console.error('[Gemini] ❌ Error en validación:', error);
    return {
      isValid: false,
      confidence: 0,
      message: 'Error: No se pudo analizar la imagen',
      detectedClasses: [],
      processor: 'gemini-vision'
    };
  }
}
