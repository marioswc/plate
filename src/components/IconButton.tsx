import { Colors, globalStyles } from "@/constant/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";
import { Pressable } from "react-native";

type IconButtonProps = {
  handlePress: () => void;
  loading?: boolean;
  iconName?: ComponentProps<typeof Ionicons>["name"];
};

export function IconButton({
  iconName,
  loading,
  handlePress,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      style={({ pressed }) => [
        globalStyles.primaryButton,
        pressed && !loading && globalStyles.btnPressed,
        loading && globalStyles.btnDisabled,
      ]}
    >
      <Ionicons name={iconName} style={{ color: Colors.onPrimary }} />
    </Pressable>
  );
}
