/**
 * @file src/hooks/useCamera.ts
 * Hook personalizado para manejo de cámara (solo fotos)
 */

import { useState, useRef, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { PermissionStatus } from '../types';

export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<any>(null);

  const permissionStatus = (permission?.granted ? 'granted' : 'undetermined') as PermissionStatus;

  const requestCameraPermission = useCallback(async () => {
    console.log('[useCamera] requestCameraPermission: requesting camera permission');
    try {
      const result = await requestPermission();
      console.log('[useCamera] requestCameraPermission: granted =', result?.granted);
      return result?.granted ?? false;
    } catch (err) {
      console.error('[useCamera] requestCameraPermission: error', err);
      return false;
    }
  }, [requestPermission]);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current) {
      console.error('[useCamera] takePicture: no camera ref');
      return null;
    }
    try {
      console.log('[useCamera] takePicture: calling takePictureAsync');
      const photo = await cameraRef.current.takePictureAsync();
      console.log('[useCamera] takePicture: ✓ photo captured:', photo?.uri);
      return photo;
    } catch (error) {
      console.error('[useCamera] takePicture: error:', error);
      return null;
    }
  }, []);

  const handleCameraReady = useCallback(() => {
    console.log('[useCamera] Camera is ready');
    setCameraReady(true);
  }, []);

  return {
    cameraRef,
    isGranted: permissionStatus === 'granted',
    requestPermission: requestCameraPermission,
    takePicture,
    handleCameraReady,
    cameraReady
  };
};

