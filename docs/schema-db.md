## Table `users`

users table

### Columns

| Name         | Type          | Constraints |
| ------------ | ------------- | ----------- |
| `user_uid`   | `uuid`        | Primary     |
| `username`   | `varchar`     | Unique      |
| `created_at` | `timestamptz` |             |
| `full_name`  | `varchar`     |             |
| `bio`        | `text`        | Nullable    |
| `avatar_url` | `text`        | Nullable    |

## Table `posts`

### Columns

| Name         | Type          | Constraints |
| ------------ | ------------- | ----------- |
| `post_id`    | `uuid`        | Primary     |
| `user_uid`   | `uuid`        |             |
| `message`    | `text`        | Nullable    |
| `photo_url`  | `text`        | Nullable    |
| `created_at` | `timestamptz` |             |
| `routine_id` | `uuid`        | Nullable    |

## Table `likes_post`

### Columns

| Name         | Type          | Constraints |
| ------------ | ------------- | ----------- |
| `created_at` | `timestamptz` |             |
| `post_id`    | `uuid`        | Primary     |
| `user_uid`   | `uuid`        | Primary     |

## Table `user_saved_exercises`

exercises saved by user

### Columns

| Name                    | Type          | Constraints |
| ----------------------- | ------------- | ----------- |
| `save_id`               | `uuid`        | Primary     |
| `user_uid`              | `uuid`        |             |
| `created_at`            | `timestamptz` |             |
| `exercise_id`           | `varchar`     |             |
| `exercise_name`         | `varchar`     |             |
| `exercise_muscle_group` | `varchar`     |             |
| `exercise_image`        | `text`        | Nullable    |

## Table `following_list`

### Columns

| Name           | Type          | Constraints |
| -------------- | ------------- | ----------- |
| `following_id` | `uuid`        | Primary     |
| `follower_id`  | `uuid`        | Primary     |
| `created_at`   | `timestamptz` |             |

## Table `routines`

routine's playlist

### Columns

| Name         | Type          | Constraints |
| ------------ | ------------- | ----------- |
| `routine_id` | `uuid`        | Primary     |
| `created_at` | `timestamptz` |             |
| `user_uid`   | `uuid`        |             |
| `name`       | `varchar`     |             |

## Table `routine_exercises`

routine saved in a playlist

### Columns

| Name                    | Type          | Constraints |
| ----------------------- | ------------- | ----------- |
| `id`                    | `uuid`        | Primary     |
| `routine_id`            | `uuid`        |             |
| `user_uid`              | `uuid`        |             |
| `exercise_image`        | `text`        | Nullable    |
| `created_at`            | `timestamptz` |             |
| `exercise_name`         | `varchar`     |             |
| `exercise_id`           | `varchar`     |             |
| `exercise_muscle_group` | `varchar`     |             |

## Table `post_comments`

### Columns

| Name                | Type          | Constraints |
| ------------------- | ------------- | ----------- |
| `comment_id`        | `uuid`        | Primary     |
| `post_id`           | `uuid`        |             |
| `user_uid`          | `uuid`        |             |
| `parent_comment_id` | `uuid`        | Nullable    |
| `content`           | `text`        |             |
| `created_at`        | `timestamptz` |             |

## RLS Policies

### `routines`

| Policy                                  | Command | Roles         | Action     | USING                     | WITH CHECK                |
| --------------------------------------- | ------- | ------------- | ---------- | ------------------------- | ------------------------- |
| `Authenticated users can view routines` | SELECT  | authenticated | PERMISSIVE | `true`                    | —                         |
| `Users can manage own routines`         | ALL     | authenticated | PERMISSIVE | `(auth.uid() = user_uid)` | `(auth.uid() = user_uid)` |

### `routine_exercises`

| Policy                                           | Command | Roles         | Action     | USING                     | WITH CHECK                |
| ------------------------------------------------ | ------- | ------------- | ---------- | ------------------------- | ------------------------- |
| `Authenticated users can view routine exercises` | SELECT  | authenticated | PERMISSIVE | `true`                    | —                         |
| `Users can manage own routine exercises`         | ALL     | authenticated | PERMISSIVE | `(auth.uid() = user_uid)` | `(auth.uid() = user_uid)` |

### `users`

| Policy                                  | Command | Roles         | Action     | USING                     | WITH CHECK                |
| --------------------------------------- | ------- | ------------- | ---------- | ------------------------- | ------------------------- |
| `Authenticated users can view profiles` | SELECT  | authenticated | PERMISSIVE | `true`                    | —                         |
| `Users can update own profile`          | UPDATE  | authenticated | PERMISSIVE | `(auth.uid() = user_uid)` | `(auth.uid() = user_uid)` |

### `likes_post`

| Policy                               | Command | Roles         | Action     | USING                     | WITH CHECK                |
| ------------------------------------ | ------- | ------------- | ---------- | ------------------------- | ------------------------- |
| `Authenticated users can view likes` | SELECT  | authenticated | PERMISSIVE | `true`                    | —                         |
| `Users can like posts`               | INSERT  | authenticated | PERMISSIVE | —                         | `(auth.uid() = user_uid)` |
| `Users can unlike own likes`         | DELETE  | authenticated | PERMISSIVE | `(auth.uid() = user_uid)` | —                         |

### `post_comments`

| Policy                                  | Command | Roles         | Action     | USING                     | WITH CHECK                |
| --------------------------------------- | ------- | ------------- | ---------- | ------------------------- | ------------------------- |
| `Authenticated users can view comments` | SELECT  | authenticated | PERMISSIVE | `true`                    | —                         |
| `Users can create own comments`         | INSERT  | authenticated | PERMISSIVE | —                         | `(auth.uid() = user_uid)` |
| `Users can delete own comments`         | DELETE  | authenticated | PERMISSIVE | `(auth.uid() = user_uid)` | —                         |

### `posts`

| Policy                               | Command | Roles         | Action     | USING                     | WITH CHECK                |
| ------------------------------------ | ------- | ------------- | ---------- | ------------------------- | ------------------------- |
| `Authenticated users can view posts` | SELECT  | authenticated | PERMISSIVE | `true`                    | —                         |
| `Users can create own posts`         | INSERT  | authenticated | PERMISSIVE | —                         | `(auth.uid() = user_uid)` |
| `Users can delete own posts`         | DELETE  | authenticated | PERMISSIVE | `(auth.uid() = user_uid)` | —                         |
| `Users can update own posts`         | UPDATE  | authenticated | PERMISSIVE | `(auth.uid() = user_uid)` | `(auth.uid() = user_uid)` |

### `user_saved_exercises`

| Policy                                 | Command | Roles         | Action     | USING                     | WITH CHECK                |
| -------------------------------------- | ------- | ------------- | ---------- | ------------------------- | ------------------------- |
| `Users can manage own saved exercises` | ALL     | authenticated | PERMISSIVE | `(auth.uid() = user_uid)` | `(auth.uid() = user_uid)` |

### `following_list`

| Policy                                 | Command | Roles         | Action     | USING                        | WITH CHECK                   |
| -------------------------------------- | ------- | ------------- | ---------- | ---------------------------- | ---------------------------- |
| `Authenticated users can view follows` | SELECT  | authenticated | PERMISSIVE | `true`                       | —                            |
| `Users can follow others`              | INSERT  | authenticated | PERMISSIVE | —                            | `(auth.uid() = follower_id)` |
| `Users can unfollow others`            | DELETE  | authenticated | PERMISSIVE | `(auth.uid() = follower_id)` | —                            |
