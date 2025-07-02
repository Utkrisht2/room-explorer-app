import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { Box, ChevronRight } from "lucide-react-native";

export const ObjectListItem = ({ object, onPress }) => {
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
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{object.text}</Text>
        <View style={styles.detailsContainer}>
          {object.brand && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{object.brand}</Text>
            </View>
          )}
          
          {object.category && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{object.category}</Text>
            </View>
          )}
          
          {object.color && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{object.color}</Text>
            </View>
          )}
        </View>
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
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagContainer: {
    backgroundColor: "#f0f3ff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#5271ff",
  },
});