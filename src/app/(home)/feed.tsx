import { globalStyles } from "@/constant/theme";
import { Text, View } from "react-native";

export default function FeedScreen() {
  return (
    <View style={[globalStyles.flex1, globalStyles.center]}>
      <Text style={globalStyles.h2}>Hello from Feed</Text>
    </View>
  );
}
