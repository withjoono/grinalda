import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/auth/login_controller.dart';
import 'package:turtle_planner/src/screens/auth/login/login_screen.dart';
import 'package:turtle_planner/src/utils/constants/app_colors.dart';
import 'package:turtle_planner/src/utils/constants/app_images.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner/src/utils/constants/app_strings.dart';

class LoginOptionsFooterWidget extends StatelessWidget {
  const LoginOptionsFooterWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<LoginController>();
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final iconColor =
        isDarkMode ? Theme.of(context).colorScheme.onPrimary : Colors.white;
    return Column(
      children: [
        Obx(
          () => OutlinedButton.icon(
            onPressed: controller.isLoading.value
                ? () {}
                : controller.isGoogleLoading.value
                    ? () {}
                    : () => controller.googleSignIn(),
            icon: Image.asset(AppImages.googleImage, width: 20),
            label: const Text(AppStrings.signInWithGoogle),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.googleButtonText,
              backgroundColor: AppColors.googleButtonBg,
              minimumSize: const Size(double.infinity, 50),
              side: const BorderSide(color: AppColors.googleButtonBg),
            ),
          ),
        ),
        const SizedBox(height: AppSizes.formHeight - 20),

        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: () => Get.to(() => const LoginScreen()),
            icon: Image.asset(
              AppImages.emailImage,
              width: 20,
              color: iconColor,
            ),
            label: const Text(AppStrings.signInWithEmail),
          ),
        ),
        const SizedBox(height: AppSizes.formHeight),
        // 이용 동의 텍스트
        const Text(
          "계속 진행하면 이용 약관에 동의하고, 개인정보 처리방침을\n확인했음을 인정하게 됩니다.",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 12),
        ),
      ],
    );
  }
}
