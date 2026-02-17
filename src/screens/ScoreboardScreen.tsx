/**
 * @file src/screens/ScoreboardScreen.tsx
 * Pantalla de tablero de puntuación con diseño moderno
 */

import React, { useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, RADIUS } from '../constants';
import { Button, Card, Icon } from '../components';
import { useAppContext } from '../context';

export const ScoreboardScreen: React.FC = () => {
  const { targets, found, setCurrentScreen } = useAppContext();

  // Agrupar encontrados por target
  const scoreData = useMemo(() => {
    const scoreMap = new Map<string, number>();
    
    // Inicializar todos los targets con 0
    targets.forEach(target => {
      scoreMap.set(target.id, 0);
    });

    // Contar encontrados por target
    found.forEach(item => {
      scoreMap.set(item.targetId, (scoreMap.get(item.targetId) || 0) + 1);
    });

    // Crear array de scores
    return targets.map(target => ({
      ...target,
      count: scoreMap.get(target.id) || 0,
      isComplete: scoreMap.get(target.id) ? true : false
    }));
  }, [targets, found]);

  const totalScore = useMemo(() => {
    return scoreData.reduce((sum, item) => sum + item.count, 0);
  }, [scoreData]);

  const completedTargets = useMemo(() => {
    return scoreData.filter(item => item.isComplete).length;
  }, [scoreData]);

  const renderScoreItem = ({ item }: any) => {
    return (
      <Card variant="elevated">
        <View style={styles.scoreItem}>
          <View style={styles.scoreItemLeft}>
            <Icon name={item.icon} size={36} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={[TYPOGRAPHY.subtitle, styles.scoreItemName]}>{item.name}</Text>
              <Text style={[TYPOGRAPHY.caption, styles.scoreItemDesc]}>{item.description}</Text>
            </View>
          </View>
          <View style={styles.scoreItemRight}>
            <View
              style={[
                styles.scoreCircle,
                item.isComplete && styles.scoreCircleComplete
              ]}
            >
              <Text style={[TYPOGRAPHY.subtitle, styles.scoreCount]}>{item.count}</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con estadísticas generales */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Icon name="bar-chart" size={28} color={COLORS.white} />
            <Text style={[TYPOGRAPHY.h1, styles.headerTitle]}>Tablero</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[TYPOGRAPHY.h2, styles.statValue]}>{totalScore}</Text>
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>Encontrados</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[TYPOGRAPHY.h2, styles.statValue]}>{completedTargets}</Text>
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>Objetivos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[TYPOGRAPHY.h2, styles.statValue]}>
                {targets.length > 0 ? Math.round((completedTargets / targets.length) * 100) : 0}%
              </Text>
              <Text style={[TYPOGRAPHY.caption, styles.statLabel]}>Progreso</Text>
            </View>
          </View>
        </View>

        {/* Lista de scores */}
        <View style={styles.listContainer}>
          <Text style={[TYPOGRAPHY.body, styles.sectionTitle]}>Detalles por Objetivo</Text>
          <FlatList
            data={scoreData}
            keyExtractor={item => item.id}
            renderItem={renderScoreItem}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
          />
        </View>

        {/* Barra de progreso visual */}
        <View style={styles.progressSection}>
          <Text style={[TYPOGRAPHY.body, styles.sectionTitle]}>Progreso General</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(completedTargets / targets.length) * 100}%`
                }
              ]}
            />
          </View>
          <Text style={[TYPOGRAPHY.caption, styles.progressText]}>
            {completedTargets} de {targets.length} objetivos completados
          </Text>
        </View>

        {/* Mensaje motivacional */}
        {completedTargets === targets.length ? (
          <View style={styles.completionCard}>
            <Icon name="checkmark-circle" size={48} color={COLORS.white} />
            <Text style={[TYPOGRAPHY.h2, styles.completionTitle]}>¡Búsqueda Completada!</Text>
            <Text style={[TYPOGRAPHY.body, styles.completionText]}>
              Has encontrado todos los objetivos. ¡Excelente trabajo!
            </Text>
          </View>
        ) : (
          <View style={styles.motivationCard}>
            <Icon name="star-outline" size={48} color={COLORS.white} />
            <Text style={[TYPOGRAPHY.h2, styles.motivationTitle]}>Continúa buscando</Text>
            <Text style={[TYPOGRAPHY.body, styles.motivationText]}>
              Te faltan {targets.length - completedTargets} objetivos por encontrar.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer con botones */}
      <View style={styles.footer}>
        <Button
          title="Inicio"
          variant="primary"
          onPress={() => setCurrentScreen('home')}
          size="medium"
        />
        <Button
          title="Ver Encontrados"
          variant="secondary"
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    ...SHADOWS.md
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg
  },
  headerTitle: {
    color: COLORS.white,
    margin: 0
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.sm
  },
  statValue: {
    color: COLORS.white,
    marginBottom: SPACING.sm
  },
  statLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500'
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg
  },
  sectionTitle: {
    color: COLORS.text,
    marginBottom: SPACING.md
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  scoreItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  scoreItemName: {
    color: COLORS.text,
    marginBottom: SPACING.xs
  },
  scoreItemDesc: {
    color: COLORS.textSecondary
  },
  scoreItemRight: {
    marginLeft: SPACING.md
  },
  scoreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm
  },
  scoreCircleComplete: {
    backgroundColor: COLORS.success
  },
  scoreCount: {
    color: COLORS.text
  },
  progressSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg
  },
  progressBar: {
    height: 24,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.sm
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.md
  },
  progressText: {
    color: COLORS.textSecondary,
    textAlign: 'center'
  },
  completionCard: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.lg
  },
  completionTitle: {
    color: COLORS.white,
    marginBottom: SPACING.sm
  },
  completionText: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center'
  },
  motivationCard: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.warning,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.lg
  },
  motivationTitle: {
    color: COLORS.white,
    marginBottom: SPACING.sm
  },
  motivationText: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    ...SHADOWS.lg
  }
});
