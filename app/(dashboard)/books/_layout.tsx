import { Stack } from 'expo-router';

export default function BooksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="edit/[id]" />
    </Stack>
  );
}
