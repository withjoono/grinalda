// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'study_record_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class StudyRecordModelAdapter extends TypeAdapter<StudyRecordModel> {
  @override
  final int typeId = 1;

  @override
  StudyRecordModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return StudyRecordModel(
      id: fields[0] as String,
      studyPlanId: fields[1] as String,
      date: fields[2] as DateTime,
      amount: fields[3] as int,
      duration: fields[4] as int,
    );
  }

  @override
  void write(BinaryWriter writer, StudyRecordModel obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.studyPlanId)
      ..writeByte(2)
      ..write(obj.date)
      ..writeByte(3)
      ..write(obj.amount)
      ..writeByte(4)
      ..write(obj.duration);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StudyRecordModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
