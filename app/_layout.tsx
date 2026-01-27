import { Stack } from "expo-router";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthProvider } from "../contexts/AuthContext";
import { LoaderProvider } from "../contexts/LoaderContext";
import "../global.css";
import { useAuth } from "../hooks/useAuth";

function RootLayoutNav() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(dashboard)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LoaderProvider>
        <RootLayoutNav />
      </LoaderProvider>
    </AuthProvider>
  );
}
