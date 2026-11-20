import { Colors, globalStyles } from "@/constant/theme";
import { ActivityIndicator, Pressable, Text } from "react-native";

type PrimaryButtonProps = {
  handlePress: () => void;
  buttonText: string;
  loading?: boolean;
};

export function PrimaryButton({
  handlePress,
  buttonText,
  loading = false,
}: PrimaryButtonProps) {
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
      {loading ? (
        <ActivityIndicator color={Colors.text} />
      ) : (
        <Text style={globalStyles.primaryButtonText}>{buttonText}</Text>
      )}
    </Pressable>
  );
}
