import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useAuthStore } from "@/stores/authStore";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    // Clear AsyncStorage once on app start
    AsyncStorage.clear()
      .then(() => console.log('AsyncStorage cleared on app start'))
      .catch(err => console.log('Failed to clear AsyncStorage', err));
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isGuest } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !isGuest && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if ((isAuthenticated || isGuest) && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isGuest, segments, router]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="room/[id]" options={{ title: "Room Details" }} />
      <Stack.Screen name="object/[id]" options={{ title: "Object Details" }} />
    </Stack>
  );
}
