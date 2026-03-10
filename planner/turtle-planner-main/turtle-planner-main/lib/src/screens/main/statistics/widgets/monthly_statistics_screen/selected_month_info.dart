import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/monthly_statistics_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class SelectedMonthInfo extends StatelessWidget {
  final MonthlyStatisticsController controller;

  const SelectedMonthInfo({super.key, required this.controller});

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
        final totalStudyTime = controller.getTotalStudyTimeForSelectedMonth();
        final averageDailyStudyTime =
            controller.getAverageDailyStudyTimeForSelectedMonth();

        return Column(
          children: [
            Text(
              controller.getFormattedMonthRange(),
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
