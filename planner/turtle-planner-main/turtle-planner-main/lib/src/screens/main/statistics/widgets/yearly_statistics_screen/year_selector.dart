import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/statistics/yearly_statistics_controller.dart';

class YearSelector extends StatelessWidget {
  final YearlyStatisticsController controller;

  const YearSelector({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Obx(() => controller.canMoveBack()
                ? IconButton(
                    icon: const Icon(Icons.chevron_left),
                    onPressed: () => controller.moveYear(false),
                  )
                : const SizedBox(width: 48)), // IconButton의 너비와 동일하게 설정
            Obx(() => Text(
                  controller.getFormattedYearRange(),
                  style: Theme.of(context).textTheme.titleMedium,
                )),
            Obx(() => controller.canMoveForward()
                ? IconButton(
                    icon: const Icon(Icons.chevron_right),
                    onPressed: () => controller.moveYear(true),
                  )
                : const SizedBox(width: 48)), // IconButton의 너비와 동일하게 설정
          ],
        ),
      ),
    );
  }
}
