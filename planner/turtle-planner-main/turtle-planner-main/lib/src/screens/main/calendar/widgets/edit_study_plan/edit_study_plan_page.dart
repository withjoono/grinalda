import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/inputs/title_input_widget.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/edit_study_plan/widgets/edit_study_settings_section.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/edit_study_plan/widgets/edit_time_settings_section.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';
import "package:turtle_planner/src/controllers/core/study_plan/edit_study_plan_controller.dart";

class EditStudyPlanPage extends StatelessWidget {
  final StudyPlanModel studyPlan;

  const EditStudyPlanPage({super.key, required this.studyPlan});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(EditStudyPlanController(studyPlan));
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Get.back(),
        ),
        title: const Text('학습 계획 수정'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Obx(
              () => TitleInputWidget(
                initialValue: controller.title.value,
                placeholder: '예) 문제집 풀이',
                size: InputSize.md,
                onChanged: controller.updateTitle,
              ),
            ),
            const SizedBox(height: 20),
            const EditStudySettingsSectionWidget(),
            const SizedBox(height: 20),
            const EditTimeSettingsSectionWidget(),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: controller.updateStudyPlan,
        child: const Icon(Icons.check),
      ),
    );
  }
}
