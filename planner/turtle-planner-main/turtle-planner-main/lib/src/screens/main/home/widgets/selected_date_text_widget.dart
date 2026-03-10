import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:turtle_planner/src/controllers/screens/home/home_controller.dart';

class SelectedDateTextWidget extends StatelessWidget {
  SelectedDateTextWidget({super.key});

  final controller = Get.find<HomeController>();

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Column(
      children: [
        Obx(() => Text(
              DateFormat('yyyy년 MM월 dd일', Get.locale.toString())
                  .format(controller.selectedDate.value),
              style: textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            )),
        const Text("임시 화면임")
      ],
    );
  }
}
