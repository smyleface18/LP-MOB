import { useEffect, useState } from "react";
import { AuthService } from "../services/auth/auth.service";
import { ResponseApi, SignUpDto } from "../types/type";
import { Authenticated } from "../services/auth/auth.type";
import { useAuthStore } from "../services/auth/auth.store";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const { signInStatus } = useAuthStore();

  const signUp = async (dto: SignUpDto): Promise<ResponseApi<null> | null> => {
    setLoading(true);
    setError(null);

    const response = await AuthService.signUp(dto);
    if (!response.ok) {
      setError(response.message);
      setLoading(false);
      return response;
    }

    setLoading(false);
    return response;
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<ResponseApi<Authenticated> | null> => {
    setLoading(true);

    const response = await AuthService.signIn(email, password);

    if (!response.ok) {
      setError(response.message);
      setLoading(false);
      return response;
    }

    if (response.ok && response.data) {
      signInStatus(response.data!);
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
    signIn,
  };
};
