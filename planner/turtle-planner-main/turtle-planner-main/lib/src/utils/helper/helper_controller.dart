import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:line_awesome_flutter/line_awesome_flutter.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/utils/constants/app_strings.dart';

class Helper extends GetxController {
  /* -- ============= VALIDATIONS ================ -- */

  static String? validateEmail(value) {
    if (value == null || value.isEmpty) return AppStrings.emailCannotEmpty;
    if (!GetUtils.isEmail(value)) return AppStrings.invalidEmailFormat;
    return null;
  }

  static String? validatePassword(value) {
    if (value == null || value.isEmpty) return '비밀번호를 입력해주세요.';

    String pattern = r'^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$';
    RegExp regex = RegExp(pattern);
    if (!regex.hasMatch(value)) {
      return '비밀번호는 8자 이상이어야 하며, 숫자와 특수문자를 포함해야 합니다.';
    }
    return null;
  }

  /* -- ============= SNACK-BARS ================ -- */

  static successSnackBar({required title, message}) {
    Get.snackbar(
      title,
      message,
      isDismissible: true,
      shouldIconPulse: true,
      colorText: Get.isDarkMode
          ? Colors.white // 다크모드에서는 흰색 텍스트
          : Get.theme.colorScheme.onPrimary
              .withOpacity(0.9), // 라이트모드에서 약간 연한 텍스트
      backgroundColor: Get.isDarkMode
          ? Get.theme.colorScheme.primary.withOpacity(0.15) // 다크모드에서 은은한 배경
          : Get.theme.colorScheme.primary.withOpacity(0.5), // 라이트모드에서 은은한 배경
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
      margin: const EdgeInsets.only(bottom: 80, left: 16, right: 16),
      icon: Icon(LineAwesomeIcons.check_circle,
          color: Get.isDarkMode
              ? Colors.white // 다크모드에서 아이콘도 흰색
              : Get.theme.colorScheme.onPrimary
                  .withOpacity(0.9)), // 라이트모드에서 아이콘도 약간 연하게
    );
  }

  static warningSnackBar({required title, message}) {
    Get.snackbar(
      title,
      message,
      isDismissible: true,
      shouldIconPulse: true,
      colorText: Get.isDarkMode
          ? Colors.white // 다크모드에서는 흰색 텍스트
          : Colors.black87.withOpacity(0.7), // 라이트모드에서 부드러운 텍스트
      backgroundColor: Get.isDarkMode
          ? Colors.amber.withOpacity(0.8) // 다크모드에서는 밝은 경고색
          : Colors.amberAccent.withOpacity(0.5), // 라이트모드에서 은은한 경고색
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
      margin: const EdgeInsets.only(bottom: 80, left: 16, right: 16),
      icon: Icon(LineAwesomeIcons.exclamation_circle_solid,
          color:
              Get.isDarkMode ? Colors.white : Colors.black87.withOpacity(0.7)),
    );
  }

  static errorSnackBar({required title, message}) {
    Get.snackbar(
      title,
      message,
      isDismissible: true,
      shouldIconPulse: true,
      colorText: Get.isDarkMode
          ? Colors.white // 다크모드에서는 흰색 텍스트
          : Colors.white.withOpacity(0.9), // 라이트모드에서 흰색을 약간 부드럽게
      backgroundColor: Get.isDarkMode
          ? Colors.redAccent.withOpacity(0.8) // 다크모드에서 강렬한 붉은색
          : Colors.red.withOpacity(0.5), // 라이트모드에서 은은한 붉은색
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
      margin: const EdgeInsets.only(bottom: 80, left: 16, right: 16),
      icon: Icon(LineAwesomeIcons.times_circle,
          color: Get.isDarkMode ? Colors.white : Colors.white.withOpacity(0.9)),
    );
  }

  static modernSnackBar({required title, message}) {
    Get.snackbar(
      title,
      message,
      isDismissible: true,
      colorText: Get.isDarkMode
          ? Get.theme.colorScheme.primary.withOpacity(0.8) // 포인트 강조
          : Get.theme.colorScheme.onSurface.withOpacity(0.7), // 기본 텍스트 색상
      backgroundColor: Get.isDarkMode
          ? Get.theme.colorScheme.surface.withOpacity(0.2) // 다크모드에서 포인트 추가
          : Get.theme.colorScheme.surface.withOpacity(0.5), // 라이트모드에서 은은한 배경
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 5),
      margin: const EdgeInsets.only(bottom: 80, left: 16, right: 16),
    );
  }

  /* -- ============= STUDY ITEM HELPERS ================ -- */

  static bool isStudyDay(StudyPlanModel plan) {
    return plan.studyDays.contains(DateTime.now().weekday % 7);
  }

  static String getNextStudyDay(StudyPlanModel plan, DateTime selectedDate) {
    List<String> weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    int currentDayIndex = selectedDate.weekday % 7;

    for (int i = 1; i <= 7; i++) {
      int nextDayIndex = (currentDayIndex + i) % 7;
      if (plan.studyDays.contains(nextDayIndex)) {
        return '${weekdays[nextDayIndex]}요일에 만나요!';
      }
    }

    return '다음 학습일이 없습니다.';
  }

  static int getRemainingStudyDays(StudyPlanModel plan) {
    DateTime now = DateTime.now();
    int remainingDays = 0;
    for (DateTime date = now;
        date.isBefore(plan.goalDate) || date.isAtSameMomentAs(plan.goalDate);
        date = date.add(const Duration(days: 1))) {
      if (plan.studyDays.contains(date.weekday % 7)) {
        remainingDays++;
      }
    }
    return remainingDays;
  }

  static double getTotalProgress(StudyPlanModel plan) {
    return plan.completedAmount / plan.totalAmount;
  }

  static String getProgressStatusHelper(
      StudyPlanModel plan, int todayProgress, int dailyGoal) {
    int remainingAmount = dailyGoal - todayProgress;

    if (remainingAmount > 0) {
      return "🔥 $remainingAmount ${plan.unit} 남았어요!";
    } else if (remainingAmount < 0) {
      return "👏 ${-remainingAmount} ${plan.unit} 더 했어요!";
    } else {
      return "🥳 오늘의 목표 달성!";
    }
  }

  static Color getProgressColor(double percentage) {
    if (percentage >= 1.0) {
      return const Color(0xFF00C853); // Green A700
    } else if (percentage >= 0.6) {
      return const Color(0xFFFFD600); // Yellow A700
    } else {
      return const Color(0xFFFF3D00); // Deep Orange A400
    }
  }

  static String formatDuration(int minutes) {
    int hours = minutes ~/ 60;
    int remainingMinutes = minutes % 60;
    if (hours > 0) {
      return '$hours시간 $remainingMinutes분';
    } else {
      return '$minutes분';
    }
  }
}
