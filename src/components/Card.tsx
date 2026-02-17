/**
 * @file src/components/Card.tsx
 * Componente de tarjeta moderna con sombra sutil
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, SHADOWS, RADIUS } from '../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  pressable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  variant = 'default',
  pressable = false
}) => {
  const variants = {
    default: {
      backgroundColor: COLORS.white,
      borderWidth: 0,
      ...SHADOWS.md
    },
    elevated: {
      backgroundColor: COLORS.white,
      borderWidth: 0,
      ...SHADOWS.lg
    },
    outlined: {
      backgroundColor: COLORS.grayLight,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...SHADOWS.sm
    }
  };

  return (
    <View style={[
      styles.card,
      variants[variant],
      pressable && styles.pressable,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    marginHorizontal: SPACING.md
  },
  pressable: {
    opacity: 0.9
  }
});
