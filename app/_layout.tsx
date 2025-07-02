import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

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
      // Redirect to the sign-in page if not authenticated and not in auth group
      router.replace("/(auth)/login");
    } else if ((isAuthenticated || isGuest) && inAuthGroup) {
      // Redirect to the home page if authenticated but still in auth group
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