import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lottie/lottie.dart';
import 'package:turtle_planner/src/screens/auth/login_options/widgets/login_options_footer_widget.dart';
import 'package:turtle_planner/src/utils/constants/app_images.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner/src/utils/constants/app_strings.dart';

class LoginOptionsScreen extends StatelessWidget {
  const LoginOptionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
          systemNavigationBarColor:
              Theme.of(context).colorScheme.surface, // Bottom bar color
          statusBarColor: Theme.of(context).colorScheme.surface),
    );
    final size = MediaQuery.of(context).size;
    return SafeArea(
      child: Scaffold(
        body: Container(
          padding: const EdgeInsets.all(AppSizes.defaultSpace),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 이미지
              Center(
                child: Lottie.asset(
                  AppImages.loginOptionsLottieImage,
                  height: size.height * 0.4,
                ),
              ),
              const SizedBox(height: AppSizes.formHeight),
              // 텍스트
              Center(
                child: Text(
                  AppStrings.loginOptionsTitle,
                  style: Theme.of(context).textTheme.headlineMedium,
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: AppSizes.formHeight - 20),
              Center(
                child: Text(
                  AppStrings.loginOptionsSubTitle,
                  style: Theme.of(context).textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
              ),
              // 빈 공간을 최대화
              const Expanded(child: SizedBox()),
              // 버튼들과 이용 동의 텍스트
              const LoginOptionsFooterWidget(),
            ],
          ),
        ),
      ),
    );
  }
}
