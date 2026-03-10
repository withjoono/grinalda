import 'package:flutter/material.dart';

Widget todayCellBuilder(
  BuildContext context,
  DateTime day,
  DateTime focusedDay,
) {
  final theme = Theme.of(context);
  final isDarkMode = theme.brightness == Brightness.dark;

  Color textColor;
  if (day.weekday == 7) {
    textColor = Colors.red;
  } else if (day.weekday == 6) {
    textColor = Colors.blue;
  } else {
    textColor = isDarkMode ? Colors.white : Colors.black;
  }

  return Container(
    padding: const EdgeInsets.only(top: 4),
    child: SizedBox(
      child: Column(
        children: [
          Text(
            '${day.day}',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
        ],
      ),
    ),
  );
}
