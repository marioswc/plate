import { Colors, globalStyles, Spacing } from "@/constant/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ExercisesScreen() {
  const handleCreateRoutine = () => {
    router.push("/exercises/create" as Href);
  };

  const handleExploreRoutines = () => {
    router.push("/exercises/explore" as Href);
  };

  return (
    <View
      style={[
        globalStyles.flex1,
        { marginTop: Spacing.xl, paddingHorizontal: Spacing.lg },
      ]}
    >
      <Text style={[globalStyles.h2, { marginBottom: Spacing.lg }]}>
        Routines
      </Text>

      <View style={[globalStyles.row, { gap: Spacing.md }]}>
        <Pressable
          onPress={handleCreateRoutine}
          style={({ pressed }) => [
            globalStyles.secondaryButton,
            globalStyles.flex1,
            { paddingVertical: Spacing.lg, gap: Spacing.sm },
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons name="add-circle-outline" size={24} color={Colors.text} />
          <Text style={globalStyles.secondaryButtonText}>New routine</Text>
        </Pressable>

        <Pressable
          onPress={handleExploreRoutines}
          style={({ pressed }) => [
            globalStyles.secondaryButton,
            globalStyles.flex1,
            { paddingVertical: Spacing.lg, gap: Spacing.sm },
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons name="search-outline" size={24} color={Colors.text} />
          <Text style={globalStyles.secondaryButtonText}>Explore routines</Text>
        </Pressable>
      </View>
    </View>
  );
}
