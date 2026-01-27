import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../contexts/AuthContext";
import { LoaderProvider } from "../contexts/LoaderContext";
import { useAuth } from "../hooks/useAuth";
import { LoadingScreen } from "../components/LoadingScreen";

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="index" />
      ) : (
        <>
          {/* Auth screens would go here */}
          <Stack.Screen name="index" />
        </>
      )}
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
