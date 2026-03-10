import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/home/home_controller.dart';
import 'package:turtle_planner/src/controllers/screens/home/today_study_controller.dart';
import 'package:turtle_planner/src/screens/main/home/widgets/add_study_plan/add_study_plan_page.dart';
import 'package:turtle_planner/src/screens/main/home/widgets/today_study_widget.dart';
import 'package:turtle_planner/src/screens/main/home/widgets/top_section_widget.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(HomeController());
    Get.put(TodayStudyController());

    final colorScheme = Theme.of(context).colorScheme;

    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        systemNavigationBarColor: colorScheme.surfaceContainer,
        statusBarColor: colorScheme.surfaceContainer,
      ),
    );

    return SafeArea(
      child: Scaffold(
        body: Column(
          children: [
            const TopSectionWidget(),
            Expanded(
              child: DefaultTabController(
                length: 2,
                child: Column(
                  children: [
                    Container(
                      color: colorScheme.surfaceContainer,
                      child: TabBar(
                        splashBorderRadius: BorderRadius.circular(10),
                        indicatorSize: TabBarIndicatorSize.tab,
                        indicatorColor: Theme.of(context).colorScheme.surface,
                        dividerColor: Colors.transparent,
                        indicator: BoxDecoration(
                          color: colorScheme.surface,
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(10),
                            topRight: Radius.circular(10),
                          ),
                        ),
                        unselectedLabelColor: colorScheme.onSurface,
                        labelColor: colorScheme.primary,
                        tabs: [
                          Obx(() {
                            int selectedIndex =
                                controller.selectedDate.value.weekday % 7;
                            int todayPlanCount = controller
                                .getStudyPlanCountForDay(selectedIndex);
                            return Tab(
                              text: "오늘의 학습 $todayPlanCount",
                            );
                          }),
                          const Tab(text: "D-Day"),
                        ],
                      ),
                    ),
                    Expanded(
                      child: TabBarView(
                        children: [
                          TodayStudyWidget(),
                          TodayStudyWidget(),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            Get.to(() => const AddStudyPlanPage());
          },
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
}
