import 'package:flutter/material.dart';

Widget defaultCellBuilder(
  BuildContext context,
  DateTime day,
  DateTime focusedDay,
) {
  final brightness = Theme.of(context).brightness;
  final isDarkMode = brightness == Brightness.dark;

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
              color: textColor,
            ),
          ),
        ],
      ),
    ),
  );
}
