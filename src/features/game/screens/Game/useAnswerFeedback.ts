import { useCallback, useEffect, useRef, useState } from 'react';
import { AnswerResult } from '../../types';

interface UseAnswerFeedbackParams {
  timeRemaining: number;
  currentQuestionId: string | undefined;
  lastAnswerResult: AnswerResult | null;
  /** Opción que el servidor ya registró para esta pregunta (reconexión). */
  answeredOptionId?: string | null;
  onSubmit: (optionId: string) => void;
}

// Encapsula la selección de opción y el modal de resultado de GamePlay: es
// lógica local de esta screen (no de sesión/red), separada de useGame().
export const useAnswerFeedback = ({
  timeRemaining,
  currentQuestionId,
  lastAnswerResult,
  answeredOptionId = null,
  onSubmit,
}: UseAnswerFeedbackParams) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState<string[]>([]);
  const [pointsEarned, setPointsEarned] = useState(0);
  const lastProcessedAnswerRef = useRef<string | null>(null);

  const handleOptionPress = useCallback(
    (optionId: string) => {
      if (selectedOption || timeRemaining <= 0) return;
      setSelectedOption(optionId);
      onSubmit(optionId);
    },
    [selectedOption, timeRemaining, onSubmit],
  );

  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    lastProcessedAnswerRef.current = null;
  }, []);

  // Procesar la respuesta que llega del backend, una sola vez por respuesta.
  useEffect(() => {
    if (!lastAnswerResult) return;
    const signature = JSON.stringify(lastAnswerResult);
    if (lastProcessedAnswerRef.current === signature) return;

    lastProcessedAnswerRef.current = signature;
    setIsCorrect(lastAnswerResult.correct);
    setPointsEarned(lastAnswerResult.points ?? 0);
    setCorrectAnswerText(lastAnswerResult.correctAnswer.map((option) => option.text ?? ''));
    setShowResult(true);
  }, [lastAnswerResult]);

  // Reiniciar selección al llegar una pregunta nueva. Si al reconectarse el
  // servidor informa que ya respondió, se deja esa opción bloqueada.
  useEffect(() => {
    setSelectedOption(answeredOptionId);
    setShowResult(false);
    setIsCorrect(false);
    setCorrectAnswerText([]);
    setPointsEarned(0);
    lastProcessedAnswerRef.current = null;
  }, [currentQuestionId, answeredOptionId]);

  return {
    selectedOption,
    showResult,
    isCorrect,
    correctAnswerText,
    pointsEarned,
    handleOptionPress,
    handleCloseResult,
  };
};
