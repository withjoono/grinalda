import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/calendar/study_plan_list_controller.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/study_plan_list/widgets/study_plan_card.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/study_plan_list/widgets/study_plan_filter_chips.dart';

class StudyPlanListWidget extends StatelessWidget {
  final StudyPlanListController controller = Get.put(StudyPlanListController());

  StudyPlanListWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        StudyPlanFilterChips(controller: controller),
        Expanded(
          child: Obx(() {
            if (controller.studyPlanController.isLoading.value) {
              return const Center(child: CircularProgressIndicator());
            } else if (controller.filteredStudyPlans.isEmpty) {
              return const Center(child: Text('학습 계획이 없습니다.'));
            } else {
              return ListView.builder(
                itemCount: controller.filteredStudyPlans.length,
                padding: const EdgeInsets.only(bottom: 80),
                itemBuilder: (context, index) {
                  final studyPlan = controller.filteredStudyPlans[index];
                  return StudyPlanCard(
                    studyPlan: studyPlan,
                    controller: controller,
                  );
                },
              );
            }
          }),
        ),
      ],
    );
  }
}
