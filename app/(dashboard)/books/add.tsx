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
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'reading' | 'completed' | 'to-read'>('to-read');
  const [frontCoverUri, setFrontCoverUri] = useState<string | null>(null);
  const [backCoverUri, setBackCoverUri] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentCover, setCurrentCover] = useState<'front' | 'back' | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  // Request camera permission on mount
  React.useEffect(() => {
    const requestCameraPermission = async () => {
      if (permission && !permission.granted && permission.canAskAgain) {
        await requestPermission();
      }
    };
    requestCameraPermission();
  }, [permission, requestPermission]);

  const openCamera = async (coverType: 'front' | 'back') => {
    // Check if permission is granted
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to capture photos');
        return;
      }
    }
    setCurrentCover(coverType);
    setCameraVisible(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        console.log('Taking picture...');
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: false });
        console.log('Photo taken:', photo.uri);
        
        if (currentCover === 'front') {
          setFrontCoverUri(photo.uri);
        } else {
          setBackCoverUri(photo.uri);
        }
        setCameraVisible(false);
        setCurrentCover(null);
      } catch (error: any) {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to take picture: ' + error.message);
      }
    }
  };

  const handleAddBook = async () => {
    if (!title || !author) {
      Alert.alert('Error', 'Please fill in title and author');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    showLoader();
    try {
      console.log('Adding book:', { title, author, genre, description });
      const bookId = await BookService.addBook(user.uid, {
        title,
        author,
        status,
        genre: genre || undefined,
        description: description || undefined,
        frontCoverUri: frontCoverUri || undefined,
        backCoverUri: backCoverUri || undefined,
      });
      console.log('Book added successfully:', bookId);
      Alert.alert('Success', 'Book added successfully!');
      router.back();
    } catch (error: any) {
      console.error('Error adding book:', error);
      Alert.alert('Error', error.message || 'Failed to add book');
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

        {/* Genre Input */}
        <View className="mb-4">
          <Text className="text-slate-400 text-sm mb-2">Genre</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-lg"
            placeholder="e.g., Fiction, Science, Mystery"
            placeholderTextColor="#64748b"
            value={genre}
            onChangeText={setGenre}
          />
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-slate-400 text-sm mb-2">Description</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-lg"
            placeholder="Enter book description"
            placeholderTextColor="#64748b"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
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
              <CameraView 
                ref={cameraRef} 
                className="flex-1" 
                facing="back"
                onCameraReady={() => console.log('Camera ready')}
              />
              <View className="absolute bottom-0 w-full bg-black/70 pb-8 pt-4">
                <View className="flex-row justify-around items-center px-6">
                  {/* Cancel Button */}
                  <TouchableOpacity
                    onPress={() => {
                      setCameraVisible(false);
                      setCurrentCover(null);
                    }}
                    className="bg-red-600 rounded-full p-4"
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
                <Text className="text-white text-center mt-3 text-base font-semibold">
                  {currentCover === 'front' ? 'Capture Front Cover' : 'Capture Back Cover'}
                </Text>
              </View>
            </>
          ) : (
            <View className="flex-1 justify-center items-center px-6 bg-slate-950">
              <Ionicons name="camera-outline" size={64} color="#6366f1" />
              <Text className="text-white text-center text-lg mt-4 mb-6 font-semibold">
                Camera Permission Required
              </Text>
              <Text className="text-slate-400 text-center mb-6">
                Please allow camera access to capture book covers
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  const result = await requestPermission();
                  if (result?.granted) {
                    // Permission granted, keep modal open for retake
                  }
                }}
                className="bg-indigo-600 px-8 py-3 rounded-lg mb-4"
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
                <Text className="text-slate-300 text-base">Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
