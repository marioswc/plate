import { AuthInput } from "@/components/AuthInput";
import { AuthWrapper } from "@/components/AuthWrapper";
import { IconButton } from "@/components/IconButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { RefButton } from "@/components/RefButton";
import { globalStyles, Spacing } from "@/constant/theme";
import { useState } from "react";
import { Text, View } from "react-native";

export default function RegisterScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  return (
    <AuthWrapper
      title="Let's get started"
      subtitle="Turn your workouts into results"
    >
      <View style={{ marginBottom: Spacing.xl, gap: Spacing.lg }}>
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
      </View>
      <View
        style={[
          globalStyles.row,
          globalStyles.center,
          { gap: Spacing.sm, marginBottom: Spacing.lg },
        ]}
      >
        <View style={[globalStyles.flex1, { gap: Spacing.sm }]}>
          <Text style={globalStyles.label}>Name:</Text>
          <AuthInput
            icon="person"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>
        <View style={[globalStyles.flex1, { gap: Spacing.sm }]}>
          <Text style={globalStyles.label}>Username:</Text>
          <AuthInput
            icon="at"
            placeholder="johndoe"
            value={username}
            onChangeText={setUsername}
          />
        </View>
      </View>
      <View style={{ marginBottom: Spacing.xl, gap: Spacing.lg }}>
        <View style={{ gap: Spacing.sm }}>
          <Text style={globalStyles.label}>Password:</Text>
          <AuthInput
            icon="lock-closed"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>
      <View style={{ marginBottom: Spacing.xl, gap: Spacing.lg }}>
        <View style={{ gap: Spacing.sm }}>
          <Text style={globalStyles.label}>Confirm password:</Text>
          <AuthInput
            icon="lock-closed"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
      </View>
      <PrimaryButton
        handlePress={() => alert("Hello from sign up")}
        buttonText="Sign Up"
        loading={loading}
      />
      <View
        style={[
          globalStyles.row,
          {
            gap: Spacing.lg,
            marginTop: Spacing.xl,
            paddingHorizontal: Spacing.sm,
          },
        ]}
      >
        <Text style={globalStyles.bodyMuted}>Already have an account?</Text>
        <RefButton route={"/login"} buttonText="Sign In" loading={loading} />
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
