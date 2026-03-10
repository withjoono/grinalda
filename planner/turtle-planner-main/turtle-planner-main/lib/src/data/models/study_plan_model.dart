import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:hive_flutter/hive_flutter.dart';

part 'study_plan_model.g.dart';

@HiveType(typeId: 3)
class StudyPlanModel {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final String tagId;

  @HiveField(3)
  final int totalAmount;

  @HiveField(4)
  final int completedAmount;

  @HiveField(5)
  final String unit;

  @HiveField(6)
  final List<int> studyDays;

  @HiveField(7)
  final DateTime startDate;

  @HiveField(8)
  final DateTime goalDate;

  @HiveField(9)
  final DateTime lastUpdated;

  StudyPlanModel({
    required this.id,
    required this.title,
    required this.tagId,
    required this.totalAmount,
    this.completedAmount = 0,
    required this.unit,
    required this.studyDays,
    required DateTime startDate,
    required DateTime goalDate,
    DateTime? lastUpdated,
  })  : startDate = _toUTCDateOnly(startDate),
        goalDate = _toUTCDateOnly(goalDate),
        lastUpdated = _toUTCDateOnly(lastUpdated ?? DateTime.now());

  static DateTime _toUTCDateOnly(DateTime date) {
    return DateTime.utc(date.year, date.month, date.day);
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'tagId': tagId,
      'totalAmount': totalAmount,
      'completedAmount': completedAmount,
      'unit': unit,
      'studyDays': studyDays,
      'startDate': startDate.toIso8601String(),
      'goalDate': goalDate.toIso8601String(),
      'lastUpdated': lastUpdated.toIso8601String(),
    };
  }

  factory StudyPlanModel.fromJson(Map<String, dynamic> json) {
    return StudyPlanModel(
      id: json['id'] as String,
      title: json['title'] as String,
      tagId: json['tagId'] as String,
      totalAmount: json['totalAmount'] as int,
      completedAmount: json['completedAmount'] as int,
      unit: json['unit'] as String,
      studyDays: List<int>.from(json['studyDays'] as List),
      startDate: DateTime.parse(json['startDate'] as String),
      goalDate: DateTime.parse(json['goalDate'] as String),
      lastUpdated: DateTime.parse(json['lastUpdated'] as String),
    );
  }

  factory StudyPlanModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return StudyPlanModel(
      id: doc.id,
      title: data['title'] as String,
      tagId: data['tagId'] as String,
      totalAmount: data['totalAmount'] as int,
      completedAmount: data['completedAmount'] as int,
      unit: data['unit'] as String,
      studyDays: List<int>.from(data['studyDays'] as List),
      startDate: (data['startDate'] as Timestamp).toDate(),
      goalDate: (data['goalDate'] as Timestamp).toDate(),
      lastUpdated: (data['lastUpdated'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'title': title,
      'tagId': tagId,
      'totalAmount': totalAmount,
      'completedAmount': completedAmount,
      'unit': unit,
      'studyDays': studyDays,
      'startDate': Timestamp.fromDate(startDate),
      'goalDate': Timestamp.fromDate(goalDate),
      'lastUpdated': Timestamp.fromDate(lastUpdated),
    };
  }

  StudyPlanModel copyWith({
    String? id,
    String? title,
    String? tagId,
    int? totalAmount,
    int? completedAmount,
    String? unit,
    List<int>? studyDays,
    DateTime? startDate,
    DateTime? goalDate,
    DateTime? lastUpdated,
  }) {
    return StudyPlanModel(
      id: id ?? this.id,
      title: title ?? this.title,
      tagId: tagId ?? this.tagId,
      totalAmount: totalAmount ?? this.totalAmount,
      completedAmount: completedAmount ?? this.completedAmount,
      unit: unit ?? this.unit,
      studyDays: studyDays ?? List.from(this.studyDays),
      startDate: startDate ?? this.startDate,
      goalDate: goalDate ?? this.goalDate,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }

  @override
  String toString() {
    return 'StudyPlanModel(id: $id, title: $title, tagId: $tagId, totalAmount: $totalAmount, completedAmount: $completedAmount, unit: $unit, studyDays: $studyDays, startDate: $startDate, goalDate: $goalDate, lastUpdated: $lastUpdated)';
  }
}
