import 'package:flutter/material.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';

class BoxSelectorWidget extends StatelessWidget {
  final String label;
  final dynamic value;
  final VoidCallback onTap;
  final LabelSize labelSize;

  const BoxSelectorWidget({
    super.key,
    required this.label,
    required this.value,
    required this.onTap,
    this.labelSize = LabelSize.md,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final isDarkMode = theme.brightness == Brightness.dark;

    TextStyle getLabelStyle() {
      switch (labelSize) {
        case LabelSize.sm:
          return theme.textTheme.bodySmall!;
        case LabelSize.md:
          return theme.textTheme.bodyMedium!;
        case LabelSize.lg:
          return theme.textTheme.bodyLarge!;
      }
    }

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: colorScheme.surfaceContainer,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                label,
                style: getLabelStyle().copyWith(
                  fontWeight: FontWeight.w700,
                  color: isDarkMode ? Colors.white : Colors.black,
                ),
              ),
            ),
            if (value is Widget)
              value
            else
              Text(
                value.toString(),
                style: getLabelStyle().copyWith(
                  fontWeight: FontWeight.w400,
                  color: isDarkMode ? Colors.white70 : Colors.black54,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
