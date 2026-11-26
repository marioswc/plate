import { FormInput } from "@/components/FormInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import { useUserProfile } from "@/hooks/profile/useUserProfile";
import { useAuth } from "@/provider/AuthProvider";
import { FieldErrors } from "@/services/auth/RegisterService";
import {
  AvatarUploadInput,
  validateAvatar,
} from "@/services/profile/AvatarService";
import {
  BIO_MAX_LENGTH,
  UpdateProfileField,
  updateProfileService,
} from "@/services/profile/UpdateProfileService";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  const [pendingAvatar, setPendingAvatar] = useState<AvatarUploadInput | null>(
    null,
  );
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

  const handlePickAvatar = async () => {
    if (saving) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow photo library access to update your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const nextAvatar: AvatarUploadInput = {
      uri: asset.uri,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
    };

    const avatarError = validateAvatar(nextAvatar);
    if (avatarError) {
      setErrors((prev) => ({ ...prev, avatar: avatarError }));
      return;
    }

    setPendingAvatar(nextAvatar);
    clearError("avatar");
  };

  const hasChanges =
    !!profile &&
    (fullName.trim() !== (profile.full_name ?? "") ||
      username.trim().toLowerCase() !== (profile.username ?? "") ||
      bio.trim() !== (profile.bio ?? "") ||
      pendingAvatar !== null);

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
        avatar: pendingAvatar,
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
          <Pressable
            onPress={handlePickAvatar}
            disabled={saving}
            style={({ pressed }) => [
              styles.avatarPressable,
              pressed && globalStyles.btnPressed,
            ]}
          >
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  pendingAvatar
                    ? { uri: pendingAvatar.uri }
                    : profile.avatar_url
                      ? { uri: profile.avatar_url }
                      : noProfilePicture
                }
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.avatarBadge}>
                <Ionicons
                  name="camera-outline"
                  size={16}
                  color={Colors.text}
                />
              </View>
            </View>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </Pressable>
          {errors.avatar ? (
            <Text style={[globalStyles.bodyError, styles.avatarError]}>
              {errors.avatar}
            </Text>
          ) : null}
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
  avatarPressable: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
  },
  avatarBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoText: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  avatarError: {
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  form: {
    gap: Spacing.lg,
  },
  footer: {
    marginTop: Spacing.xxl,
  },
});
