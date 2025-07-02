import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useObjectStore } from "@/stores/objectStore";
import { MapPin, Trash2, Tag, Box, Palette, Circle, Ruler } from "lucide-react-native";

export default function ObjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { objects, getObject, deleteObject } = useObjectStore();
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const objectData = getObject(id);
      setObject(objectData);
      setLoading(false);
    }
  }, [id, objects]);

  const handleDeleteObject = () => {
    Alert.alert(
      "Delete Object",
      "Are you sure you want to delete this object?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteObject(id);
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

  if (!object) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Object not found</Text>
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
      <View style={styles.imageContainer}>
        {Platform.OS === "web" ? (
          <View style={styles.webImageContainer}>
            <img 
              src={object.imageUri} 
              alt={object.text} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </View>
        ) : (
          <Image 
            source={{ uri: object.imageUri }} 
            style={styles.objectImage} 
          />
        )}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.objectName}>{object.text}</Text>
        <Text style={styles.timestamp}>
          Detected on {new Date(object.timestamp).toLocaleDateString()}
        </Text>
        
        <View style={styles.attributesContainer}>
          <View style={styles.attributeRow}>
            <View style={styles.attributeItem}>
              <Tag size={20} color="#5271ff" />
              <View style={styles.attributeTextContainer}>
                <Text style={styles.attributeLabel}>Brand</Text>
                <Text style={styles.attributeValue}>{object.brand || "Unknown"}</Text>
              </View>
            </View>
            
            <View style={styles.attributeItem}>
              <Box size={20} color="#5271ff" />
              <View style={styles.attributeTextContainer}>
                <Text style={styles.attributeLabel}>Category</Text>
                <Text style={styles.attributeValue}>{object.category || "Unknown"}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.attributeRow}>
            <View style={styles.attributeItem}>
              <Palette size={20} color="#5271ff" />
              <View style={styles.attributeTextContainer}>
                <Text style={styles.attributeLabel}>Color</Text>
                <Text style={styles.attributeValue}>{object.color || "Unknown"}</Text>
              </View>
            </View>
            
            <View style={styles.attributeItem}>
              <Circle size={20} color="#5271ff" />
              <View style={styles.attributeTextContainer}>
                <Text style={styles.attributeLabel}>Shape</Text>
                <Text style={styles.attributeValue}>{object.shape || "Unknown"}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.attributeRow}>
            <View style={styles.attributeItem}>
              <Ruler size={20} color="#5271ff" />
              <View style={styles.attributeTextContainer}>
                <Text style={styles.attributeLabel}>Size</Text>
                <Text style={styles.attributeValue}>{object.size || "Unknown"}</Text>
              </View>
            </View>
            
            <View style={styles.attributeItem}>
              <MapPin size={20} color="#5271ff" />
              <View style={styles.attributeTextContainer}>
                <Text style={styles.attributeLabel}>Location</Text>
                <Text style={styles.attributeValue}>
                  {object.currentCity && object.currentState
                    ? `${object.currentCity}, ${object.currentState}`
                    : "Unknown"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {object.latitude && object.longitude && (
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesLabel}>GPS Coordinates:</Text>
            <Text style={styles.coordinatesValue}>
              {object.latitude.toFixed(6)}, {object.longitude.toFixed(6)}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteObject}
        >
          <Trash2 size={20} color="#ff3b30" />
          <Text style={styles.deleteButtonText}>Delete Object</Text>
        </TouchableOpacity>
      </View>
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
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
  },
  objectImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  webImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  detailsContainer: {
    padding: 16,
  },
  objectName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  attributesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  attributeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  attributeItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  attributeTextContainer: {
    marginLeft: 12,
  },
  attributeLabel: {
    fontSize: 12,
    color: "#666",
  },
  attributeValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  coordinatesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  coordinatesLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  coordinatesValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
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
  },
  deleteButtonText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});