import { globalStyles } from "@/constant/theme";
import { Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={[globalStyles.flex1, globalStyles.center]}>
      <Text style={globalStyles.h2}>Hello from profile</Text>
    </View>
  );
}
