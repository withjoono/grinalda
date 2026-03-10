// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'study_plan_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class StudyPlanModelAdapter extends TypeAdapter<StudyPlanModel> {
  @override
  final int typeId = 3;

  @override
  StudyPlanModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return StudyPlanModel(
      id: fields[0] as String,
      title: fields[1] as String,
      tagId: fields[2] as String,
      totalAmount: fields[3] as int,
      completedAmount: fields[4] as int,
      unit: fields[5] as String,
      studyDays: (fields[6] as List).cast<int>(),
      startDate: fields[7] as DateTime,
      goalDate: fields[8] as DateTime,
      lastUpdated: fields[9] as DateTime?,
    );
  }

  @override
  void write(BinaryWriter writer, StudyPlanModel obj) {
    writer
      ..writeByte(10)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.tagId)
      ..writeByte(3)
      ..write(obj.totalAmount)
      ..writeByte(4)
      ..write(obj.completedAmount)
      ..writeByte(5)
      ..write(obj.unit)
      ..writeByte(6)
      ..write(obj.studyDays)
      ..writeByte(7)
      ..write(obj.startDate)
      ..writeByte(8)
      ..write(obj.goalDate)
      ..writeByte(9)
      ..write(obj.lastUpdated);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StudyPlanModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
