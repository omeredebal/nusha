import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors, ThemeColors } from '../constants/Theme';

export function useTheme(): ThemeColors {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}

export function useIsDark(): boolean {
  const scheme = useRNColorScheme();
  return scheme === 'dark';
}
