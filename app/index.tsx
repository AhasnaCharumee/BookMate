import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState } from "react";
import { Alert, Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import "../global.css";

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View className="flex-1 bg-slate-950" />;

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900 p-6">
        <View className="bg-slate-800 p-8 rounded-3xl items-center shadow-2xl">
          <Ionicons name="camera-outline" size={64} color="#6366f1" />
          <Text className="text-white text-xl font-bold mt-4 text-center">Camera Permission</Text>
          <Text className="text-slate-400 text-center mt-2 mb-6">
            We need your permission to access the camera.
          </Text>
          
          <TouchableOpacity 
            className="bg-indigo-500 px-10 py-3 rounded-full shadow-lg active:bg-indigo-600" 
            onPress={requestPermission}
          >
            <Text className="text-white font-bold text-lg">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        
        if (data) {
          setPhoto(data.uri);
          
          // writeOnly: true මගින් Audio permission ප්‍රශ්නය මගහැරේ
          const { status } = await MediaLibrary.requestPermissionsAsync(true);
          
          if (status === 'granted') {
            await MediaLibrary.saveToLibraryAsync(data.uri);
            Alert.alert("Success! 🎉", "Photo saved to your gallery.");
          } else {
            Alert.alert("Permission Denied", "Cannot save photo without gallery access.");
          }
        }
      } catch (error) {
        console.log("Error:", error);
        Alert.alert("Error", "Could not save the photo.");
      }
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {!isCameraOpen ? (
        <View className="flex-1 items-center justify-center bg-slate-950">
          <View className="absolute top-20 items-center">
             <Text className="text-indigo-400 text-sm font-bold tracking-widest uppercase">Snap App</Text>
             <Text className="text-white text-3xl font-black mt-1">Capture Moments</Text>
          </View>
          
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsCameraOpen(true)}
            className="bg-indigo-600 w-28 h-28 rounded-full items-center justify-center shadow-2xl shadow-indigo-500/50 border-4 border-indigo-400"
          >
            <Ionicons name="camera" size={44} color="white" />
          </TouchableOpacity>
          <Text className="text-slate-500 mt-8 font-medium italic">Tap to start shooting</Text>
        </View>
      ) : (
        <View className="flex-1">
          {/* Camera View */}
          <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef} />

          {/* Absolute Overlays (UI Elements) */}
          <View className="absolute inset-0 pointer-events-box-none">
            
            {/* Top Bar */}
            <View className="flex-row justify-between items-center px-6 pt-14">
              <TouchableOpacity
                onPress={() => setIsCameraOpen(false)}
                className="bg-black/40 w-12 h-12 rounded-full items-center justify-center border border-white/10 backdrop-blur-md"
              >
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              
              <View className="bg-black/40 px-4 py-1.5 rounded-full border border-white/20">
                <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Live Preview</Text>
              </View>
              <View className="w-12" />
            </View>

            {/* Bottom Controls */}
            <View className="absolute bottom-10 w-full px-8 flex-row justify-between items-center">
              
              {/* Thumbnail / Gallery Preview */}
              <View className="w-16 h-16 items-center justify-center">
                {photo ? (
                  <TouchableOpacity 
                    className="shadow-xl"
                    onPress={() => Alert.alert("Gallery", "Opening your last capture...")}
                  >
                    <Image 
                      source={{ uri: photo }} 
                      className="w-16 h-16 rounded-2xl border-2 border-white" 
                    />
                  </TouchableOpacity>
                ) : (
                  <View className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 items-center justify-center">
                    <Ionicons name="images-outline" size={24} color="white" />
                  </View>
                )}
              </View>

              {/* Shutter Button */}
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={takePicture}
                className="bg-white w-20 h-20 rounded-full items-center justify-center p-1 border-[6px] border-white/30 shadow-2xl"
              >
                <View className="bg-white w-full h-full rounded-full border-2 border-black/5 shadow-inner" />
              </TouchableOpacity>

              {/* Flip Camera Button */}
              <TouchableOpacity
                onPress={toggleCameraFacing}
                className="bg-white/10 w-14 h-14 rounded-full items-center justify-center border border-white/20 backdrop-blur-sm"
              >
                <Ionicons name="camera-reverse-outline" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}