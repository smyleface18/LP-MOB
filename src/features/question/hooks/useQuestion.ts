import { useCallback, useEffect, useRef, useState } from 'react';
import { CreateQuestionDto, Question } from '../types';
import { questionService, UpdateQuestionDto } from '../services/question.service';
import { getErrorMessage } from '@/shared/api/getErrorMessage';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await questionService.getAll();
    if (!isMountedRef.current) return;

    if (!response.ok) {
      setError(getErrorMessage(response.message, 'Error al cargar las preguntas'));
      setLoading(false);
      return;
    }

    setQuestions(response.data ?? []);
    setLoading(false);
  }, []);

  const createQuestion = useCallback(async (questionData: CreateQuestionDto) => {
    setError(null);
    const response = await questionService.create(questionData);
    if (!isMountedRef.current) return response;

    if (!response.ok) {
      setError(getErrorMessage(response.message, 'Error al crear la pregunta'));
      return response;
    }

    if (response.data) {
      setQuestions((prev) => [...prev, response.data!]);
    }
    return response;
  }, []);

  const updateQuestion = useCallback(async (id: string, questionData: UpdateQuestionDto) => {
    setError(null);
    const response = await questionService.update(id, questionData);
    if (!isMountedRef.current) return response;

    if (!response.ok) {
      setError(getErrorMessage(response.message, 'Error al actualizar la pregunta'));
      return response;
    }

    if (response.data) {
      setQuestions((prev) => prev.map((q) => (q.id === id ? response.data! : q)));
    }
    return response;
  }, []);

  const deleteQuestion = useCallback(async (id: string) => {
    setError(null);
    const response = await questionService.delete(id);
    if (!isMountedRef.current) return response;

    if (!response.ok) {
      setError(getErrorMessage(response.message, 'Error al eliminar la pregunta'));
      return response;
    }

    setQuestions((prev) => prev.filter((q) => q.id !== id));
    return response;
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return {
    questions,
    loading,
    error,
    loadQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
};
