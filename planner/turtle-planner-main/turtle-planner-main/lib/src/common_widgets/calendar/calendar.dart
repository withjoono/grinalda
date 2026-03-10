import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:turtle_planner/src/common_widgets/calendar/default_cell_builder.dart';
import 'package:turtle_planner/src/common_widgets/calendar/disabled_cell_builder.dart';
import 'package:turtle_planner/src/common_widgets/calendar/dow_builder.dart';
import 'package:turtle_planner/src/common_widgets/calendar/header_title_builder.dart';
import 'package:turtle_planner/src/common_widgets/calendar/marked_cell_builder.dart';
import 'package:turtle_planner/src/common_widgets/calendar/outside_cell_builder.dart';
import 'package:turtle_planner/src/common_widgets/calendar/selected_cell_builder.dart';
import 'package:turtle_planner/src/common_widgets/calendar/today_cell_builder.dart';

class Calendar extends StatefulWidget {
  final Map<DateTime, int> datasets;
  final Function(DateTime, DateTime) onDaySelected;
  final DateTime initialSelectedDay;
  final DateTime? firstDay;
  final DateTime? lastDay;

  const Calendar({
    super.key,
    required this.datasets,
    required this.onDaySelected,
    required this.initialSelectedDay,
    this.firstDay,
    this.lastDay,
  });

  @override
  State<Calendar> createState() => _CalendarState();
}

class _CalendarState extends State<Calendar> {
  late DateTime _selectedDay;
  late DateTime _focusedDay;
  var _calendarFormat = CalendarFormat.month;

  @override
  void initState() {
    super.initState();
    _selectedDay = widget.initialSelectedDay;
    _focusedDay = widget.initialSelectedDay;
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // 화면 크기에 따라 rowHeight를 동적으로 계산
        final availableHeight = constraints.maxHeight;
        final rowHeight = (availableHeight - 80) / 6; // 헤더와 요일 행을 고려하여 계산

        return TableCalendar(
          selectedDayPredicate: (day) {
            return isSameDay(_selectedDay, day);
          },
          onDaySelected: (selectedDay, focusedDay) {
            setState(() {
              _selectedDay = selectedDay;
              _focusedDay = focusedDay;
            });
            widget.onDaySelected(selectedDay, focusedDay);
          },
          onPageChanged: (focusedDay) {
            _focusedDay = focusedDay;
          },
          calendarFormat: _calendarFormat,
          onFormatChanged: (format) {
            setState(() {
              _calendarFormat = format;
            });
          },
          rowHeight: rowHeight,
          headerStyle: const HeaderStyle(
            formatButtonVisible: false,
          ),
          daysOfWeekHeight: 28,
          calendarBuilders: const CalendarBuilders(
            outsideBuilder: outsideCellBuilder,
            defaultBuilder: defaultCellBuilder,
            disabledBuilder: disabledCellBuilder,
            headerTitleBuilder: headerTitleBuilder,
            selectedBuilder: selectedCellBuilder,
            todayBuilder: todayCellBuilder,
            markerBuilder: markedCellBuilder,
            dowBuilder: dowBuilder,
          ),
          eventLoader: (day) {
            int? totalSeconds =
                widget.datasets[DateTime(day.year, day.month, day.day)];
            return totalSeconds != null ? [totalSeconds] : [];
          },
          firstDay: widget.firstDay ?? DateTime.utc(2021, 10, 16),
          lastDay: widget.lastDay ?? DateTime.now(),
          focusedDay: _focusedDay,
          availableGestures: AvailableGestures.horizontalSwipe,
        );
      },
    );
  }
}
