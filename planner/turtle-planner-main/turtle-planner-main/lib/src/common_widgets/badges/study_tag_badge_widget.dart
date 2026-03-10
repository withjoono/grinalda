import 'package:flutter/material.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';

class StudyTagBadgeWidget extends StatelessWidget {
  final String text;
  final Color color;
  final Color? textColor;
  final BadgeSize size;

  const StudyTagBadgeWidget({
    super.key,
    required this.text,
    required this.color,
    this.textColor,
    this.size = BadgeSize.md,
  });

  @override
  Widget build(BuildContext context) {
    EdgeInsets getPaddingForSize() {
      switch (size) {
        case BadgeSize.sm:
          return const EdgeInsets.symmetric(horizontal: 6, vertical: 1);
        case BadgeSize.md:
          return const EdgeInsets.symmetric(horizontal: 8, vertical: 2);
        case BadgeSize.lg:
          return const EdgeInsets.symmetric(horizontal: 10, vertical: 3);
      }
    }

    double getFontSizeForSize() {
      switch (size) {
        case BadgeSize.sm:
          return 10;
        case BadgeSize.md:
          return 12;
        case BadgeSize.lg:
          return 14;
      }
    }

    return Container(
      padding: getPaddingForSize(),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(
          color: color,
          width: 1,
        ),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: textColor ?? color,
          fontSize: getFontSizeForSize(),
          fontWeight: FontWeight.normal,
        ),
      ),
    );
  }
}
