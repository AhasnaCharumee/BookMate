import { Stack } from "expo-router";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthProvider } from "../contexts/AuthContext";
import { LoaderProvider } from "../contexts/LoaderContext";
import "../global.css";
import { useAuth } from "../hooks/useAuth";

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
