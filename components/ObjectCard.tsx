import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { Box } from "lucide-react-native";

export const ObjectCard = ({ object, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {object.imageUri ? (
        Platform.OS === "web" ? (
          <View style={styles.webImageContainer}>
            <img 
              src={object.imageUri} 
              alt={object.text} 
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
            />
          </View>
        ) : (
          <Image source={{ uri: object.imageUri }} style={styles.image} />
        )
      ) : (
        <View style={styles.placeholderContainer}>
          <Box size={24} color="#5271ff" />
        </View>
      )}
      
      <Text style={styles.name} numberOfLines={1}>{object.text}</Text>
      <Text style={styles.category} numberOfLines={1}>{object.category || "Unknown"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginHorizontal: 12,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 12,
    marginHorizontal: 12,
  },
});