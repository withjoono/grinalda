import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/core/study_record_controller.dart';
import 'package:turtle_planner/src/screens/main/calendar/calendar_screen.dart';
import 'package:turtle_planner/src/screens/main/home/home_screen.dart';
import 'package:turtle_planner/src/screens/main/profile/profile_screen.dart';
import 'package:turtle_planner/src/screens/main/statistics/statistics_menu.dart';
import 'package:line_awesome_flutter/line_awesome_flutter.dart';

class HomeMenu extends StatelessWidget {
  const HomeMenu({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(AppScreenController());
    Get.put(StudyRecordController());

    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
          systemNavigationBarColor: Theme.of(context).colorScheme.surface,
          statusBarColor: Theme.of(context).colorScheme.surface),
    );

    return Scaffold(
      extendBody: true,
      bottomNavigationBar: Obx(
        () => Container(
          height: 80,
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surfaceContainer,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                  context, 0, LineAwesomeIcons.home_solid, '홈', controller),
              _buildNavItem(context, 1, Icons.calendar_month_outlined, '학습계획',
                  controller),
              _buildNavItem(
                  context, 2, Icons.analytics_outlined, '통계', controller),
              _buildNavItem(
                  context, 3, LineAwesomeIcons.user, '내정보', controller),
            ],
          ),
        ),
      ),
      body: Obx(() => controller.screens[controller.selectedMenu.value]),
    );
  }

  Widget _buildNavItem(BuildContext context, int index, IconData icon,
      String label, AppScreenController controller) {
    final isSelected = controller.selectedMenu.value == index;
    return GestureDetector(
      onTap: () => controller.selectedMenu.value = index,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected
                  ? Theme.of(context).colorScheme.primary
                  : Theme.of(context).colorScheme.onSurface,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: isSelected
                    ? Theme.of(context).colorScheme.primary
                    : Theme.of(context).colorScheme.onSurface,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AppScreenController extends GetxController {
  static AppScreenController get instance => Get.find();

  final Rx<int> selectedMenu = 0.obs;

  final screens = [
    const HomeScreen(),
    const CalendarScreen(),
    const StatisticsMenu(),
    const ProfileScreen(),
  ];
}
