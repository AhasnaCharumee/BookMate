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
  const [isLent, setIsLent] = useState(false);
  const [lentTo, setLentTo] = useState('');
  const [lentAt, setLentAt] = useState<string | null>(null);
  const [expectedReturnAt, setExpectedReturnAt] = useState('');
  const [frontCoverUri, setFrontCoverUri] = useState<string | null>(null);
  const [backCoverUri, setBackCoverUri] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentCover, setCurrentCover] = useState<'front' | 'back' | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const CameraViewWithRef = CameraView as any;

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
      setIsLent(!!book.isLent);
      setLentTo(book.lentTo || '');
      setLentAt(book.lentAt || null);
      setExpectedReturnAt(book.expectedReturnAt || '');
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
      // Build book data object without undefined values
      const bookData: any = {
        title,
        author,
        status,
      };
      
      if (genre) bookData.genre = genre;
      if (frontCoverUri) bookData.frontCoverUri = frontCoverUri;
      if (backCoverUri) bookData.backCoverUri = backCoverUri;
      if (isLent) {
        bookData.isLent = true;
        bookData.lentTo = lentTo || null;
        bookData.lentAt = lentAt || new Date().toISOString();
        bookData.expectedReturnAt = expectedReturnAt || null;
      } else {
        bookData.isLent = false;
        bookData.lentTo = null;
        bookData.lentAt = null;
        bookData.expectedReturnAt = null;
      }

      await BookService.updateBook(user.uid, id, bookData);
      
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
      className={`flex-1 p-3 rounded-lg border-2 ${
        status === value 
          ? 'bg-emerald-600 border-emerald-600' 
          : 'bg-transparent border-slate-600'
      }`}
    >
      <Text className={`text-center font-bold ${
        status === value ? 'text-white' : 'text-slate-300'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="bg-slate-900 px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-center">
          <TouchableOpacity onPress={() => router.back()} className="absolute left-6">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Edit Book</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Required Fields Info */}
        <View className="mb-6 bg-slate-800 rounded-lg p-3">
          <Text className="text-slate-300 text-xs">
            <Text className="text-emerald-400 font-semibold">*</Text> = Required field
          </Text>
        </View>

        {/* Book Covers */}
        <View className="mb-4">
          <Text className="text-slate-400 text-sm mb-2">Book Covers (Tap to retake)</Text>
          <View>
            {/* Front Cover - Main */}
            <TouchableOpacity 
              onPress={() => openCamera('front')}
              className="bg-slate-800 rounded-lg overflow-hidden mb-3"
              style={{ height: 220 }}
            >
              {frontCoverUri ? (
                <>
                  <Image source={{ uri: frontCoverUri }} className="w-full h-full" resizeMode="cover" />
                  <View className="absolute top-2 right-2 bg-emerald-600 rounded-full p-2">
                    <Ionicons name="camera" size={16} color="white" />
                  </View>
                </>
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Ionicons name="camera" size={48} color="#64748b" />
                  <Text className="text-emerald-400 text-sm mt-2 font-semibold">Front Cover (Main)</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Back Cover - Secondary */}
            <TouchableOpacity 
              onPress={() => openCamera('back')}
              className="bg-slate-800 rounded-lg overflow-hidden"
              style={{ height: 130 }}
            >
              {backCoverUri ? (
                <>
                  <Image source={{ uri: backCoverUri }} className="w-full h-full" resizeMode="cover" />
                  <View className="absolute top-2 right-2 bg-emerald-600 rounded-full p-2">
                    <Ionicons name="camera" size={14} color="white" />
                  </View>
                </>
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Ionicons name="camera" size={32} color="#64748b" />
                  <Text className="text-slate-400 text-xs mt-2">Back Cover (Optional)</Text>
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

        {/* Lending Section */}
        <View className="mb-6">
          <Text className="text-slate-400 text-sm mb-2">Lending</Text>
          <TouchableOpacity
            onPress={() => setIsLent(!isLent)}
            className={`p-3 rounded-lg border-2 ${
              isLent ? 'bg-amber-500 border-amber-500' : 'bg-slate-800 border-slate-700'
            }`}
          >
            <Text className={`text-center font-bold ${isLent ? 'text-white' : 'text-slate-400'}`}>
              {isLent ? 'Lent Out' : 'Not Lent'}
            </Text>
          </TouchableOpacity>

          {isLent && (
            <View className="mt-4">
              <View className="mb-4">
                <Text className="text-slate-400 text-sm mb-2">Lent To (Name)</Text>
                <TextInput
                  className="bg-slate-800 text-white p-4 rounded-lg"
                  placeholder="e.g., Sahan"
                  placeholderTextColor="#64748b"
                  value={lentTo}
                  onChangeText={setLentTo}
                />
              </View>
              <View>
                <Text className="text-slate-400 text-sm mb-2">Expected Return (YYYY-MM-DD)</Text>
                <TextInput
                  className="bg-slate-800 text-white p-4 rounded-lg"
                  placeholder="2026-02-28"
                  placeholderTextColor="#64748b"
                  value={expectedReturnAt}
                  onChangeText={setExpectedReturnAt}
                />
              </View>
            </View>
          )}
        </View>

        {/* Update Button */}
        <TouchableOpacity
          className="bg-emerald-600 p-4 rounded-lg"
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
              <CameraViewWithRef 
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
                  className="bg-emerald-600 p-6 rounded-full"
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
                className="bg-emerald-600 px-6 py-3 rounded-lg mt-4"
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
