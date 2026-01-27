import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useLoader } from '../../../hooks/useLoader';
import { BookService } from '../../../services/bookService';

export default function AddBookScreen() {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'reading' | 'completed' | 'to-read'>('to-read');

  const handleAddBook = async () => {
    if (!title || !author) {
      Alert.alert('Error', 'Please fill in title and author');
      return;
    }

    if (!user) return;

    showLoader();
    try {
      await BookService.addBook(user.uid, {
        title,
        author,
        status,
      });
      Alert.alert('Success', 'Book added successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      hideLoader();
    }
  };

  const StatusButton = ({ value, label }: { value: typeof status; label: string }) => (
    <TouchableOpacity
      onPress={() => setStatus(value)}
      className={`flex-1 p-3 rounded-lg ${
        status === value ? 'bg-indigo-600' : 'bg-slate-800'
      }`}
    >
      <Text className={`text-center font-bold ${
        status === value ? 'text-white' : 'text-slate-400'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="bg-slate-900 px-6 pt-12 pb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Add New Book</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-slate-400 text-sm mb-2">Book Title *</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-lg"
            placeholder="Enter book title"
            placeholderTextColor="#64748b"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Author Input */}
        <View className="mb-4">
          <Text className="text-slate-400 text-sm mb-2">Author *</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-lg"
            placeholder="Enter author name"
            placeholderTextColor="#64748b"
            value={author}
            onChangeText={setAuthor}
          />
        </View>

        {/* Status Selection */}
        <View className="mb-6">
          <Text className="text-slate-400 text-sm mb-2">Reading Status</Text>
          <View className="flex-row gap-2">
            <StatusButton value="to-read" label="To Read" />
            <StatusButton value="reading" label="Reading" />
            <StatusButton value="completed" label="Completed" />
          </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          className="bg-indigo-600 p-4 rounded-lg"
          onPress={handleAddBook}
        >
          <Text className="text-white text-center font-bold text-lg">
            Add Book
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
