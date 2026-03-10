import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/yearly_statistics_controller.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/yearly_statistics_screen/year_selector.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/yearly_statistics_screen/yearly_heatmap.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/yearly_statistics_screen/selected_year_info.dart';

class YearlyStatisticsScreen extends StatelessWidget {
  const YearlyStatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(YearlyStatisticsController());
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                YearSelector(controller: controller),
                SelectedYearInfo(controller: controller),
                const SizedBox(height: 16),
                YearlyHeatmap(controller: controller),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
