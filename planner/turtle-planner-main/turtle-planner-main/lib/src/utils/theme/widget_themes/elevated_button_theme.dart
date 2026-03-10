import 'package:flutter/material.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class TElevatedButtonTheme {
  TElevatedButtonTheme._();

  static final light = ElevatedButtonThemeData(
    style: OutlinedButton.styleFrom(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(
          Radius.circular(8.0),
        ),
      ),
      padding: const EdgeInsets.symmetric(
        vertical: AppSizes.buttonPaddingY,
      ),
    ),
  );

  static final dark = ElevatedButtonThemeData(
    style: OutlinedButton.styleFrom(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(
          Radius.circular(8.0),
        ),
      ),
      padding: const EdgeInsets.symmetric(
        vertical: AppSizes.buttonPaddingY,
      ),
    ),
  );
}
