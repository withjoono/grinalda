import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/screens/auth/forget_password/widgets/forget_password_form_widget.dart';
import 'package:turtle_planner/src/screens/auth/forget_password/widgets/forget_password_header_widget.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class ForgetPasswordScreen extends StatelessWidget {
  const ForgetPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.chevron_left),
            iconSize: AppSizes.iconLg,
            onPressed: () => Get.back(),
          ),
          backgroundColor: Colors.transparent,
          elevation: 0,
        ),
        body: SingleChildScrollView(
          child: Container(
            padding: const EdgeInsets.all(AppSizes.defaultSpace),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ForgetPasswordHeaderWidget(size: size),
                const ForgetPasswordForm(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
