import { globalStyles } from "@/constant/theme";
import { Text, View } from "react-native";

export default function EditProfileScreen() {
  return (
    <View style={[globalStyles.screen, globalStyles.center]}>
      <Text style={globalStyles.h2}>Edit profile</Text>
    </View>
  );
}
