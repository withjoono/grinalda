import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/long_term_view/long_term_view_widget.dart';
import 'package:turtle_planner/src/screens/main/calendar/widgets/study_plan_list/study_plan_list.dart';

class CalendarScreen extends StatelessWidget {
  const CalendarScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    // 시스템 UI 오버레이 스타일 설정
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        systemNavigationBarColor: colorScheme.surfaceContainer,
        statusBarColor: colorScheme.surfaceContainer,
      ),
    );

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: const Text("🧐 학습관리"),
          backgroundColor: colorScheme.surfaceContainer,
        ),
        body: DefaultTabController(
          length: 2,
          child: Column(
            children: [
              Container(
                color: colorScheme.surfaceContainer,
                child: TabBar(
                  splashBorderRadius: BorderRadius.circular(10),
                  indicatorSize: TabBarIndicatorSize.tab,
                  indicatorColor: colorScheme.surface,
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
                  tabs: const [
                    Tab(text: "캘린더"),
                    Tab(text: "학습계획 관리"),
                  ],
                ),
              ),
              Expanded(
                child: TabBarView(
                  children: [
                    const LongTermViewWidget(),
                    StudyPlanListWidget(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
