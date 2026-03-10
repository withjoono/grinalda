import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:get/get.dart';
import 'package:hive/hive.dart';

import '../models/study_record_model.dart';
import '../../utils/exceptions/firebase_auth_exceptions.dart';
import '../../utils/exceptions/firebase_exceptions.dart';

class StudyRecordRepository extends GetxController {
  static StudyRecordRepository get instance => Get.find();

  final _db = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;
  late Box<StudyRecordModel> _cacheBox;

  @override
  void onInit() async {
    super.onInit();
    await _initHive();
  }

  Future<void> _initHive() async {
    try {
      if (!Hive.isBoxOpen('study_records')) {
        _cacheBox = await Hive.openBox<StudyRecordModel>('study_records');
      } else {
        _cacheBox = Hive.box<StudyRecordModel>('study_records');
      }
    } catch (e) {
      throw '캐시 초기화 중 오류가 발생했습니다: $e';
    }
  }

  String _getCacheKey(String planId, DateTime date) {
    return '$planId-${date.toUtc().toIso8601String().split('T')[0]}';
  }

  Future<void> addStudyRecord(StudyRecordModel record) async {
    try {
      String? uid = _auth.currentUser?.uid;
      if (uid == null) throw '사용자가 로그인되어 있지 않습니다.';

      DocumentReference docRef = await _db
          .collection("Users")
          .doc(uid)
          .collection("StudyRecords")
          .add(record.toFirestore());

      String cacheKey = _getCacheKey(record.studyPlanId, record.date);
      await _cacheBox.put(cacheKey, record.copyWith(id: docRef.id));
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      throw '학습 기록 추가 중 문제가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  Future<List<StudyRecordModel>> getAllStudyRecords() async {
    if (_cacheBox.isEmpty) {
      try {
        String? uid = _auth.currentUser?.uid;
        if (uid == null) throw '사용자가 로그인되어 있지 않습니다.';

        QuerySnapshot snapshot = await _db
            .collection("Users")
            .doc(uid)
            .collection("StudyRecords")
            .get();

        List<StudyRecordModel> records = snapshot.docs.map((doc) {
          StudyRecordModel record = StudyRecordModel.fromFirestore(doc);
          String cacheKey = _getCacheKey(record.studyPlanId, record.date);
          _cacheBox.put(cacheKey, record);
          return record;
        }).toList();

        return records;
      } on FirebaseAuthException catch (e) {
        throw CFirebaseAuthException(e.code).message;
      } on FirebaseException catch (e) {
        throw CFirebaseException(e.code).message;
      } catch (e) {
        throw '학습 기록을 불러오는 데 실패했습니다. 다시 시도해 주세요.';
      }
    } else {
      return _cacheBox.values.toList();
    }
  }

  Future<void> updateStudyRecord(StudyRecordModel record) async {
    try {
      String? uid = _auth.currentUser?.uid;
      if (uid == null) throw '사용자가 로그인되어 있지 않습니다.';

      await _db
          .collection("Users")
          .doc(uid)
          .collection("StudyRecords")
          .doc(record.id)
          .update(record.toFirestore());

      String cacheKey = _getCacheKey(record.studyPlanId, record.date);
      await _cacheBox.put(cacheKey, record);
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      throw '학습 기록 수정 중 문제가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  Future<void> deleteStudyRecord(
      String recordId, String planId, DateTime date) async {
    try {
      String? uid = _auth.currentUser?.uid;
      if (uid == null) throw '사용자가 로그인되어 있지 않습니다.';

      await _db
          .collection("Users")
          .doc(uid)
          .collection("StudyRecords")
          .doc(recordId)
          .delete();

      String cacheKey = _getCacheKey(planId, date);
      await _cacheBox.delete(cacheKey);
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      throw '학습 기록 삭제 중 문제가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  Future<void> clearCache() async {
    try {
      await _cacheBox.clear();
    } catch (e) {
      throw '캐시 초기화 중 오류가 발생했습니다: $e';
    }
  }
}
