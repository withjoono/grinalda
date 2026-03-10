import 'package:flutter/material.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner/src/utils/constants/app_strings.dart';

class ForgetPasswordForm extends StatelessWidget {
  const ForgetPasswordForm({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSizes.formHeight - 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextFormField(
              decoration: const InputDecoration(
                labelText: AppStrings.email,
                hintText: AppStrings.emailPlaceholder,
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(
              height: AppSizes.formHeight - 10,
            ),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {},
                child: const Text(
                  AppStrings.forgetPasswordButton,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
