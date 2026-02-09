import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GenreDropdown from '../../../components/genre-dropdown';
import { useAuth } from '../../../hooks/useAuth';
import { useLoader } from '../../../hooks/useLoader';
import { BookService } from '../../../services/bookService';

export default function AddBookScreen() {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const insets = useSafeAreaInsets();
  
  // Wait for user to be ready before rendering
  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-950">
        <Text className="text-white text-lg">Loading user...</Text>
      </View>
    );
  }

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'reading' | 'completed' | 'to-read'>('to-read');
  const [isLent, setIsLent] = useState(false);
  const [lentTo, setLentTo] = useState('');
  const [expectedReturnAt, setExpectedReturnAt] = useState('');
  const [frontCoverUri, setFrontCoverUri] = useState<string | null>(null);
  const [backCoverUri, setBackCoverUri] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentCover, setCurrentCover] = useState<'front' | 'back' | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const CameraViewWithRef = CameraView as any;

  // Request camera permission on mount only
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
    if (!cameraRef.current) return;

    try {
      console.log('Taking picture...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      console.log('Photo taken:', photo.uri);

      if (currentCover === 'front') {
        setFrontCoverUri(photo.uri);
      } else {
        setBackCoverUri(photo.uri);
      }

      // Save to gallery (optional)
      MediaLibrary.createAssetAsync(photo.uri)
        .then((asset) => console.log('Saved to gallery:', asset.uri))
        .catch((error) => console.log('Gallery save skipped:', error));

      Alert.alert('Success', 'Photo captured!');
      setCameraVisible(false);
      setCurrentCover(null);
    } catch (error: any) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take picture: ' + error.message);
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
      console.log('User ID:', user.uid);

      // Build book data object without undefined values
      const bookData: any = {
        title,
        author,
        status,
      };
      
      if (genre) bookData.genre = genre;
      if (description) bookData.description = description;
      if (frontCoverUri) bookData.frontCoverUri = frontCoverUri;
      if (backCoverUri) bookData.backCoverUri = backCoverUri;
      if (isLent) {
        bookData.isLent = true;
        bookData.lentTo = lentTo || null;
        bookData.lentAt = new Date().toISOString();
        bookData.expectedReturnAt = expectedReturnAt || null;
      }

      const bookId = await BookService.addBook(user.uid, bookData);

      console.log('Book added successfully with ID:', bookId);

      // Hide loader first
      hideLoader();

      // Clear form fields
      setTitle('');
      setAuthor('');
      setGenre('');
      setDescription('');
      setStatus('to-read');
      setIsLent(false);
      setLentTo('');
      setExpectedReturnAt('');
      setFrontCoverUri(null);
      setBackCoverUri(null);

      // Show success message
      Alert.alert(
        'Success',
        'Book added successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Redirecting to library...');
              router.replace('/(dashboard)/library');
            }
          }
        ]
      );

    } catch (error: any) {
      hideLoader();
      console.error('Add book error:', error);

      Alert.alert('Error', 'Failed to add book. Please try again.');
    }
  };

  const StatusButton = ({ value, label }: { value: typeof status; label: string }) => (
    <TouchableOpacity
      onPress={() => setStatus(value)}
      className={`flex-1 p-3 rounded-lg border-2 ${
        status === value 
          ? 'bg-emerald-600 border-emerald-600' 
          : 'bg-slate-800 border-slate-700'
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-950"
    >
      <View className="flex-1 bg-slate-950">
        {/* Header */}
        <View className="bg-slate-900 px-6 pt-8 pb-4">
          <View className="flex-row items-center justify-center">
            <TouchableOpacity onPress={() => router.back()} className="absolute left-6">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Add New Book</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Required Fields Info */}
        <View className="mb-6 bg-slate-800 rounded-lg p-3">
          <Text className="text-slate-300 text-xs">
            <Text className="text-emerald-400 font-semibold">*</Text> = Required field
          </Text>
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

        {/* Book Cover Photo */}
        <View className="mb-6">
          <Text className="text-slate-300 text-sm mb-2 font-semibold">Book Cover Photo</Text>
          {/* Front Cover - Main */}
          <TouchableOpacity
            className="bg-slate-800 rounded-lg p-4 items-center justify-center border-2 border-dashed border-slate-600"
            style={{ height: 200 }}
            onPress={() => openCamera('front')}
          >
            {frontCoverUri ? (
              <Image source={{ uri: frontCoverUri }} className="w-full h-full rounded-lg" />
            ) : (
              <View className="items-center">
                <Ionicons name="camera" size={48} color="#10b981" />
                <Text className="text-emerald-400 text-base mt-4 font-semibold">Capture Photo</Text>
                <Text className="text-slate-500 text-xs mt-1">Tap to take a photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          className="bg-emerald-600 p-4 rounded-lg active:bg-emerald-700"
          onPress={handleAddBook}
        >
          <Text className="text-white text-center font-bold text-lg">
            Add Book
          </Text>
        </TouchableOpacity>

        {/* Safe area bottom spacing */}
        <View style={{ height: Math.max(16, insets.bottom) }} />
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
                onCameraReady={() => console.log('Camera ready')}
              />
              <View style={{ 
                position: 'absolute', 
                bottom: 0, 
                width: '100%', 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                paddingBottom: 32, 
                paddingTop: 16 
              }}>
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-around', 
                  alignItems: 'center', 
                  paddingHorizontal: 24 
                }}>
                  {/* Cancel Button */}
                  <TouchableOpacity
                    onPress={() => {
                      setCameraVisible(false);
                      setCurrentCover(null);
                    }}
                    style={{ 
                      backgroundColor: '#dc2626', 
                      borderRadius: 9999, 
                      padding: 16 
                    }}
                  >
                    <Ionicons name="close" size={28} color="white" />
                  </TouchableOpacity>

                  {/* Capture Button */}
                  <TouchableOpacity
                    onPress={takePicture}
                    style={{ 
                      backgroundColor: '#10b981', 
                      borderRadius: 9999, 
                      padding: 24 
                    }}
                  >
                    <Ionicons name="camera" size={36} color="white" />
                  </TouchableOpacity>

                  {/* Placeholder for symmetry */}
                  <View style={{ width: 56 }} />
                </View>
                <Text style={{ 
                  color: 'white', 
                  textAlign: 'center', 
                  marginTop: 12, 
                  fontSize: 16, 
                  fontWeight: '600' 
                }}>
                  {currentCover === 'front' ? 'Capture Front Cover' : 'Capture Back Cover'}
                </Text>
              </View>
            </>
          ) : (
            <View className="flex-1 justify-center items-center px-6 bg-slate-950">
              <Ionicons name="camera-outline" size={64} color="#10b981" />
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
                className="bg-emerald-600 px-8 py-3 rounded-lg mb-4"
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
    </KeyboardAvoidingView>
  );
}
