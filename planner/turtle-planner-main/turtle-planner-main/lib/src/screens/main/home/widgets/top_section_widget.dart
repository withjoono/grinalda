import 'package:flutter/material.dart';
import 'package:turtle_planner/src/screens/main/home/widgets/header_widget.dart';
import 'package:turtle_planner/src/screens/main/home/widgets/weekly_date_selector_widget.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class TopSectionWidget extends StatelessWidget {
  const TopSectionWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      color: colorScheme.surfaceContainer,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSizes.md,
            ),
            child: HeaderWidget(),
          ),
          const SizedBox(height: AppSizes.md - 10),
          const Padding(
            padding: EdgeInsets.symmetric(
              horizontal: AppSizes.md,
            ),
            child: WeeklyDateSelector(),
          ),
        ],
      ),
    );
  }
}
