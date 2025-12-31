import { useState } from "react";
import { User, UserRoles } from "../services/auth/auth.type";
import { Level } from "../types/type";
import { userService } from "../services/user.service";

export const useUser = () => {
  const [user, setUser] = useState<User>({
    id: "",
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    avatar: "",
    username: "",
    email: "",
    score: 0,
    userRole: UserRoles.PLAYER,
    level: Level.A1,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getMe = async () => {
    setLoading(true);
    const reponse = await userService.getMe();

    if (!reponse.ok) {
      setError(reponse.message);
      setLoading(false);
      return;
    }

    setUser(reponse.data!);
    setLoading(false);
    return reponse;
  };

  return {
    user,
    setUser,
    error,
    setError,
    getMe,
    loading,
    setLoading,
  };
};
