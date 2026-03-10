import "package:flutter/material.dart";
import "package:turtle_planner/src/utils/constants/app_colors.dart";

class TColorTheme {
  static ColorScheme light = ColorScheme.fromSeed(
    seedColor: AppColors.primary,
    brightness: Brightness.light,
    surfaceContainer: Colors.white,
    surface: Colors.grey.shade50,
  );

  static ColorScheme dark = ColorScheme.fromSeed(
    seedColor: AppColors.primary,
    brightness: Brightness.dark,
  );
}
