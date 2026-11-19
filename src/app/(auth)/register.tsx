import { Colors, globalStyles } from "@/constant/theme";
import { Text, View } from "react-native";

export default function RegisterScreen() {
  return (
    <View style={[globalStyles.flex1, globalStyles.center]}>
      <Text style={{ color: Colors.text }}>Hello from register screen</Text>
    </View>
  );
}
