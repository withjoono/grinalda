import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/calendar/long_term_view_controller.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/long_term_view/calendar_content_widget.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/long_term_view/tag_column_widget.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/long_term_view/year_selector_widget.dart';

class LongTermViewWidget extends GetView<LongTermViewController> {
  const LongTermViewWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      return Column(
        children: [
          YearSelectorWidget(
            selectedYear: controller.selectedYear,
            onYearChanged: controller.changeYear,
          ),
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TagColumnWidget(
                  groupedPlans: controller.groupedPlans.value,
                  scrollController: controller.tagScrollController.value,
                  onTagTap: controller.onTagTap,
                  selectedTag: controller.selectedTag,
                ),
                VerticalDivider(
                  width: 0.3,
                  thickness: 1,
                  color: Colors.grey.withOpacity(0.2),
                ),
                Expanded(
                  child: CalendarContentWidget(
                    groupedPlans: controller.groupedPlans.value,
                    selectedYear: controller.selectedYear,
                    verticalScrollController:
                        controller.contentVerticalScrollController.value,
                    horizontalScrollController:
                        controller.contentHorizontalScrollController.value,
                    selectedTag: controller.selectedTag,
                    selectedItemIndex: controller.selectedItemIndex,
                  ),
                ),
              ],
            ),
          ),
        ],
      );
    });
  }
}
