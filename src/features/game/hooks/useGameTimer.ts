import { useRef } from "react";
import { GameAction } from "./game-action";

export const useGameTimer = (dispatch: React.Dispatch<GameAction>) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const start = (seconds: number) => {
    stop();
    dispatch({ type: 'SET_TIME', payload: seconds });

    timerRef.current = setInterval(() => {
      dispatch({ type: 'SET_TIME', payload: seconds-- });
      if (seconds <= 0) stop();
    }, 1000);
  };

  return { start, stop };
};