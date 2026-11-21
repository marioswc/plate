import { StyleSheet } from "react-native";

export const Colors = {
  background: "#000000",
  buttonDisabled: "#4d4d50",
  surface: "#121214",
  surfaceInput: "#1C1C1E",
  border: "#2C2C2E",

  primary: "#FFFFFF",
  onPrimary: "#000000",

  text: "#FFFFFF",
  textSecondary: "#8E8E93",
  textMuted: "#5E5E63",

  danger: "#FF453A",
  success: "#30D158",
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  display: 30,
} as const;

export const FontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const globalStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  colError: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenPadded: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceInput,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  inputText: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    paddingVertical: 0,
  },
  inputIcon: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
  },
  inputCheckbox: {
    width: 14,
    height: 14,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: Colors.onPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  refButtonText: {
    color: Colors.text,
    fontWeight: FontWeight.semibold,
    textDecorationLine: "underline",
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  btnDisabled: {
    backgroundColor: Colors.buttonDisabled,
    opacity: 0.4,
  },
  h1: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.5,
    textTransform: "capitalize",
  },
  h2: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  body: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  bodyMuted: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  bodyError: {
    fontSize: FontSize.sm,
    color: Colors.danger,
  },
  caption: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});

export const theme = {
  colors: Colors,
  fontSize: FontSize,
  fontWeight: FontWeight,
  spacing: Spacing,
  radius: Radius,
  styles: globalStyles,
} as const;
