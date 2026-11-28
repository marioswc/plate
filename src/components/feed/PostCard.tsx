import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Radius,
  Spacing,
} from "@/constant/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const noProfilePicture = require("@/assets/images/no-profile-picture.jpeg");

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string | null;
  createdAt: string;
  content: string;
  imageUrl?: string | null;
  routineId?: string | null;
  routineName?: string | null;
  likesCount: number;
  commentsCount: number;
  liked?: boolean;
  following?: boolean;
}

interface PostCardProps {
  post: FeedPost;
  isOwnPost?: boolean;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onFollow?: (authorId: string) => void;
  onPressRoutine?: (routineId: string) => void;
}

export function PostCard({
  post,
  isOwnPost = false,
  onLike,
  onComment,
  onFollow,
  onPressRoutine,
}: PostCardProps) {
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  return (
    <View style={[globalStyles.card, styles.card]}>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <Image
            source={
              post.authorAvatar ? { uri: post.authorAvatar } : noProfilePicture
            }
            style={styles.avatar}
            contentFit="cover"
          />

          <View style={styles.authorInfo}>
            <Text style={styles.authorName} numberOfLines={1}>
              {post.authorName}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              @{post.authorUsername} · {post.createdAt}
            </Text>
          </View>
        </View>

        {!isOwnPost ? (
          <Pressable
            onPress={() => onFollow?.(post.authorId)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.followButton,
              pressed && globalStyles.btnPressed,
            ]}
          >
            <Ionicons
              name={post.following ? "checkmark" : "add"}
              size={14}
              color={Colors.text}
            />
            <Text style={styles.followText}>
              {post.following ? "Following" : "Follow"}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {post.content ? <Text style={styles.content}>{post.content}</Text> : null}

      {post.routineName ? (
        <Pressable
          onPress={() => post.routineId && onPressRoutine?.(post.routineId)}
          disabled={!post.routineId || !onPressRoutine}
          style={({ pressed }) => [
            styles.routineTag,
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons
            name="barbell-outline"
            size={14}
            color={Colors.textSecondary}
          />
          <Text style={styles.routineText}>{post.routineName}</Text>
        </Pressable>
      ) : null}

      {post.imageUrl ? (
        <Image
          source={{ uri: post.imageUrl }}
          style={[styles.postImage, { aspectRatio }]}
          contentFit="cover"
          onLoad={({ source }) => {
            if (source.width && source.height) {
              const ratio = source.width / source.height;
              setAspectRatio(Math.min(Math.max(ratio, 4 / 5), 16 / 9));
            }
          }}
        />
      ) : null}

      <View style={styles.footer}>
        <Pressable
          onPress={() => onLike?.(post.id)}
          hitSlop={8}
          style={({ pressed }) => [
            styles.footerButton,
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={18}
            color={post.liked ? Colors.danger : Colors.textSecondary}
          />
          <Text style={styles.footerText}>{post.likesCount}</Text>
        </Pressable>

        <Pressable
          onPress={() => onComment?.(post.id)}
          hitSlop={8}
          style={({ pressed }) => [
            styles.footerButton,
            pressed && globalStyles.btnPressed,
          ]}
        >
          <Ionicons
            name="chatbubble-outline"
            size={17}
            color={Colors.textSecondary}
          />
          <Text style={styles.footerText}>{post.commentsCount}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  authorRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm + 2,
  },
  followText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  meta: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  content: {
    fontSize: FontSize.md,
    lineHeight: 22,
    color: Colors.text,
  },
  routineTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceInput,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm + 2,
  },
  routineText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  postImage: {
    width: "100%",
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceInput,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
