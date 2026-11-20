import { Colors, globalStyles } from "@/constant/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps, useState } from "react";
import { Pressable, StyleProp, TextInput, TextStyle, View } from "react-native";

type AuthInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: ComponentProps<typeof Ionicons>["name"];
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: StyleProp<TextStyle>;
};

export function AuthInput({
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = "none",
  style,
}: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={globalStyles.input}>
      {icon && <Ionicons name={icon} style={globalStyles.inputIcon} />}
      <TextInput
        style={[globalStyles.inputText, style]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        autoCapitalize={autoCapitalize}
      />
      {secureTextEntry && (
        <Pressable
          onPress={() => setIsPasswordVisible((prev) => !prev)}
          hitSlop={8}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            style={globalStyles.inputIcon}
          />
        </Pressable>
      )}
    </View>
  );
}
