import { Colors } from "@/constant/theme";
import { Stack } from "expo-router";

export default function ExercisesLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ title: "New routine" }} />
      <Stack.Screen name="explore" options={{ title: "Explore routines" }} />
    </Stack>
  );
}
