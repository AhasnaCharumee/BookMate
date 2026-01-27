import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function BottomNav() {
  const navigation = useNavigation();

  return (
    <View className="bg-slate-900 border-t border-slate-800 flex-row justify-around py-2">
      <TouchableOpacity
        onPress={() => navigation.navigate('home')}
        className="flex-1 py-3 items-center"
      >
        <Ionicons name="library" size={24} color="#6366f1" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('profile')}
        className="flex-1 py-3 items-center"
      >
        <Ionicons name="person" size={24} color="#6366f1" />
      </TouchableOpacity>
    </View>
  );
}
