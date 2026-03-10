import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/weekly_statistics_controller.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/weekly_statistics_screen/selected_week_info.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/weekly_statistics_screen/week_grid.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/weekly_statistics_screen/weekly_study_chart.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/weekly_statistics_screen/tag_study_ratio_chart.dart';

class WeeklyStatisticsScreen extends StatelessWidget {
  const WeeklyStatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(WeeklyStatisticsController());
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                _buildWeekGridWithHeader(context, controller),
                const SizedBox(height: 16),
                SelectedWeekInfo(controller: controller),
                const SizedBox(height: 16),
                WeeklyStudyChart(controller: controller),
                const SizedBox(height: 16),
                TagStudyRatioChart(controller: controller),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildWeekGridWithHeader(
      BuildContext context, WeeklyStatisticsController controller) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          _buildHeader(context, controller),
          WeekGrid(controller: controller),
        ],
      ),
    );
  }

  Widget _buildHeader(
      BuildContext context, WeeklyStatisticsController controller) {
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left),
            onPressed: () => controller.moveQuarter(false),
          ),
          Obx(() => Text(
                '${controller.selectedYear.value}년 ${controller.selectedQuarter.value}분기',
                style: Theme.of(context).textTheme.titleMedium,
              )),
          IconButton(
            icon: const Icon(Icons.chevron_right),
            onPressed: () => controller.moveQuarter(true),
          ),
        ],
      ),
    );
  }
}
