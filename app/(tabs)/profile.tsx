import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { User, Settings, LogOut, Lock, Bell, Moon, HelpCircle, Download } from "lucide-react-native";
import { useState } from "react";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isGuest, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      "Export Data",
      "This will export all your inventory data as JSON",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Export",
          onPress: () => {
            // In a real app, this would export the data
            Alert.alert("Success", "Data exported successfully");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <User size={40} color="#5271ff" />
        </View>
        <Text style={styles.userName}>{isGuest ? "Guest User" : user?.name || "User"}</Text>
        <Text style={styles.userEmail}>{isGuest ? "Guest Session" : user?.email || ""}</Text>
        
        {isGuest && (
          <TouchableOpacity 
            style={styles.createAccountButton}
            onPress={() => router.replace("/(auth)/signup")}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          disabled={isGuest}
          onPress={() => router.push("/profile/personal-info")}
        >
          <User size={20} color={isGuest ? "#ccc" : "#333"} />
          <Text style={[styles.menuItemText, isGuest && styles.disabledText]}>Personal Information</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          disabled={isGuest}
          onPress={() => router.push("/profile/security")}
        >
          <Lock size={20} color={isGuest ? "#ccc" : "#333"} />
          <Text style={[styles.menuItemText, isGuest && styles.disabledText]}>Security</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.menuItem}>
          <Bell size={20} color="#333" />
          <Text style={styles.menuItemText}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#e5e5e5", true: "#5271ff" }}
            thumbColor="#fff"
          />
        </View>
        
        <View style={styles.menuItem}>
          <Moon size={20} color="#333" />
          <Text style={styles.menuItemText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#e5e5e5", true: "#5271ff" }}
            thumbColor="#fff"
          />
        </View>
        
        <View style={styles.menuItem}>
          <Settings size={20} color="#333" />
          <Text style={styles.menuItemText}>Auto Sync</Text>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: "#e5e5e5", true: "#5271ff" }}
            thumbColor="#fff"
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={exportData}
        >
          <Download size={20} color="#333" />
          <Text style={styles.menuItemText}>Export Data (JSON)</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push("/help")}
        >
          <HelpCircle size={20} color="#333" />
          <Text style={styles.menuItemText}>Help & Support</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#ff3b30" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  header: {
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f3ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  createAccountButton: {
    backgroundColor: "#5271ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createAccountButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
  disabledText: {
    color: "#ccc",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff3b30",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff3b30",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 24,
    marginBottom: 32,
  },
});