import { AuthStack } from "./AuthStack";
import { UserStack } from "./UserStack";
import { AdminStack } from "./AdminStack";
import { useAuthStore } from "../services/auth/auth.store";

export const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  if (user?.userRole === "ADMIN") {
    return <AdminStack />;
  }

  return <UserStack />;
};
