import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:get/get.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../models/study_plan_model.dart';
import '../../utils/exceptions/firebase_auth_exceptions.dart';
import '../../utils/exceptions/firebase_exceptions.dart';

class StudyPlanRepository extends GetxController {
  static StudyPlanRepository get instance => Get.find();

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  late Box<StudyPlanModel> _cacheBox;

  final RxList<StudyPlanModel> plans = <StudyPlanModel>[].obs;
  final RxBool isLoading = false.obs;

  @override
  void onInit() async {
    super.onInit();
    await _initHive();
    await loadStudyPlans();
    _auth.authStateChanges().listen((user) {
      if (user != null) {
        loadStudyPlans();
      } else {
        clearCache();
        plans.clear();
      }
    });
  }

  Future<void> _initHive() async {
    try {
      _cacheBox = await Hive.openBox<StudyPlanModel>('study_plans');
    } catch (e) {
      throw '캐시 초기화 중 오류가 발생했습니다: $e';
    }
  }

  CollectionReference<Map<String, dynamic>> get _studyPlansCollection {
    return _firestore
        .collection('Users')
        .doc(_auth.currentUser!.uid)
        .collection('StudyPlans');
  }

  Future<void> loadStudyPlans() async {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
      String? uid = _auth.currentUser?.uid;
      if (uid == null) {
        plans.clear();
        return;
      }

      var cachedPlans = _cacheBox.values.toList();
      if (cachedPlans.isNotEmpty) {
        plans.value = cachedPlans;
        return;
      }

      QuerySnapshot snapshot = await _studyPlansCollection.get();
      var serverPlans = snapshot.docs
          .map((doc) => StudyPlanModel.fromFirestore(doc))
          .toList();

      await _cacheBox.clear();
      for (var plan in serverPlans) {
        await _cacheBox.put(plan.id, plan);
      }

      plans.value = serverPlans;
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      print('학습 계획 로드 중 오류 발생: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<String> addStudyPlan(StudyPlanModel plan) async {
    try {
      DocumentReference docRef =
          await _studyPlansCollection.add(plan.toFirestore());
      String newId = docRef.id;
      StudyPlanModel newPlan = plan.copyWith(id: newId);
      await _cacheBox.put(newId, newPlan);
      plans.add(newPlan);
      return newId;
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      print('학습 계획 추가 중 오류 발생: $e');
      throw '학습 계획을 추가하는데 실패했습니다. 다시 시도해 주세요.';
    }
  }

  Future<void> updateStudyPlan(StudyPlanModel plan) async {
    try {
      await _studyPlansCollection.doc(plan.id).update(plan.toFirestore());
      await _cacheBox.put(plan.id, plan);
      int index = plans.indexWhere((p) => p.id == plan.id);
      if (index != -1) {
        plans[index] = plan;
        plans.refresh();
      }
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      print('학습 계획 업데이트 중 오류 발생: $e');
      throw '학습 계획을 업데이트하는데 실패했습니다. 다시 시도해 주세요.';
    }
  }

  Future<void> deleteStudyPlan(String planId) async {
    try {
      await _studyPlansCollection.doc(planId).delete();
      await _cacheBox.delete(planId);
      plans.removeWhere((p) => p.id == planId);
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      print('학습 계획 삭제 중 오류 발생: $e');
      throw '학습 계획을 삭제하는데 실패했습니다. 다시 시도해 주세요.';
    }
  }

  Future<void> clearCache() async {
    try {
      await _cacheBox.clear();
    } catch (e) {
      throw '캐시 초기화 중 오류가 발생했습니다: $e';
    }
  }

  Future<void> syncWithServer() async {
    isLoading.value = true;
    try {
      QuerySnapshot snapshot = await _studyPlansCollection.get();
      var serverPlans = snapshot.docs
          .map((doc) => StudyPlanModel.fromFirestore(doc))
          .toList();

      await _cacheBox.clear();
      for (var plan in serverPlans) {
        await _cacheBox.put(plan.id, plan);
      }

      plans.value = serverPlans;
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } catch (e) {
      print('서버와 동기화 중 오류 발생: $e');
    } finally {
      isLoading.value = false;
    }
  }
}
