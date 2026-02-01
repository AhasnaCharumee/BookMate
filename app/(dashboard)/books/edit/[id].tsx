import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
import GenreDropdown from '../../../../components/genre-dropdown';
import { useAuth } from '../../../../hooks/useAuth';
import { useLoader } from '../../../../hooks/useLoader';
import { BookService } from '../../../../services/bookService';

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<'reading' | 'completed' | 'to-read'>('to-read');
  const [frontCoverUri, setFrontCoverUri] = useState<string | null>(null);
  const [backCoverUri, setBackCoverUri] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentCover, setCurrentCover] = useState<'front' | 'back' | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    if (!user || !id) return;
    
    showLoader();
    try {
      const book = await BookService.getBook(user.uid, id);
      setTitle(book.title);
      setAuthor(book.author);
      setGenre(book.genre || '');
      setStatus(book.status);
      setFrontCoverUri(book.frontCoverUri || null);
      setBackCoverUri(book.backCoverUri || null);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      router.back();
    } finally {
      hideLoader();
    }
  };

  const openCamera = async (coverType: 'front' | 'back') => {
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
        const photo = await cameraRef.current.takePictureAsync({ 
          quality: 0.8,
          base64: false,
        });
        
        if (currentCover === 'front') {
          setFrontCoverUri(photo.uri);
        } else {
          setBackCoverUri(photo.uri);
        }
        
        setCameraVisible(false);
        setCurrentCover(null);
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const handleUpdateBook = async () => {
    if (!title || !author) {
      Alert.alert('Error', 'Please fill in title and author');
      return;
    }

    if (!user || !id) return;

    showLoader();
    try {
      await BookService.updateBook(user.uid, id, {
        title,
        author,
        genre: genre || undefined,
        status,
        frontCoverUri: frontCoverUri || undefined,
        backCoverUri: backCoverUri || undefined,
      });
      
      hideLoader();
      Alert.alert('Success', 'Book updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error: any) {
      hideLoader();
      Alert.alert('Error', 'Failed to update book');
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
          <Text className="text-white text-2xl font-bold">Edit Book</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Book Covers */}
        <View className="mb-4">
          <Text className="text-slate-400 text-sm mb-2">Book Covers (Tap to retake)</Text>
          <View className="flex-row gap-3 mb-3">
            {/* Front Cover */}
            <TouchableOpacity 
              onPress={() => openCamera('front')}
              className="flex-1 bg-slate-800 rounded-lg overflow-hidden"
              style={{ height: 150 }}
            >
              {frontCoverUri ? (
                <>
                  <Image source={{ uri: frontCoverUri }} className="w-full h-full" resizeMode="cover" />
                  <View className="absolute top-2 right-2 bg-indigo-600 rounded-full p-2">
                    <Ionicons name="camera" size={16} color="white" />
                  </View>
                </>
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Ionicons name="camera" size={40} color="#64748b" />
                  <Text className="text-slate-400 text-xs mt-2">Front Cover</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Back Cover */}
            <TouchableOpacity 
              onPress={() => openCamera('back')}
              className="flex-1 bg-slate-800 rounded-lg overflow-hidden"
              style={{ height: 150 }}
            >
              {backCoverUri ? (
                <>
                  <Image source={{ uri: backCoverUri }} className="w-full h-full" resizeMode="cover" />
                  <View className="absolute top-2 right-2 bg-indigo-600 rounded-full p-2">
                    <Ionicons name="camera" size={16} color="white" />
                  </View>
                </>
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Ionicons name="camera" size={40} color="#64748b" />
                  <Text className="text-slate-400 text-xs mt-2">Back Cover</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Genre Dropdown */}
        <View className="mb-4">
          <Text className="text-slate-400 text-sm mb-2">Genre</Text>
          <GenreDropdown value={genre} onSelect={setGenre} />
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

        {/* Update Button */}
        <TouchableOpacity
          className="bg-indigo-600 p-4 rounded-lg"
          onPress={handleUpdateBook}
        >
          <Text className="text-white text-center font-bold text-lg">
            Update Book
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Camera Modal */}
      <Modal visible={cameraVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          {permission?.granted ? (
            <>
              <CameraView 
                ref={cameraRef}
                style={{ flex: 1, width: '100%', height: '100%' }}
                facing="back"
                mode="picture"
                autofocus="on"
              />
              
              <View className="absolute bottom-0 left-0 right-0 p-6 flex-row justify-between items-center">
                <TouchableOpacity
                  onPress={() => {
                    setCameraVisible(false);
                    setCurrentCover(null);
                  }}
                  className="bg-slate-800 p-4 rounded-full"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={takePicture}
                  className="bg-indigo-600 p-6 rounded-full"
                >
                  <Ionicons name="camera" size={32} color="white" />
                </TouchableOpacity>

                <View style={{ width: 56 }} />
              </View>
            </>
          ) : (
            <View className="flex-1 justify-center items-center bg-slate-950 p-6">
              <Ionicons name="camera-outline" size={64} color="#64748b" />
              <Text className="text-white text-lg mt-4 text-center">
                Camera permission required
              </Text>
              <TouchableOpacity
                onPress={requestPermission}
                className="bg-indigo-600 px-6 py-3 rounded-lg mt-4"
              >
                <Text className="text-white font-bold">Grant Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCameraVisible(false)}
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
