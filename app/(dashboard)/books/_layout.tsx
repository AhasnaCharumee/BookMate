import { Stack } from 'expo-router';

export default function BooksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add" />
      <Stack.Screen name="[id]" />
      {/* Nested edit stack handles [id] inside edit/_layout.tsx */}
      <Stack.Screen name="edit" />
    </Stack>
  );
}
