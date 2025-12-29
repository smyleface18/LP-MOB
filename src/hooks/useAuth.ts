import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { ResponseApi, SignUpDto } from "../types/type";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const signUp = async (dto: SignUpDto): Promise<ResponseApi<null> | null> => {
    setLoading(true);
    setError(null);

    const response = await AuthService.signUp(dto);
    if (!response.ok) {
      setError(response.message);
      setLoading(false);
      return null;
    }

    setLoading(false);
    return response;
  };

  return {
    signUp,
    loading,
    error,
    signUpForm,
    setSignUpForm,
  };
};
