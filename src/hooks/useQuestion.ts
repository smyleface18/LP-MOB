import { useState, useEffect } from "react";
import { Question } from "../types/type";
import { questionService } from "../services/question.service";

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    const response = await questionService.getAll();
    if (!response.ok) {
      setError("Error al cargar las preguntas");
      console.error("Error loading questions:", response.message);
      return;
    }
    setQuestions(response.data!);
    setLoading(false);
  };

  const createQuestion = async (questionData: any) => {
    const response = await questionService.create(questionData);

    if (!response.ok) {
      setError("Error al crear la pregunta");
      console.error("Error al crear la pregunta", response.message);
      return;
    }

    setQuestions((prev) => [...prev, response.data!]);
    return response;
  };

  const updateQuestion = async (id: string, questionData: any) => {
    const response = await questionService.update(id, questionData);

    if (!response.ok) {
      setError("Error al actualizar la pregunta");
      console.error("Error al actualizar la pregunta", response.message);
      return;
    }

    setQuestions((prev) => prev.map((q) => (q.id === id ? response.data! : q)));
    return response;
  };

  const deleteQuestion = async (id: string) => {
    const response = await questionService.delete(id);

    if (!response.ok) {
      setError("Error al eliminar la pregunta");
      console.error("Error al eliminar la pregunta", response.message);
      return;
    }

    setQuestions((prev) => prev.filter((q) => q.id !== id));
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
