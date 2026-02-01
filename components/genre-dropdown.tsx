import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const GENRE_OPTIONS = [
  'Fiction',
  'Mystery',
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Thriller',
  'Horror',
  'Biography',
  'History',
  'Self-Help',
  'Non-Fiction',
  'Poetry',
  'Drama',
  'Science',
  'Adventure',
  'Other',
];

interface GenreDropdownProps {
  value: string;
  onSelect: (genre: string) => void;
}

export default function GenreDropdown({ value, onSelect }: GenreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="bg-slate-800 text-white p-4 rounded-lg flex-row items-center justify-between"
      >
        <Text className={`text-base ${value ? 'text-white' : 'text-slate-500'}`}>
          {value || 'Select a genre'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={value ? '#ffffff' : '#64748b'} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        >
          <View className="flex-1 justify-center px-6">
            <View className="bg-slate-800 rounded-lg overflow-hidden">
              {/* Header */}
              <View className="bg-slate-900 px-6 py-4 flex-row items-center justify-between">
                <Text className="text-white text-lg font-bold">Select Genre</Text>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Genre List */}
              <ScrollView className="max-h-96">
                {GENRE_OPTIONS.map((genre) => (
                  <TouchableOpacity
                    key={genre}
                    onPress={() => {
                      onSelect(genre);
                      setIsOpen(false);
                    }}
                    className={`px-6 py-4 border-b border-slate-700 flex-row items-center justify-between ${
                      value === genre ? 'bg-indigo-600/20' : 'bg-slate-800'
                    }`}
                  >
                    <Text className={`text-base ${
                      value === genre ? 'text-indigo-400 font-semibold' : 'text-white'
                    }`}>
                      {genre}
                    </Text>
                    {value === genre && (
                      <Ionicons name="checkmark" size={20} color="#6366f1" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
