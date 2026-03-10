import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';

class LongTermViewController extends GetxController {
  final StudyPlanController _studyPlanController = StudyPlanController.instance;

  final selectedYear = DateTime.now().year.obs;
  final selectedTag = RxString('');
  final selectedItemIndex = RxInt(-1);

  final Rx<ScrollController> tagScrollController = ScrollController().obs;
  final Rx<ScrollController> contentVerticalScrollController =
      ScrollController().obs;
  final Rx<ScrollController> contentHorizontalScrollController =
      ScrollController().obs;

  final RxList<StudyPlanModel> studyPlans = <StudyPlanModel>[].obs;
  final Rx<Map<String, List<StudyPlanModel>>> groupedPlans =
      Rx<Map<String, List<StudyPlanModel>>>({});

  @override
  void onInit() {
    super.onInit();
    ever(selectedYear, (_) => updateGroupedPlans());
    loadStudyPlans();
  }

  Future<void> loadStudyPlans() async {
    try {
      studyPlans.value = _studyPlanController.plans;
      updateGroupedPlans();
    } catch (e) {
      print('학습 계획 로드 중 오류 발생: $e');
      // 에러 처리 (예: 사용자에게 알림)
    }
  }

  void updateGroupedPlans() {
    groupedPlans.value = _getRelevantGroupedPlans();
  }

  Map<String, List<StudyPlanModel>> _getRelevantGroupedPlans() {
    Map<String, List<StudyPlanModel>> plans = {};
    for (var plan in studyPlans) {
      if (_isPlanRelevantForSelectedYear(plan)) {
        if (!plans.containsKey(plan.tagId)) {
          plans[plan.tagId] = [];
        }
        plans[plan.tagId]!.add(plan);
      }
    }
    plans.forEach((key, value) {
      value.sort((a, b) => a.startDate.compareTo(b.startDate));
    });
    return plans;
  }

  bool _isPlanRelevantForSelectedYear(StudyPlanModel plan) {
    return (plan.startDate.year <= selectedYear.value &&
        plan.goalDate.year >= selectedYear.value);
  }

  void onTagTap(String tagId) {
    if (selectedTag.value == tagId) {
      selectedItemIndex.value++;
      if (selectedItemIndex.value >= groupedPlans.value[tagId]!.length) {
        selectedItemIndex.value = 0;
      }
    } else {
      selectedTag.value = tagId;
      selectedItemIndex.value = 0;
    }
    scrollToSelectedItem();
  }

  void scrollToSelectedItem() {
    if (selectedTag.value.isNotEmpty && selectedItemIndex.value >= 0) {
      final plans = groupedPlans.value[selectedTag.value];
      if (plans != null && plans.isNotEmpty) {
        final selectedPlan = plans[selectedItemIndex.value];
        final yearStartDate = DateTime(selectedYear.value, 1, 1);
        final startOffset =
            selectedPlan.startDate.difference(yearStartDate).inDays;

        double verticalOffset = 0.0;
        for (var entry in groupedPlans.value.entries) {
          if (entry.key == selectedTag.value) {
            verticalOffset += selectedItemIndex.value * (30.0 + 5.0);
            break;
          }
          verticalOffset += entry.value.length * (30.0 + 5.0) + 20.0;
        }

        contentVerticalScrollController.value.animateTo(
          verticalOffset,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );

        contentHorizontalScrollController.value.animateTo(
          startOffset * 5.0,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      }
    }
  }

  void changeYear(int year) {
    selectedYear.value = year;
  }

  // 추가: 학습 계획 업데이트 메서드
  Future<void> updateStudyPlan(StudyPlanModel plan) async {
    try {
      await _studyPlanController.updateStudyPlan(plan);
      await loadStudyPlans(); // 전체 목록을 다시 로드
    } catch (e) {
      print('학습 계획 업데이트 중 오류 발생: $e');
      // 에러 처리
    }
  }

  // 추가: 새 학습 계획 추가 메서드
  Future<void> addStudyPlan(StudyPlanModel plan) async {
    try {
      await _studyPlanController.addStudyPlan(plan);
      await loadStudyPlans(); // 전체 목록을 다시 로드
    } catch (e) {
      print('새 학습 계획 추가 중 오류 발생: $e');
      // 에러 처리
    }
  }

  // 추가: 학습 계획 삭제 메서드
  Future<void> deleteStudyPlan(String planId) async {
    try {
      await _studyPlanController.deleteStudyPlan(planId);
      await loadStudyPlans(); // 전체 목록을 다시 로드
    } catch (e) {
      print('학습 계획 삭제 중 오류 발생: $e');
      // 에러 처리
    }
  }
}
