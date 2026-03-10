import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner_v2/src/screens/welcome_screen.dart';
import 'package:turtle_planner_v2/src/controllers/theme/theme_controller.dart';
import 'package:turtle_planner_v2/src/utils/app_bounding.dart';
import 'package:turtle_planner_v2/src/utils/constants/app_strings.dart';
import 'package:turtle_planner_v2/src/utils/theme/theme.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    final themeController = Get.put(ThemeController());
    return Obx(
      () => GetMaterialApp(
        /// -- README(Docs[3]) -- Bindings
        initialBinding: InitialBinding(),
        title: AppStrings.appName,
        theme: TAppTheme.lightTheme,
        darkTheme: TAppTheme.darkTheme,
        themeMode: themeController.themeMode.value,
        debugShowCheckedModeBanner: false,
        defaultTransition: Transition.native,
        transitionDuration: const Duration(milliseconds: 500),
        home: const WelcomeScreen(),
        locale: const Locale('ko', 'KR'),
      ),
    );
  }
}
