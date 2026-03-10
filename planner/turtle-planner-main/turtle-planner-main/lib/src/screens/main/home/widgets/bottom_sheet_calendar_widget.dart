import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/calendar/calendar.dart';
import 'package:turtle_planner/src/controllers/screens/home/home_controller.dart';

class BottomSheetCalendarWidget extends StatelessWidget {
  // HomeController 인스턴스를 가져옴
  final HomeController controller = Get.find<HomeController>();

  // 기본 생성자
  BottomSheetCalendarWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.6,
      child: Calendar(
        datasets: {}, // 데이터를 추가할 수 있음
        initialSelectedDay: controller.selectedDate.value,
        onDaySelected: (selectedDay, focusedDay) {
          controller.setSelectedDateWithCalendar(selectedDay);
          Get.back(); // BottomSheet을 닫음
        },
      ),
    );
  }
}
