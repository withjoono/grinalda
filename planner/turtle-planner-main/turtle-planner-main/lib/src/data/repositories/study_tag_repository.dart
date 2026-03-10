import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:hive/hive.dart';

import '../models/study_tag_model.dart';
import '../../utils/exceptions/firebase_auth_exceptions.dart';
import '../../utils/exceptions/firebase_exceptions.dart';

class StudyTagRepository extends GetxController {
  static StudyTagRepository get instance => Get.find();

  final _db = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;
  late Box<StudyTagModel> _cacheBox;

  final RxList<StudyTagModel> tags = <StudyTagModel>[].obs;

  final List<StudyTagModel> systemStudyTags = [
    StudyTagModel(
      id: 'korean',
      name: '국어',
      colorValue: Colors.red[400]!.value,
      isSystemTag: true,
    ),
    StudyTagModel(
      id: 'math',
      name: '수학',
      colorValue: Colors.blue[400]!.value,
      isSystemTag: true,
    ),
    StudyTagModel(
      id: 'social',
      name: '사회',
      colorValue: Colors.green[400]!.value,
      isSystemTag: true,
    ),
    StudyTagModel(
      id: 'science',
      name: '과학',
      colorValue: Colors.orange[400]!.value,
      isSystemTag: true,
    ),
    StudyTagModel(
      id: 'english',
      name: '영어',
      colorValue: Colors.teal[400]!.value,
      isSystemTag: true,
    ),
    StudyTagModel(
      id: 'second_language',
      name: '제2외국어',
      colorValue: Colors.purple[400]!.value,
      isSystemTag: true,
    ),
    StudyTagModel(
      id: 'undecided',
      name: '미정',
      colorValue: Colors.blueGrey[400]!.value,
      isSystemTag: true,
    ),
  ];

  @override
  void onInit() async {
    super.onInit();
    await _initHive();
    loadStudyTags();
    _auth.authStateChanges().listen((user) {
      if (user != null) {
        loadStudyTags();
      } else {
        tags.clear();
      }
    });
  }

  Future<void> _initHive() async {
    try {
      _cacheBox = await Hive.openBox<StudyTagModel>('study_tags');
    } catch (e) {
      throw '캐시 초기화 중 오류가 발생했습니다: $e';
    }
  }

  Future<void> loadStudyTags() async {
    try {
      String? uid = _auth.currentUser?.uid;
      if (uid == null) {
        tags.value = [...systemStudyTags];
        return;
      }

      QuerySnapshot snapshot =
          await _db.collection("Users").doc(uid).collection("StudyTags").get();
      var userStudyTags =
          snapshot.docs.map((doc) => StudyTagModel.fromFirestore(doc)).toList();

      await _cacheBox.clear();
      for (var tag in userStudyTags) {
        await _cacheBox.put(tag.id, tag);
      }

      tags.value = [...systemStudyTags, ...userStudyTags];
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      throw '태그를 불러오는 중 문제가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  List<StudyTagModel> getSystemStudyTags() {
    return systemStudyTags;
  }

  List<StudyTagModel> getUserStudyTags() {
    return tags.where((tag) => !tag.isSystemTag).toList();
  }

  Future<void> addStudyTag(StudyTagModel tag) async {
    try {
      String? uid = _auth.currentUser?.uid;
      if (uid == null) throw '사용자가 로그인되어 있지 않습니다.';

      if (systemStudyTags.any((sysStudyTag) =>
          sysStudyTag.name.toLowerCase() == tag.name.toLowerCase())) {
        throw '기본 태그와 동일한 이름의 태그를 생성할 수 없습니다.';
      }

      DocumentReference docRef = await _db
          .collection("Users")
          .doc(uid)
          .collection("StudyTags")
          .add(tag.toFirestore());
      tag.id = docRef.id;

      await _cacheBox.put(tag.id, tag);

      tags.add(tag);
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      throw '태그 추가 중 문제가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  Future<void> updateStudyTag(StudyTagModel tag) async {
    try {
      if (tag.isSystemTag) throw '기본 태그는 수정할 수 없습니다.';

      String? uid = _auth.currentUser?.uid;
      if (uid == null) throw '사용자가 로그인되어 있지 않습니다.';

      await _db
          .collection("Users")
          .doc(uid)
          .collection("StudyTags")
          .doc(tag.id)
          .update(tag.toFirestore());

      await _cacheBox.put(tag.id, tag);

      int index = tags.indexWhere((t) => t.id == tag.id);
      if (index != -1) {
        tags[index] = tag;
        tags.refresh();
      }
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      throw '태그 수정 중 문제가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  Future<void> deleteStudyTag(StudyTagModel tag) async {
    try {
      if (tag.isSystemTag) throw '기본 태그는 삭제할 수 없습니다.';

      String? uid = _auth.currentUser?.uid;
      if (uid == null) throw '사용자가 로그인되어 있지 않습니다.';

      await _db
          .collection("Users")
          .doc(uid)
          .collection("StudyTags")
          .doc(tag.id)
          .delete();

      await _cacheBox.delete(tag.id);

      tags.removeWhere((t) => t.id == tag.id);
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      throw '태그 삭제 중 문제가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  StudyTagModel? getStudyTagById(String id) {
    StudyTagModel? cachedTag = _cacheBox.get(id);
    if (cachedTag != null) return cachedTag;

    return tags.firstWhereOrNull((tag) => tag.id == id);
  }

  StudyTagModel? getStudyTagByName(String name) {
    return tags.firstWhereOrNull(
        (tag) => tag.name.toLowerCase() == name.toLowerCase());
  }

  List<StudyTagModel> getAllStudyTags() {
    return tags;
  }

  Future<void> clearCache() async {
    try {
      await _cacheBox.clear();
    } catch (e) {
      throw '캐시 초기화 중 오류가 발생했습니다: $e';
    }
  }
}
