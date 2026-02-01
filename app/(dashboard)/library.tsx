import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useLoader } from '../../hooks/useLoader';
import { Book, BookService } from '../../services/bookService';

export default function LibraryScreen() {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [filter, setFilter] = useState<'all' | 'reading' | 'completed' | 'to-read'>('all');
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (user) {
      console.log('Loading books for user:', user.uid);
      loadBooks();
    }
  }, [user]);

  const loadBooks = async () => {
    if (!user?.uid) {
      console.warn('No user or UID available');
      return;
    }

    showLoader();
    try {
      console.log('Fetching books from path: users/' + user.uid + '/books');
      const userBooks = await BookService.getUserBooks(user.uid);
      setBooks(userBooks);
    } catch (error: any) {
      console.error('Failed to load books:', error.message);
      console.error('Error code:', error.code);
    } finally {
      hideLoader();
    }
  };

  const filteredBooks = filter === 'all' 
    ? books 
    : books.filter(book => book.status === filter);

  const getFilterCount = (status: 'reading' | 'completed' | 'to-read') => {
    return books.filter(book => book.status === status).length;
  };

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/(dashboard)/books/${item.id}`)}
      className="bg-slate-800 p-4 rounded-lg mb-3 flex-row justify-between items-center"
    >
      <View className="flex-1">
        <Text className="text-white text-lg font-bold">{item.title}</Text>
        <Text className="text-slate-400 mt-1">by {item.author}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#64748b" />
    </TouchableOpacity>
  );

  const FilterButton = ({ 
    value, 
    label, 
    count 
  }: { 
    value: typeof filter; 
    label: string;
    count: number;
  }) => (
    <TouchableOpacity
      onPress={() => setFilter(value)}
      style={{ paddingHorizontal: 10, paddingVertical: 4, height: 24, borderRadius: 12 }}
      className={`flex-row items-center justify-center ${
        filter === value ? 'bg-indigo-600' : 'bg-slate-800'
      }`}
    >
      <Text 
        style={{ fontSize: 15 }}
        className={`font-medium ${
          filter === value ? 'text-white' : 'text-slate-400'
        }`}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="bg-slate-900 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Library</Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        {/* Filters - Horizontal Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ gap: 8 }}
        >
          <FilterButton value="all" label="All" count={books.length} />
          <FilterButton value="reading" label="Reading" count={getFilterCount('reading')} />
          <FilterButton value="completed" label="Done" count={getFilterCount('completed')} />
          <FilterButton value="to-read" label="To Read" count={getFilterCount('to-read')} />
        </ScrollView>

        {/* Books List */}
        {filteredBooks.length > 0 ? (
          <FlatList
            data={filteredBooks}
            renderItem={renderBook}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="book-outline" size={64} color="#64748b" />
            <Text className="text-slate-400 text-lg mt-4">
              No books in this category
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(dashboard)/books/add')}
              className="bg-indigo-600 px-6 py-3 rounded-lg mt-4"
            >
              <Text className="text-white font-bold">Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
