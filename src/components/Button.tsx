/**
 * @file src/components/Button.tsx
 * Componente de botón moderno con diseño limpio
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, RADIUS } from '../constants';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'success' | 'danger' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  icon
}) => {
  const isOutline = variant === 'outline';
  
  const variantColors = {
    primary: { bg: COLORS.primary, text: COLORS.white, border: COLORS.primary },
    success: { bg: COLORS.success, text: COLORS.white, border: COLORS.success },
    danger: { bg: COLORS.danger, text: COLORS.white, border: COLORS.danger },
    secondary: { bg: COLORS.primaryLight, text: COLORS.primary, border: COLORS.primary },
    outline: { bg: COLORS.transparent, text: COLORS.primary, border: COLORS.primary }
  };

  const sizes = {
    small: { padV: SPACING.md, padH: SPACING.lg, fontSize: 14 },
    medium: { padV: SPACING.lg, padH: SPACING.xl, fontSize: 16 },
    large: { padV: SPACING.xl, padH: SPACING.xxl, fontSize: 18 }
  };

  const colors = variantColors[variant];
  const size_style = sizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: isOutline ? COLORS.transparent : colors.bg,
          borderColor: colors.border,
          borderWidth: isOutline ? 2 : 0,
          paddingVertical: size_style.padV,
          paddingHorizontal: size_style.padH,
        },
        SHADOWS.md,
        disabled && styles.disabled,
        style
      ]}
    >
      <Text 
        style={[
          styles.text, 
          { 
            color: colors.text,
            fontSize: size_style.fontSize,
            opacity: disabled ? 0.6 : 1 
          }
        ]}
      >
        {icon && `${icon} `}{title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    fontWeight: '600' as const,
    lineHeight: 24
  },
  disabled: {
    opacity: 0.5
  }
});
