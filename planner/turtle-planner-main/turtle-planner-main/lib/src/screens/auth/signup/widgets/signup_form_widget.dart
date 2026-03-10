import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/buttons/primary_button.dart';
import 'package:turtle_planner/src/controllers/auth/signup_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner/src/utils/constants/app_strings.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';
import 'package:line_awesome_flutter/line_awesome_flutter.dart';

class SignUpForm extends StatelessWidget {
  const SignUpForm({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<SignUpController>();
    return Form(
      key: controller.signupFormKey,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSizes.formHeight - 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextFormField(
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
            Obx(
              () => TextFormField(
                controller: controller.password,
                validator: Helper.validatePassword,
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
            TextFormField(
              controller: controller.name,
              decoration: const InputDecoration(
                labelText: AppStrings.name,
                hintText: AppStrings.namePlaceholder,
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(
              height: AppSizes.formHeight - 10,
            ),
            Obx(
              () => TPrimaryButton(
                isLoading: controller.isLoading.value ? true : false,
                text: AppStrings.signupButton,
                onPressed: controller.isGoogleLoading.value
                    ? () {}
                    : controller.isLoading.value
                        ? () {}
                        : () async => {
                              await controller.createUser(),
                            },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
