import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { LoadingAnimation } from '@/assets/animations';

export interface LoadingProps {
  size?: number;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Loading: React.FC<LoadingProps> = ({ size = 64, loop = true, style }) => (
  <View style={[{ width: size, height: size }, style]}>
    <LottieView
      source={LoadingAnimation}
      autoPlay
      loop={loop}
      style={{ width: '100%', height: '100%' }}
    />
  </View>
);

export default Loading;
