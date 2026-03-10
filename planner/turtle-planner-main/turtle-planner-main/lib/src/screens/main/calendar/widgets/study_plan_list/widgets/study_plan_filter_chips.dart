import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/selectors/filter_chip_selector_widget.dart';
import 'package:turtle_planner/src/controllers/screens/calendar/study_plan_list_controller.dart';

class StudyPlanFilterChips extends StatelessWidget {
  final StudyPlanListController controller;

  const StudyPlanFilterChips({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Obx(() => Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
          child: SizedBox(
            width: double.infinity,
            child: Wrap(
              spacing: 8.0,
              runSpacing: 8.0,
              alignment: WrapAlignment.start,
              children: [
                _buildFilterChip('진행중', 'inProgress'),
                _buildFilterChip('완료됨', 'completed'),
                _buildFilterChip('예정', 'planned'),
              ],
            ),
          ),
        ));
  }

  Widget _buildFilterChip(String label, String value) {
    return FilterChipSelectorWidget(
      label: label,
      isSelected: controller.filterStatus.value == value,
      onSelected: () => controller.filterStatus.value = value,
      selectedColor: Get.theme.colorScheme.primaryContainer,
      checkmarkColor: Get.theme.colorScheme.onPrimaryContainer,
    );
  }
}
