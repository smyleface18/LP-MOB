import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { SpeechMark } from '../types';

/** Margen para dar por terminado el audio (el status no siempre llega a `duration`). */
const END_EPSILON = 0.25;

/**
 * Índice de la palabra que se está narrando: la última marca cuyo `time` ya
 * pasó. -1 antes de la primera o sin marcas.
 */
export function activeMarkIndex(marks: SpeechMark[] | null, currentMs: number): number {
  if (!marks || marks.length === 0) return -1;
  let low = 0;
  let high = marks.length - 1;
  let found = -1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (marks[mid].time <= currentMs) {
      found = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return found;
}

// Una sola viñeta suena a la vez: la que empieza pausa a la anterior.
let pauseCurrent: (() => void) | null = null;

/** Pausa la viñeta que esté sonando (ej. al detener la historia completa). */
export function stopNarration() {
  pauseCurrent?.();
}

/**
 * Audio de una viñeta con la palabra que se está leyendo. El audio se carga
 * recién al tocar play (una historieta tiene hasta 10 viñetas). Si la URL
 * cambia (se firmó otra vez), el próximo play carga la nueva. `onEnded` se
 * llama una vez cada vez que el audio llega al final (para encadenar viñetas).
 */
export const usePanelNarration = (
  audioUrl: string | null,
  speechMarks: SpeechMark[] | null,
  onEnded?: () => void,
) => {
  const player = useAudioPlayer(null, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const isCurrent = loadedUrl !== null && loadedUrl === audioUrl;

  const pause = useCallback(() => {
    try {
      player.pause();
    } catch {
      // El player ya fue liberado.
    }
  }, [player]);

  // Parar al desmontar (ej. salir del review), antes de que se libere el player.
  useLayoutEffect(
    () => () => {
      pause();
      if (pauseCurrent === pause) pauseCurrent = null;
    },
    [pause],
  );

  const duration = isCurrent && status.duration > 0 ? status.duration : 0;
  const atEnd = duration > 0 && status.currentTime >= duration - END_EPSILON;

  // Fin del audio: en web `didJustFinish` queda en true mientras está al
  // final, así que se avisa una sola vez por reproducción.
  const endedNotified = useRef(false);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const finished = isCurrent && (status.didJustFinish || (atEnd && !status.playing));
  useEffect(() => {
    if (!finished || endedNotified.current) return;
    endedNotified.current = true;
    onEndedRef.current?.();
  }, [finished]);

  /** Reproduce desde `fromStart` o desde donde quedó; pausa a la viñeta que estaba sonando. */
  const start = useCallback(
    (fromStart: boolean) => {
      if (!audioUrl) return;
      if (pauseCurrent && pauseCurrent !== pause) pauseCurrent();
      pauseCurrent = pause;
      endedNotified.current = false;

      if (!isCurrent) {
        player.replace({ uri: audioUrl });
        setLoadedUrl(audioUrl);
      } else if (fromStart || atEnd) {
        void player.seekTo(0);
      }
      player.play();
    },
    [audioUrl, isCurrent, atEnd, player, pause],
  );

  const toggle = useCallback(() => {
    if (isCurrent && status.playing) {
      pause();
      return;
    }
    start(false);
  }, [isCurrent, status.playing, pause, start]);

  /** Reproduce la viñeta desde el principio. */
  const play = useCallback(() => start(true), [start]);

  const playing = isCurrent && status.playing;
  const started = isCurrent && (status.playing || status.currentTime > 0);
  return {
    playing,
    loading: isCurrent && !status.isLoaded,
    progress: duration > 0 ? Math.min(status.currentTime / duration, 1) : 0,
    /** -1 si no hay que resaltar ninguna palabra (sin empezar o ya terminó). */
    activeIndex: started && !atEnd ? activeMarkIndex(speechMarks, status.currentTime * 1000) : -1,
    toggle,
    play,
  };
};
