import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { DASHBOARD_USER_BACKGROUND_XML } from '@/assets/banners/dashboardBackgrounds';

export interface DashboardBackgroundProps {
  style?: StyleProp<ViewStyle>;
}

// Banda ondulada decorativa para el header de UserDashboard. Se posiciona
// absoluta y detrás del contenido; el padre debe tener overflow: 'hidden'
// y renderizarla como primer hijo. A diferencia de AuthBackground, no tiene
// variante por tema (el diseño solo entregó una).
const DashboardBackground: React.FC<DashboardBackgroundProps> = ({ style }) => (
  <View style={[StyleSheet.absoluteFillObject, style]} pointerEvents="none">
    <SvgXml
      xml={DASHBOARD_USER_BACKGROUND_XML}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMin slice"
    />
  </View>
);

export default DashboardBackground;
