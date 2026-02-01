import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useLoader } from '../../hooks/useLoader';
import { BookService } from '../../services/bookService';
import { db, storage } from '../../services/firebase';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    reading: 0,
    completed: 0,
    toRead: 0,
  });

  useEffect(() => {
    if (user) {
      loadProfilePhoto();
      loadStats();
    }
  }, [user]);

  const loadProfilePhoto = async () => {
    if (!user?.uid) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().profilePhotoUrl) {
        setProfilePhotoUri(userDoc.data().profilePhotoUrl);
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfilePhotoUri(imageUri);
        
        // Upload to Firebase
        await uploadProfilePhoto(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadProfilePhoto = async (imageUri: string) => {
    if (!user?.uid) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    showLoader();
    try {
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Create reference with user UID in path
      const filename = `photo_${Date.now()}.jpg`;
      const storageRef = ref(storage, `users/${user.uid}/${filename}`);
      
      console.log('Uploading to:', `users/${user.uid}/${filename}`);

      // Upload with metadata
      const metadata = {
        contentType: 'image/jpeg',
      };
      
      const uploadResult = await uploadBytes(storageRef, blob, metadata);
      console.log('Upload successful:', uploadResult);

      // Get download URL
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      console.log('Download URL:', downloadUrl);

      // Save URL to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        profilePhotoUrl: downloadUrl,
        photoUpdatedAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Profile photo updated!');
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      Alert.alert('Error', `Failed to upload photo: ${error.message}`);
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

      <ScrollView className="flex-1 px-6 pt-6">
        {/* User Info Card */}
        <View className="bg-slate-900 rounded-xl p-6 mb-6">
          {/* Avatar */}
          <View className="items-center mb-4">
            <TouchableOpacity onPress={pickImage}>
              <View className="w-24 h-24 bg-emerald-600 rounded-full items-center justify-center overflow-hidden">
                {profilePhotoUri ? (
                  <Image 
                    source={{ uri: profilePhotoUri }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-white text-4xl font-bold">
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                )}
              </View>
              <View className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-2 border-2 border-slate-900">
                <Ionicons name="camera" size={16} color="white" />
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
    </View>
  );
}
