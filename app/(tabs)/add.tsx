import React from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import { Spacing, Radius, FontSizes, LISTING_CATEGORIES, CONDITIONS } from '../../constants/Theme';
import BookCover from '../../components/BookCover';

export default function AddScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const d = state.draft;

  const publish = () => {
    if (!d.title.trim() || !d.price || Number(d.price) <= 0) {
      Alert.alert('Eksik Bilgi', 'Kitap adı ve fiyat gerekli.');
      return;
    }
    dispatch({ type: 'PUBLISH_LISTING' });
    Alert.alert('İlanın Yayında! 🎉', 'Akışta görünmeye başladı.');
    router.navigate('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Yeni İlan</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Live Preview */}
        <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.previewCover}>
            <BookCover id={state.nextId} title={d.title} author={d.author} />
            <View style={[styles.previewPrice, { backgroundColor: colors.accent }]}>
              <Text style={[styles.previewPriceText, { color: colors.accentText }]}>
                ₺{d.price || '0'}
              </Text>
            </View>
            <View style={styles.previewCond}>
              <Text style={styles.previewCondText}>{d.condition}</Text>
            </View>
          </View>
        </View>

        {/* Camera placeholder */}
        <TouchableOpacity
          style={[styles.cameraBox, { borderColor: colors.border2, backgroundColor: colors.card }]}
          activeOpacity={0.7}
        >
          <Ionicons name="camera-outline" size={28} color={colors.muted} />
          <Text style={[styles.cameraText, { color: colors.muted }]}>Kapak Fotoğrafı Çek</Text>
          <Text style={[styles.note, { color: colors.muted2 }]}>Gerçek uygulamada kamerayla çekilir</Text>
        </TouchableOpacity>

        {/* Form */}
        <Text style={[styles.label, { color: colors.muted }]}>KİTAP ADI</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
          value={d.title}
          onChangeText={v => dispatch({ type: 'UPDATE_DRAFT', field: 'title', value: v })}
          placeholder="Örn. Sefiller"
          placeholderTextColor={colors.muted2}
          maxLength={60}
        />

        <Text style={[styles.label, { color: colors.muted }]}>YAZAR</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
          value={d.author}
          onChangeText={v => dispatch({ type: 'UPDATE_DRAFT', field: 'author', value: v })}
          placeholder="Victor Hugo"
          placeholderTextColor={colors.muted2}
          maxLength={50}
        />

        <Text style={[styles.label, { color: colors.muted }]}>KATEGORİ</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {LISTING_CATEGORIES.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.chip,
                {
                  borderColor: d.category === c ? colors.accent : colors.border,
                  backgroundColor: d.category === c ? colors.accent : colors.card,
                },
              ]}
              onPress={() => dispatch({ type: 'UPDATE_DRAFT', field: 'category', value: c })}
            >
              <Text style={{ color: d.category === c ? colors.accentText : colors.text, fontSize: FontSizes.md - 1, fontWeight: '500' }}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.label, { color: colors.muted }]}>DURUM</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CONDITIONS.map(c => (
            <TouchableOpacity
              key={c.value}
              style={[
                styles.chip,
                {
                  borderColor: d.condition === c.value ? colors.accent : colors.border,
                  backgroundColor: d.condition === c.value ? colors.accent : colors.card,
                },
              ]}
              onPress={() => dispatch({ type: 'UPDATE_DRAFT', field: 'condition', value: c.value })}
            >
              <Text style={{ color: d.condition === c.value ? colors.accentText : colors.text, fontSize: FontSizes.md - 1, fontWeight: '500' }}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.label, { color: colors.muted }]}>FİYAT (₺)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
          value={d.price}
          onChangeText={v => dispatch({ type: 'UPDATE_DRAFT', field: 'price', value: v })}
          keyboardType="numeric"
          placeholder="80"
          placeholderTextColor={colors.muted2}
        />

        <Text style={[styles.label, { color: colors.muted }]}>BU KİTAP SANA NE HİSSETTİRDİ?</Text>
        <TextInput
          style={[styles.input, styles.textarea, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
          value={d.note}
          onChangeText={v => dispatch({ type: 'UPDATE_DRAFT', field: 'note', value: v })}
          placeholder="Bir cümleyle ifade et…"
          placeholderTextColor={colors.muted2}
          multiline
          maxLength={250}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.publishBtn, { backgroundColor: colors.accent }]}
          onPress={publish}
          activeOpacity={0.8}
        >
          <Text style={[styles.publishText, { color: colors.accentText }]}>Yayınla ✨</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: 'Fraunces',
    fontWeight: '800',
    fontSize: FontSizes.hero,
  },
  scroll: {
    padding: Spacing.lg,
  },
  previewCard: {
    borderWidth: 1,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  previewCover: {
    paddingHorizontal: 50,
    paddingVertical: Spacing.lg,
    position: 'relative',
  },
  previewPrice: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
  },
  previewPriceText: {
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: 16,
  },
  previewCond: {
    position: 'absolute',
    left: Spacing.lg,
    bottom: Spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewCondText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  cameraBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Radius.sm,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  cameraText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  note: {
    fontSize: FontSizes.sm,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: Spacing.lg,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  textarea: {
    minHeight: 80,
    paddingTop: Spacing.md,
  },
  chips: {
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 7,
  },
  publishBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  publishText: {
    fontWeight: '600',
    fontSize: FontSizes.lg,
  },
});
