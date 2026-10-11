import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUserHue } from '../constants/Theme';
import { useTheme } from '../hooks/useTheme';

interface AvatarProps {
  name: string;
  size?: number;
  verified?: boolean;
}

export default function Avatar({ name, size = 40, verified }: AvatarProps) {
  const colors = useTheme();
  const hue = getUserHue(name);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: `hsl(${hue}, 35%, 38%)`,
          },
        ]}
      >
        <Text
          style={[
            styles.initial,
            { fontSize: size * 0.42, color: colors.accentText },
          ]}
        >
          {name[0]}
        </Text>
      </View>
      {verified && (
        <View style={[styles.badge, { borderColor: colors.card }]}>
          <Text style={styles.badgeText}>✓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    fontFamily: 'Fraunces',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    bottom: -1,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2D7D4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
});
