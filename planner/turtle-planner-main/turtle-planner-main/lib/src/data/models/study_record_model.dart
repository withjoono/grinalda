import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:hive/hive.dart';

part 'study_record_model.g.dart';

@HiveType(typeId: 1)
class StudyRecordModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String studyPlanId;

  @HiveField(2)
  final DateTime date;

  @HiveField(3)
  final int amount;

  @HiveField(4)
  final int duration;

  StudyRecordModel({
    required this.id,
    required this.studyPlanId,
    required DateTime date,
    required this.amount,
    required this.duration,
  }) : date = _toUTCDateOnly(date);

  static DateTime _toUTCDateOnly(DateTime date) {
    return DateTime.utc(date.year, date.month, date.day);
  }

  static StudyRecordModel empty(String studyPlanId, DateTime date) {
    return StudyRecordModel(
      id: '',
      studyPlanId: studyPlanId,
      date: date,
      amount: 0,
      duration: 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'studyPlanId': studyPlanId,
      'date': date.toIso8601String(),
      'amount': amount,
      'duration': duration,
    };
  }

  factory StudyRecordModel.fromJson(Map<String, dynamic> json) {
    return StudyRecordModel(
      id: json['id'],
      studyPlanId: json['studyPlanId'],
      date: DateTime.parse(json['date']),
      amount: json['amount'],
      duration: json['duration'],
    );
  }

  factory StudyRecordModel.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    DateTime recordDate = (data['date'] as Timestamp).toDate();
    return StudyRecordModel(
      id: doc.id,
      studyPlanId: data['studyPlanId'],
      date: _toUTCDateOnly(recordDate),
      amount: data['amount'],
      duration: data['duration'],
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'studyPlanId': studyPlanId,
      'date': Timestamp.fromDate(date),
      'amount': amount,
      'duration': duration,
    };
  }

  StudyRecordModel copyWith({
    String? id,
    String? studyPlanId,
    DateTime? date,
    int? amount,
    int? duration,
  }) {
    return StudyRecordModel(
      id: id ?? this.id,
      studyPlanId: studyPlanId ?? this.studyPlanId,
      date: date ?? this.date,
      amount: amount ?? this.amount,
      duration: duration ?? this.duration,
    );
  }
}
