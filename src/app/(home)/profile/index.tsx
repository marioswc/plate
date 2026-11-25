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
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Href, router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { session } = useAuth();
  const { profile, loading, error, refetch } = useUserProfile(session?.user.id);
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

  return (
    <View style={[globalStyles.screenPadded, styles.container]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={handleEditProfile}
          hitSlop={8}
          style={({ pressed }) => [
            styles.editButton,
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons name="create-outline" size={18} color={Colors.text} />
          <Text style={styles.editButtonText}>Edit profile</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        {profile.avatar_url ? (
          <Image
            source={{ uri: profile.avatar_url }}
            style={styles.avatar}
            contentFit="cover"
          />
        ) : (
          <Image
            source={noProfilePicture}
            style={styles.avatar}
            contentFit="cover"
          />
        )}

        <View style={styles.info}>
          <Text style={styles.fullName} numberOfLines={1}>
            {profile.full_name}
          </Text>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Followers</Text>
              <Text style={styles.statValue}>{profile.followers_count}</Text>
            </View>

            <View>
              <Text style={styles.statLabel}>Following</Text>
              <Text style={styles.statValue}>{profile.following_count}</Text>
            </View>
          </View>
        </View>
      </View>

      {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: Spacing.md,
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: Radius.full,
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
    gap: Spacing.xxxl,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: 2,
  },
  bio: {
    fontSize: FontSize.md,
    color: Colors.text,
    marginTop: Spacing.md,
  },
});
