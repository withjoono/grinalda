import 'package:get/get.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class StudyPlanListController extends GetxController {
  final StudyPlanController studyPlanController = StudyPlanController.instance;
  final StudyTagRepository studyTagRepo = StudyTagRepository.instance;

  final RxString filterStatus = 'inProgress'.obs;

  List<StudyPlanModel> get filteredStudyPlans {
    final now = DateTime.now();
    switch (filterStatus.value) {
      case 'inProgress':
        return studyPlanController.plans
            .where((plan) =>
                now.isAfter(plan.startDate) && now.isBefore(plan.goalDate))
            .toList();
      case 'completed':
        return studyPlanController.plans
            .where((plan) => now.isAfter(plan.goalDate))
            .toList();
      case 'planned':
        return studyPlanController.plans
            .where((plan) => now.isBefore(plan.startDate))
            .toList();
      default:
        return studyPlanController.plans;
    }
  }

  StudyTagModel? getStudyTagById(String tagId) {
    return studyTagRepo.getStudyTagById(tagId);
  }

  double getProgressPercentage(StudyPlanModel plan) {
    return plan.completedAmount / plan.totalAmount;
  }

  Future<void> deleteStudyPlan(String planId) async {
    try {
      await studyPlanController.deleteStudyPlan(planId);
      // 삭제 후 목록 갱신
      studyPlanController.refreshStudyPlans();
      update();
    } catch (e) {
      Helper.errorSnackBar(title: '오류', message: '학습 계획 삭제에 실패했습니다: $e');
    }
  }
}
