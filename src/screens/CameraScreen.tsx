/**
 * @file src/screens/CameraScreen.tsx
 * Pantalla de captura de foto con detección automática y diseño moderno
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import { CameraView } from 'expo-camera';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, RADIUS } from '../constants';
import { Button, LoadingSpinner, Icon } from '../components';
import { useAppContext } from '../context';
import { useCamera } from '../hooks';
import { generateId } from '../utils';
import { validatePhotoAgainstTarget } from '../services/objectDetectionService';

export const CameraScreen: React.FC = () => {
  const { selectedTarget, setCurrentScreen, addFoundItem } = useAppContext();
  const { cameraRef, isGranted, requestPermission, takePicture, handleCameraReady, cameraReady } = useCamera();
  const [isValidating, setIsValidating] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    if (!isGranted) {
      requestPermission();
    }
  }, [isGranted, requestPermission]);

  const handleTakePhoto = async () => {
    if (!selectedTarget) return;
    
    setIsValidating(true);
    
    try {
      console.log('[CameraScreen] Capturando foto...');
      const photo = await takePicture();
      if (!photo) {
        setIsValidating(false);
        return;
      }

      // Guardar URI para mostrar preview
      setPhotoUri(photo.uri);

      console.log('[CameraScreen] Validating photo against target:', selectedTarget.id);
      const validation = await validatePhotoAgainstTarget(photo.uri, selectedTarget);
      
      console.log('[CameraScreen] Validation result:', validation);

      if (validation.isValid) {
        // Objeto detectado correctamente
        Alert.alert(
          '¡Correcto!',
          `${validation.message}\n\nConfianza: ${Math.round(validation.confidence * 100)}%`,
          [
            {
              text: 'Guardar',
              onPress: async () => {
                await addFoundItem({
                  id: generateId(),
                  uri: photo.uri,
                  type: 'photo',
                  targetId: selectedTarget.id,
                  targetName: selectedTarget.name,
                  timestamp: Date.now(),
                  metadata: {
                    confidence: validation.confidence,
                    detectedObjects: validation.detectionData?.detectedClasses || [],
                    processor: validation.detectionData?.processor || 'unknown'
                  }
                });
                setCurrentScreen('scoreboard');
              }
            },
            {
              text: 'Intentar de Nuevo',
              onPress: () => {
                setIsValidating(false);
                setPhotoUri(null);
              },
              style: 'cancel'
            }
          ]
        );
      } else {
        // Objeto no detectado
        Alert.alert(
          'Objeto Incorrecto',
          validation.message,
          [
            {
              text: 'Intentar de Nuevo',
              onPress: () => {
                setIsValidating(false);
                setPhotoUri(null);
              }
            },
            {
              text: 'Cancelar',
              onPress: () => setCurrentScreen('home'),
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('[CameraScreen] Error validating photo:', error);
      Alert.alert('Error', 'Hubo un error al validar la foto. Intenta de nuevo.');
    } finally {
      setIsValidating(false);
      setPhotoUri(null); // Limpiar preview
    }
  };

  if (!isGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Icon name="camera" size={64} color={COLORS.primary} />
          <Text style={[TYPOGRAPHY.body, styles.permissionText]}>Se necesita acceso a la cámara</Text>
          <Button
            title="Permitir cámara"
            onPress={() => requestPermission()}
            variant="primary"
            size="large"
          />
          <Button
            title="Volver"
            variant="secondary"
            onPress={() => setCurrentScreen('home')}
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Icon name={selectedTarget?.icon!} size={24} color={COLORS.white} />
          <Text style={[TYPOGRAPHY.h2, styles.headerTitle]}>
            {selectedTarget?.name}
          </Text>
        </View>
      </View>

      <View style={styles.cameraContainer}>
        {isValidating && photoUri ? (
          // Mostrar preview mientras valida
          <Image 
            source={{ uri: photoUri }} 
            style={styles.previewImage}
          />
        ) : (
          // Mostrar cámara mientras no está validando
          <CameraView
            style={styles.camera}
            facing="back"
            ref={cameraRef}
            onCameraReady={handleCameraReady}
          />
        )}
        <View style={styles.controls}>
          {isValidating ? (
            <View style={styles.validatingContainer}>
              <LoadingSpinner />
              <Text style={[TYPOGRAPHY.subtitle, styles.validatingText]}>Analizando foto...</Text>
            </View>
          ) : (
            <>
              <Button
                title="Capturar Foto"
                onPress={handleTakePhoto}
                variant="primary"
                size="large"
                disabled={!cameraReady}
              />
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={() => setCurrentScreen('home')}
                size="large"
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.md
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md
  },
  headerTitle: {
    color: COLORS.white
  },
  cameraContainer: {
    flex: 1,
    position: 'relative'
  },
  camera: {
    flex: 1
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover'
  },
  controls: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    gap: SPACING.md
  },
  validatingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    ...SHADOWS.lg
  },
  validatingText: {
    color: COLORS.white,
    marginTop: SPACING.sm
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl
  },
  permissionTitle: {
    fontSize: 64,
    marginBottom: SPACING.lg
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: COLORS.text
  }
});
