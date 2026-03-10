import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:turtle_planner/src/screens/main/profile/widgets/profile_widget.dart';
import 'package:turtle_planner/src/screens/main/profile/widgets/profile_settings_widget.dart';
import 'package:turtle_planner/src/screens/main/profile/widgets/profile_bottom_widget.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        systemNavigationBarColor: colorScheme.surfaceContainer,
        statusBarColor: colorScheme.surface,
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text("😊 마이페이지"),
        backgroundColor: colorScheme.surfaceContainer,
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(AppSizes.defaultSpace),
          child: const Column(
            children: [
              ProfileWidget(),
              SizedBox(height: 20),
              ProfileSettingsWidget(),
              SizedBox(height: 20),
              ProfileBottomWidget(),
            ],
          ),
        ),
      ),
    );
  }
}
