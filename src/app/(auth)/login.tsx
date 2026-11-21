import { AuthInput } from "@/components/AuthInput";
import { AuthWrapper } from "@/components/AuthWrapper";
import { IconButton } from "@/components/IconButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { RefButton } from "@/components/RefButton";
import { globalStyles, Spacing } from "@/constant/theme";
import { LoginField, loginService } from "@/services/auth/LoginService";
import { FieldErrors } from "@/services/auth/RegisterService";
import { useState } from "react";
import { Text, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSelected, setSelection] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrors<LoginField>>({});

  const clearErrors = (field: LoginField) => {
    setErrors((prevErrors) => {
      if (!prevErrors[field]) return prevErrors;
      const nextErrors = { ...prevErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleLoginEmail = async () => {
    if (loading) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await loginService({ email, password });
      if (!res.ok) {
        setErrors(res.errors);
        return;
      }
    } finally {
      return setLoading(false);
    }
  };

  return (
    <AuthWrapper
      title="Back to the grind"
      subtitle="Pick up right where you left off"
    >
      <View style={{ marginBottom: Spacing.xl, gap: Spacing.md }}>
        <View style={{ gap: Spacing.sm }}>
          <Text style={globalStyles.label}>Email:</Text>
          <AuthInput
            icon="mail"
            placeholder="you@example.com"
            value={email}
            keyboardType="email-address"
            onChangeText={(text) => {
              setEmail(text);
              clearErrors("email");
            }}
          />
        </View>
        {errors.email ? (
          <Text style={globalStyles.bodyError}>{errors.email}</Text>
        ) : null}

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
        {errors.password ? (
          <Text style={globalStyles.bodyError}>{errors.password}</Text>
        ) : null}
      </View>
      <View
        style={[
          globalStyles.row,
          {
            justifyContent: "flex-end",
            paddingHorizontal: Spacing.xs,
            marginBottom: Spacing.xl,
          },
        ]}
      >
        <RefButton
          route={"/register"}
          buttonText="Forgot password?"
          loading={loading}
        />
      </View>
      <PrimaryButton
        handlePress={handleLoginEmail}
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
