import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, ScrollView,
  StyleSheet, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import { Spacing, Radius, FontSizes, CATEGORIES } from '../../constants/Theme';
import BookCover from '../../components/BookCover';

const { width } = Dimensions.get('window');
const GRID_GAP = 12;
const COL_WIDTH = (width - Spacing.lg * 2 - GRID_GAP) / 2;

export default function ExploreScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Hepsi');

  const filtered = state.books.filter(
    b =>
      !state.blocked.has(b.seller) &&
      (category === 'Hepsi' || b.category === category) &&
      (b.title + b.author + b.seller).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Keşfet</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { paddingHorizontal: Spacing.lg }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.bg2, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Kitap, yazar veya satıcı ara…"
            placeholderTextColor={colors.muted2}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[
              styles.chip,
              {
                borderColor: category === c ? colors.accent : colors.border,
                backgroundColor: category === c ? colors.accent : colors.card,
              },
            ]}
            onPress={() => setCategory(c)}
          >
            <Text
              style={[
                styles.chipText,
                { color: category === c ? colors.accentText : colors.text },
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={48} color={colors.muted2} />
          <Text style={[styles.emptyText, { color: colors.muted }]}>Sonuç bulunamadı.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.gridItem, { width: COL_WIDTH }]}
              onPress={() => router.push(`/book/${item.id}`)}
              activeOpacity={0.8}
            >
              <BookCover id={item.id} title={item.title} author={item.author} />
              <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.bookMeta, { color: colors.muted }]}>
                {item.seller} · {item.city}
              </Text>
              <Text style={[styles.bookPrice, { color: colors.accent }]}>₺{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  title: {
    fontFamily: 'Fraunces',
    fontWeight: '800',
    fontSize: FontSizes.hero,
    letterSpacing: -0.3,
  },
  searchWrap: {
    marginTop: Spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FontSizes.md,
  },
  chips: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: FontSizes.md - 1,
    fontWeight: '500',
  },
  row: {
    gap: GRID_GAP,
  },
  gridContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
    gap: Spacing.lg,
  },
  gridItem: {},
  bookTitle: {
    fontFamily: 'Fraunces',
    fontWeight: '600',
    fontSize: FontSizes.md - 1,
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
  bookMeta: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  bookPrice: {
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: FontSizes.lg - 1,
    marginTop: 3,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.md,
  },
});
