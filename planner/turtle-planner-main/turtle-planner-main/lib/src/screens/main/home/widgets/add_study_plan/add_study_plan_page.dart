import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/inputs/title_input_widget.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/add_study_plan_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';
import 'study_settings_section_widget.dart';
import 'time_settings_section_widget.dart';

class AddStudyPlanPage extends StatelessWidget {
  const AddStudyPlanPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(AddStudyPlanController());

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Get.back(),
        ),
        title: const Text('새 학습 계획 추가'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Obx(() => TitleInputWidget(
                  initialValue: controller.title.value,
                  placeholder: '예) 문제집 풀이',
                  size: InputSize.md,
                  onChanged: controller.updateTitle,
                )),
            const SizedBox(height: 20),
            Obx(() => StudySettingsSectionWidget(
                  selectedTag: controller.selectedTag,
                  selectedUnit: controller.selectedUnit.value,
                  totalAmount: controller.totalAmount.value,
                  onUnitChanged: controller.updateSelectedUnit,
                  onTotalAmountChanged: controller.updateTotalAmount,
                )),
            const SizedBox(height: 20),
            Obx(() => TimeSettingsSectionWidget(
                  startDate: controller.startDate.value,
                  goalDate: controller.goalDate.value,
                  selectedDays: controller.selectedDays.toList(),
                  onStartDateChanged: controller.updateStartDate,
                  onGoalDateChanged: controller.updateGoalDate,
                  onSelectedDaysChanged: controller.updateSelectedDays,
                )),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: controller.addStudyPlan,
        child: const Icon(Icons.check),
      ),
    );
  }
}
