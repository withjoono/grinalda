import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';

import '../models/user_model.dart';
import '../../utils/exceptions/firebase_auth_exceptions.dart';
import '../../utils/exceptions/firebase_exceptions.dart';
import '../../utils/exceptions/format_exceptions.dart';
import '../../utils/exceptions/platform_exceptions.dart';

class UserRepository extends GetxController {
  static UserRepository get instance => Get.find();

  final _db = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;

  /// Getters
  String get currentUserId => _auth.currentUser?.uid ?? "";
  String get currentUserEmail => _auth.currentUser?.email ?? "";
  String get currentUserDisplayName => _auth.currentUser?.displayName ?? "";

  /// 사용자 데이터 저장
  Future<void> createUser(UserModel user) async {
    try {
      await _db
          .collection("Users")
          .doc(_auth.currentUser?.uid)
          .set(user.toJson());
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw '사용자 데이터 저장 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  /// 특정 사용자 상세 정보 가져오기
  Future<UserModel> getUserDetails(String uid) async {
    try {
      final snapshot = await _db.collection("Users").doc(uid).get();
      if (!snapshot.exists) throw '해당 사용자를 찾을 수 없습니다.';

      return UserModel.fromSnapshot(snapshot);
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw '사용자 정보 조회 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  /// 사용자 정보 업데이트
  Future<void> updateUserRecord(UserModel user) async {
    try {
      await _db
          .collection("Users")
          .doc(_auth.currentUser?.uid)
          .update(user.toJson());
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw '사용자 정보 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  /// 사용자 데이터 삭제
  Future<void> deleteUser() async {
    try {
      await _db.collection("Users").doc(_auth.currentUser?.uid).delete();
      await _auth.currentUser?.delete();
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw '사용자 데이터 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  /// 사용자 존재 여부 확인
  Future<bool> userExists(String uid) async {
    try {
      final snapshot = await _db.collection("Users").doc(uid).get();
      return snapshot.exists;
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw '사용자 존재 여부 확인 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }
}
