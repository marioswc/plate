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
import { logoutService } from "@/services/auth/LogoutService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Href, router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { session } = useAuth();
  const { profile, loading, error, refetch } = useUserProfile(session?.user.id);
  const [loggingOut, setLoggingOut] = useState(false);
  const isFirstFocus = useRef(true);
  const noProfilePicture = require("@/assets/images/no-profile-picture.jpeg");

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );

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
          {error ?? "No se pudo cargar el perfil"}
        </Text>
      </View>
    );
  }

  const handleEditProfile = () => {
    router.push("/profile/edit" as Href);
  };

  const handleLogout = () => {
    if (loggingOut) return;

    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          const result = await logoutService();
          if (!result.ok) {
            setLoggingOut(false);
            Alert.alert("Error", result.error);
          }
        },
      },
    ]);
  };

  return (
    <View style={[globalStyles.screenPadded, styles.container]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={handleEditProfile}
          disabled={loggingOut}
          hitSlop={8}
          style={({ pressed }) => [
            styles.editButton,
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons name="create-outline" size={16} color={Colors.text} />
          <Text style={styles.editButtonText}>Edit profile</Text>
        </Pressable>

        <Pressable
          onPress={handleLogout}
          disabled={loggingOut}
          hitSlop={8}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && globalStyles.btnPressed,
            loggingOut && styles.buttonDisabled,
          ]}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color={Colors.danger} />
          ) : (
            <Ionicons name="log-out-outline" size={16} color={Colors.danger} />
          )}
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Image
          source={
            profile.avatar_url ? { uri: profile.avatar_url } : noProfilePicture
          }
          style={styles.avatar}
          contentFit="cover"
        />

        <View style={styles.info}>
          <View>
            <Text style={styles.fullName} numberOfLines={1}>
              {profile.full_name}
            </Text>
            <Text style={styles.username} numberOfLines={1}>
              @{profile.username}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statValue}>{profile.followers_count}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>

            <View>
              <Text style={styles.statValue}>{profile.following_count}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
      </View>

      {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

      <View style={[globalStyles.divider, styles.divider]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  username: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
  },
  editButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
  },
  logoutButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.danger,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  info: {
    flex: 1,
    gap: Spacing.sm,
  },
  fullName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxl,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  bio: {
    fontSize: FontSize.md,
    lineHeight: 22,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  divider: {
    marginTop: Spacing.lg,
  },
});
