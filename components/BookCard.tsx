import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../context/AppContext';
import { formatTimeAgo, Spacing, Radius, FontSizes } from '../constants/Theme';
import BookCover from './BookCover';
import Avatar from './Avatar';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onOffer: () => void;
}

export default function BookCard({ book, onPress, onOffer }: BookCardProps) {
  const colors = useTheme();
  const { state, toggleLike, toggleSave, toggleFollow } = useApp();
  const isLiked = state.likes.has(book.id);
  const isSaved = state.saved.has(book.id);
  const isFollowing = state.following.has(book.seller);
  const isMe = book.seller === 'Sen';

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.top}>
        <Avatar name={book.seller} verified={book.verified} />
        <View style={styles.nameCol}>
          <Text style={[styles.seller, { color: colors.text }]}>{book.seller}</Text>
          <Text style={[styles.meta, { color: colors.muted }]}>
            📍 {book.city} · {formatTimeAgo(book.timeAgo)}
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
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.followText,
                { color: isFollowing ? colors.accentText : colors.accent },
              ]}
            >
              {isFollowing ? 'Takipte' : 'Takip et'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cover */}
      <TouchableOpacity style={styles.coverWrap} onPress={onPress} activeOpacity={0.9}>
        <BookCover id={book.id} title={book.title} author={book.author} />
        <View style={[styles.priceTag, { backgroundColor: colors.accent }]}>
          <Text style={[styles.priceText, { color: colors.accentText }]}>₺{book.price}</Text>
        </View>
        <View style={styles.condBadge}>
          <Text style={styles.condText}>{book.condition}</Text>
        </View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleLike(book.id)}
          activeOpacity={0.6}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={isLiked ? colors.accent : colors.muted}
          />
          <Text style={[styles.actionCount, { color: isLiked ? colors.accent : colors.muted }]}>
            {book.likes + (isLiked ? 1 : 0)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.muted} />
          <Text style={[styles.actionCount, { color: colors.muted }]}>{book.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleSave(book.id)}
          activeOpacity={0.6}
        >
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isSaved ? colors.accent : colors.muted}
          />
        </TouchableOpacity>

        <View style={styles.spacer} />

        {!isMe && (
          <TouchableOpacity
            style={[styles.offerBtn, { backgroundColor: colors.accent }]}
            onPress={onOffer}
            activeOpacity={0.7}
          >
            <Text style={[styles.offerText, { color: colors.accentText }]}>Teklif Ver</Text>
          </TouchableOpacity>
        )}
        {isMe && (
          <Text style={[styles.myTag, { color: colors.muted }]}>Senin ilanın</Text>
        )}
      </View>

      {/* Quote */}
      <View style={styles.quoteWrap}>
        <View style={[styles.quoteLine, { backgroundColor: colors.accent }]} />
        <Text style={[styles.quote, { color: colors.text2 }]}>"{book.note}"</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  nameCol: {
    flex: 1,
  },
  seller: {
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  meta: {
    fontSize: FontSizes.sm,
    marginTop: 1,
  },
  followBtn: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
  },
  followText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  coverWrap: {
    paddingHorizontal: 44,
    paddingVertical: Spacing.md,
    position: 'relative',
  },
  priceTag: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
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
    fontSize: 17,
  },
  condBadge: {
    position: 'absolute',
    left: Spacing.lg,
    bottom: Spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  condText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  actionCount: {
    fontSize: FontSizes.md - 1,
  },
  spacer: {
    flex: 1,
  },
  offerBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  offerText: {
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  myTag: {
    fontSize: FontSizes.sm,
    paddingRight: Spacing.sm,
  },
  quoteWrap: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 14,
    paddingTop: 4,
    gap: Spacing.md,
  },
  quoteLine: {
    width: 3,
    borderRadius: 3,
    opacity: 0.35,
  },
  quote: {
    flex: 1,
    fontFamily: 'Fraunces_Italic',
    fontSize: 15,
    lineHeight: 22,
  },
});
