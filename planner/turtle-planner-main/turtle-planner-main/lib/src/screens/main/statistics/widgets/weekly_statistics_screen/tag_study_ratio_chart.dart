import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/weekly_statistics_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner/src/utils/helper/device_helper.dart';

class TagStudyRatioChart extends StatelessWidget {
  final WeeklyStatisticsController controller;

  const TagStudyRatioChart({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final availableWidth = DeviceHelper.getScreenWidth(context);
    final chartSize = availableWidth * 0.4; // 차트 크기를 화면 너비의 40%로 설정

    return Container(
      height: 300,
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '태그별 학습 비율',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: AppSizes.xl),
          Expanded(
            child: Obx(() {
              final tagStudyInfoList =
                  controller.getTagStudyInfoForSelectedWeek();
              if (tagStudyInfoList.isEmpty) {
                return const Center(child: Text('이 주에 학습 기록이 없습니다.'));
              }
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    width: chartSize,
                    height: chartSize,
                    child: PieChart(
                      PieChartData(
                        sections: tagStudyInfoList
                            .map((info) => PieChartSectionData(
                                  color: Color(info.tag.colorValue),
                                  value: info.percentage,
                                  title:
                                      '${info.percentage.toStringAsFixed(1)}%',
                                  radius: chartSize / 2,
                                  titleStyle: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ))
                            .toList(),
                        sectionsSpace: 0,
                        centerSpaceRadius: 0,
                        startDegreeOffset: -90,
                      ),
                    ),
                  ),
                  Flexible(
                    child: Padding(
                      padding: const EdgeInsets.only(left: 16.0),
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: tagStudyInfoList.map((info) {
                            return Padding(
                              padding:
                                  const EdgeInsets.symmetric(vertical: 8.0),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    width: 16,
                                    height: 16,
                                    color: Color(info.tag.colorValue),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          info.tag.name,
                                          style: const TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.bold),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          '${controller.formatDuration(info.duration)} (${info.percentage.toStringAsFixed(1)}%)',
                                          style: const TextStyle(fontSize: 12),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                  ),
                ],
              );
            }),
          ),
        ],
      ),
    );
  }
}
