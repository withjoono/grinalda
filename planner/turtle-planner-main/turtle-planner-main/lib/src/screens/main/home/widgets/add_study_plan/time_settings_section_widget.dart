import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:turtle_planner/src/common_widgets/labels/form_label_widget.dart';
import 'package:turtle_planner/src/common_widgets/selectors/box_selector_widget.dart';
import 'package:turtle_planner/src/common_widgets/selectors/weekday_selector_widget.dart';
import 'package:turtle_planner/src/common_widgets/calendar/calendar.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class TimeSettingsSectionWidget extends StatelessWidget {
  final DateTime startDate;
  final DateTime goalDate;
  final List<int> selectedDays;
  final Function(DateTime) onStartDateChanged;
  final Function(DateTime) onGoalDateChanged;
  final Function(List<int>) onSelectedDaysChanged;

  const TimeSettingsSectionWidget({
    super.key,
    required this.startDate,
    required this.goalDate,
    required this.selectedDays,
    required this.onStartDateChanged,
    required this.onGoalDateChanged,
    required this.onSelectedDaysChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const FormLabelWidget(
          text: '시간 설정',
          size: LabelSize.md,
        ),
        BoxSelectorWidget(
          label: '🐤 시작일',
          value: DateFormat('yyyy-MM-dd').format(startDate),
          onTap: () => _showDatePicker(context, true),
          labelSize: LabelSize.md,
        ),
        const SizedBox(height: 10),
        BoxSelectorWidget(
          label: '🐔 목표일',
          value: DateFormat('yyyy-MM-dd').format(goalDate),
          onTap: () => _showDatePicker(context, false),
          labelSize: LabelSize.md,
        ),
        const SizedBox(height: 20),
        WeekdaySelectorWidget(
          selectedDays: selectedDays,
          onSelectionChanged: onSelectedDaysChanged,
        ),
      ],
    );
  }

  void _showDatePicker(BuildContext context, bool isStartDate) {
    final colorScheme = Theme.of(context).colorScheme;
    final backgroundColor = colorScheme.surface.withOpacity(0.5);
    final sheetColor = colorScheme.surface;

    // 오늘의 날짜를 0시 0분으로 고정
    final today = DateTime.now();
    final todayWithoutTime = DateTime(today.year, today.month, today.day);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      barrierColor: backgroundColor,
      builder: (BuildContext context) {
        return Container(
          color: sheetColor,
          child: SizedBox(
            height: MediaQuery.of(context).size.height * 0.6,
            child: Calendar(
              datasets: const {}, // 데이터를 추가할 수 있음
              initialSelectedDay: isStartDate ? startDate : goalDate,
              onDaySelected: (selectedDay, _) {
                // 선택된 날짜에서 시간 정보 제외
                final selectedDayWithoutTime = DateTime(
                  selectedDay.year,
                  selectedDay.month,
                  selectedDay.day,
                );

                if (isStartDate) {
                  if (!selectedDayWithoutTime.isBefore(todayWithoutTime)) {
                    onStartDateChanged(selectedDayWithoutTime);
                    if (goalDate.isBefore(selectedDayWithoutTime)) {
                      onGoalDateChanged(
                          selectedDayWithoutTime.add(const Duration(days: 1)));
                    }
                  } else {
                    Helper.modernSnackBar(
                      title: '잘못된 선택',
                      message: '오늘 이후의 날짜만 선택할 수 있습니다. 다시 선택해 주세요.',
                    );
                    return;
                  }
                } else {
                  onGoalDateChanged(selectedDayWithoutTime
                      .add(const Duration(days: 1))
                      .subtract(const Duration(seconds: 1)));
                }
                Navigator.pop(context);
              },
              firstDay: isStartDate ? todayWithoutTime : startDate,
              lastDay: isStartDate
                  ? todayWithoutTime.add(const Duration(days: 365))
                  : startDate.add(const Duration(days: 365)),
            ),
          ),
        );
      },
    );
  }
}
