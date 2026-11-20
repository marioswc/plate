import { AuthInput } from "@/components/AuthInput";
import { AuthWrapper } from "@/components/AuthWrapper";
import { IconButton } from "@/components/IconButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { RefButton } from "@/components/RefButton";
import { globalStyles, Spacing } from "@/constant/theme";
import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { Text, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSelected, setSelection] = useState<boolean>(false);
  return (
    <AuthWrapper
      title="Back to the grind"
      subtitle="Pick up right where you left off"
    >
      <View style={{ marginBottom: Spacing.xl, gap: Spacing.xl }}>
        <View style={{ gap: Spacing.sm }}>
          <Text style={globalStyles.label}>Email:</Text>
          <AuthInput
            icon="mail"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={{ gap: Spacing.sm }}>
          <Text style={globalStyles.label}>Password:</Text>
          <AuthInput
            icon="lock-closed"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>
      <View
        style={[
          globalStyles.rowBetween,
          { paddingHorizontal: Spacing.xs, marginBottom: Spacing.xl },
        ]}
      >
        <View style={[globalStyles.row, { gap: Spacing.sm }]}>
          <Checkbox
            style={globalStyles.inputCheckbox}
            value={isSelected}
            onValueChange={setSelection}
          />
          <Text style={[globalStyles.bodyMuted]}>Remember me</Text>
        </View>
        <RefButton
          route={"/register"}
          buttonText="Forgot password"
          loading={loading}
        />
      </View>
      <PrimaryButton
        handlePress={() => alert("Hello from sign in")}
        buttonText="Sign In"
        loading={loading}
      />
      <View
        style={[
          globalStyles.row,
          {
            gap: Spacing.xs,
            marginTop: Spacing.xl,
            paddingHorizontal: Spacing.sm,
          },
        ]}
      >
        <Text style={globalStyles.bodyMuted}>New here with us?</Text>
        <RefButton route={"/register"} buttonText="Sign Up" loading={loading} />
      </View>
      <View
        style={[
          globalStyles.row,
          {
            gap: Spacing.md,
            marginTop: Spacing.xl,
            paddingHorizontal: Spacing.sm,
            marginVertical: Spacing.xl,
          },
        ]}
      >
        <View style={[globalStyles.divider, globalStyles.flex1]} />
        <Text style={[globalStyles.bodyMuted]}>Or continue with</Text>
        <View style={[globalStyles.divider, globalStyles.flex1]} />
      </View>
      <View style={[globalStyles.center]}>
        <IconButton
          iconName="logo-google"
          handlePress={() => alert("hola chat")}
        />
      </View>
    </AuthWrapper>
  );
}
