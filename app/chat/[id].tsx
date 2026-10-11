import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';
import { Spacing, Radius, FontSizes } from '../../constants/Theme';
import Avatar from '../../components/Avatar';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { state, sendMessage, dispatch } = useApp();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const thread = state.threads.find(t => t.id === Number(id));
  const book = thread ? state.books.find(b => b.id === thread.bookId) : null;

  useEffect(() => {
    if (thread) {
      dispatch({ type: 'MARK_THREAD_READ', threadId: thread.id });
    }
  }, [thread?.id]);

  if (!thread) return null;

  const handleSend = () => {
    const msg = text.trim();
    if (!msg) return;
    sendMessage(thread.id, msg);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item, index }: { item: typeof thread.messages[0]; index: number }) => {
    if (item.offer) {
      const statusMap: Record<string, string> = {
        wait: '⏳ Yanıt bekleniyor…',
        acc: '✓ Kabul edildi',
        old: '↩ Karşı teklif geldi',
        rej: '✗ Reddedildi',
        cnt: '🤝 Karşı teklif',
      };
      const isAccepted = item.offer.status === 'acc';
      const isCounter = item.offer.status === 'cnt';

      return (
        <View
          style={[
            styles.offerBubble,
            {
              backgroundColor: isAccepted ? colors.greenLight : colors.card,
              borderColor: isAccepted ? colors.green : colors.accent,
            },
          ]}
        >
          <Text style={[styles.offerLabel, { color: colors.muted }]}>
            {item.from === 'me' ? 'Senin teklifin' : `${thread.user} karşı teklif`}
          </Text>
          <Text
            style={[
              styles.offerValue,
              { color: isAccepted ? colors.green : colors.accent },
            ]}
          >
            ₺{item.offer.value}
          </Text>
          <Text style={[styles.offerStatus, { color: colors.muted }]}>
            {statusMap[item.offer.status] || ''}
          </Text>
          {isCounter && (
            <View style={styles.offerActions}>
              <TouchableOpacity
                style={[styles.offerActionBtn, { backgroundColor: colors.green }]}
                onPress={() => dispatch({ type: 'RESPOND_OFFER', threadId: thread.id, messageIndex: index, accept: true })}
              >
                <Text style={styles.offerActionText}>Kabul Et</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.offerActionBtn, { backgroundColor: colors.red }]}
                onPress={() => dispatch({ type: 'RESPOND_OFFER', threadId: thread.id, messageIndex: index, accept: false })}
              >
                <Text style={styles.offerActionText}>Reddet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }

    const isMe = item.from === 'me';
    return (
      <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
        <View
          style={[
            styles.bubble,
            isMe
              ? [styles.bubbleMe, { backgroundColor: colors.accent }]
              : [styles.bubbleThem, { backgroundColor: colors.card, borderColor: colors.border }],
          ]}
        >
          <Text style={[styles.msgText, { color: isMe ? colors.accentText : colors.text }]}>
            {item.text}
          </Text>
          <Text
            style={[
              styles.msgTime,
              { color: isMe ? 'rgba(255,255,255,0.6)' : colors.muted2 },
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Avatar name={thread.user} size={34} verified={book?.verified} />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.text }]}>{thread.user}</Text>
          {book && (
            <Text style={[styles.headerSub, { color: colors.muted }]} numberOfLines={1}>
              {book.title} · ₺{book.price}
            </Text>
          )}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={thread.messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input */}
      <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
          value={text}
          onChangeText={setText}
          placeholder="Mesaj yaz…"
          placeholderTextColor={colors.muted2}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.accent }]}
          onPress={handleSend}
        >
          <Ionicons name="send" size={18} color={colors.accentText} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  headerInfo: { flex: 1 },
  headerName: { fontWeight: '600', fontSize: FontSizes.md },
  headerSub: { fontSize: FontSizes.sm - 1, marginTop: 1 },
  messagesList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  msgRow: {},
  msgRowMe: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: FontSizes.md,
    lineHeight: 20,
  },
  msgTime: {
    fontSize: 10,
    marginTop: 3,
  },
  offerBubble: {
    alignSelf: 'center',
    width: '85%',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  offerLabel: {
    fontSize: FontSizes.sm,
  },
  offerValue: {
    fontFamily: 'Fraunces',
    fontWeight: '700',
    fontSize: 26,
    marginVertical: 4,
  },
  offerStatus: {
    fontSize: FontSizes.sm,
  },
  offerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    width: '100%',
  },
  offerActionBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  offerActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: FontSizes.md - 1,
  },
  inputBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md - 2,
    fontSize: FontSizes.md,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
