/**
 * @file src/screens/SplashScreen.tsx
 * Pantalla de bienvenida/splash
 * Muestra logo y branding antes de la app principal
 */

import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants';
import { Icon } from '../components';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number; // segundos
  imageSource?: any; // Fuente de imagen opcional
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinish, 
  duration = 3,
  imageSource
}) => {
  useEffect(() => {
    // Timer para mostrar splash durante X segundos
    const timer = setTimeout(() => {
      onFinish();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente simulado */}
      <View style={styles.background}>
        {/* Imagen principal (opcional) */}
        {imageSource && (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* Logo emoji si no hay imagen */}
        {!imageSource && (
          <Icon name="flag" size={100} color={COLORS.primary} />
        )}

        {/* Texto de bienvenida */}
        <Text style={styles.title}>Treasure Hunt</Text>
        <Text style={styles.subtitle}>Embark on a Quest...</Text>
        
        {/* Indicador de carga */}
        <View style={styles.loadingDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark
  },
  background: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.dark
  },
  image: {
    width: '80%',
    height: '50%',
    marginBottom: 30
  },
  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.primary,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 32
  },
  subtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 8
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    opacity: 0.6
  }
});
