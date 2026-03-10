import 'package:flutter/material.dart';

class ScheduleItem {
  String title;
  String memo;
  DateTime date;
  TimeOfDay? startTime;
  TimeOfDay? endTime;
  IconData icon;
  Color color;

  ScheduleItem({
    required this.title,
    required this.date,
    required this.memo,
    required this.icon,
    required this.color,
    this.startTime,
    this.endTime,
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'date': date.toIso8601String(),
      'memo': memo,
      'icon': icon.codePoint,
      'startTime':
          startTime != null ? '${startTime!.hour}:${startTime!.minute}' : null,
      'endTime': endTime != null ? '${endTime!.hour}:${endTime!.minute}' : null,
      'color': color.value, // 색상을 정수값으로 저장
    };
  }

  factory ScheduleItem.fromJson(Map<String, dynamic> json) {
    return ScheduleItem(
      title: json['title'],
      date: DateTime.parse(json['date']),
      memo: json['memo'],
      icon: IconData(json['icon'], fontFamily: 'MaterialIcons'),
      startTime: json['startTime'] != null
          ? TimeOfDay(
              hour: int.parse(json['startTime'].split(':')[0]),
              minute: int.parse(json['startTime'].split(':')[1]))
          : null,
      endTime: json['endTime'] != null
          ? TimeOfDay(
              hour: int.parse(json['endTime'].split(':')[0]),
              minute: int.parse(json['endTime'].split(':')[1]))
          : null,
      color: Color(json['color']), // JSON에서 색상 복원
    );
  }
}
