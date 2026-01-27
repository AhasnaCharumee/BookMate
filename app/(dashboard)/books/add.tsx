import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
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
  const [frontCoverUri, setFrontCoverUri] = useState<string | null>(null);
  const [backCoverUri, setBackCoverUri] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentCover, setCurrentCover] = useState<'front' | 'back' | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const openCamera = (coverType: 'front' | 'back') => {
    setCurrentCover(coverType);
    setCameraVisible(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (currentCover === 'front') {
          setFrontCoverUri(photo.uri);
        } else {
          setBackCoverUri(photo.uri);
        }
        setCameraVisible(false);
        setCurrentCover(null);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

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
        frontCoverUri: frontCoverUri || undefined,
        backCoverUri: backCoverUri || undefined,
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

        {/* Book Cover Photos */}
        <View className="mb-6">
          <Text className="text-slate-400 text-sm mb-2">Book Cover Photos (Optional)</Text>
          <View className="flex-row gap-3">
            {/* Front Cover */}
            <TouchableOpacity
              className="flex-1 bg-slate-800 rounded-lg p-4 items-center justify-center"
              style={{ height: 160 }}
              onPress={() => openCamera('front')}
            >
              {frontCoverUri ? (
                <Image source={{ uri: frontCoverUri }} className="w-full h-full rounded-lg" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={32} color="#6366f1" />
                  <Text className="text-slate-400 text-sm mt-2">Front Cover</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Back Cover */}
            <TouchableOpacity
              className="flex-1 bg-slate-800 rounded-lg p-4 items-center justify-center"
              style={{ height: 160 }}
              onPress={() => openCamera('back')}
            >
              {backCoverUri ? (
                <Image source={{ uri: backCoverUri }} className="w-full h-full rounded-lg" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={32} color="#6366f1" />
                  <Text className="text-slate-400 text-sm mt-2">Back Cover</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          className="bg-indigo-600 p-4 rounded-lg mb-6"
          onPress={handleAddBook}
        >
          <Text className="text-white text-center font-bold text-lg">
            Add Book
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Camera Modal */}
      <Modal visible={cameraVisible} animationType="slide">
        <View className="flex-1 bg-black">
          {permission?.granted ? (
            <>
              <CameraView ref={cameraRef} className="flex-1" facing="back" />
              <View className="absolute bottom-0 w-full bg-black/50 pb-8 pt-4">
                <View className="flex-row justify-around items-center px-6">
                  {/* Cancel Button */}
                  <TouchableOpacity
                    onPress={() => {
                      setCameraVisible(false);
                      setCurrentCover(null);
                    }}
                    className="bg-slate-700 rounded-full p-4"
                  >
                    <Ionicons name="close" size={28} color="white" />
                  </TouchableOpacity>

                  {/* Capture Button */}
                  <TouchableOpacity
                    onPress={takePicture}
                    className="bg-indigo-600 rounded-full p-6"
                  >
                    <Ionicons name="camera" size={36} color="white" />
                  </TouchableOpacity>

                  {/* Placeholder for symmetry */}
                  <View className="w-14" />
                </View>
                <Text className="text-white text-center mt-3">
                  {currentCover === 'front' ? 'Capture Front Cover' : 'Capture Back Cover'}
                </Text>
              </View>
            </>
          ) : (
            <View className="flex-1 justify-center items-center px-6">
              <Ionicons name="camera-outline" size={64} color="#6366f1" />
              <Text className="text-white text-center text-lg mt-4 mb-6">
                Camera permission is required to capture book covers
              </Text>
              <TouchableOpacity
                onPress={requestPermission}
                className="bg-indigo-600 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-bold">Grant Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setCameraVisible(false);
                  setCurrentCover(null);
                }}
                className="mt-4"
              >
                <Text className="text-slate-400">Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
