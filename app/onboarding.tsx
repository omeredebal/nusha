import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../context/AppContext';
import { ONBOARDING_SCREENS } from '../constants/Data';
import { Spacing, Radius, FontSizes } from '../constants/Theme';
import BookCover from '../components/BookCover';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const colors = useTheme();
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateTransition = (next: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 15 }),
      ]).start();
    });
  };

  const finish = () => {
    dispatch({ type: 'SET_ONBOARDED' });
    router.replace('/(tabs)');
  };

  const next = () => {
    if (step < ONBOARDING_SCREENS.length - 1) {
      animateTransition(step + 1);
    } else {
      finish();
    }
  };

  const screen = ONBOARDING_SCREENS[step];
  const isLast = step === ONBOARDING_SCREENS.length - 1;

  const bookHues = [200, 340, 45, 120, 280];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Illustration */}
        <View style={[styles.illustration, { backgroundColor: colors.accentLight }]}>
          <Text style={styles.emoji}>{screen.emoji}</Text>
          <View style={styles.booksRow}>
            {bookHues.slice(0, 3).map((h, i) => (
              <View key={i} style={{ transform: [{ rotate: `${(i - 1) * 5}deg` }] }}>
                <BookCover
                  id={h + step * 100}
                  title={['📖', '📚', '✨'][i]}
                  author=""
                  small
                />
              </View>
            ))}
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          {screen.title.split(screen.highlight).map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i === 0 && (
                <Text style={{ color: colors.accent, fontStyle: 'italic' }}>
                  {screen.highlight}
                </Text>
              )}
            </React.Fragment>
          ))}
        </Text>

        {/* Description */}
        <Text style={[styles.desc, { color: colors.muted }]}>{screen.desc}</Text>
      </Animated.View>

      {/* Dots */}
      <View style={styles.dots}>
        {ONBOARDING_SCREENS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === step ? colors.accent : colors.border2,
                width: i === step ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.accent }]}
          onPress={next}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnText, { color: colors.accentText }]}>
            {isLast ? 'Başlayalım ✨' : 'Devam et'}
          </Text>
        </TouchableOpacity>
        {!isLast && (
          <TouchableOpacity style={styles.skip} onPress={finish} activeOpacity={0.6}>
            <Text style={[styles.skipText, { color: colors.muted }]}>Atla</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  booksRow: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    fontFamily: 'Fraunces',
    fontWeight: '800',
    fontSize: 30,
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  desc: {
    fontSize: FontSizes.lg,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 300,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  btnText: {
    fontWeight: '600',
    fontSize: FontSizes.lg,
  },
  skip: {
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontSize: FontSizes.md,
  },
});
