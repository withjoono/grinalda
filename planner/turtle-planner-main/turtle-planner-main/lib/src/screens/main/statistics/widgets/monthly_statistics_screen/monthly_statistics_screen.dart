import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/monthly_statistics_controller.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/monthly_statistics_screen/selected_month_info.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/monthly_statistics_screen/month_grid.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/monthly_statistics_screen/monthly_study_chart.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/monthly_statistics_screen/tag_study_ratio_chart.dart';

class MonthlyStatisticsScreen extends StatelessWidget {
  const MonthlyStatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(MonthlyStatisticsController());
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                _buildMonthGridWithHeader(context, controller),
                const SizedBox(height: 16),
                SelectedMonthInfo(controller: controller),
                const SizedBox(height: 16),
                MonthlyStudyChart(controller: controller),
                const SizedBox(height: 16),
                TagStudyRatioChart(controller: controller),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMonthGridWithHeader(
      BuildContext context, MonthlyStatisticsController controller) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          _buildHeader(context, controller),
          MonthGrid(controller: controller),
        ],
      ),
    );
  }

  Widget _buildHeader(
      BuildContext context, MonthlyStatisticsController controller) {
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left),
            onPressed: () => controller.moveYear(false),
          ),
          Obx(() => Text(
                '${controller.selectedYear.value}년',
                style: Theme.of(context).textTheme.titleMedium,
              )),
          IconButton(
            icon: const Icon(Icons.chevron_right),
            onPressed: () => controller.moveYear(true),
          ),
        ],
      ),
    );
  }
}
