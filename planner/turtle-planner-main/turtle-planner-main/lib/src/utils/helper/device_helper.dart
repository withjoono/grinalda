import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';

class DeviceHelper {
  // 키보드 숨기기
  static void hideKeyboard(BuildContext context) {
    FocusScope.of(context).requestFocus(FocusNode());
  }

  // 상태 바 색상 설정
  static Future<void> setStatusBarColor(Color color) async {
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(statusBarColor: color),
    );
  }

  // 가로 방향 여부 확인
  static bool isLandscapeOrientation(BuildContext context) {
    final viewInsets = View.of(context).viewInsets;
    return viewInsets.bottom == 0;
  }

  // 세로 방향 여부 확인
  static bool isPortraitOrientation(BuildContext context) {
    final viewInsets = View.of(context).viewInsets;
    return viewInsets.bottom != 0;
  }

  // 전체 화면 모드 설정
  static void setFullScreen(bool enable) {
    SystemChrome.setEnabledSystemUIMode(
        enable ? SystemUiMode.immersiveSticky : SystemUiMode.edgeToEdge);
  }

  // 화면 높이 가져오기
  static double getScreenHeight() {
    return MediaQuery.of(Get.context!).size.height;
  }

  // 화면 너비 가져오기
  static double getScreenWidth(BuildContext context) {
    return MediaQuery.of(context).size.width;
  }

  // 픽셀 비율 가져오기
  static double getPixelRatio() {
    return MediaQuery.of(Get.context!).devicePixelRatio;
  }

  // 상태 바 높이 가져오기
  static double getStatusBarHeight() {
    return MediaQuery.of(Get.context!).padding.top;
  }

  // 하단 네비게이션 바 높이 가져오기
  static double getBottomNavigationBarHeight() {
    return kBottomNavigationBarHeight;
  }

  // 앱 바 높이 가져오기
  static double getAppBarHeight() {
    return kToolbarHeight;
  }

  // 키보드 높이 가져오기
  static double getKeyboardHeight() {
    final viewInsets = MediaQuery.of(Get.context!).viewInsets;
    return viewInsets.bottom;
  }

  // 키보드 표시 여부 확인
  static Future<bool> isKeyboardVisible() async {
    final viewInsets = View.of(Get.context!).viewInsets;
    return viewInsets.bottom > 0;
  }

  // 실제 물리적 기기인지 확인
  static Future<bool> isPhysicalDevice() async {
    return defaultTargetPlatform == TargetPlatform.android ||
        defaultTargetPlatform == TargetPlatform.iOS;
  }

  // 진동 피드백 제공
  static void vibrate(Duration duration) {
    HapticFeedback.vibrate();
    Future.delayed(duration, () => HapticFeedback.vibrate());
  }

  // 선호하는 화면 방향 설정
  static Future<void> setPreferredOrientations(
      List<DeviceOrientation> orientations) async {
    await SystemChrome.setPreferredOrientations(orientations);
  }

  // 상태 바 숨기기
  static void hideStatusBar() {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual, overlays: []);
  }

  // 상태 바 표시
  static void showStatusBar() {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual,
        overlays: SystemUiOverlay.values);
  }

  // 인터넷 연결 확인
  static Future<bool> hasInternetConnection() async {
    try {
      final result = await InternetAddress.lookup('example.com');
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } on SocketException catch (_) {
      return false;
    }
  }

  // iOS 기기 여부 확인
  static bool isIOS() {
    return Platform.isIOS;
  }

  // Android 기기 여부 확인
  static bool isAndroid() {
    return Platform.isAndroid;
  }

  // 다크 모드 여부 확인
  static bool isDarkMode(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark;
  }
}
