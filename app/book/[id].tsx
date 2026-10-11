import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import { Spacing, Radius, FontSizes, getHue, formatTimeAgo } from '../../constants/Theme';
import BookCover from '../../components/BookCover';
import Avatar from '../../components/Avatar';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { state, toggleLike, toggleSave, toggleFollow, sendOffer, startChat } = useApp();
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  const book = state.books.find(b => b.id === Number(id));
  if (!book) return null;

  const isLiked = state.likes.has(book.id);
  const isSaved = state.saved.has(book.id);
  const isFollowing = state.following.has(book.seller);
  const isMe = book.seller === 'Sen';

  const handleOffer = () => {
    setOfferAmount(String(Math.round(book.price * 0.85)));
    setShowOffer(true);
  };

  const submitOffer = () => {
    const amount = Number(offerAmount);
    if (!(amount > 0)) {
      Alert.alert('Hata', 'Geçerli bir tutar gir');
      return;
    }
    const threadId = sendOffer(book.id, amount);
    setShowOffer(false);
    Alert.alert('Teklif Gönderildi ✓', `₺${amount} teklifi gönderildi.`, [
      { text: 'Mesajlara Git', onPress: () => router.push(`/chat/${threadId}`) },
      { text: 'Tamam' },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {book.title}
        </Text>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => Alert.alert('Bilgi', 'Paylaşım linki kopyalandı')}
        >
          <Ionicons name="share-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Cover */}
        <View style={[styles.coverSection, { backgroundColor: colors.card }]}>
          <View style={styles.coverWrap}>
            <BookCover id={book.id} title={book.title} author={book.author} />
            <View style={[styles.priceTag, { backgroundColor: colors.accent }]}>
              <Text style={[styles.priceText, { color: colors.accentText }]}>₺{book.price}</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoRow}>
          <View style={[styles.infoBadge, { backgroundColor: colors.bg2 }]}>
            <Text style={[styles.infoText, { color: colors.muted }]}>
              {book.author} · {book.category} · {book.condition}
            </Text>
          </View>
        </View>

        {/* Seller */}
        <View style={[styles.sellerRow, { borderColor: colors.border }]}>
          <Avatar name={book.seller} verified={book.verified} />
          <View style={styles.sellerInfo}>
            <Text style={[styles.sellerName, { color: colors.text }]}>{book.seller}</Text>
            <Text style={[styles.sellerMeta, { color: colors.muted }]}>
              📍 {book.city} · ★ 4.9 · 23 satış
            </Text>
          </View>
          {!isMe && (
            <TouchableOpacity
              style={[
                styles.followBtn,
                {
                  borderColor: colors.accent,
                  backgroundColor: isFollowing ? colors.accent : 'transparent',
                },
              ]}
              onPress={() => toggleFollow(book.seller)}
            >
              <Text style={{ color: isFollowing ? colors.accentText : colors.accent, fontSize: 12, fontWeight: '600' }}>
                {isFollowing ? 'Takipte' : 'Takip et'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quote */}
        <View style={styles.quoteSection}>
          <View style={[styles.quoteLine, { backgroundColor: colors.accent }]} />
          <Text style={[styles.quote, { color: colors.text2 }]}>"{book.note}"</Text>
        </View>

        {/* Actions */}
        <View style={[styles.actionsRow, { borderColor: colors.border }]}>
          <TouchableOpacity style={styles.actionItem} onPress={() => toggleLike(book.id)}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? colors.accent : colors.muted}
            />
            <Text style={[styles.actionLabel, { color: isLiked ? colors.accent : colors.muted }]}>
              {book.likes + (isLiked ? 1 : 0)} beğeni
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => toggleSave(book.id)}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? colors.accent : colors.muted}
            />
            <Text style={[styles.actionLabel, { color: isSaved ? colors.accent : colors.muted }]}>
              Kaydet
            </Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        {!isMe && (
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={[styles.ctaBtn, styles.ctaOutline, { borderColor: colors.accent }]}
              onPress={() => {
                const threadId = startChat(book.id);
                router.push(`/chat/${threadId}`);
              }}
            >
              <Ionicons name="chatbubble-outline" size={18} color={colors.accent} />
              <Text style={{ color: colors.accent, fontWeight: '600', fontSize: FontSizes.md }}>Mesaj Yaz</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: colors.accent }]}
              onPress={handleOffer}
            >
              <Text style={{ color: colors.accentText, fontWeight: '600', fontSize: FontSizes.md }}>Teklif Ver</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.futureNote, { color: colors.muted }]}>
          💡 Güvenli ödeme ve kargo sonraki sürümde eklenecek.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Offer Modal */}
      <Modal visible={showOffer} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity style={styles.modalBg} onPress={() => setShowOffer(false)} />
          <View style={[styles.sheet, { backgroundColor: colors.card }]}>
            <View style={[styles.handle, { backgroundColor: colors.border2 }]} />
            <Text style={[styles.sheetTitle, { color: colors.text }]}>{book.title}</Text>
            <Text style={[styles.sheetSub, { color: colors.muted }]}>
              İstenen fiyat: <Text style={{ color: colors.accent, fontWeight: '700' }}>₺{book.price}</Text>
            </Text>
            <TextInput
              style={[styles.offerInput, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
              value={offerAmount}
              onChangeText={setOfferAmount}
              keyboardType="numeric"
              autoFocus
            />
            <View style={styles.quickPrices}>
              {[0.9, 0.85, 0.8, 0.75].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.qChip, { borderColor: colors.border, backgroundColor: colors.card }]}
                  onPress={() => setOfferAmount(String(Math.round(book.price * r)))}
                >
                  <Text style={{ color: colors.text }}>₺{Math.round(book.price * r)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.accent }]}
              onPress={submitOffer}
            >
              <Text style={{ color: colors.accentText, fontWeight: '600', fontSize: FontSizes.lg }}>Teklifi Gönder 🤝</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerTitle: {
    flex: 1,
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: FontSizes.xl - 1,
  },
  shareBtn: { padding: Spacing.sm },
  scroll: { paddingBottom: 20 },
  coverSection: {
    paddingHorizontal: 60,
    paddingVertical: Spacing.xl,
    position: 'relative',
  },
  coverWrap: { position: 'relative' },
  priceTag: {
    position: 'absolute',
    top: Spacing.md,
    right: -30,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
  },
  priceText: {
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: 18,
  },
  infoRow: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  infoBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: 20,
  },
  infoText: {
    fontSize: FontSizes.md - 1,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sellerInfo: { flex: 1 },
  sellerName: { fontWeight: '600', fontSize: FontSizes.md },
  sellerMeta: { fontSize: FontSizes.sm, marginTop: 2 },
  followBtn: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  quoteSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    margin: Spacing.lg,
  },
  quoteLine: { width: 3, borderRadius: 3, opacity: 0.35 },
  quote: {
    flex: 1,
    fontFamily: 'Fraunces_Italic',
    fontSize: FontSizes.lg,
    lineHeight: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xxl,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    borderTopWidth: 1,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: Spacing.sm,
  },
  actionLabel: { fontSize: FontSizes.md },
  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  ctaBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  ctaOutline: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  futureNote: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: 40,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.lg,
  },
  sheetTitle: { fontFamily: 'Fraunces', fontWeight: '700', fontSize: FontSizes.xxl },
  sheetSub: { fontSize: FontSizes.md, marginTop: 4, marginBottom: Spacing.lg },
  offerInput: {
    borderWidth: 1.5, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: 22, fontFamily: 'Fraunces', fontWeight: '700', textAlign: 'center',
  },
  quickPrices: {
    flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginTop: Spacing.md,
  },
  qChip: {
    borderWidth: 1.5, borderRadius: 20, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  submitBtn: {
    width: '100%', paddingVertical: Spacing.lg, borderRadius: Radius.sm,
    alignItems: 'center', marginTop: Spacing.xl,
  },
});
