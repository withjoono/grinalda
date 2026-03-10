import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/yearly_statistics_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class SelectedYearInfo extends StatelessWidget {
  final YearlyStatisticsController controller;

  const SelectedYearInfo({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Obx(() {
        final totalStudyTime = controller.getTotalStudyTimeForYear();
        final averageDailyStudyTime =
            controller.getAverageDailyStudyTimeForYear();

        return Column(
          children: [
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
