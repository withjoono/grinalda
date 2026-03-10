import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/home/home_controller.dart';

class WeeklyDateSelectorItemWidget extends StatelessWidget {
  final DateTime date;
  final double itemWidth;

  const WeeklyDateSelectorItemWidget({
    super.key,
    required this.date,
    required this.itemWidth,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final controller = Get.find<HomeController>();
    final isDisabled = date.isAfter(DateTime.now());

    return SizedBox(
      width: itemWidth,
      child: Column(
        children: [
          Obx(() {
            final isSelected =
                date.year == controller.selectedDate.value.year &&
                    date.month == controller.selectedDate.value.month &&
                    date.day == controller.selectedDate.value.day;

            return GestureDetector(
              onTap: isDisabled ? null : () => controller.setSelectedDate(date),
              child: Opacity(
                opacity: isDisabled ? 0.5 : 1.0,
                child: Container(
                  width: itemWidth,
                  height: 70,
                  decoration: BoxDecoration(
                    color:
                        isSelected ? colorScheme.primary : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        controller.getKoreanWeekday(date),
                        style: TextStyle(
                          color: isSelected
                              ? colorScheme.onPrimary
                              : colorScheme.onSurface,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isSelected
                              ? colorScheme.onPrimary
                              : colorScheme.surface,
                        ),
                        child: Center(
                          child: Text(
                            '${date.day}',
                            style: TextStyle(
                              color: isSelected
                                  ? colorScheme.primary
                                  : colorScheme.onSurfaceVariant,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
          const SizedBox(height: 4),
          SizedBox(
            height: 20,
            child: controller.isToday(date)
                ? Text(
                    'Today',
                    style: TextStyle(
                      color: colorScheme.primary,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  )
                : null,
          ),
        ],
      ),
    );
  }
}
