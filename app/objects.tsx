import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ObjectsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>All detected objects will be listed here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
}); 