import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/loaders/animation_loader.dart';
import "../helper/device_helper.dart";

class FullScreenLoader {
  static void openLoadingDialog(String text, String animation) {
    showDialog(
      context: Get.overlayContext!,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return PopScope(
          canPop: false,
          child: Container(
            color:
                DeviceHelper.isDarkMode(context) ? Colors.black : Colors.white,
            width: double.infinity,
            height: double.infinity,
            child: Column(
              children: [
                const SizedBox(height: 250),
                AnimationLoaderWidget(text: text, animation: animation),
              ],
            ),
          ),
        );
      },
    );
  }

  static stopLoading() {
    if (Get.isDialogOpen == true) {
      Navigator.of(Get.overlayContext!).pop();
    }
  }
}
