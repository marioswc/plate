import { Colors } from "@/constant/theme";
import { Stack } from "expo-router";

export default function AuthRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}
