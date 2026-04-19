import { AuthStack } from './AuthStack';
import { UserStack } from './UserStack';
import { AdminStack } from './AdminStack';
import { useAuthState } from '@/store';

export const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthState();

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  if (user?.userRole === 'ADMIN') {
    return <AdminStack />;
  }

  return <UserStack />;
};
