import 'package:flutter/material.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class TFilledButtonTheme {
  TFilledButtonTheme._();

  static FilledButtonThemeData light = FilledButtonThemeData(
    style: FilledButton.styleFrom(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(8.0)),
      ),
      iconColor: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: AppSizes.buttonPaddingY),
    ),
  );

  static FilledButtonThemeData dark = FilledButtonThemeData(
      style: FilledButton.styleFrom(
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(8.0)),
    ),
    padding: const EdgeInsets.symmetric(vertical: AppSizes.buttonPaddingY),
  ));
}
