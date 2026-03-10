import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/weekly_statistics_controller.dart';

class WeekGrid extends StatelessWidget {
  final WeeklyStatisticsController controller;

  const WeekGrid({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final weekRanges = controller.weekRanges;
      return GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 5,
          childAspectRatio: 0.9,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemCount: weekRanges.length,
        itemBuilder: (context, index) {
          final week = weekRanges[index];
          return Obx(() {
            final isSelected = controller.isWeekSelected(week);
            final studyTime = controller.getWeeklyTotalStudyTime(week);
            return InkWell(
              onTap: () => controller.selectWeek(week),
              child: Container(
                decoration: BoxDecoration(
                  color: isSelected
                      ? Theme.of(context).colorScheme.primary
                      : Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      controller.getFormattedDateRange(week),
                      style: TextStyle(
                        color: isSelected
                            ? Theme.of(context).colorScheme.onPrimary
                            : Theme.of(context).colorScheme.onSurface,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      studyTime > Duration.zero
                          ? controller.formatDuration(studyTime)
                          : '',
                      style: TextStyle(
                        color: isSelected
                            ? Theme.of(context).colorScheme.onPrimary
                            : Theme.of(context).colorScheme.onSurface,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            );
          });
        },
      );
    });
  }
}
