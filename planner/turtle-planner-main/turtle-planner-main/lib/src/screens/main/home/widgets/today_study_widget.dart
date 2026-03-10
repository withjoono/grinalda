import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:turtle_planner/src/common_widgets/badges/study_tag_badge_widget.dart';
import 'package:turtle_planner/src/common_widgets/selectors/filter_chip_selector_widget.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/controllers/screens/home/home_controller.dart';
import 'package:turtle_planner/src/controllers/screens/home/today_study_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class TodayStudyWidget extends StatelessWidget {
  final TodayStudyController controller = Get.find<TodayStudyController>();
  final HomeController homeController = Get.find<HomeController>();

  TodayStudyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildFilterChips(),
        Expanded(
          child: Obx(() {
            if (controller.isLoading.value) {
              return const Center(child: CircularProgressIndicator());
            } else if (controller.studyPlans.isEmpty) {
              return const Center(child: Text('오늘은 학습 계획이 없습니다.'));
            } else {
              return _buildStudyPlansList();
            }
          }),
        ),
      ],
    );
  }

  Widget _buildFilterChips() {
    return Obx(() {
      final tags = controller.getAvailableStudyTags();
      return SizedBox(
        height: 50,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: tags.length,
          separatorBuilder: (_, __) => const SizedBox(width: 8),
          itemBuilder: (_, index) => _buildFilterChip(tags[index]),
        ),
      );
    });
  }

  Widget _buildFilterChip(StudyTagModel tag) {
    return Obx(() => FilterChipSelectorWidget(
          label: tag.name,
          isSelected: controller.filterTag.value == tag.id,
          onSelected: () => controller.filterTag.value = tag.id,
          selectedColor: Get.theme.colorScheme.primaryContainer,
          checkmarkColor: Get.theme.colorScheme.onPrimaryContainer,
        ));
  }

  Widget _buildStudyPlansList() {
    return ListView.builder(
      itemCount: controller.getFilteredStudyPlans().length,
      padding: const EdgeInsets.only(bottom: 80),
      itemBuilder: (context, index) {
        final studyPlan = controller.getFilteredStudyPlans()[index];
        return _buildStudyCard(context, studyPlan);
      },
    );
  }

  Widget _buildStudyCard(BuildContext context, StudyPlanModel studyPlan) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      color: colorScheme.surfaceContainer,
      child: InkWell(
        onTap: () => _showProgressDialog(context, studyPlan),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildStudyCardHeader(studyPlan, textTheme, colorScheme),
              const SizedBox(height: 16),
              _buildProgressIndicator(studyPlan, colorScheme),
              const SizedBox(height: 8),
              _buildStudyCardFooter(studyPlan, textTheme, colorScheme),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStudyCardHeader(
      StudyPlanModel studyPlan, TextTheme textTheme, ColorScheme colorScheme) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                studyPlan.title,
                style: textTheme.titleMedium,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              _buildStudyTagBadge(studyPlan.tagId),
            ],
          ),
        ),
        _buildStudyProgress(studyPlan, textTheme, colorScheme),
      ],
    );
  }

  Widget _buildStudyProgress(
      StudyPlanModel studyPlan, TextTheme textTheme, ColorScheme colorScheme) {
    return FutureBuilder<int>(
      future: controller.getTotalCompletedAmount(
          studyPlan, homeController.selectedDate.value.toUtc()),
      builder: (context, snapshot) {
        final totalCompletedAmount = snapshot.data ?? 0;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              "${(totalCompletedAmount / studyPlan.totalAmount * 100).toStringAsFixed(1)}% ($totalCompletedAmount/${studyPlan.totalAmount})",
              style:
                  textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            Text(
              "목표일: ${DateFormat('yyyy-MM-dd').format(studyPlan.goalDate.toUtc())}",
              style: textTheme.bodySmall
                  ?.copyWith(color: colorScheme.onSurfaceVariant),
            ),
            Text(
              "남은 학습일: ${controller.getRemainingStudyDays(studyPlan, homeController.selectedDate.value.toUtc())}일",
              style: textTheme.bodySmall
                  ?.copyWith(color: colorScheme.onSurfaceVariant),
            ),
          ],
        );
      },
    );
  }

  Widget _buildProgressIndicator(
      StudyPlanModel studyPlan, ColorScheme colorScheme) {
    return FutureBuilder<double>(
      future: controller.getProgressPercentage(studyPlan),
      builder: (context, snapshot) {
        final progress = snapshot.data ?? 0.0;
        return LinearProgressIndicator(
          value: progress,
          backgroundColor: colorScheme.surfaceContainerHighest,
          valueColor:
              AlwaysStoppedAnimation<Color>(Helper.getProgressColor(progress)),
          minHeight: 6,
        );
      },
    );
  }

  Widget _buildStudyCardFooter(
      StudyPlanModel studyPlan, TextTheme textTheme, ColorScheme colorScheme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        FutureBuilder<Map<String, dynamic>>(
          future: controller.getProgressStatus(studyPlan),
          builder: (context, snapshot) {
            final status = snapshot.data?['status'] ?? '상태 로딩 중...';
            final percentage = snapshot.data?['percentage'] ?? 0.0;
            return Text(
              status,
              style: textTheme.bodyMedium?.copyWith(
                color: Helper.getProgressColor(percentage),
                fontWeight: FontWeight.bold,
              ),
            );
          },
        ),
        FutureBuilder<bool>(
          future: controller.isDailyGoalAchieved(studyPlan),
          builder: (context, snapshot) {
            if (snapshot.data == true) {
              return Row(
                children: [
                  Icon(Icons.check_circle,
                      size: 16, color: colorScheme.primary),
                  const SizedBox(width: 4),
                  Text(
                    controller.getNextStudyDay(studyPlan),
                    style: textTheme.bodySmall
                        ?.copyWith(color: colorScheme.primary),
                  ),
                ],
              );
            } else {
              return const SizedBox.shrink();
            }
          },
        ),
      ],
    );
  }

  Widget _buildStudyTagBadge(String tagId) {
    return Obx(() {
      StudyTagModel? tag = controller.getStudyTagById(tagId);
      tag ??= StudyTagModel(
        id: 'undecided',
        name: '미정',
        colorValue: Colors.grey.value,
        isSystemTag: true,
      );
      return StudyTagBadgeWidget(
        text: tag.name,
        color: tag.color,
        size: BadgeSize.sm,
      );
    });
  }

  void _showProgressDialog(
      BuildContext context, StudyPlanModel studyPlan) async {
    final TextEditingController amountController = TextEditingController();
    final TextEditingController durationController = TextEditingController();
    final existingRecord = await controller.getExistingStudyRecord(
        studyPlan, homeController.selectedDate.value);

    final isExist = existingRecord != null && existingRecord.id.isNotEmpty;

    if (isExist) {
      amountController.text = existingRecord.amount.toString();
      durationController.text = existingRecord.duration.toString();
    }

    Get.dialog(
      Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                isExist ? "🐢 기록 업데이트" : "🐢 수고했어요!",
                style:
                    const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Text(
                  "${studyPlan.title} ${isExist ? '기록을 업데이트합니다.' : '오늘 얼마나 공부했나요?'}"),
              const SizedBox(height: 16),
              TextField(
                controller: amountController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: "학습량 (${studyPlan.unit})",
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12)),
                  suffixText: studyPlan.unit,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: durationController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: "학습 시간 (분)",
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12)),
                  suffixText: "분",
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () => Get.back(),
                      child: const Text("취소"),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        final amount = int.tryParse(amountController.text) ?? 0;
                        final duration =
                            int.tryParse(durationController.text) ?? 0;
                        controller.updateOrAddStudyProgress(
                          studyPlan,
                          amount,
                          duration,
                          isExist ? existingRecord.id : null,
                        );
                        Get.back();
                      },
                      child: Text(isExist ? "수정" : "확인"),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
