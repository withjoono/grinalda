import 'package:flutter/material.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';
import 'package:turtle_planner/src/utils/constants/app_strings.dart';

class ForgetPasswordHeaderWidget extends StatelessWidget {
  const ForgetPasswordHeaderWidget({
    super.key,
    required this.size,
  });

  final Size size;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.forgetPasswordTitle,
          style: Theme.of(context).textTheme.headlineMedium,
        ),
        const SizedBox(
          height: AppSizes.defaultSpace - 10,
        ),
        Text(
          AppStrings.forgetPasswordSubTitle,
          style: Theme.of(context).textTheme.bodyLarge,
        ),
      ],
    );
  }
}
