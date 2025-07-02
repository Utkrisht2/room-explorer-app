import { StyleSheet, Text, View, TouchableOpacity, Platform, Image } from "react-native";
import { Layers } from "lucide-react-native";
import type { Room } from "@/stores/roomStore";

type RoomCardProps = {
  room: Room;
  onPress: () => void;
};

export const RoomCard = ({ room, onPress }: RoomCardProps) => {
  let imageContent;
  if (room.imageUri) {
    if (Platform.OS === "web") {
      imageContent = (
        <View style={styles.webImageContainer}>
          <img
            src={room.imageUri}
            alt={room.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </View>
      );
    } else {
      imageContent = <Image source={{ uri: room.imageUri }} style={styles.image} />;
    }
  } else {
    imageContent = (
      <View style={styles.placeholderContainer}>
        <Layers size={32} color="#5271ff" />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {imageContent}
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{room.name}</Text>
        <Text style={styles.furniture}>
          {room.furniture?.length || 0} {room.furniture?.length === 1 ? "item" : "items"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  webImageContainer: {
    width: "100%",
    height: 120,
    overflow: "hidden",
  },
  placeholderContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#f0f3ff",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  furniture: {
    fontSize: 12,
    color: "#666",
  },
});