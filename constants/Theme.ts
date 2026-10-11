import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ====== Color Palette ======

export const Colors = {
  light: {
    bg: '#F5EFE5',
    bg2: '#EDE6DA',
    card: '#FFFBF5',
    card2: '#FFF7ED',
    text: '#1A1512',
    text2: '#3D3529',
    muted: '#8A7B6B',
    muted2: '#B5A594',
    border: '#E8DDD0',
    border2: '#D6C9B8',
    accent: '#8B2F3B',
    accentHover: '#A33848',
    accentLight: 'rgba(139, 47, 59, 0.08)',
    accentText: '#FFFAF5',
    gold: '#B8893A',
    goldLight: 'rgba(184, 137, 58, 0.12)',
    green: '#2D7D4F',
    greenLight: 'rgba(45, 125, 79, 0.1)',
    red: '#C0392B',
    redLight: 'rgba(192, 57, 43, 0.1)',
    blue: '#2980B9',
    tabBar: '#FFFBF5',
    statusBar: 'dark' as const,
  },
  dark: {
    bg: '#0F0D0A',
    bg2: '#171411',
    card: '#1C1915',
    card2: '#23201B',
    text: '#F2EADF',
    text2: '#D6CBBC',
    muted: '#9E9080',
    muted2: '#6B5F52',
    border: '#2E2923',
    border2: '#3D362E',
    accent: '#E09478',
    accentHover: '#E8A88F',
    accentLight: 'rgba(224, 148, 120, 0.1)',
    accentText: '#1B130D',
    gold: '#D4A44A',
    goldLight: 'rgba(212, 164, 74, 0.12)',
    green: '#4CAF7C',
    greenLight: 'rgba(76, 175, 124, 0.1)',
    red: '#E74C3C',
    redLight: 'rgba(231, 76, 60, 0.1)',
    blue: '#5DADE2',
    tabBar: '#1C1915',
    statusBar: 'light' as const,
  },
};

export type ThemeColors = {
  [K in keyof typeof Colors.light]: K extends 'statusBar' ? 'dark' | 'light' : (typeof Colors.light)[K];
};

// ====== Typography ======

export const Fonts = {
  serif: 'Fraunces',
  serifItalic: 'Fraunces_Italic',
  sans: 'Inter',
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  hero: 28,
  display: 34,
};

// ====== Spacing ======

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

// ====== Border Radius ======

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
};

// ====== Shadows ======

export const Shadows = {
  small: {
    shadowColor: '#1A1512',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#1A1512',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#1A1512',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  cover: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
};

// ====== Layout ======

export const Layout = {
  screenWidth: SCREEN_WIDTH,
  maxWidth: 430,
  coverAspectRatio: 3 / 4,
};

// ====== Book Cover Patterns ======

export const CoverPatterns = [
  // Each pattern returns gradient colors based on hue
  (h: number) => [`hsl(${h}, 42%, 36%)`, `hsl(${h}, 48%, 22%)`],
  (h: number) => [`hsl(${h}, 50%, 40%)`, `hsl(${h}, 40%, 26%)`],
  (h: number) => [`hsl(${h}, 38%, 30%)`, `hsl(${h}, 38%, 24%)`],
  (h: number) => [`hsl(${h}, 45%, 35%)`, `hsl(${h}, 36%, 24%)`],
  (h: number) => [`hsl(${h}, 42%, 32%)`, `hsl(${h}, 55%, 38%)`],
  (h: number) => [`hsl(${h}, 38%, 28%)`, `hsl(${h}, 50%, 36%)`],
];

// ====== Utility ======

export function getHue(id: number): number {
  return (id * 53 + 10) % 360;
}

export function getUserHue(name: string): number {
  return ([...name].reduce((s, c) => s + c.charCodeAt(0), 0) * 37) % 360;
}

export function formatTimeAgo(minutes: number): string {
  if (minutes < 1) return 'şimdi';
  if (minutes < 60) return `${minutes} dk`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} sa`;
  return `${Math.floor(minutes / 1440)} gün`;
}

export const CONDITIONS: Array<{ label: string; value: string }> = [
  { label: 'Yeni gibi', value: 'Yeni gibi' },
  { label: 'Çok iyi', value: 'Çok iyi' },
  { label: 'İyi', value: 'İyi' },
  { label: 'Yıpranmış', value: 'Yıpranmış' },
];

export const CATEGORIES = [
  'Hepsi', 'Roman', 'Felsefe', 'Çocuk', 'Distopya', 'Macera', 'Şiir', 'Tarih', 'Bilim',
];

export const LISTING_CATEGORIES = [
  'Roman', 'Felsefe', 'Çocuk', 'Distopya', 'Macera', 'Şiir', 'Tarih', 'Bilim',
];
