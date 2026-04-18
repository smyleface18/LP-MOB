import { AuthStack } from './AuthStack';
import { UserStack } from './UserStack';
import { AdminStack } from './AdminStack';
import { useAppStore } from '@/store';

export const AppNavigator = () => {
  const { isAuthenticated, user } = useAppStore();

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  if (user?.userRole === 'ADMIN') {
    return <AdminStack />;
  }

  return <UserStack />;
};
