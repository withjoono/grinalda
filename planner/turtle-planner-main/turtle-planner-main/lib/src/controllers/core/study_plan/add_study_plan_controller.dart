import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';

class AddStudyPlanController extends GetxController {
  final StudyPlanController _studyPlanController =
      Get.find<StudyPlanController>();
  final StudyTagRepository _tagRepository = Get.find<StudyTagRepository>();

  var title = ''.obs;
  var totalAmount = 300.obs;
  var selectedUnit = '페이지'.obs;
  late Rx<StudyTagModel> selectedTag;
  var selectedDays = <int>[0, 1, 2, 3, 4, 5, 6].obs;
  var startDate = DateTime.now().obs;
  var goalDate = DateTime.now().add(const Duration(days: 30)).obs;

  @override
  void onInit() {
    super.onInit();
    _initializeSelectedTag();
    _initializeDates();
  }

  void _initializeSelectedTag() {
    List<StudyTagModel> systemTags = _tagRepository.getSystemStudyTags();
    selectedTag = (systemTags.isNotEmpty
            ? systemTags.first
            : StudyTagModel(
                id: 'default',
                name: '기본',
                colorValue: Colors.grey.value,
                isSystemTag: true,
              ))
        .obs;
  }

  void _initializeDates() {
    final now = DateTime.now().toLocal();
    startDate.value = DateTime.utc(now.year, now.month, now.day);
    goalDate.value = startDate.value.add(const Duration(days: 30));
  }

  void updateTitle(String value) => title.value = value;
  void updateTotalAmount(int value) => totalAmount.value = value;
  void updateSelectedUnit(String value) => selectedUnit.value = value;
  void updateSelectedTag(StudyTagModel value) => selectedTag.value = value;
  void updateSelectedDays(List<int> value) => selectedDays.value = value;
  void updateStartDate(DateTime value) => startDate.value = value;
  void updateGoalDate(DateTime value) => goalDate.value = value;

  DateTime _toUTCDate(DateTime date) {
    return DateTime.utc(date.year, date.month, date.day);
  }

  void addStudyPlan() {
    if (title.value.isEmpty) {
      Get.snackbar('오류', '학습 이름을 입력해주세요.');
      return;
    }
    if (selectedDays.isEmpty) {
      Get.snackbar('오류', '학습 요일을 선택해주세요.');
      return;
    }

    final newPlan = StudyPlanModel(
      id: '',
      title: title.value,
      tagId: selectedTag.value.id,
      totalAmount: totalAmount.value,
      completedAmount: 0,
      unit: selectedUnit.value,
      studyDays: selectedDays,
      startDate: _toUTCDate(startDate.value),
      goalDate: _toUTCDate(goalDate.value),
    );

    _studyPlanController.addStudyPlan(newPlan);
    Get.back();
  }
}
