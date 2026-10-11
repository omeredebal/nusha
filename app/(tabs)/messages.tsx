import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import { Spacing, Radius, FontSizes } from '../../constants/Theme';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';

export default function MessagesScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { state } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mesajlar</Text>
      </View>

      {state.threads.length === 0 ? (
        <EmptyState
          icon="chatbubble-outline"
          title="Henüz mesajın yok"
          description="İlanlara teklif vererek sohbet başlat."
        />
      ) : (
        <FlatList
          data={state.threads}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const lastMsg = item.messages[item.messages.length - 1];
            const preview = lastMsg?.offer
              ? `Teklif: ₺${lastMsg.offer.value}`
              : lastMsg?.text || '';
            const book = state.books.find(b => b.id === item.bookId);

            return (
              <TouchableOpacity
                style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {
                  router.push(`/chat/${item.id}`);
                }}
                activeOpacity={0.7}
              >
                <Avatar name={item.user} verified={book?.verified} />
                <View style={styles.rowContent}>
                  <View style={styles.rowTop}>
                    <Text style={[styles.name, { color: colors.text }]}>{item.user}</Text>
                    <Text style={[styles.time, { color: colors.muted2 }]}>
                      {lastMsg?.time || ''}
                    </Text>
                  </View>
                  {book && (
                    <Text style={[styles.bookRef, { color: colors.muted }]} numberOfLines={1}>
                      📖 {book.title}
                    </Text>
                  )}
                  <Text style={[styles.preview, { color: colors.muted }]} numberOfLines={1}>
                    {preview}
                  </Text>
                </View>
                {item.unread && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
                )}
              </TouchableOpacity>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: 'Fraunces',
    fontWeight: '800',
    fontSize: FontSizes.hero,
  },
  list: {
    padding: Spacing.lg,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
    gap: Spacing.md,
  },
  rowContent: {
    flex: 1,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  time: {
    fontSize: FontSizes.xs + 1,
  },
  bookRef: {
    fontSize: FontSizes.sm,
    marginTop: 1,
  },
  preview: {
    fontSize: FontSizes.md - 1,
    marginTop: 2,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
