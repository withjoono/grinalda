import 'package:flutter/material.dart';
import 'package:turtle_planner_v2/src/utils/theme/widget_themes/color_theme.dart';
import 'package:turtle_planner_v2/src/utils/theme/widget_themes/elevated_button_theme.dart';
import 'package:turtle_planner_v2/src/utils/theme/widget_themes/filled_button_theme.dart';
import 'package:turtle_planner_v2/src/utils/theme/widget_themes/input_decoration_theme.dart';
import 'package:turtle_planner_v2/src/utils/theme/widget_themes/outlined_button_theme.dart';
import 'package:turtle_planner_v2/src/utils/theme/widget_themes/text_button_theme.dart';
import 'package:turtle_planner_v2/src/utils/theme/widget_themes/text_theme.dart';

class TAppTheme {
  TAppTheme._();

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: TColorTheme.light,
    textTheme: TTextTheme.light,
    outlinedButtonTheme: TOutlinedButtonTheme.light,
    elevatedButtonTheme: TElevatedButtonTheme.light,
    filledButtonTheme: TFilledButtonTheme.light,
    inputDecorationTheme: TInputDecorationTheme.light,
    textButtonTheme: TTextButtonTheme.light,
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: TColorTheme.dark,
    textTheme: TTextTheme.dark,
    outlinedButtonTheme: TOutlinedButtonTheme.dark,
    filledButtonTheme: TFilledButtonTheme.dark,
    inputDecorationTheme: TInputDecorationTheme.dark,
    textButtonTheme: TTextButtonTheme.dark,
  );
}
