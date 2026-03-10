import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/selectors/box_selector_widget.dart';
import 'package:turtle_planner/src/controllers/theme/theme_controller.dart';

class ProfileSettingsWidget extends StatelessWidget {
  const ProfileSettingsWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final themeController = Get.find<ThemeController>();

    return Column(
      children: [
        BoxSelectorWidget(
          label: '현재 버전',
          value: 'v1.0.0',
          onTap: () {},
        ),
        const SizedBox(height: 8),
        Obx(() => BoxSelectorWidget(
              label: '화면 테마',
              value: _getThemeModeName(themeController.themeMode.value),
              onTap: () {
                Get.bottomSheet(
                  Container(
                    color: Theme.of(context).scaffoldBackgroundColor,
                    child: Wrap(
                      children: [
                        ListTile(
                          title: const Text('라이트'),
                          onTap: () {
                            themeController.setTheme(ThemeMode.light);
                            Get.back();
                          },
                        ),
                        ListTile(
                          title: const Text('다크'),
                          onTap: () {
                            themeController.setTheme(ThemeMode.dark);
                            Get.back();
                          },
                        ),
                        ListTile(
                          title: const Text('시스템'),
                          onTap: () {
                            themeController.setTheme(ThemeMode.system);
                            Get.back();
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            )),
        const SizedBox(height: 8),
        BoxSelectorWidget(
          label: '이용약관',
          value: const Icon(Icons.chevron_right),
          onTap: () => {},
        ),
        const SizedBox(height: 8),
        BoxSelectorWidget(
          label: '개인정보 처리방침',
          value: const Icon(Icons.chevron_right),
          onTap: () => {},
        ),
      ],
    );
  }

  String _getThemeModeName(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return '라이트';
      case ThemeMode.dark:
        return '다크';
      case ThemeMode.system:
        return '시스템';
    }
  }
}
