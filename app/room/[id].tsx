import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRoomStore } from "@/stores/roomStore";
import { Edit, Trash2, Plus, X, MapPin } from "lucide-react-native";
import { Platform } from "react-native";

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { rooms, getRoom, updateRoom, deleteRoom } = useRoomStore();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [furnitureName, setFurnitureName] = useState("");
  const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [editMode, setEditMode] = useState(false);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    if (id) {
      const roomData = getRoom(id);
      setRoom(roomData);
      setRoomName(roomData?.name || "");
      setLoading(false);
    }
  }, [id, rooms]);

  const handleImageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setImageSize({ width, height });
  };

  const handleImagePress = (event) => {
    if (!room?.imageUri || !editMode) return;
    
    // Get touch position relative to the image
    const { locationX, locationY } = event.nativeEvent;
    setMarkerPosition({ x: locationX, y: locationY });
    setModalVisible(true);
  };

  const addFurniture = () => {
    if (!furnitureName.trim()) {
      Alert.alert("Error", "Please enter furniture name");
      return;
    }
    
    const newFurniture = {
      id: Date.now().toString(),
      name: furnitureName.trim(),
      position: {
        x: markerPosition.x / imageSize.width, // Store as percentage
        y: markerPosition.y / imageSize.height,
      },
    };
    
    const updatedFurniture = [...(room.furniture || []), newFurniture];
    
    updateRoom(id, { ...room, furniture: updatedFurniture });
    setFurnitureName("");
    setModalVisible(false);
  };

  const saveRoomName = () => {
    if (!roomName.trim()) {
      Alert.alert("Error", "Room name cannot be empty");
      return;
    }
    
    updateRoom(id, { ...room, name: roomName.trim() });
    setEditMode(false);
  };

  const handleDeleteRoom = () => {
    Alert.alert(
      "Delete Room",
      "Are you sure you want to delete this room?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteRoom(id);
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5271ff" />
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Room not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {editMode ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.editNameInput}
              value={roomName}
              onChangeText={setRoomName}
              autoFocus
            />
            <TouchableOpacity 
              style={styles.saveNameButton}
              onPress={saveRoomName}
            >
              <Text style={styles.saveNameButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{room.name}</Text>
            <TouchableOpacity onPress={() => setEditMode(true)}>
              <Edit size={20} color="#5271ff" />
            </TouchableOpacity>
          </View>
        )}
        
        <Text style={styles.timestamp}>
          Added on {new Date(room.timestamp).toLocaleDateString()}
        </Text>
      </View>
      
      {room.imageUri ? (
        <View style={styles.imageContainer}>
          <TouchableOpacity 
            activeOpacity={editMode ? 0.7 : 1}
            onPress={handleImagePress}
          >
            {Platform.OS === "web" ? (
              <View 
                style={styles.webImageContainer}
                onLayout={handleImageLayout}
              >
                <img 
                  src={room.imageUri} 
                  alt={room.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                
                {room.furniture?.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.furnitureMarker,
                      {
                        left: `${item.position.x * 100}%`,
                        top: `${item.position.y * 100}%`,
                      },
                    ]}
                  >
                    <MapPin size={24} color="#5271ff" />
                    <Text style={styles.markerLabel}>{item.name}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View onLayout={handleImageLayout}>
                <Image 
                  source={{ uri: room.imageUri }} 
                  style={styles.roomImage} 
                />
                
                {room.furniture?.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.furnitureMarker,
                      {
                        left: imageSize.width * item.position.x,
                        top: imageSize.height * item.position.y,
                      },
                    ]}
                  >
                    <MapPin size={24} color="#5271ff" />
                    <Text style={styles.markerLabel}>{item.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
          
          {editMode && (
            <Text style={styles.tapInstructionText}>
              Tap on the image to add furniture markers
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No layout image available</Text>
        </View>
      )}
      
      <View style={styles.furnitureSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Furniture</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setEditMode(!editMode)}
          >
            <Text style={styles.editButtonText}>
              {editMode ? "Done" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>
        
        {room.furniture?.length > 0 ? (
          <View style={styles.furnitureList}>
            {room.furniture.map((item) => (
              <View key={item.id} style={styles.furnitureItem}>
                <MapPin size={16} color="#5271ff" />
                <Text style={styles.furnitureName}>{item.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noFurnitureText}>
            No furniture added yet
            {room.imageUri && editMode && ". Tap on the image to add furniture markers"}
          </Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDeleteRoom}
      >
        <Trash2 size={20} color="#ff3b30" />
        <Text style={styles.deleteButtonText}>Delete Room</Text>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Furniture</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Furniture name"
              value={furnitureName}
              onChangeText={setFurnitureName}
              autoFocus
            />
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addFurniture}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Furniture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: "#5271ff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  editNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editNameInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    marginRight: 8,
  },
  saveNameButton: {
    backgroundColor: "#5271ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveNameButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  imageContainer: {
    marginBottom: 16,
  },
  roomImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  webImageContainer: {
    width: "100%",
    height: 250,
    position: "relative",
  },
  tapInstructionText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  noImageContainer: {
    backgroundColor: "#e5e5e5",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  noImageText: {
    fontSize: 16,
    color: "#666",
  },
  furnitureMarker: {
    position: "absolute",
    transform: [{ translateX: -12 }, { translateY: -24 }],
    alignItems: "center",
  },
  markerLabel: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  furnitureSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  editButton: {
    backgroundColor: "#f0f3ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#5271ff",
    fontSize: 14,
    fontWeight: "500",
  },
  furnitureList: {
    gap: 12,
  },
  furnitureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  furnitureName: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  noFurnitureText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingVertical: 16,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff3b30",
    borderRadius: 12,
    paddingVertical: 16,
    margin: 16,
  },
  deleteButtonText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalInput: {
    backgroundColor: "#f7f8fa",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5271ff",
    borderRadius: 12,
    paddingVertical: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});