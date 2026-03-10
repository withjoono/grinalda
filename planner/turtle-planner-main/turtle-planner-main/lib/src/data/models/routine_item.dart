import 'package:flutter/material.dart';

class RoutineItem {
  String title;
  String memo;
  DateTime startDate;
  DateTime? endDate;
  List<int> repeatDays;
  TimeOfDay startTime;
  TimeOfDay? endTime;
  IconData icon;
  bool hasNotification;
  Duration duration;
  Color color;

  RoutineItem({
    required this.title,
    required this.startDate,
    required this.repeatDays,
    required this.startTime,
    required this.memo,
    required this.icon,
    required this.color,
    this.endDate,
    this.endTime,
    this.hasNotification = false,
    this.duration = const Duration(hours: 1),
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'repeatDays': repeatDays,
      'memo': memo,
      'icon': icon.codePoint,
      'startTime': '${startTime.hour}:${startTime.minute}',
      'endTime': endTime != null ? '${endTime!.hour}:${endTime!.minute}' : null,
      'hasNotification': hasNotification,
      'duration': duration.inMinutes,
      'color': color.value, // 색상을 정수값으로 저장
    };
  }

  factory RoutineItem.fromJson(Map<String, dynamic> json) {
    return RoutineItem(
      title: json['title'],
      startDate: DateTime.parse(json['startDate']),
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      repeatDays: List<int>.from(json['repeatDays']),
      memo: json['memo'],
      icon: IconData(json['icon'], fontFamily: 'MaterialIcons'),
      startTime: TimeOfDay(
        hour: int.parse(json['startTime'].split(':')[0]),
        minute: int.parse(json['startTime'].split(':')[1]),
      ),
      endTime: json['endTime'] != null
          ? TimeOfDay(
              hour: int.parse(json['endTime'].split(':')[0]),
              minute: int.parse(json['endTime'].split(':')[1]),
            )
          : null,
      hasNotification: json['hasNotification'] ?? false,
      duration: Duration(minutes: json['duration'] ?? 60),
      color: Color(json['color']), // JSON에서 색상 복원
    );
  }
}
