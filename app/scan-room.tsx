import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useRoomStore } from "@/stores/roomStore";
import { Scan, ExternalLink, Image as ImageIcon, Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function ScanRoomScreen() {
  const [roomName, setRoomName] = useState("");
  const [layoutImage, setLayoutImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addRoom } = useRoomStore();

  // Open MagicPlan app or redirect to install
  const openMagicPlan = async () => {
    try {
      // This is a placeholder. In a real app, you would check installed apps.
      const isMagicPlanInstalled = false;
      if (isMagicPlanInstalled) {
        Alert.alert("Success", "Opening MagicPlan...");
      } else {
        const storeUrl =
          Platform.OS === "ios"
            ? "https://apps.apple.com/app/magicplan/id427424432"
            : "https://play.google.com/store/apps/details?id=com.sensopia.magicplan";
        Alert.alert(
          "MagicPlan Not Installed",
          "You need to install MagicPlan to scan rooms.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Install", onPress: () => Linking.openURL(storeUrl) },
          ]
        );
      }
    } catch (error) {
      console.error("Error opening MagicPlan:", error);
      Alert.alert("Error", "Failed to open MagicPlan.");
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setLayoutImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  // Save room to store
  const saveRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert("Error", "Please enter a room name.");
      return;
    }
    setLoading(true);
    try {
      const newRoom = {
        id: Date.now().toString(),
        name: roomName.trim(),
        imageUri: layoutImage,
        timestamp: new Date().toISOString(),
        furniture: [],
      };
      await addRoom(newRoom);
      Alert.alert("Success", "Room added successfully.", [
        { text: "OK", onPress: () => router.replace(`/room/${newRoom.id}`) },
      ]);
    } catch (error) {
      console.error("Error saving room:", error);
      Alert.alert("Error", "Failed to save room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Scan Room</Text>
          <Text style={styles.subtitle}>
            Use MagicPlan to scan your room or upload a layout image.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Room Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter room name"
              value={roomName}
              onChangeText={setRoomName}
            />
          </View>

          <TouchableOpacity
            style={styles.magicPlanButton}
            onPress={openMagicPlan}
          >
            <Scan size={24} color="#fff" />
            <Text style={styles.magicPlanButtonText}>Open MagicPlan</Text>
            <ExternalLink size={16} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickImage}
          >
            <ImageIcon size={24} color="#5271ff" />
            <Text style={styles.uploadButtonText}>Upload Layout Image</Text>
          </TouchableOpacity>

          {layoutImage && (
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.imagePreviewLabel}>Selected Image:</Text>
              {Platform.OS === "web" ? (
                <View style={styles.webImageContainer}>
                  <img
                    src={layoutImage}
                    alt="Room Layout"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </View>
              ) : (
                <Image source={{ uri: layoutImage }} style={styles.imagePreview} />
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!roomName.trim() || loading) && styles.disabledButton,
            ]}
            onPress={saveRoom}
            disabled={!roomName.trim() || loading}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save Room"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f7f8fa",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  magicPlanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5271ff",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  magicPlanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  orText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginVertical: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f3ff",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: "#5271ff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  imagePreviewContainer: {
    marginBottom: 16,
  },
  imagePreviewLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  webImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5271ff",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});
