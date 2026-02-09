import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLoader } from '../../hooks/useLoader';
import AuthService from '../../services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showLoader, hideLoader } = useLoader();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('Login attempt with:', email);
    showLoader();
    try {
      const user = await AuthService.login(email, password);
      console.log('Login successful:', user.uid);
      hideLoader();
      // Navigate immediately to dashboard after successful login
      router.replace('/(dashboard)/home');
    } catch (error: any) {
      console.error('Login error:', error);
      hideLoader();
      Alert.alert('Login Failed', error.message || 'An error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="items-center mb-12">
          <Ionicons name="book" size={64} color="#10b981" />
          <Text className="text-white text-3xl font-bold mt-4">BookMate</Text>
          <Text className="text-slate-400 text-base mt-2">Welcome back!</Text>
        </View>

        {/* Login Form */}
        <View className="space-y-4">
          {/* Email Input */}
          <View>
            <Text className="text-slate-400 text-sm mb-2">Email</Text>
            <TextInput
              className="bg-slate-800 text-white p-4 rounded-lg"
              placeholder="Enter your email"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-slate-400 text-sm mb-2">Password</Text>
            <TextInput
              className="bg-slate-800 text-white p-4 rounded-lg"
              placeholder="Enter your password"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-emerald-600 p-4 rounded-lg mt-6"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-bold text-lg">
              Login
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-slate-400">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-emerald-400 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
