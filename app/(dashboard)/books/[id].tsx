import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useLoader } from '../../../hooks/useLoader';
import { Book, BookService } from '../../../services/bookService';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    if (!user || !id) return;
    
    showLoader();
    try {
      const bookData = await BookService.getBook(user.uid, id);
      setBook(bookData);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      router.back();
    } finally {
      hideLoader();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user || !id) return;
            showLoader();
            try {
              await BookService.deleteBook(user.uid, id);
              Alert.alert('Success', 'Book deleted');
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              hideLoader();
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/(dashboard)/books/edit/${id}`);
  };

  if (!book) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'to-read': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'reading': return 'Reading';
      case 'completed': return 'Completed';
      case 'to-read': return 'To Read';
      default: return status;
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="bg-slate-900 px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold" numberOfLines={1}>
              Book Details
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={handleEdit} className="bg-indigo-600 p-2 rounded-lg">
              <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} className="bg-red-600 p-2 rounded-lg">
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Book Covers */}
        {(book.frontCoverUri || book.backCoverUri) && (
          <View className="mb-4">
            <Text className="text-slate-400 text-sm mb-2">Book Covers</Text>
            <View className="flex-row gap-3">
              {book.frontCoverUri && (
                <View className="flex-1">
                  <Image 
                    source={{ uri: book.frontCoverUri }} 
                    className="w-full rounded-lg"
                    style={{ height: 200 }}
                    resizeMode="cover"
                  />
                  <Text className="text-slate-400 text-xs text-center mt-1">Front Cover</Text>
                </View>
              )}
              {book.backCoverUri && (
                <View className="flex-1">
                  <Image 
                    source={{ uri: book.backCoverUri }} 
                    className="w-full rounded-lg"
                    style={{ height: 200 }}
                    resizeMode="cover"
                  />
                  <Text className="text-slate-400 text-xs text-center mt-1">Back Cover</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Book Card */}
        <View className="bg-slate-900 rounded-xl p-6 mb-4">
          {/* Title */}
          <Text className="text-white text-3xl font-bold mb-4">
            {book.title}
          </Text>

          {/* Author */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="person" size={20} color="#64748b" />
            <Text className="text-slate-400 text-lg ml-2">{book.author}</Text>
          </View>

          {/* Status Badge */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="bookmark" size={20} color="#64748b" />
            <View className={`ml-2 px-3 py-1 rounded-full ${getStatusColor(book.status)}`}>
              <Text className="text-white font-semibold">
                {getStatusLabel(book.status)}
              </Text>
            </View>
          </View>

          {/* Genre */}
          {book.genre && (
            <View className="flex-row items-center mb-4">
              <Ionicons name="pricetag" size={20} color="#64748b" />
              <Text className="text-slate-400 text-lg ml-2">{book.genre}</Text>
            </View>
          )}

          {/* Description */}
          {book.description && (
            <View className="mb-4">
              <Text className="text-slate-300 font-semibold mb-2">Description</Text>
              <Text className="text-slate-400 leading-5">{book.description}</Text>
            </View>
          )}

          {/* Dates */}
          <View className="border-t border-slate-800 pt-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar" size={18} color="#64748b" />
              <Text className="text-slate-400 ml-2">
                Added: {new Date(book.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time" size={18} color="#64748b" />
              <Text className="text-slate-400 ml-2">
                Updated: {new Date(book.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
