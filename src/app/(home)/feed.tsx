import { CreatePostBar } from "@/components/feed/CreatePostBar";
import { FeedPost, PostCard } from "@/components/feed/PostCard";
import {
  Colors,
  FontSize,
  FontWeight,
  globalStyles,
  Spacing,
} from "@/constant/theme";
import { useAuth } from "@/provider/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function FeedScreen() {
  const { session } = useAuth();
  const [posts] = useState<FeedPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: fetch posts from Supabase
    setRefreshing(false);
  }, []);

  const handleCreatePost = () => {};
  const handleAddPhoto = () => {};
  const handleShareRoutine = () => {};

  return (
    <View style={[globalStyles.screenPadded, styles.container]}>
      <Text style={globalStyles.h2}>Feed</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <CreatePostBar
            onCreatePost={handleCreatePost}
            onAddPhoto={handleAddPhoto}
            onShareRoutine={handleShareRoutine}
          />
        }
        ListHeaderComponentStyle={styles.header}
        ListEmptyComponent={
          <View style={[globalStyles.card, styles.emptyCard]}>
            <Ionicons
              name="newspaper-outline"
              size={28}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No posts today</Text>
            <Text style={[globalStyles.bodyMuted, styles.emptyText]}>
              Be the first to share your workout or pull down to refresh.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            isOwnPost={item.authorId === session?.user.id}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  listContent: {
    flexGrow: 1,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  emptyCard: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  emptyText: {
    textAlign: "center",
  },
});
