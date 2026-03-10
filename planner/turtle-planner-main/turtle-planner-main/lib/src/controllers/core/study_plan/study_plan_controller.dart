import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/core/study_record_controller.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/data/repositories/study_plan_repository.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class StudyPlanController extends GetxController {
  static StudyPlanController get instance => Get.find();

  final StudyPlanRepository _studyPlanRepo = StudyPlanRepository.instance;
  final StudyTagRepository _studyTagRepo = StudyTagRepository.instance;
  final StudyRecordController _studyRecordController =
      StudyRecordController.instance;

  RxList<StudyPlanModel> get plans => _studyPlanRepo.plans;
  RxBool get isLoading => _studyPlanRepo.isLoading;

  @override
  void onInit() {
    super.onInit();
    ever(plans, (_) => update()); // Trigger update when plans change
  }

  Future<void> addStudyPlan(StudyPlanModel plan) async {
    try {
      await _studyPlanRepo.addStudyPlan(plan);
    } catch (e) {
      Helper.errorSnackBar(title: "에러", message: '학습 계획 추가에 실패했습니다: $e');
    }
  }

  Future<void> updateStudyPlan(StudyPlanModel plan) async {
    try {
      await _studyPlanRepo.updateStudyPlan(plan);
    } catch (e) {
      Helper.errorSnackBar(title: "에러", message: '학습 계획 업데이트에 실패했습니다: $e');
    }
  }

  Future<void> deleteStudyPlan(String planId) async {
    try {
      // StudyPlan 삭제
      await _studyPlanRepo.deleteStudyPlan(planId);

      // 관련된 모든 StudyRecord 삭제
      await _studyRecordController.deleteStudyRecordsByPlanId(planId);

      Helper.successSnackBar(title: "성공", message: '학습 계획과 관련 기록이 삭제되었습니다.');
    } catch (e) {
      Helper.errorSnackBar(title: "에러", message: '학습 계획 삭제에 실패했습니다: $e');
    }
  }

  Future<void> updateStudyPlanProgress(
      String planId, int additionalAmount) async {
    try {
      StudyPlanModel? plan = plans.firstWhereOrNull((p) => p.id == planId);
      if (plan != null) {
        StudyPlanModel updatedPlan = plan.copyWith(
          completedAmount: plan.completedAmount + additionalAmount,
          lastUpdated: DateTime.now().toUtc(),
        );
        await updateStudyPlan(updatedPlan);
      } else {
        throw '해당 ID의 학습 계획을 찾을 수 없습니다.';
      }
    } catch (e) {
      Helper.errorSnackBar(
          title: "에러", message: '학습 계획 진행 상황 업데이트에 실패했습니다: $e');
    }
  }

  List<StudyPlanModel> getStudyPlansForDate(DateTime date) {
    return plans
        .where((plan) =>
            plan.studyDays.contains(date.weekday % 7) &&
            !date.isBefore(plan.startDate) &&
            !date.isAfter(plan.goalDate))
        .toList();
  }

  List<StudyPlanModel> getStudyPlansForDateRange(
      DateTime startDate, DateTime endDate) {
    return plans
        .where((plan) =>
            !plan.startDate.isAfter(endDate) &&
            !plan.goalDate.isBefore(startDate))
        .toList();
  }

  Future<void> syncWithServer() async {
    try {
      await _studyPlanRepo.syncWithServer();
    } catch (e) {
      Helper.errorSnackBar(title: "에러", message: '서버 동기화에 실패했습니다: $e');
    }
  }

  Future<void> refreshStudyPlans() async {
    try {
      await _studyPlanRepo.loadStudyPlans();
    } catch (e) {
      Helper.errorSnackBar(title: "에러", message: '학습 계획을 불러오는데 실패했습니다: $e');
    }
  }

  StudyTagModel? getStudyTagByPlanId(String planId) {
    StudyPlanModel? plan = plans.firstWhereOrNull((p) => p.id == planId);
    if (plan != null) {
      return _studyTagRepo.getStudyTagById(plan.tagId);
    }
    return null;
  }
}
