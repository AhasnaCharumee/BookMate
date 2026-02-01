import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLoader } from '../../hooks/useLoader';
import AuthService from '../../services/authService';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showLoader, hideLoader } = useLoader();

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    showLoader();
    try {
      await AuthService.register(email, password, name);
      Alert.alert('Success', 'Account created successfully!');
      // Navigation will happen automatically through AuthContext
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      hideLoader();
    }
  };

  return (
    <View className="flex-1 bg-slate-950 justify-center px-6">
      {/* Header */}
      <View className="items-center mb-8">
        <Ionicons name="book" size={56} color="#10b981" />
        <Text className="text-white text-3xl font-bold mt-4">Create Account</Text>
        <Text className="text-slate-400 text-base mt-2">Join BookMate today</Text>
      </View>

      {/* Register Form */}
      <View className="space-y-4">
        {/* Name Input */}
        <View>
          <Text className="text-slate-400 text-sm mb-2">Name</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-lg"
            placeholder="Enter your name"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
          />
        </View>

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
            placeholder="At least 6 characters"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Confirm Password Input */}
        <View>
          <Text className="text-slate-400 text-sm mb-2">Confirm Password</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-lg"
            placeholder="Re-enter your password"
            placeholderTextColor="#64748b"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          className="bg-emerald-600 p-4 rounded-lg mt-6"
          onPress={handleRegister}
        >
          <Text className="text-white text-center font-bold text-lg">
            Create Account
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-emerald-400 font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
