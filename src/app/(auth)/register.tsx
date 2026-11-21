import { AuthInput } from "@/components/AuthInput";
import { AuthWrapper } from "@/components/AuthWrapper";
import { IconButton } from "@/components/IconButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { RefButton } from "@/components/RefButton";
import { globalStyles, Spacing } from "@/constant/theme";
import {
  FieldErrors,
  RegisterField,
  registerService,
} from "@/services/auth/RegisterService";
import { useState } from "react";
import { Keyboard, Text, View } from "react-native";

export default function RegisterScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({});

  const clearErrors = (field: RegisterField) => {
    setErrors((prevErrors) => {
      if (!prevErrors[field]) return prevErrors;
      const nextErrors = { ...prevErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleRegisterEmail = async () => {
    if (loading) return;
    setLoading(true);
    Keyboard.dismiss();
    setErrors({});
    try {
      const res = await registerService({
        email,
        full_name: fullName,
        username,
        password,
        confirmPassword,
      });
      if (!res.ok) {
        setErrors(res.errors);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper
      title="Let's get started"
      subtitle="Turn your workouts into results"
    >
      <View style={{ marginBottom: Spacing.md, gap: Spacing.lg }}>
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
      </View>
      <View
        style={[
          globalStyles.row,
          globalStyles.center,
          { gap: Spacing.sm, marginBottom: Spacing.md },
        ]}
      >
        <View
          style={[
            globalStyles.colError,
            globalStyles.flex1,
            { gap: Spacing.sm },
          ]}
        >
          <View style={{ gap: Spacing.sm }}>
            <Text style={globalStyles.label}>Name:</Text>
            <AuthInput
              icon="person"
              placeholder="John Doe"
              value={fullName}
              autoCapitalize="words"
              onChangeText={(text) => {
                setFullName(text);
                clearErrors("full_name");
              }}
            />
          </View>
          {errors.full_name ? (
            <Text style={globalStyles.bodyError}>{errors.full_name}</Text>
          ) : null}
        </View>
        <View
          style={[
            globalStyles.colError,
            globalStyles.flex1,
            { gap: Spacing.sm },
          ]}
        >
          <View style={{ gap: Spacing.sm }}>
            <Text style={globalStyles.label}>Username:</Text>
            <AuthInput
              icon="at"
              placeholder="johndoe"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                clearErrors("username");
              }}
            />
          </View>
          {errors.username ? (
            <Text style={globalStyles.bodyError}>{errors.username}</Text>
          ) : null}
        </View>
      </View>
      <View style={{ marginBottom: Spacing.md, gap: Spacing.lg }}>
        <View style={{ gap: Spacing.sm }}>
          <Text style={globalStyles.label}>Password:</Text>
          <AuthInput
            icon="lock-closed"
            placeholder="Create a password"
            value={password}
            secureTextEntry
            onChangeText={(text) => {
              setPassword(text);
              clearErrors("password");
            }}
          />
        </View>
        {errors.password ? (
          <Text style={globalStyles.bodyError}>{errors.password}</Text>
        ) : null}
      </View>
      <View style={{ marginBottom: Spacing.md, gap: Spacing.lg }}>
        <View style={{ gap: Spacing.sm }}>
          <Text style={globalStyles.label}>Confirm password:</Text>
          <AuthInput
            icon="lock-closed"
            placeholder="Repeat your password"
            value={confirmPassword}
            secureTextEntry
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearErrors("confirmPassword");
            }}
          />
        </View>
        {errors.confirmPassword ? (
          <Text style={globalStyles.bodyError}>{errors.confirmPassword}</Text>
        ) : null}
      </View>
      <PrimaryButton
        handlePress={handleRegisterEmail}
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
