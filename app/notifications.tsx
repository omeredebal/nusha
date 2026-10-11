import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../context/AppContext';
import { Spacing, Radius, FontSizes } from '../constants/Theme';
import EmptyState from '../components/EmptyState';

const ICON_MAP: Record<string, { icon: string; bgKey: string; colorKey: string }> = {
  like: { icon: 'heart', bgKey: 'redLight', colorKey: 'red' },
  offer: { icon: 'pricetag', bgKey: 'goldLight', colorKey: 'gold' },
  follow: { icon: 'person-add', bgKey: 'greenLight', colorKey: 'green' },
  msg: { icon: 'chatbubble', bgKey: 'accentLight', colorKey: 'accent' },
};

export default function NotificationsScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Bildirimler</Text>
        <TouchableOpacity
          style={styles.markBtn}
          onPress={() => dispatch({ type: 'MARK_ALL_NOTIFS_READ' })}
        >
          <Ionicons name="checkmark-done" size={22} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {state.notifications.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          title="Henüz bildirim yok"
          description="Etkileşimler burada görünecek."
        />
      ) : (
        <FlatList
          data={state.notifications}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const cfg = ICON_MAP[item.type] || ICON_MAP.msg;
            return (
              <View
                style={[
                  styles.row,
                  {
                    backgroundColor: item.read ? colors.card : colors.accentLight,
                    borderColor: item.read ? colors.border : colors.accent,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: (colors as any)[cfg.bgKey] },
                  ]}
                >
                  <Ionicons
                    name={cfg.icon as any}
                    size={18}
                    color={(colors as any)[cfg.colorKey]}
                  />
                </View>
                <View style={styles.body}>
                  <Text style={[styles.text, { color: colors.text }]}>{item.text}</Text>
                  <Text style={[styles.time, { color: colors.muted }]}>{item.time} önce</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  backBtn: { padding: Spacing.sm },
  title: {
    flex: 1,
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: FontSizes.xl,
  },
  markBtn: { padding: Spacing.sm },
  list: {
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: { flex: 1 },
  text: { fontSize: FontSizes.md - 1, lineHeight: 20 },
  time: { fontSize: FontSizes.xs + 1, marginTop: 3 },
});
