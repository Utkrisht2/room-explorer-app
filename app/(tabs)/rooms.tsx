import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useRoomStore } from "@/stores/roomStore";
import { Plus } from "lucide-react-native";
import { RoomListItem } from "@/components/RoomListItem";

export default function RoomsScreen() {
  const router = useRouter();
  const { rooms, fetchRooms } = useRoomStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      await fetchRooms();
    } catch (error) {
      console.error("Error loading rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRooms();
    } catch (error) {
      console.error("Error refreshing rooms:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToRoom = (id: string) => {
    router.push(`/room/${id}`);
  };

  const navigateToScanRoom = () => {
    router.push("/scan-room");
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5271ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomListItem room={item} onPress={() => navigateToRoom(item.id)} />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Rooms</Text>
            <Text style={styles.headerSubtitle}>
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"} in your inventory
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No rooms added yet</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={navigateToScanRoom}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Room</Text>
            </TouchableOpacity>
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      
      {rooms.length > 0 && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={navigateToScanRoom}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
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
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5271ff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5271ff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});