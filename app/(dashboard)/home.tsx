import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useLoader } from '../../hooks/useLoader';
import { Book, BookService } from '../../services/bookService';

export default function HomeScreen() {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [books, setBooks] = useState<Book[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load books when screen opens
  useEffect(() => {
    loadBooks();
  }, []);

  // Reload books when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [user])
  );

  const loadBooks = async () => {
    if (!user) return;

    showLoader();
    try {
      const userBooks = await BookService.getUserBooks(user.uid);
      setBooks(userBooks);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load books');
    } finally {
      hideLoader();
      setRefreshing(false);
    }
  };

  const handleDeleteBook = (bookId: string, title: string) => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              await BookService.deleteBook(user.uid, bookId);
              loadBooks(); // Refresh list
              Alert.alert('Success', 'Book deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'to-read':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reading':
        return 'Reading';
      case 'completed':
        return 'Completed';
      case 'to-read':
        return 'To Read';
      default:
        return status;
    }
  };

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity onPress={() => router.push(`/(dashboard)/books/${item.id}`)}>
      <View className="bg-slate-800 p-4 rounded-lg mb-3">
        {/* Book Cover Image */}
        {item.frontCoverUri && (
          <Image
            source={{ uri: item.frontCoverUri }}
            className="w-full rounded-lg mb-3"
            style={{ height: 150 }}
            resizeMode="cover"
          />
        )}
        
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">{item.title}</Text>
            <Text className="text-slate-400 mt-1">by {item.author}</Text>
            <View className="flex-row items-center gap-2 mt-2">
              <View className={`${getStatusColor(item.status)} px-3 py-1 rounded-full`}>
                <Text className="text-white text-xs font-bold">
                  {getStatusText(item.status)}
                </Text>
              </View>
              {item.isLent && (
                <View className="bg-amber-500 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">Lent</Text>
                </View>
              )}
            </View>
          </View>
          
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push(`/(dashboard)/books/edit/${item.id}`)}
              className="bg-emerald-600 p-2 rounded-lg"
            >
              <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteBook(item.id, item.title)}
              className="bg-red-600 p-2 rounded-lg"
            >
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="bg-slate-900 px-6 pt-12 pb-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">My Books</Text>
            <Text className="text-slate-400 mt-1">{books.length} books</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(dashboard)/books/add')}
            className="bg-emerald-600 w-12 h-12 rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Books List */}
      <View className="flex-1 px-6 pt-4">
        {books.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="book-outline" size={64} color="#64748b" />
            <Text className="text-slate-400 text-lg mt-4">No books yet</Text>
            <Text className="text-slate-500 text-center mt-2">
              Add your first book to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={books}
            renderItem={renderBook}
            keyExtractor={(item: any) => item.id}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadBooks();
            }}
          />
        )}
      </View>
    </View>
  );
}
