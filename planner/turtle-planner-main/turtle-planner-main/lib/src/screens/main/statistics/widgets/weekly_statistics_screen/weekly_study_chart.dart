import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/weekly_statistics_controller.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class WeeklyStudyChart extends StatelessWidget {
  final WeeklyStatisticsController controller;

  const WeeklyStudyChart({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 300,
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Obx(() {
        final dailyStudyTime = controller.getDailyStudyTimeForSelectedWeek();
        return Column(
          children: [
            Text(
              '요일별 학습 시간',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            Expanded(
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  maxY: dailyStudyTime
                      .fold(
                          0,
                          (max, duration) => duration.inMinutes > max
                              ? duration.inMinutes
                              : max)
                      .toDouble(),
                  barTouchData: BarTouchData(
                    touchTooltipData: BarTouchTooltipData(
                      getTooltipItem: (group, groupIndex, rod, rodIndex) {
                        return BarTooltipItem(
                          controller.formatDuration(dailyStudyTime[groupIndex]),
                          const TextStyle(color: Colors.white),
                        );
                      },
                    ),
                  ),
                  titlesData: FlTitlesData(
                    show: true,
                    topTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false)),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          const titles = ['일', '월', '화', '수', '목', '금', '토'];
                          return Text(
                            titles[value.toInt()],
                            style: TextStyle(
                              fontSize: AppSizes.fontSizeSm,
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                            ),
                          );
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 40,
                        getTitlesWidget: (value, meta) {
                          return Text(
                            '${value.toInt()}분',
                            style: TextStyle(
                              fontSize: 10,
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  gridData: const FlGridData(show: false),
                  borderData: FlBorderData(show: false),
                  barGroups: List.generate(7, (index) {
                    return BarChartGroupData(
                      x: index,
                      barRods: [
                        BarChartRodData(
                          toY: dailyStudyTime[index].inMinutes.toDouble(),
                          color: Theme.of(context).colorScheme.primary,
                          width: 16,
                          borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(4)),
                        ),
                      ],
                    );
                  }),
                ),
              ),
            ),
          ],
        );
      }),
    );
  }
}
