import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:turtle_planner/src/controllers/screens/home/home_controller.dart';
import 'package:turtle_planner/src/screens/main/home/widgets/bottom_sheet_calendar_widget.dart';

class HeaderWidget extends StatelessWidget {
  // HomeController 인스턴스를 가져옴
  final HomeController controller = Get.find<HomeController>();

  // 기본 생성자
  HeaderWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final textStyle = Theme.of(context).textTheme.titleMedium;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        GestureDetector(
          onTap: () => _showBottomSheetCalendar(context),
          child: Obx(() => Row(
                children: [
                  Text(
                    DateFormat('yyyy년 MM월', Get.locale.toString())
                        .format(controller.selectedDate.value),
                    style: textStyle,
                  ),
                  const Icon(Icons.keyboard_arrow_down),
                ],
              )),
        ),
        IconButton(
          icon: const Icon(Icons.more_horiz),
          onPressed: () {
            // 여기에 버튼 클릭 시 동작을 추가할 수 있음
          },
        ),
      ],
    );
  }

  // BottomSheet을 표시하는 함수
  void _showBottomSheetCalendar(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final backgroundColor = colorScheme.surface.withOpacity(0.5);
    final sheetColor = colorScheme.surface;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      barrierColor: backgroundColor,
      builder: (BuildContext context) {
        return Container(
          color: sheetColor,
          child: BottomSheetCalendarWidget(), // const로 최적화
        );
      },
    );
  }
}
