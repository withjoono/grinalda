import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:line_awesome_flutter/line_awesome_flutter.dart';
import 'package:turtle_planner/src/controllers/auth/mail_verification_controller.dart';
import 'package:turtle_planner/src/data/repositories/authentication_repository.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner/src/utils/constants/app_strings.dart';

class MailVerification extends StatelessWidget {
  const MailVerification({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<MailVerificationController>();
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(
              top: AppSizes.defaultSpace * 5,
              left: AppSizes.defaultSpace,
              right: AppSizes.defaultSpace,
              bottom: AppSizes.defaultSpace * 2),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(LineAwesomeIcons.envelope_open, size: 100),
              const SizedBox(height: AppSizes.defaultSpace * 2),
              Text(AppStrings.emailVerificationTitle,
                  style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: AppSizes.defaultSpace),
              Text(
                AppStrings.emailVerificationSubTitle,
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSizes.defaultSpace * 2),
              SizedBox(
                width: 200,
                child: OutlinedButton(
                    child: const Text(AppStrings.next),
                    onPressed: () =>
                        controller.manuallyCheckEmailVerificationStatus()),
              ),
              const SizedBox(height: AppSizes.defaultSpace * 2),
              TextButton(
                onPressed: () => controller.sendVerificationEmail(),
                child: const Text(AppStrings.resendEmailLink),
              ),
              TextButton(
                onPressed: () => AuthenticationRepository.instance.logout(),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(LineAwesomeIcons.long_arrow_alt_left_solid),
                    SizedBox(width: 5),
                    Text(AppStrings.backToLogin),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
