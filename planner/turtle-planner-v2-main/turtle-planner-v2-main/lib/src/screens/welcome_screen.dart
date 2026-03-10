import 'package:animated_splash_screen/animated_splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:page_transition/page_transition.dart';
import 'package:lottie/lottie.dart';
import 'package:turtle_planner_v2/src/screens/login_options/login_options_screen.dart';
import 'package:turtle_planner_v2/src/utils/constants/app_images.dart';
import 'package:turtle_planner_v2/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner_v2/src/utils/constants/app_strings.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
          systemNavigationBarColor:
              Theme.of(context).colorScheme.surface, // Bottom bar color
          statusBarColor: Theme.of(context).colorScheme.surface),
    );
    return AnimatedSplashScreen(
      splash: SizedBox(
        width: double.infinity,
        height: double.infinity,
        child: Stack(
          children: [
            Positioned(
              top: 80,
              left: AppSizes.defaultSpace,
              child: TweenAnimationBuilder<Offset>(
                duration: const Duration(milliseconds: 1500),
                tween: Tween<Offset>(
                    begin: const Offset(0, -0.3), end: Offset.zero),
                builder: (context, offset, child) {
                  return Transform.translate(
                    offset: offset * 100,
                    child: child,
                  );
                },
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      AppStrings.appName,
                      style: Theme.of(context)
                          .textTheme
                          .headlineSmall
                          ?.copyWith(
                              color: Theme.of(context).colorScheme.primary),
                    ),
                    Text(
                      AppStrings.splashTagLine1,
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                  ],
                ),
              ),
            ),
            Center(
              child: TweenAnimationBuilder<double>(
                duration: const Duration(milliseconds: 1500),
                tween: Tween<double>(begin: 0, end: 1),
                builder: (context, value, child) {
                  return Opacity(
                    opacity: value,
                    child: child,
                  );
                },
                child: Lottie.asset(
                  AppImages.splashLottieImage,
                  width: 250,
                  height: 250,
                ),
              ),
            ),
            Positioned(
              bottom: 40,
              right: AppSizes.defaultSpace,
              child: TweenAnimationBuilder<Offset>(
                duration: const Duration(milliseconds: 1500),
                tween: Tween<Offset>(
                    begin: const Offset(0.3, 0), end: Offset.zero),
                builder: (context, offset, child) {
                  return Transform.translate(
                    offset: offset * 100,
                    child: child,
                  );
                },
                child: Text(
                  AppStrings.splashTagLine2,
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
            ),
          ],
        ),
      ),

      nextScreen: const LoginOptionsScreen(),
      splashIconSize: double.infinity,
      // duration: 3000,
      splashTransition: SplashTransition.fadeTransition,
      backgroundColor: Theme.of(context).colorScheme.surface,
      pageTransitionType: PageTransitionType.fade,
    );
  }
}
