import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Colors, globalStyles, Radius, Spacing } from "@/constant/theme";
import { useUserProfile } from "@/hooks/profile/useUserProfile";
import { useAuth } from "@/provider/AuthProvider";
import { FieldErrors } from "@/services/auth/RegisterService";
import {
  BIO_MAX_LENGTH,
  UpdateProfileField,
  updateProfileService,
} from "@/services/profile/UpdateProfileService";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const { session } = useAuth();
  const userUid = session?.user.id;
  const { profile, loading, error } = useUserProfile(userUid);
  const noProfilePicture = require("@/assets/images/no-profile-picture.jpeg");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<UpdateProfileField>>({});

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setUsername(profile.username ?? "");
    setBio(profile.bio ?? "");
  }, [profile]);

  const clearError = (field: UpdateProfileField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const hasChanges =
    !!profile &&
    (fullName.trim() !== (profile.full_name ?? "") ||
      username.trim().toLowerCase() !== (profile.username ?? "") ||
      bio.trim() !== (profile.bio ?? ""));

  const handleSave = async () => {
    if (!userUid || saving || !hasChanges) return;

    setSaving(true);
    Keyboard.dismiss();
    setErrors({});

    try {
      const res = await updateProfileService(userUid, {
        full_name: fullName,
        username,
        bio,
      });

      if (!res.ok) {
        setErrors(res.errors);
        return;
      }

      router.back();
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <View style={[globalStyles.screen, globalStyles.center]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={[globalStyles.screen, globalStyles.center]}>
        <Text style={globalStyles.bodyError}>
          {error ?? "Could not load profile"}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <Image
            source={
              profile.avatar_url
                ? { uri: profile.avatar_url }
                : noProfilePicture
            }
            style={styles.avatar}
            contentFit="cover"
          />
        </View>

        <View style={styles.form}>
          <FormInput
            label="Full name"
            icon="person-outline"
            placeholder="Your name"
            value={fullName}
            autoCapitalize="words"
            editable={!saving}
            error={errors.full_name}
            onChangeText={(text) => {
              setFullName(text);
              clearError("full_name");
            }}
          />

          <FormInput
            label="Username"
            icon="at-outline"
            placeholder="username"
            value={username}
            autoCapitalize="none"
            editable={!saving}
            error={errors.username}
            onChangeText={(text) => {
              setUsername(text);
              clearError("username");
            }}
          />

          <FormInput
            label="Bio"
            placeholder="Tell others a bit about your training..."
            value={bio}
            multiline
            maxLength={BIO_MAX_LENGTH}
            showCount
            autoCapitalize="sentences"
            editable={!saving}
            error={errors.bio}
            onChangeText={(text) => {
              setBio(text);
              clearError("bio");
            }}
          />

          {errors.form ? (
            <Text style={globalStyles.bodyError}>{errors.form}</Text>
          ) : null}
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            handlePress={handleSave}
            buttonText="Save changes"
            loading={saving}
            disabled={!hasChanges}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
  },
  form: {
    gap: Spacing.lg,
  },
  footer: {
    marginTop: Spacing.xxl,
  },
});
