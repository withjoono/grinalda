import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:hive/hive.dart';

part 'study_tag_model.g.dart';

@HiveType(typeId: 2)
class StudyTagModel extends HiveObject {
  @HiveField(0)
  String id;

  @HiveField(1)
  String name;

  @HiveField(2)
  int colorValue;

  @HiveField(3)
  bool isSystemTag;

  Color get color => Color(colorValue);

  set color(Color newColor) {
    colorValue = newColor.value;
  }

  StudyTagModel({
    required this.id,
    required this.name,
    required this.colorValue,
    this.isSystemTag = false,
  });

  // Hive를 위한 팩토리 생성자
  factory StudyTagModel.withColor({
    required String id,
    required String name,
    required Color color,
    bool isSystemTag = false,
  }) {
    return StudyTagModel(
      id: id,
      name: name,
      colorValue: color.value,
      isSystemTag: isSystemTag,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'colorValue': colorValue,
      'isSystemTag': isSystemTag,
    };
  }

  factory StudyTagModel.fromJson(Map<String, dynamic> json) {
    return StudyTagModel(
      id: json['id'],
      name: json['name'],
      colorValue: json['colorValue'],
      isSystemTag: json['isSystemTag'] ?? false,
    );
  }

  factory StudyTagModel.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return StudyTagModel(
      id: doc.id,
      name: data['name'],
      colorValue: data['colorValue'],
      isSystemTag: data['isSystemTag'] ?? false,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'name': name,
      'colorValue': colorValue,
      'isSystemTag': isSystemTag,
    };
  }

  StudyTagModel copyWith({
    String? id,
    String? name,
    Color? color,
    bool? isSystemTag,
  }) {
    return StudyTagModel(
      id: id ?? this.id,
      name: name ?? this.name,
      colorValue: color?.value ?? colorValue,
      isSystemTag: isSystemTag ?? this.isSystemTag,
    );
  }
}
