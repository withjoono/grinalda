import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:turtle_planner/src/common_widgets/labels/form_label_widget.dart';
import 'package:turtle_planner/src/common_widgets/selectors/box_selector_widget.dart';
import 'package:turtle_planner/src/common_widgets/selectors/weekday_selector_widget.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/edit_study_plan_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';

class EditTimeSettingsSectionWidget extends StatelessWidget {
  const EditTimeSettingsSectionWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<EditStudyPlanController>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const FormLabelWidget(
          text: '시간 설정',
          size: LabelSize.md,
        ),
        Obx(
          () => BoxSelectorWidget(
            label: '🐤 시작일',
            value: DateFormat('yyyy-MM-dd').format(controller.startDate.value),
            onTap: () => controller.showDatePicker(true),
            labelSize: LabelSize.md,
          ),
        ),
        const SizedBox(height: 10),
        Obx(
          () => BoxSelectorWidget(
            label: '🐔 목표일',
            value: DateFormat('yyyy-MM-dd').format(controller.goalDate.value),
            onTap: () => controller.showDatePicker(false),
            labelSize: LabelSize.md,
          ),
        ),
        const SizedBox(height: 20),
        Obx(
          () => WeekdaySelectorWidget(
            selectedDays: controller.selectedDays.toList(),
            onSelectionChanged: controller.updateSelectedDays,
          ),
        ),
      ],
    );
  }
}
