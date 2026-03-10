// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'study_tag_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class StudyTagModelAdapter extends TypeAdapter<StudyTagModel> {
  @override
  final int typeId = 2;

  @override
  StudyTagModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return StudyTagModel(
      id: fields[0] as String,
      name: fields[1] as String,
      colorValue: fields[2] as int,
      isSystemTag: fields[3] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, StudyTagModel obj) {
    writer
      ..writeByte(4)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.colorValue)
      ..writeByte(3)
      ..write(obj.isSystemTag);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StudyTagModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
