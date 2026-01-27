import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useLoader } from '../../hooks/useLoader';
import { Book, BookService } from '../../services/bookService';

export default function SearchScreen() {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!user || !searchQuery.trim()) return;

    setHasSearched(true);
    showLoader();
    try {
      const allBooks = await BookService.getUserBooks(user.uid);
      const results = allBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      hideLoader();
    }
  };

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/(dashboard)/books/${item.id}`)}
      className="bg-slate-800 p-4 rounded-lg mb-3"
    >
      <Text className="text-white text-lg font-bold">{item.title}</Text>
      <Text className="text-slate-400 mt-1">by {item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="bg-slate-900 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Search Books</Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        {/* Search Input */}
        <View className="flex-row items-center bg-slate-800 rounded-lg px-4 mb-4">
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            className="flex-1 text-white p-4"
            placeholder="Search by title or author..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setSearchResults([]);
              setHasSearched(false);
            }}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Button */}
        <TouchableOpacity
          className="bg-indigo-600 p-4 rounded-lg mb-4"
          onPress={handleSearch}
        >
          <Text className="text-white text-center font-bold text-lg">
            Search
          </Text>
        </TouchableOpacity>

        {/* Results */}
        {hasSearched && (
          <View className="flex-1">
            {searchResults.length > 0 ? (
              <>
                <Text className="text-slate-400 mb-3">
                  Found {searchResults.length} book{searchResults.length !== 1 ? 's' : ''}
                </Text>
                <FlatList
                  data={searchResults}
                  renderItem={renderBook}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              </>
            ) : (
              <View className="flex-1 justify-center items-center">
                <Ionicons name="search" size={64} color="#64748b" />
                <Text className="text-slate-400 text-lg mt-4">
                  No books found
                </Text>
                <Text className="text-slate-500 text-center mt-2">
                  Try searching with different keywords
                </Text>
              </View>
            )}
          </View>
        )}

        {!hasSearched && (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="book" size={64} color="#64748b" />
            <Text className="text-slate-400 text-lg mt-4">
              Search your library
            </Text>
            <Text className="text-slate-500 text-center mt-2 px-8">
              Enter a book title or author name to find books in your collection
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
