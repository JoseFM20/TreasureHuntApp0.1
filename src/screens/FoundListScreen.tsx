/**
 * @file src/screens/FoundListScreen.tsx
 * Pantalla de items encontrados con diseño moderno
 */

import React, { useMemo } from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, RADIUS } from '../constants';
import { Button, Card, LoadingSpinner, Icon } from '../components';
import { useAppContext } from '../context';
import { formatDate, getStats, groupByDay } from '../utils';

export const FoundListScreen: React.FC = () => {
  const { found, removeFoundItem, setCurrentScreen } = useAppContext();
  const stats = useMemo(() => getStats(found), [found]);
  const grouped = useMemo(() => groupByDay(found), [found]);

  const days = Object.keys(grouped).sort().reverse();

  const handleDelete = (id: string) => {
    removeFoundItem(id);
  };

  if (found.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="mail-open" size={64} color={COLORS.gray} />
          <Text style={[TYPOGRAPHY.h2, styles.emptyText]}>Aún no hay objetos encontrados</Text>
          <Text style={[TYPOGRAPHY.body, styles.emptySubtext]}>¡Inicia una búsqueda!</Text>
          <Button
            title="Volver a casa"
            onPress={() => setCurrentScreen('home')}
            variant="primary"
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[TYPOGRAPHY.h1, styles.title]}>Items Encontrados</Text>
        <Text style={[TYPOGRAPHY.body, styles.stats]}>
          {stats.photos} fotos • {stats.videos} videos
        </Text>
      </View>

      <FlatList
        data={days}
        keyExtractor={day => day}
        renderItem={({ item: day }) => (
          <View key={day}>
            <Text style={[TYPOGRAPHY.caption, styles.dayHeader]}>{day}</Text>
            {grouped[day].map(item => (
              <Card key={item.id} variant="elevated" style={styles.itemCard}>
                <View style={styles.itemContent}>
                  {item.type === 'photo' ? (
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <View style={[styles.thumbnail, styles.videoPlaceholder]}>
                      <Icon name="play-circle" size={32} color={COLORS.white} />
                    </View>
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={[TYPOGRAPHY.subtitle, styles.itemTitle]}>{item.targetName}</Text>
                    <View style={styles.itemTypeContainer}>
                      {item.type === 'photo' ? (
                        <>
                          <Icon name="camera" size={14} color={COLORS.primary} />
                          <Text style={[TYPOGRAPHY.caption, styles.itemType]}>Foto</Text>
                        </>
                      ) : (
                        <>
                          <Icon name="play-outline" size={14} color={COLORS.primary} />
                          <Text style={[TYPOGRAPHY.caption, styles.itemType]}>Video</Text>
                        </>
                      )}
                    </View>
                    <Text style={[TYPOGRAPHY.caption, styles.itemTime]}>
                      {new Date(item.timestamp).toLocaleTimeString('es-ES')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteBtn}
                    activeOpacity={0.7}
                  >
                    <View style={styles.deleteBtnBox}>
                      <Icon name="trash" size={20} color={COLORS.danger} />
                    </View>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <Button
          title="Volver"
          onPress={() => setCurrentScreen('home')}
          variant="secondary"
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
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    ...SHADOWS.md
  },
  title: {
    color: COLORS.white,
    marginBottom: SPACING.sm
  },
  stats: {
    color: COLORS.white,
    opacity: 0.9
  },
  listContent: {
    paddingBottom: SPACING.xl
  },
  dayHeader: {
    color: COLORS.textSecondary,
    marginLeft: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md
  },
  itemCard: {
    marginVertical: 0,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md
  },
  videoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    color: COLORS.text,
    marginBottom: SPACING.xs
  },
  itemTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs
  },
  itemType: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs
  },
  itemTime: {
    color: COLORS.textSecondary
  },
  deleteBtn: {
    padding: SPACING.sm
  },
  deleteBtnBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
    color: COLORS.text
  },
  emptySubtext: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    ...SHADOWS.lg
  }
});
