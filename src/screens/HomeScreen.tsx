/**
 * @file src/screens/HomeScreen.tsx
 * Pantalla principal con lista de objetivos modernizada
 */

import React, { useMemo } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, RADIUS } from '../constants';
import { Card, Button, Icon } from '../components';
import { useAppContext } from '../context';

export const HomeScreen: React.FC = () => {
  const { targets, found, setSelectedTarget, setCurrentScreen } = useAppContext();

  const isFound = (id: string) => found.some(f => f.targetId === id);

  const stats = useMemo(() => ({
    total: found.length,
    unique: new Set(found.map(f => f.targetId)).size
  }), [found]);

  const handleOpenCamera = (target: any) => {
    setSelectedTarget(target);
    setCurrentScreen('camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon name="flag" size={28} color={COLORS.white} />
          <Text style={[TYPOGRAPHY.h1, styles.title]}>Búsqueda del Tesoro</Text>
        </View>
        <Text style={[TYPOGRAPHY.body, styles.subtitle]}>
          {stats.total} encontrados • {stats.unique}/{targets.length} objetivos
        </Text>
      </View>

      <FlatList
        data={targets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card variant="elevated" pressable>
            <TouchableOpacity
              onPress={() => handleOpenCamera(item)}
              activeOpacity={0.7}
            >
              <View style={styles.targetRow}>
                <View style={styles.targetInfo}>
                  <Icon name={item.icon!} size={40} color={COLORS.primary} />
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={[TYPOGRAPHY.subtitle, styles.targetName]}>{item.name}</Text>
                    {item.description && (
                      <Text style={[TYPOGRAPHY.caption, styles.description]}>{item.description}</Text>
                    )}
                  </View>
                  {isFound(item.id) && (
                    <View style={styles.badgeContainer}>
                      <Icon name="checkmark-done" size={20} color={COLORS.white} />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        )}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <Button
          title={`Tablero (${stats.unique}/${targets.length})`}
          variant="success"
          onPress={() => setCurrentScreen('scoreboard')}
          size="medium"
        />
        <Button
          title={`Ver encontrados (${stats.total})`}
          variant="primary"
          onPress={() => setCurrentScreen('found')}
          size="medium"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grayLight
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    ...SHADOWS.md
  },
  title: {
    color: COLORS.white,
    marginBottom: SPACING.sm
  },
  subtitle: {
    color: COLORS.white,
    opacity: 0.9
  },
  listContent: {
    paddingBottom: SPACING.xl
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  icon: {
    fontSize: 40,
    marginRight: SPACING.md
  },
  targetName: {
    color: COLORS.text,
    marginBottom: SPACING.xs
  },
  description: {
    color: COLORS.textSecondary
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  badgeContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
    ...SHADOWS.sm
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    gap: SPACING.md,
    ...SHADOWS.lg
  }
});
