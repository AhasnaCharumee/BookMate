import { Stack } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="books" />
    </Stack>
  );
}
