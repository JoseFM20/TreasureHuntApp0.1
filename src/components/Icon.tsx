/**
 * @file src/components/Icon.tsx
 * Componente Icon que encapsula Ionicons para mantener consistencia visual
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../constants';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = COLORS.dark,
  style
}) => {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};
