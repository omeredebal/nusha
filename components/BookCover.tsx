import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getHue, Shadows } from '../constants/Theme';

interface BookCoverProps {
  id: number;
  title: string;
  author: string;
  small?: boolean;
}

export default function BookCover({ id, title, author, small }: BookCoverProps) {
  const hue = getHue(id);
  const pattern = id % 6;

  const gradients: [string, string][] = [
    [`hsl(${hue}, 42%, 36%)`, `hsl(${hue}, 48%, 22%)`],
    [`hsl(${hue}, 50%, 40%)`, `hsl(${hue}, 38%, 26%)`],
    [`hsl(${hue}, 38%, 32%)`, `hsl(${hue}, 42%, 22%)`],
    [`hsl(${hue}, 45%, 38%)`, `hsl(${hue}, 36%, 24%)`],
    [`hsl(${hue}, 42%, 34%)`, `hsl(${hue}, 55%, 26%)`],
    [`hsl(${hue}, 40%, 30%)`, `hsl(${hue}, 50%, 22%)`],
  ];

  const [startColor, endColor] = gradients[pattern];

  if (small) {
    return (
      <View style={[styles.coverSmall, Shadows.cover]}>
        <LinearGradient
          colors={[startColor, endColor]}
          style={styles.coverSmallInner}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 1 }}
        >
          <Text style={styles.titleSmall} numberOfLines={2}>{title || 'Kitap adı'}</Text>
        </LinearGradient>
        <View style={styles.spine} />
      </View>
    );
  }

  return (
    <View style={[styles.cover, Shadows.cover]}>
      <LinearGradient
        colors={[startColor, endColor]}
        style={styles.coverInner}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      >
        <Text style={styles.title} numberOfLines={3}>{title || 'Kitap adı'}</Text>
        <Text style={styles.author} numberOfLines={1}>{author || 'Yazar'}</Text>
      </LinearGradient>
      <View style={styles.spine} />
      <View style={styles.pageEdge} />
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    aspectRatio: 3 / 4,
    borderRadius: 3,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  coverInner: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 22,
    paddingLeft: 26,
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF8EE',
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  author: {
    fontSize: 10,
    color: 'rgba(255,248,238,0.7)',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  pageEdge: {
    position: 'absolute',
    right: -3,
    top: 2,
    bottom: 2,
    width: 3,
    backgroundColor: '#E9DFCD',
    borderRadius: 1,
  },
  coverSmall: {
    width: 70,
    height: 95,
    borderRadius: 2,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  coverSmallInner: {
    flex: 1,
    justifyContent: 'center',
    padding: 6,
    paddingLeft: 10,
  },
  titleSmall: {
    fontFamily: 'Fraunces',
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF8EE',
    lineHeight: 12,
  },
});
