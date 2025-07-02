import { StyleSheet, Text, View, TouchableOpacity, Platform, Image } from "react-native";
import { Layers, ChevronRight } from "lucide-react-native";
import type { Room } from "@/stores/roomStore";

type RoomListItemProps = {
  room: Room;
  onPress: () => void;
};

export const RoomListItem = ({ room, onPress }: RoomListItemProps) => {
  let imageContent;
  if (room.imageUri) {
    if (Platform.OS === "web") {
      imageContent = (
        <View style={styles.webImageContainer}>
          <img
            src={room.imageUri}
            alt={room.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
          />
        </View>
      );
    } else {
      imageContent = <Image source={{ uri: room.imageUri }} style={styles.image} />;
    }
  } else {
    imageContent = (
      <View style={styles.placeholderContainer}>
        <Layers size={24} color="#5271ff" />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {imageContent}
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{room.name}</Text>
        <Text style={styles.details}>
          {new Date(room.timestamp).toLocaleDateString()} • 
          {room.furniture?.length || 0} {room.furniture?.length === 1 ? "item" : "items"}
        </Text>
      </View>
      
      <ChevronRight size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: "cover",
  },
  webImageContainer: {
    width: 60,
    height: 60,
    overflow: "hidden",
  },
  placeholderContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f3ff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#666",
  },
});