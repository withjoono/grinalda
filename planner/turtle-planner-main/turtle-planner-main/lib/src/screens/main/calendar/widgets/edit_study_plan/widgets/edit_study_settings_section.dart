import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/labels/form_label_widget.dart';
import 'package:turtle_planner/src/common_widgets/selectors/box_selector_widget.dart';
import 'package:turtle_planner/src/common_widgets/badges/study_tag_badge_widget.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/edit_study_plan_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';

class EditStudySettingsSectionWidget extends StatelessWidget {
  const EditStudySettingsSectionWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<EditStudyPlanController>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const FormLabelWidget(
          text: '학습 설정',
          size: LabelSize.md,
        ),
        const SizedBox(height: 10),
        Obx(
          () => BoxSelectorWidget(
            label: '🏷️ 학습 태그',
            value: StudyTagBadgeWidget(
              text: controller.selectedTag.value.name,
              color: controller.selectedTag.value.color,
            ),
            onTap: () => controller.showStudyTagSelector(),
            labelSize: LabelSize.md,
          ),
        ),
        const SizedBox(height: 10),
        Obx(
          () => BoxSelectorWidget(
            label: '📏 학습 단위',
            value: controller.selectedUnit.value,
            onTap: () => controller.showUnitSelector(),
            labelSize: LabelSize.md,
          ),
        ),
        const SizedBox(height: 10),
        Obx(
          () => BoxSelectorWidget(
            label: '🔥 총 학습량',
            value:
                '${controller.totalAmount.value} ${controller.selectedUnit.value}',
            onTap: () => controller.showTotalAmountInputDialog(),
            labelSize: LabelSize.md,
          ),
        ),
      ],
    );
  }
}
