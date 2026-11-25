import { Colors, globalStyles } from "@/constant/theme";
import { ActivityIndicator, Pressable, Text } from "react-native";

type PrimaryButtonProps = {
  handlePress: () => void;
  buttonText: string;
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({
  handlePress,
  buttonText,
  loading = false,
  disabled = false,
}: PrimaryButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        globalStyles.primaryButton,
        pressed && !isDisabled && globalStyles.btnPressed,
        isDisabled && globalStyles.btnDisabled,
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
