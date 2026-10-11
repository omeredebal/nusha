import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import { Spacing, Radius, FontSizes, getHue } from '../../constants/Theme';
import Avatar from '../../components/Avatar';
import BookCover from '../../components/BookCover';
import EmptyState from '../../components/EmptyState';
import { ProfileTab } from '../../types';

export default function ProfileScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const [tab, setTab] = useState<ProfileTab>('listings');

  const tabs: { key: ProfileTab; label: string; icon: string }[] = [
    { key: 'listings', label: 'İlanlarım', icon: 'book-outline' },
    { key: 'saved', label: 'Kaydedilenler', icon: 'bookmark-outline' },
    { key: 'shelf', label: 'Raflarım', icon: 'library-outline' },
  ];

  const savedBooks = state.books.filter(b => state.saved.has(b.id));

  const renderTabContent = () => {
    switch (tab) {
      case 'listings':
        if (state.myListings.length === 0) {
          return (
            <EmptyState
              icon="book-outline"
              title="Henüz ilanın yok"
              description="İlk kitabını satmaya başla!"
            />
          );
        }
        return (
          <View style={styles.grid}>
            {state.myListings.map(b => (
              <TouchableOpacity
                key={b.id}
                style={styles.gridItem}
                onPress={() => router.push(`/book/${b.id}`)}
              >
                <BookCover id={b.id} title={b.title} author={b.author} small />
                <Text style={[styles.gridTitle, { color: colors.text }]} numberOfLines={1}>
                  {b.title}
                </Text>
                <Text style={[styles.gridPrice, { color: colors.accent }]}>₺{b.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'saved':
        if (savedBooks.length === 0) {
          return (
            <EmptyState
              icon="bookmark-outline"
              title="Kaydettiğin ilan yok"
              description="Akıştaki ilanları kaydet!"
            />
          );
        }
        return (
          <View style={styles.grid}>
            {savedBooks.map(b => (
              <TouchableOpacity
                key={b.id}
                style={styles.gridItem}
                onPress={() => router.push(`/book/${b.id}`)}
              >
                <BookCover id={b.id} title={b.title} author={b.author} small />
                <Text style={[styles.gridTitle, { color: colors.text }]} numberOfLines={1}>
                  {b.title}
                </Text>
                <Text style={[styles.gridMeta, { color: colors.muted }]}>
                  {b.seller} · ₺{b.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'shelf':
        return (
          <View>
            {[
              { key: 'reading', label: '📖 Şu An Okuyorum', items: state.shelves.reading },
              { key: 'read', label: '✅ Okuduklarım', items: state.shelves.read },
              { key: 'want', label: '🎯 Okumak İstiyorum', items: state.shelves.want },
            ].map(section => (
              <View key={section.key} style={styles.shelfSection}>
                <View style={styles.shelfHeader}>
                  <Text style={[styles.shelfLabel, { color: colors.muted }]}>{section.label}</Text>
                  <View style={[styles.shelfCount, { backgroundColor: colors.accentLight }]}>
                    <Text style={[styles.shelfCountText, { color: colors.accent }]}>
                      {section.items.length}
                    </Text>
                  </View>
                </View>
                {section.items.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.shelfScroll}
                  >
                    {section.items.map(item => (
                      <View key={item.id} style={styles.shelfItem}>
                        <BookCover id={item.id} title={item.title} author={item.author} small />
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={[styles.shelfEmpty, { color: colors.muted2 }]}>
                    Henüz kitap eklenmemiş.
                  </Text>
                )}
              </View>
            ))}
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar name="Sen" size={80} />
          <Text style={[styles.profileName, { color: colors.text }]}>Okur Profili</Text>
          <Text style={[styles.profileBio, { color: colors.muted }]}>📍 Bursa · Okur & Satıcı</Text>
        </View>

        {/* Stats */}
        <View style={[styles.stats, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { value: state.myListings.length, label: 'İlan' },
            { value: 128, label: 'Takipçi' },
            { value: 34 + state.following.size, label: 'Takip' },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.accent }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
          {tabs.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && { borderBottomColor: colors.accent }]}
              onPress={() => setTab(t.key)}
            >
              <Ionicons
                name={t.icon as any}
                size={18}
                color={tab === t.key ? colors.accent : colors.muted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: tab === t.key ? colors.accent : colors.muted },
                  tab === t.key && styles.tabLabelActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Menu */}
        <View style={[styles.menu, { borderTopColor: colors.border }]}>
          {[
            { icon: 'create-outline', label: 'Profili Düzenle', action: () => Alert.alert('Bilgi', 'Profil düzenleme yakında') },
            { icon: 'settings-outline', label: 'Ayarlar', action: () => Alert.alert('Bilgi', 'Ayarlar yakında') },
            { icon: 'gift-outline', label: 'İstek Listem', action: () => Alert.alert('Bilgi', 'İstek listesi yakında') },
            { icon: 'trash-outline', label: 'Hesabı Sil', danger: true, action: () => {
              Alert.alert(
                'Hesabı Sil',
                'Bu işlem geri alınamaz. Tüm verileriniz silinecek.',
                [
                  { text: 'Vazgeç', style: 'cancel' },
                  { text: 'Sil', style: 'destructive', onPress: () => Alert.alert('Bilgi', 'Hesap silme talebi alındı') },
                ]
              );
            }},
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuRow, { borderBottomColor: colors.border }]}
              onPress={item.action}
              activeOpacity={0.6}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={item.danger ? colors.red : colors.muted}
              />
              <Text style={[styles.menuLabel, { color: item.danger ? colors.red : colors.text }]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted2} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg },
  profileHeader: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  profileName: {
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: FontSizes.xxl,
    marginTop: Spacing.md,
  },
  profileBio: {
    fontSize: FontSizes.md - 1,
    marginTop: Spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  statItem: { alignItems: 'center' },
  statValue: {
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: FontSizes.xxl,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: FontSizes.md - 1,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridItem: {
    width: '30%',
  },
  gridTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  gridPrice: {
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  gridMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  shelfSection: {
    marginBottom: Spacing.xl,
  },
  shelfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  shelfLabel: {
    fontSize: FontSizes.md - 1,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shelfCount: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    borderRadius: 10,
  },
  shelfCountText: {
    fontSize: FontSizes.xs + 1,
    fontWeight: '600',
  },
  shelfScroll: {
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  shelfItem: {},
  shelfEmpty: {
    fontSize: FontSizes.sm,
  },
  menu: {
    borderTopWidth: 1,
    marginTop: Spacing.xxl,
    paddingTop: Spacing.lg,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSizes.md,
  },
});
