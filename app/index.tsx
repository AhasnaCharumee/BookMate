import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <Ionicons name="book" size={72} color="#10b981" />
        <Text className="text-white text-3xl font-bold mt-4">BookMate</Text>
        <Text className="text-slate-400 mt-2">Your personal reading space</Text>
      </View>
    );
  }

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
