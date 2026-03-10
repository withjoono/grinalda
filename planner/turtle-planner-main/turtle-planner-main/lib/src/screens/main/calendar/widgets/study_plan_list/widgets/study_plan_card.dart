import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:turtle_planner/src/common_widgets/badges/study_tag_badge_widget.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/controllers/screens/calendar/study_plan_list_controller.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/edit_study_plan/edit_study_plan_page.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class StudyPlanCard extends StatelessWidget {
  final StudyPlanModel studyPlan;
  final StudyPlanListController controller;

  const StudyPlanCard({
    super.key,
    required this.studyPlan,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return InkWell(
      onTap: () => _showOptionsDialog(context),
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        color: colorScheme.surfaceContainer,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      studyPlan.title,
                      style: textTheme.titleMedium,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  _buildStudyTagBadge(studyPlan.tagId),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                "시작일: ${DateFormat('yyyy-MM-dd').format(studyPlan.startDate)}",
                style: textTheme.bodySmall,
              ),
              Text(
                "목표일: ${DateFormat('yyyy-MM-dd').format(studyPlan.goalDate)}",
                style: textTheme.bodySmall,
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: controller.getProgressPercentage(studyPlan),
                backgroundColor: colorScheme.surfaceContainerHighest,
                valueColor: AlwaysStoppedAnimation<Color>(
                  Helper.getProgressColor(
                      controller.getProgressPercentage(studyPlan)),
                ),
                minHeight: 6,
              ),
              const SizedBox(height: 4),
              Text(
                "${(controller.getProgressPercentage(studyPlan) * 100).toStringAsFixed(1)}% (${studyPlan.completedAmount}/${studyPlan.totalAmount} ${studyPlan.unit})",
                style: textTheme.bodySmall,
                textAlign: TextAlign.right,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStudyTagBadge(String tagId) {
    final tag = controller.getStudyTagById(tagId);
    return StudyTagBadgeWidget(
      text: tag?.name ?? '미정',
      color: tag?.color ?? Colors.grey,
      size: BadgeSize.sm,
    );
  }

  void _showOptionsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('학습 계획 옵션'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.edit),
                title: const Text('학습 계획 수정'),
                onTap: () {
                  Navigator.of(context).pop();
                  Get.to(() => EditStudyPlanPage(studyPlan: studyPlan));
                },
              ),
              ListTile(
                leading: const Icon(Icons.delete),
                title: const Text('학습 계획 삭제'),
                onTap: () {
                  Navigator.of(context).pop();
                  _showDeleteConfirmationDialog(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showDeleteConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('학습 계획 삭제'),
          content: const Text('삭제하면 해당 학습 계획의 기록들도 모두 삭제돼요. 정말 삭제할까요?'),
          actions: [
            TextButton(
              child: const Text('취소'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: const Text('삭제하기'),
              onPressed: () {
                Navigator.of(context).pop();
                controller.deleteStudyPlan(studyPlan.id);
              },
            ),
          ],
        );
      },
    );
  }
}
