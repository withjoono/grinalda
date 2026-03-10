import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/buttons/primary_button.dart';
import 'package:turtle_planner/src/controllers/auth/login_controller.dart';
import 'package:turtle_planner/src/screens/auth/forget_password/forget_password.dart';
import 'package:turtle_planner/src/screens/auth/signup/signup_screen.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner/src/utils/constants/app_strings.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';
import 'package:line_awesome_flutter/line_awesome_flutter.dart';

class LoginForm extends StatelessWidget {
  const LoginForm({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<LoginController>();
    return Form(
      key: controller.loginFormKey,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSizes.formHeight - 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// -- Email Field
            TextFormField(
              validator: Helper.validateEmail,
              controller: controller.email,
              decoration: const InputDecoration(
                labelText: AppStrings.email,
                hintText: AppStrings.emailPlaceholder,
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(
              height: AppSizes.formHeight - 20,
            ),

            /// -- Password Field
            Obx(
              () => TextFormField(
                controller: controller.password,
                validator: (value) {
                  if (value!.isEmpty) return 'Enter your password';
                  return null;
                },
                obscureText: controller.showPassword.value ? false : true,
                decoration: InputDecoration(
                  labelText: AppStrings.password,
                  hintText: AppStrings.passwordPlaceholder,
                  border: const OutlineInputBorder(),
                  suffixIcon: IconButton(
                    icon: controller.showPassword.value
                        ? const Icon(LineAwesomeIcons.eye)
                        : const Icon(LineAwesomeIcons.eye_slash),
                    onPressed: () => controller.showPassword.value =
                        !controller.showPassword.value,
                  ),
                ),
              ),
            ),
            const SizedBox(
              height: AppSizes.formHeight - 20,
            ),

            /// -- LOGIN BTN
            Obx(
              () => TPrimaryButton(
                isLoading: controller.isLoading.value ? true : false,
                text: AppStrings.login,
                onPressed: controller.isGoogleLoading.value
                    ? () {}
                    : controller.isLoading.value
                        ? () {}
                        : () => controller.login(),
              ),
            ),
            const SizedBox(height: AppSizes.formHeight - 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () => Get.to(() => const SignUpScreen()),
                  style: TextButton.styleFrom(
                    foregroundColor: Theme.of(context).colorScheme.primary,
                  ),
                  child: const Text(AppStrings.signup),
                ),
                const Text(' | '),
                TextButton(
                  onPressed: () => Get.to(() => const ForgetPasswordScreen()),
                  style: TextButton.styleFrom(
                    foregroundColor: Theme.of(context).colorScheme.secondary,
                  ),
                  child: const Text(AppStrings.findPassword),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
