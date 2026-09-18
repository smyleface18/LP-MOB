// Mock de expo-audio solo para Storybook (Vite/navegador).
//
// expo-audio depende, incluso en su variante .web.js, del hook `useEvent` del
// paquete `expo`, que reexporta la clase `EventEmitter` real de
// expo-modules-core. Esa clase lee `globalThis.expo.EventEmitter`, un global
// que solo instala el runtime nativo/Metro — nunca existe en un navegador. No
// es un problema de resolución de módulos: esta versión de expo-modules-core
// no tiene ninguna variante web para su EventEmitter. Por eso se mockea aquí
// en vez de arreglarse con alias/extensions.
//
// Esto no afecta al build real de la app (mobile ni web): solo se usa dentro
// de .storybook/main.ts, vía resolve.alias.

interface MockAudioPlayer {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
}

export function useAudioPlayer(_source: unknown): MockAudioPlayer {
  return {
    play: () => {},
    pause: () => {},
    seekTo: () => {},
  };
}
