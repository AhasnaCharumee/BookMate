import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useLoader } from '../../hooks/useLoader';
import { BookService } from '../../services/bookService';
import { db } from '../../services/firebase';

// Available avatar icons
const AVATAR_ICONS = [
  { id: 'book-outline', label: 'Book' },
  { id: 'glasses-outline', label: 'Glasses' },
  { id: 'person-outline', label: 'Person' },
  { id: 'heart-outline', label: 'Heart' },
  { id: 'star-outline', label: 'Star' },
  { id: 'planet-outline', label: 'Planet' },
  { id: 'rocket-outline', label: 'Rocket' },
  { id: 'cafe-outline', label: 'Coffee' },
] as const;

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const insets = useSafeAreaInsets();
  const [selectedAvatar, setSelectedAvatar] = useState<string>('book-outline');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    reading: 0,
    completed: 0,
    toRead: 0,
  });

  useEffect(() => {
    if (user) {
      loadAvatar();
      loadStats();
    }
  }, [user]);

  const loadAvatar = async () => {
    if (!user?.uid) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().avatar) {
        setSelectedAvatar(userDoc.data().avatar);
      }
    } catch (error: any) {
      const errorCode = error?.code as string | undefined;
      if (errorCode === 'permission-denied' || errorCode === 'not-found') {
        return;
      }
      console.error('Error loading avatar:', error);
    }
  };

  const loadStats = async () => {
    if (!user?.uid) {
      console.warn('No user or UID available for stats');
      return;
    }
    
    showLoader();
    try {
      console.log('Loading stats for user:', user.uid);
      const bookStats = await BookService.getBookStats(user.uid);
      setStats(bookStats);
    } catch (error: any) {
      console.error('Failed to load stats:', error.message);
      console.error('Error code:', error.code);
    } finally {
      hideLoader();
    }
  };

  const handleAvatarSelect = async (avatarId: string) => {
    if (!user?.uid) return;

    try {
      showLoader();
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        avatar: avatarId,
        avatarUpdatedAt: new Date().toISOString(),
      }, { merge: true });
      
      setSelectedAvatar(avatarId);
      setShowAvatarModal(false);
      Alert.alert('Success', 'Avatar updated!');
    } catch (error: any) {
      const errorCode = error?.code as string | undefined;
      if (errorCode === 'permission-denied') {
        Alert.alert('Error', 'Avatar update not allowed for this account.');
        return;
      }
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update avatar');
    } finally {
      hideLoader();
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            showLoader();
            await logout();
            hideLoader();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  if (!user) return null;

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="bg-slate-900 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Profile</Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: Math.max(24, insets.bottom + 16) }}
      >
        {/* User Info Card */}
        <View className="bg-slate-900 rounded-xl p-6 mb-6">
          {/* Avatar */}
          <View className="items-center mb-4">
            <TouchableOpacity onPress={() => setShowAvatarModal(true)}>
              <View className="w-24 h-24 bg-emerald-600 rounded-full items-center justify-center">
                <Ionicons name={selectedAvatar as any} size={48} color="white" />
              </View>
              <View className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-2 border-2 border-slate-900">
                <Ionicons name="create-outline" size={16} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {user.displayName || 'User'}
          </Text>

          {/* Email */}
          <View className="flex-row items-center justify-center mb-4">
            <Ionicons name="mail" size={16} color="#64748b" />
            <Text className="text-slate-400 ml-2">{user.email}</Text>
          </View>
        </View>

        {/* Statistics Card */}
        <View className="bg-slate-900 rounded-xl p-6 mb-6">
          <Text className="text-white text-xl font-bold mb-4">Reading Statistics</Text>
          
          {/* Total Books */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <View className="flex-row items-center">
              <Ionicons name="library" size={24} color="#8b5cf6" />
              <Text className="text-slate-300 text-lg ml-3">Total Books</Text>
            </View>
            <Text className="text-white text-2xl font-bold">{stats.total}</Text>
          </View>

          {/* Reading */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <View className="flex-row items-center">
              <Ionicons name="book" size={24} color="#3b82f6" />
              <Text className="text-slate-300 text-lg ml-3">Currently Reading</Text>
            </View>
            <Text className="text-white text-2xl font-bold">{stats.reading}</Text>
          </View>

          {/* Completed */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="text-slate-300 text-lg ml-3">Completed</Text>
            </View>
            <Text className="text-white text-2xl font-bold">{stats.completed}</Text>
          </View>

          {/* To Read */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="bookmark" size={24} color="#eab308" />
              <Text className="text-slate-300 text-lg ml-3">To Read</Text>
            </View>
            <Text className="text-white text-2xl font-bold">{stats.toRead}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-600 p-4 rounded-lg flex-row items-center justify-center mb-6"
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color="white" />
          <Text className="text-white text-center font-bold text-lg ml-2">
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-slate-900 rounded-t-3xl p-6 max-h-[70%]">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-xl font-bold">Choose Avatar</Text>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                <Ionicons name="close" size={28} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Avatar Grid */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap justify-between">
                {AVATAR_ICONS.map((avatar) => (
                  <TouchableOpacity
                    key={avatar.id}
                    onPress={() => handleAvatarSelect(avatar.id)}
                    className={`w-[48%] mb-4 p-4 rounded-xl items-center ${
                      selectedAvatar === avatar.id
                        ? 'bg-emerald-600'
                        : 'bg-slate-800'
                    }`}
                  >
                    <View className="mb-2">
                      <Ionicons
                        name={avatar.id as any}
                        size={48}
                        color={selectedAvatar === avatar.id ? '#ffffff' : '#94a3b8'}
                      />
                    </View>
                    <Text
                      className={`text-center font-semibold ${
                        selectedAvatar === avatar.id
                          ? 'text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {avatar.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
