import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '@/app/providers/theme.provider';
import { AUTH_BACKGROUND_DARK_XML, AUTH_BACKGROUND_LIGHT_XML } from '@/assets/banners/authBackgrounds';

export interface AuthBackgroundProps {
  style?: StyleProp<ViewStyle>;
  /** Intensidad del banner (0-1). Se mezcla con theme.color.background para
   * que el texto que va encima (badge, headline, subtítulo, feature cards)
   * mantenga contraste sin importar qué parte del gradiente le toque atrás.
   * Default 0.45. */
  intensity?: number;
}

// Fondo decorativo para SignIn/Signup (banners diseñados a medida, uno por
// tema — ver src/assets/banners). Se posiciona absoluto y detrás del
// contenido; el padre que lo use debe tener position: 'relative' (el
// default de View) y renderizarlo como primer hijo.
const AuthBackground: React.FC<AuthBackgroundProps> = ({ style, intensity = 0.45 }) => {
  const theme = useTheme();
  const xml = theme.isDark ? AUTH_BACKGROUND_DARK_XML : AUTH_BACKGROUND_LIGHT_XML;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        styles.container,
        { backgroundColor: theme.color.background },
        style,
      ]}
      pointerEvents="none"
    >
      <SvgXml
        xml={xml}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        opacity={intensity}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default AuthBackground;
