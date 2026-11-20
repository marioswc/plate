import { globalStyles } from "@/constant/theme";
import { Href, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

type RefButtonProps = {
  route: Href;
  buttonText: string;
  loading?: boolean;
};

export function RefButton({
  route,
  buttonText,
  loading = false,
}: RefButtonProps) {
  const router = useRouter();
  function handlePress() {
    router.navigate(route);
  }
  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      style={({ pressed }) => [
        pressed && !loading && globalStyles.btnPressed,
        loading && globalStyles.btnDisabled,
      ]}
    >
      <Text style={globalStyles.refButtonText}>{buttonText}</Text>
    </Pressable>
  );
}
