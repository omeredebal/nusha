import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Modal,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import { Spacing, Radius, FontSizes } from '../../constants/Theme';
import BookCard from '../../components/BookCard';
import { Book } from '../../types';

export default function FeedScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { state, unreadNotifCount } = useApp();
  const [offerBook, setOfferBook] = useState<Book | null>(null);
  const [offerAmount, setOfferAmount] = useState('');

  const visibleBooks = state.books.filter(b => !state.blocked.has(b.seller));

  const openBook = useCallback((id: number) => {
    router.push(`/book/${id}`);
  }, []);

  const openOffer = useCallback((book: Book) => {
    setOfferBook(book);
    setOfferAmount(String(Math.round(book.price * 0.85)));
  }, []);

  const submitOffer = useCallback(() => {
    if (!offerBook) return;
    const amount = Number(offerAmount);
    if (!(amount > 0)) {
      Alert.alert('Hata', 'Geçerli bir tutar gir');
      return;
    }
    const { sendOffer } = useAppRef.current;
    const threadId = sendOffer(offerBook.id, amount);
    setOfferBook(null);
    Alert.alert('Teklif Gönderildi ✓', `₺${amount} teklifi ${offerBook.seller}'a iletildi.`, [
      { text: 'Mesajlara Git', onPress: () => router.push(`/chat/${threadId}`) },
      { text: 'Tamam' },
    ]);
  }, [offerBook, offerAmount]);

  // We need a ref to avoid stale closure in submitOffer
  const useAppRef = React.useRef(useApp());
  useAppRef.current = useApp();

  const renderHeader = () => (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Text style={[styles.logo, { color: colors.text }]}>
        nüsha<Text style={{ color: colors.accent, fontStyle: 'normal' }}>.</Text>
      </Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push('/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {unreadNotifCount > 0 && (
            <View style={[styles.notifBadge, { backgroundColor: colors.red }]}>
              <Text style={styles.notifBadgeText}>{unreadNotifCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      {renderHeader()}

      <FlatList
        data={visibleBooks}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => openBook(item.id)}
            onOffer={() => openOffer(item)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Offer Modal */}
      <Modal visible={!!offerBook} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={styles.modalBg} onPress={() => setOfferBook(null)} />
          <View style={[styles.sheet, { backgroundColor: colors.card }]}>
            <View style={[styles.handle, { backgroundColor: colors.border2 }]} />
            {offerBook && (
              <>
                <Text style={[styles.sheetTitle, { color: colors.text }]}>{offerBook.title}</Text>
                <Text style={[styles.sheetSub, { color: colors.muted }]}>
                  İstenen fiyat: <Text style={{ color: colors.accent, fontWeight: '700' }}>₺{offerBook.price}</Text>
                </Text>

                <Text style={[styles.label, { color: colors.muted }]}>TEKLİFİN (₺)</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: colors.bg2,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  value={offerAmount}
                  onChangeText={setOfferAmount}
                  keyboardType="numeric"
                  autoFocus
                />

                <View style={styles.quickPrices}>
                  {[0.9, 0.85, 0.8, 0.75].map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.chip, { borderColor: colors.border, backgroundColor: colors.card }]}
                      onPress={() => setOfferAmount(String(Math.round(offerBook.price * r)))}
                    >
                      <Text style={{ color: colors.text, fontSize: FontSizes.md }}>
                        ₺{Math.round(offerBook.price * r)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, { backgroundColor: colors.accent }]}
                  onPress={submitOffer}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.submitText, { color: colors.accentText }]}>
                    Teklifi Gönder 🤝
                  </Text>
                </TouchableOpacity>

                <Text style={[styles.note, { color: colors.muted }]}>
                  Satıcı teklifini kabul ederse bildirim alırsın.
                </Text>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  logo: {
    fontFamily: 'Fraunces_Italic',
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconBtn: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  list: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: FontSizes.xxl,
  },
  sheetSub: {
    fontSize: FontSizes.md,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 22,
    fontFamily: 'Fraunces',
    fontWeight: '700',
    textAlign: 'center',
  },
  quickPrices: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  submitBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  submitText: {
    fontWeight: '600',
    fontSize: FontSizes.lg,
  },
  note: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
