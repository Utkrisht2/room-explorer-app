import { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, loginAsGuest } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Simulate login - in a real app, this would connect to Supabase
      await login(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      router.replace("/(tabs)");
    } catch (err) {
      setError("Failed to login as guest");
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push("/(auth)/signup");
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={["#f7f8fa", "#e7eaf0"]}
          style={styles.gradientBackground}
        />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Home Inventory</Text>
          <Text style={styles.subtitle}>Track your belongings with ease</Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <LogIn size={20} color="#fff" />
                <Text style={styles.loginButtonText}>Login</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={navigateToSignup}
          >
            <UserPlus size={20} color="#5271ff" />
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.guestButton} 
            onPress={handleGuestLogin}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#ff3b30",
    marginBottom: 16,
    textAlign: "center",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5271ff",
    borderRadius: 12,
    height: 56,
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  signupButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#5271ff",
    height: 56,
    marginBottom: 16,
  },
  signupButtonText: {
    color: "#5271ff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  guestButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  guestButtonText: {
    color: "#666",
    fontSize: 16,
  },
});