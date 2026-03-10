import 'package:flutter/material.dart';

Widget outsideCellBuilder(
  BuildContext context,
  DateTime day,
  DateTime focusedDay,
) {
  final brightness = Theme.of(context).brightness;
  final isDarkMode = brightness == Brightness.dark;

  Color textColor;
  if (day.weekday == 7) {
    textColor = isDarkMode ? Colors.red.shade800 : Colors.red.shade200;
  } else if (day.weekday == 6) {
    textColor = isDarkMode ? Colors.blue.shade800 : Colors.blue.shade200;
  } else {
    textColor = isDarkMode ? Colors.grey.shade500 : Colors.black38;
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
              color: textColor,
            ),
          ),
        ],
      ),
    ),
  );
}
