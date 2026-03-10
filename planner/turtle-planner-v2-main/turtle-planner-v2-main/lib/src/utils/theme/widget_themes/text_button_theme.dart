import 'package:flutter/material.dart';
import 'package:turtle_planner_v2/src/utils/constants/app_sizes.dart';

class TTextButtonTheme {
  TTextButtonTheme._();

  static final light = TextButtonThemeData(
    style: TextButton.styleFrom(
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

  static final dark = TextButtonThemeData(
    style: TextButton.styleFrom(
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
