import 'package:flutter/material.dart';

class WeekdaySelectorWidget extends StatelessWidget {
  final List<int> selectedDays;
  final Function(List<int>) onSelectionChanged;
  final double? circleSize;

  const WeekdaySelectorWidget({
    super.key,
    required this.selectedDays,
    required this.onSelectionChanged,
    this.circleSize,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final isDarkMode = theme.brightness == Brightness.dark;

    final unselectedColor = isDarkMode
        ? colorScheme.onSurface.withOpacity(0.6)
        : colorScheme.onSurface.withOpacity(0.4);

    return LayoutBuilder(
      builder: (context, constraints) {
        final maxWidth = constraints.maxWidth;
        final itemWidth = (maxWidth - 12) / 7; // 12는 여백을 위한 값
        final finalCircleSize =
            circleSize ?? (itemWidth > 45 ? 45.0 : itemWidth);
        final fontSize =
            finalCircleSize < 30 ? 10.0 : (finalCircleSize < 40 ? 12.0 : 14.0);

        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(7, (index) {
            final weekday = ['일', '월', '화', '수', '목', '금', '토'][index];
            final isSelected = selectedDays.contains(index);
            return GestureDetector(
              onTap: () {
                List<int> newSelection = List.from(selectedDays);
                if (isSelected) {
                  newSelection.remove(index);
                } else {
                  newSelection.add(index);
                }
                onSelectionChanged(newSelection);
              },
              child: Container(
                width: finalCircleSize,
                height: finalCircleSize,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isSelected
                      ? colorScheme.primary
                      : colorScheme.surfaceContainer,
                ),
                child: Center(
                  child: Text(
                    weekday,
                    style: TextStyle(
                      color:
                          isSelected ? colorScheme.onPrimary : unselectedColor,
                      fontWeight: FontWeight.bold,
                      fontSize: fontSize,
                    ),
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}
