import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useRoomStore } from "@/stores/roomStore";
import { useObjectStore } from "@/stores/objectStore";
import { LinearGradient } from "expo-linear-gradient";
import { Scan, Camera, Search, Plus } from "lucide-react-native";
import { RoomCard } from "@/components/RoomCard";
import { ObjectCard } from "@/components/ObjectCard";
import { useAuthStore } from "@/stores/authStore";

export default function HomeScreen() {
  const router = useRouter();
  const { rooms, fetchRooms } = useRoomStore();
  const { objects, fetchObjects } = useObjectStore();
  const { user, isGuest } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchRooms(), fetchObjects()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchRooms, fetchObjects]);

  const navigateToScanRoom = () => {
    router.push("/scan-room");
  };

  const navigateToObjectDetection = () => {
    router.push("/detect");
  };

  const navigateToSearch = () => {
    router.push("/search");
  };

  const navigateToRoom = (id: string) => {
    router.push(`/room/${id}`);
  };

  const navigateToObject = (id: string) => {
    router.push(`/object/${id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5271ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome{user ? `, ${user.name}` : ""}
          {isGuest ? " (Guest)" : ""}
        </Text>
        <Text style={styles.subtitleText}>
          Manage your home inventory with ease
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={navigateToScanRoom}
        >
          <LinearGradient
            colors={["#5271ff", "#7a90ff"]}
            style={styles.actionButtonGradient}
          >
            <Scan size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.actionButtonText}>Scan Room</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={navigateToObjectDetection}
        >
          <LinearGradient
            colors={["#ff9f7a", "#ff7a7a"]}
            style={styles.actionButtonGradient}
          >
            <Camera size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.actionButtonText}>Detect Object</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={navigateToSearch}
        >
          <LinearGradient
            colors={["#7aff9f", "#7affcf"]}
            style={styles.actionButtonGradient}
          >
            <Search size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.actionButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Rooms */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Rooms</Text>
          <TouchableOpacity onPress={() => router.push("/rooms")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {rooms.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No rooms added yet</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={navigateToScanRoom}
            >
              <Plus size={16} color="#5271ff" />
              <Text style={styles.emptyStateButtonText}>Add Room</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.roomsScrollContainer}
          >
            {rooms.slice(0, 5).map((room) => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onPress={() => navigateToRoom(room.id)} 
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Recent Objects */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Objects</Text>
          <TouchableOpacity onPress={() => router.push("/objects")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {objects.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No objects detected yet</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={navigateToObjectDetection}
            >
              <Plus size={16} color="#5271ff" />
              <Text style={styles.emptyStateButtonText}>Detect Object</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.objectsContainer}>
            {objects.slice(0, 4).map((object) => (
              <ObjectCard 
                key={object.id} 
                object={object} 
                onPress={() => navigateToObject(object.id)} 
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
    width: "30%",
  },
  actionButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  sectionContainer: {
    marginBottom: 24,
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
  seeAllText: {
    fontSize: 14,
    color: "#5271ff",
    fontWeight: "500",
  },
  roomsScrollContainer: {
    paddingRight: 16,
  },
  objectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyStateContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f3ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#5271ff",
    marginLeft: 8,
  },
});