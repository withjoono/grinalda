import 'package:get/get.dart';
import 'package:flutter/material.dart';

class ThemeController extends GetxController {
  // 기본 테마 모드
  Rx<ThemeMode> themeMode = ThemeMode.system.obs;

  void toggleTheme() {
    if (themeMode.value == ThemeMode.light) {
      themeMode.value = ThemeMode.dark;
    } else {
      themeMode.value = ThemeMode.light;
    }
  }

  void setTheme(ThemeMode mode) {
    themeMode.value = mode;
  }
}
