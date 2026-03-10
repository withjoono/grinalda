import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/monthly_statistics_screen/monthly_statistics_screen.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/weekly_statistics_screen/weekly_statistics_screen.dart';
import 'package:turtle_planner/src/screens/main/statistics/widgets/yearly_statistics_screen/yearly_statistics_screen.dart';

class StatisticsMenu extends StatelessWidget {
  const StatisticsMenu({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    // Set system UI overlay style
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        systemNavigationBarColor: colorScheme.surfaceContainer,
        statusBarColor: colorScheme.surfaceContainer,
      ),
    );

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: const Text("📊 통계"),
          backgroundColor: colorScheme.surfaceContainer,
        ),
        body: DefaultTabController(
          length: 3,
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
                    Tab(text: "주간"),
                    Tab(text: "월간"),
                    Tab(text: "잔디밭"),
                  ],
                ),
              ),
              const Expanded(
                child: TabBarView(
                  children: [
                    WeeklyStatisticsScreen(),
                    MonthlyStatisticsScreen(),
                    YearlyStatisticsScreen(),
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
