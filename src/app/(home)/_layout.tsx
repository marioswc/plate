import { Colors } from "@/constant/theme";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}
