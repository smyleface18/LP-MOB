// Mock de expo-video solo para Storybook — misma razón que expo-audio.ts:
// su cadena de imports llega a expo-modules-core's EventEmitter, que depende
// de un global (`globalThis.expo`) que solo existe en el runtime nativo/Metro.
// No afecta al build real de la app; se usa solo vía resolve.alias en
// .storybook/main.ts.
import React from 'react';
import { View } from 'react-native';

interface MockVideoPlayer {
  status: 'idle' | 'loading' | 'readyToPlay' | 'error';
  play: () => void;
  pause: () => void;
  addListener: (event: string, listener: (payload: unknown) => void) => { remove: () => void };
}

export function useVideoPlayer(
  _source: unknown,
  setup?: (player: MockVideoPlayer) => void,
): MockVideoPlayer {
  const player: MockVideoPlayer = {
    status: 'idle',
    play: () => {},
    pause: () => {},
    addListener: () => ({ remove: () => {} }),
  };
  setup?.(player);
  return player;
}

export const VideoView = React.forwardRef<View, Record<string, unknown>>((props, ref) => (
  <View ref={ref} style={props.style as never} />
));
