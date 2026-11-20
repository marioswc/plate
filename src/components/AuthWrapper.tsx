import { Colors, globalStyles, Spacing } from "@/constant/theme";
import { PropsWithChildren } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthWrapperProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
}

export function AuthWrapper({ children, title, subtitle }: AuthWrapperProps) {
  const logo = require("@/assets/icon.png");
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center", marginBottom: Spacing.lg }}>
            <Image style={styles.logoStyles} source={logo}></Image>
          </View>
          <View
            style={[
              globalStyles.center,
              { gap: Spacing.xs, marginBottom: Spacing.xl },
            ]}
          >
            <Text style={globalStyles.h1}>{title}</Text>
            <Text style={globalStyles.bodyMuted}>{subtitle}</Text>
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  logoStyles: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
