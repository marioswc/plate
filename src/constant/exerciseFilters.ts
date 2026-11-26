export type FilterType = "level" | "primaryMuscles" | "force";

export interface FilterOption {
  value: string;
  label: string;
}

export const LEVEL_OPTIONS: FilterOption[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

export const MUSCLE_OPTIONS: FilterOption[] = [
  { value: "chest", label: "Chest" },
  { value: "abdominals", label: "Abdominals" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "shoulders", label: "Shoulders" },
  { value: "quadriceps", label: "Quadriceps" },
];

export const FORCE_OPTIONS: FilterOption[] = [
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
  { value: "static", label: "Static" },
];

export function getFilterLabel(
  options: FilterOption[],
  value: string | null,
  fallback: string,
) {
  const found = options.find((item) => item.value === value);
  return found ? found.label : fallback;
}
