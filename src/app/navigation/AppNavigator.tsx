import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { useAuthState } from '@/store';

export const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthState();

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  return <MainTabs role={user?.userRole} />;
};
