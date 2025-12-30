import { apiService } from "./api/api.service";
import { API_ENDPOINTS } from "./api/apiConfig";
import { Question, ResponseApi } from "../types/type";

export interface CreateQuestionDto {
  questionText?: string;
  questionImage?: string;
  options: string[];
  correctAnswer: string;
  categoryId: string;
  active?: boolean;
}

export interface UpdateQuestionDto extends Partial<CreateQuestionDto> {}

export const questionService = {
  // Obtener todas las preguntas
  getAll: async (): Promise<ResponseApi<Question[]>> => {
    return apiService.get<Question[]>(API_ENDPOINTS.QUESTIONS);
  },

  // Obtener una pregunta por ID
  getById: async (id: string): Promise<ResponseApi<Question>> => {
    return apiService.get<Question>(`${API_ENDPOINTS.QUESTIONS}/${id}`);
  },

  // Crear una nueva pregunta
  create: async (data: CreateQuestionDto): Promise<ResponseApi<Question>> => {
    return apiService.post<Question>(API_ENDPOINTS.QUESTIONS, data);
  },

  // Crear múltiples preguntas
  createMany: async (
    data: CreateQuestionDto[]
  ): Promise<ResponseApi<Question[]>> => {
    return apiService.post<Question[]>(`${API_ENDPOINTS.QUESTIONS}/bulk`, data);
  },

  // Actualizar una pregunta
  update: async (
    id: string,
    data: UpdateQuestionDto
  ): Promise<ResponseApi<Question>> => {
    return apiService.patch<Question>(`${API_ENDPOINTS.QUESTIONS}/${id}`, data);
  },

  // Eliminar una pregunta
  delete: async (id: string): Promise<ResponseApi<void>> => {
    return apiService.delete<void>(`${API_ENDPOINTS.QUESTIONS}/${id}`);
  },
};
