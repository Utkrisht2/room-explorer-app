import React from "react";
import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Platform, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useObjectStore } from "@/stores/objectStore";
import { Camera, Image as ImageIcon, RotateCcw, Check } from "lucide-react-native";

export default function DetectScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const cameraRef = useRef(null);
  const router = useRouter();
  const { addObject } = useObjectStore();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      requestLocationPermission(status === "granted");
    })();
  }, []);

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      // This is a mock since we can't actually take a picture in this environment
      // In a real app, you would use cameraRef.current.takePictureAsync()
      setCapturedImage("https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80");
      
      // Get location
      if (locationPermission) {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setLocation(currentLocation);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
        
        // Get location
        if (locationPermission) {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          setLocation(currentLocation);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setLocation(null);
  };

  const processImage = async () => {
    if (!capturedImage) return;
    
    setProcessing(true);
    
    try {
      // Simulate object detection and processing
      // In a real app, you would call Firebase MLKit or another service here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock detection results
      const detectedObject = {
        id: Date.now().toString(),
        text: "HP Laptop",
        brand: "HP",
        category: "electronic device",
        color: "black",
        shape: "rectangle",
        size: "medium",
        latitude: location?.coords.latitude || null,
        longitude: location?.coords.longitude || null,
        currentCity: "New York",
        currentState: "NY",
        timestamp: new Date().toISOString(),
        imageUri: capturedImage,
      };
      
      // Add the detected object to the store
      await addObject(detectedObject);
      
      // Navigate to the object details page
      router.push(`/object/${detectedObject.id}`);
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process image");
    } finally {
      setProcessing(false);
    }
  };

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need camera permission to detect objects</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          {Platform.OS === "web" ? (
            <View style={styles.webImageContainer}>
              <img 
                src={capturedImage} 
                alt="Captured" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </View>
          ) : (
            <View style={styles.imagePreview}>
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />
            </View>
          )}
          
          <View style={styles.previewOverlay}>
            <Text style={styles.previewText}>
              {processing ? "Processing..." : "Ready to process"}
            </Text>
            {location && (
              <Text style={styles.locationText}>
                Location captured: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={resetCapture}
            disabled={processing}
          >
            <RotateCcw size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.processButton]}
            onPress={processImage}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Check size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Process</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <RotateCcw size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.captureContainer}>
            <TouchableOpacity 
              style={styles.galleryButton}
              onPress={pickImage}
            >
              <ImageIcon size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <View style={styles.placeholderButton} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#5271ff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 40,
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
  },
  placeholderButton: {
    width: 44,
    height: 44,
  },
  previewContainer: {
    flex: 1,
    position: "relative",
  },
  imagePreview: {
    flex: 1,
  },
  webImageContainer: {
    flex: 1,
    overflow: "hidden",
  },
  previewImage: {
    flex: 1,
    resizeMode: "cover",
  },
  previewOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  previewText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  locationText: {
    color: "#fff",
    fontSize: 12,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#000",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  processButton: {
    backgroundColor: "#5271ff",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});