import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter_vertical_heatmap/flutter_vertical_heatmap.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/yearly_statistics_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner/src/utils/helper/device_helper.dart';

class YearlyHeatmap extends StatelessWidget {
  final YearlyStatisticsController controller;

  const YearlyHeatmap({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final isDarkMode = DeviceHelper.isDarkMode(context);

    return Obx(() => HeatMap(
          startDate: DateTime(controller.selectedYear.value, 1, 1),
          endDate: controller.getEndDate(),
          datasets: controller.datasets.value,
          defaultColor: isDarkMode ? Colors.white10 : Colors.white,
          monthLabel: const [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월",
          ],
          weekLabel: const ["일", "월", "화", "수", "목", "금", "토"],
          colorTipLabel: const ["0~1h", "1~3h", "3~5h", "5h+"],
          colorTipSize: 20,
          margin: const EdgeInsets.all(3),
          size: 32,
          colorsets: const {
            1: Color(0xFFF0F4C3), // Lime 100
            61: Color(0xFFDCE775), // Lime 300
            181: Color(0xFFCDDC39), // Lime 500
            301: Color(0xFFAFB42B), // Lime 700
          },
          onClick: (value) async {
            ScaffoldMessenger.of(context).clearSnackBars();
            String formattedDate = value.toString().split(" ")[0];
            String studyTime = controller.getFormattedStudyTimeForDate(value);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      formattedDate,
                      style: const TextStyle(
                        fontSize: AppSizes.fontSizeSm,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      studyTime,
                      style: const TextStyle(
                        fontSize: AppSizes.fontSizeMd,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ));
  }
}
