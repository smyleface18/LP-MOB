import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Lottie } from 'lottie-react';
import { LoadingAnimation } from '@/assets/animations';

export interface LoadingProps {
  size?: number;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Loading: React.FC<LoadingProps> = ({ size = 64, loop = true, style }) => (
  <View style={[{ width: size, height: size }, style]}>
    <Lottie src={LoadingAnimation} loop={loop} autoplay style={{ width: '100%', height: '100%' }} />
  </View>
);

export default Loading;
