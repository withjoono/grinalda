import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';
import 'package:turtle_planner/src/screens/main/home/widgets/add_study_plan/study_tag_selector_page.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';
import 'package:turtle_planner/src/common_widgets/calendar/calendar.dart';
import 'package:flutter/cupertino.dart';

class EditStudyPlanController extends GetxController {
  final StudyPlanController _studyPlanController =
      Get.find<StudyPlanController>();
  final StudyTagRepository _tagRepository = Get.find<StudyTagRepository>();

  late StudyPlanModel studyPlan;
  var title = ''.obs;
  var totalAmount = 0.obs;
  var selectedUnit = ''.obs;
  var selectedTag = StudyTagModel(
    id: 'undecided',
    name: '미정',
    colorValue: Colors.blueGrey[400]!.value,
    isSystemTag: true,
  ).obs;
  var selectedDays = <int>[].obs;
  var startDate = DateTime.now().obs;
  var goalDate = DateTime.now().obs;

  EditStudyPlanController(StudyPlanModel initialPlan) {
    studyPlan = initialPlan;
    title.value = initialPlan.title;
    totalAmount.value = initialPlan.totalAmount;
    selectedUnit.value = initialPlan.unit;
    selectedDays.value = List<int>.from(initialPlan.studyDays);
    startDate.value = initialPlan.startDate;
    goalDate.value = initialPlan.goalDate;

    StudyTagModel? tag = _tagRepository.getStudyTagById(initialPlan.tagId);
    selectedTag.value = tag ?? _tagRepository.getSystemStudyTags().first;
  }

  void updateTitle(String value) {
    title.value = value;
  }

  void updateTotalAmount(int value) {
    totalAmount.value = value;
  }

  void updateSelectedUnit(String value) {
    selectedUnit.value = value;
  }

  void updateSelectedTag(StudyTagModel value) {
    selectedTag(value);
  }

  void updateSelectedDays(List<int> value) {
    selectedDays(List<int>.from(value));
  }

  void updateStartDate(DateTime value) {
    startDate.value = value;
  }

  void updateGoalDate(DateTime value) {
    goalDate.value = value;
  }

  void showStudyTagSelector() {
    Get.to(() => StudyTagSelectorPage(
          selectedTag: selectedTag.value,
          onTagSelected: (tag) {
            updateSelectedTag(tag);
            Get.back();
          },
        ));
  }

  void showUnitSelector() {
    showCupertinoModalPopup<void>(
      context: Get.context!,
      builder: (BuildContext context) => CupertinoActionSheet(
        title: const Text('단위 선택'),
        actions: <CupertinoActionSheetAction>[
          CupertinoActionSheetAction(
            onPressed: () => _selectUnit('페이지'),
            child: const Text('페이지'),
          ),
          CupertinoActionSheetAction(
            onPressed: () => _selectUnit('단어'),
            child: const Text('단어'),
          ),
          CupertinoActionSheetAction(
            onPressed: () => _selectUnit('문제'),
            child: const Text('문제'),
          ),
          CupertinoActionSheetAction(
            onPressed: () => _selectUnit('강의'),
            child: const Text('강의'),
          ),
        ],
        cancelButton: CupertinoActionSheetAction(
          isDefaultAction: true,
          onPressed: () => Navigator.pop(context),
          child: const Text('취소'),
        ),
      ),
    );
  }

  void _selectUnit(String unit) {
    updateSelectedUnit(unit);
    Navigator.pop(Get.context!);
  }

  void showTotalAmountInputDialog() {
    String tempAmount = totalAmount.value.toString();

    Get.dialog(
      AlertDialog(
        title: const Text('총 학습량 입력'),
        content: TextField(
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            hintText: '학습량을 입력하세요',
            suffixText: selectedUnit.value,
          ),
          onChanged: (value) {
            tempAmount = value;
          },
        ),
        actions: <Widget>[
          TextButton(
            child: const Text('취소'),
            onPressed: () => Get.back(),
          ),
          TextButton(
            child: const Text('확인'),
            onPressed: () {
              int? newAmount = int.tryParse(tempAmount);
              if (newAmount != null && newAmount > 0) {
                updateTotalAmount(newAmount);
                Get.back();
              } else {
                Helper.errorSnackBar(title: "오류", message: '올바른 숫자를 입력해주세요.');
              }
            },
          ),
        ],
      ),
    );
  }

  void showDatePicker(bool isStartDate) {
    final colorScheme = Theme.of(Get.context!).colorScheme;
    final backgroundColor = colorScheme.surface.withOpacity(0.5);
    final sheetColor = colorScheme.surface;

    final today = DateTime.now();
    final todayWithoutTime = DateTime(today.year, today.month, today.day);

    Get.bottomSheet(
      Container(
        color: sheetColor,
        child: SizedBox(
          height: Get.height * 0.6,
          child: Calendar(
            datasets: const {},
            initialSelectedDay: isStartDate ? startDate.value : goalDate.value,
            onDaySelected: (selectedDay, _) {
              final selectedDayWithoutTime = DateTime(
                selectedDay.year,
                selectedDay.month,
                selectedDay.day,
              );

              if (isStartDate) {
                if (!selectedDayWithoutTime.isBefore(todayWithoutTime)) {
                  updateStartDate(selectedDayWithoutTime);
                  if (goalDate.value.isBefore(selectedDayWithoutTime)) {
                    updateGoalDate(
                        selectedDayWithoutTime.add(const Duration(days: 1)));
                  }
                } else {
                  Helper.errorSnackBar(
                    title: '잘못된 선택',
                    message: '오늘 이후의 날짜만 선택할 수 있습니다. 다시 선택해 주세요.',
                  );
                  return;
                }
              } else {
                if (selectedDayWithoutTime.isAfter(startDate.value)) {
                  updateGoalDate(selectedDayWithoutTime
                      .add(const Duration(days: 1))
                      .subtract(const Duration(seconds: 1)));
                } else {
                  Helper.errorSnackBar(
                    title: '잘못된 선택',
                    message: '목표일은 시작일 이후여야 합니다. 다시 선택해 주세요.',
                  );
                  return;
                }
              }
              Get.back();
            },
            firstDay: startDate.value,
            lastDay: todayWithoutTime.add(const Duration(days: 365)),
          ),
        ),
      ),
      backgroundColor: backgroundColor,
    );
  }

  void updateStudyPlan() {
    if (title.value.isEmpty) {
      Helper.errorSnackBar(title: '오류', message: '학습 이름을 입력해주세요.');
      return;
    }
    if (selectedDays.isEmpty) {
      Helper.errorSnackBar(title: '오류', message: '학습 요일을 선택해주세요.');
      return;
    }

    final updatedPlan = studyPlan.copyWith(
      title: title.value,
      tagId: selectedTag.value.id,
      totalAmount: totalAmount.value,
      unit: selectedUnit.value,
      studyDays: selectedDays,
      startDate: startDate.value,
      goalDate: goalDate.value,
    );

    _studyPlanController.updateStudyPlan(updatedPlan);
    Get.back();
  }
}
