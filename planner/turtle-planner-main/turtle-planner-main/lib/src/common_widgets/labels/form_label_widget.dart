import 'package:flutter/material.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';

class FormLabelWidget extends StatelessWidget {
  final String text;
  final LabelSize size;

  const FormLabelWidget({
    super.key,
    required this.text,
    this.size = LabelSize.md,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;

    TextStyle getStyleForSize() {
      switch (size) {
        case LabelSize.sm:
          return theme.textTheme.bodySmall!;
        case LabelSize.md:
          return theme.textTheme.bodyMedium!;
        case LabelSize.lg:
          return theme.textTheme.bodyLarge!;
      }
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        text,
        style: getStyleForSize().copyWith(
          fontWeight: FontWeight.w600,
          color: isDarkMode ? Colors.white70 : Colors.black54,
        ),
      ),
    );
  }
}
