import { Redirect } from 'expo-router';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // If authenticated, go to dashboard
  // If not authenticated, go to login
  if (isAuthenticated) {
    return <Redirect href="/(dashboard)/home" />;
  }
  return <Redirect href="/(auth)/login" />;
}
