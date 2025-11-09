import { useState, useEffect } from 'react';
import { Question } from '../types/type';
import { questionService } from '../services/question.service';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionService.getAll();
      setQuestions(data);
    } catch (err) {
      setError('Error al cargar las preguntas');
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: any) => {
    try {
      const newQuestion = await questionService.create(questionData);
      setQuestions(prev => [...prev, newQuestion]);
      return newQuestion;
    } catch (err) {
      setError('Error al crear la pregunta');
      throw err;
    }
  };

  const updateQuestion = async (id: string, questionData: any) => {
    try {
      const updatedQuestion = await questionService.update(id, questionData);
      setQuestions(prev => prev.map(q => q.id === id ? updatedQuestion : q));
      return updatedQuestion;
    } catch (err) {
      setError('Error al actualizar la pregunta');
      throw err;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await questionService.delete(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      setError('Error al eliminar la pregunta');
      throw err;
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

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