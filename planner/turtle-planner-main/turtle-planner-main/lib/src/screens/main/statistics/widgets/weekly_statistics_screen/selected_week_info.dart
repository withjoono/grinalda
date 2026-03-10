import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/weekly_statistics_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class SelectedWeekInfo extends StatelessWidget {
  final WeeklyStatisticsController controller;

  const SelectedWeekInfo({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Obx(() {
        final selectedWeek = controller.selectedWeek.value;
        final totalStudyTime = controller.getTotalStudyTimeForSelectedWeek();
        final averageDailyStudyTime =
            controller.getAverageDailyStudyTimeForSelectedWeek();

        return Column(
          children: [
            Text(
              selectedWeek != null
                  ? controller.getFullFormattedDateRange(selectedWeek)
                  : '주를 선택해주세요',
              style: Theme.of(context).textTheme.titleMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        '총 시간',
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.primary,
                          fontSize: AppSizes.fontSizeMd,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        controller.formatDuration(totalStudyTime),
                        style: const TextStyle(
                          fontSize: AppSizes.fontSizeLg,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        '하루 평균',
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.primary,
                          fontSize: AppSizes.fontSizeMd,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        controller.formatDuration(averageDailyStudyTime),
                        style: const TextStyle(
                          fontSize: AppSizes.fontSizeLg,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        );
      }),
    );
  }
}
