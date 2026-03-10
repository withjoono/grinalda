import 'package:flutter/material.dart';
// import 'package:get/get.dart';
// import 'package:turtle_planner_v2/src/controllers/auth/login_controller.dart';
// import 'package:turtle_planner_v2/src/screens/auth/login/login_screen.dart';
// import 'package:turtle_planner_v2/src/utils/constants/app_colors.dart';
// import 'package:turtle_planner_v2/src/utils/constants/app_images.dart';
import 'package:turtle_planner_v2/src/utils/constants/app_sizes.dart';
// import 'package:turtle_planner_v2/src/utils/constants/app_strings.dart';

class LoginOptionsFooterWidget extends StatelessWidget {
  const LoginOptionsFooterWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    // final controller = Get.find<LoginController>();
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        SizedBox(height: AppSizes.formHeight),
        // 이용 동의 텍스트
        Text(
          "계속 진행하면 이용 약관에 동의하고, 개인정보 처리방침을\n확인했음을 인정하게 됩니다.",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 12),
        ),
      ],
    );
  }
}
