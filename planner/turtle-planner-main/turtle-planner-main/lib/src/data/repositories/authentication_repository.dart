import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/services.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:turtle_planner/home_menu.dart';

import '../../screens/auth/mail_verification/mail_verification.dart';
import '../../screens/auth/welcome/welcome_screen.dart';
import '../../utils/exceptions/firebase_auth_exceptions.dart';
import '../../utils/exceptions/firebase_exceptions.dart';
import '../../utils/exceptions/format_exceptions.dart';
import '../../utils/exceptions/platform_exceptions.dart';

class AuthenticationRepository extends GetxController {
  static AuthenticationRepository get instance => Get.find();

  /// Variables
  late final Rx<User?> _firebaseUser;
  final _auth = FirebaseAuth.instance;
  final userStorage = GetStorage();

  /// Getters
  User? get firebaseUser => _firebaseUser.value;
  String get getUserID => firebaseUser?.uid ?? "";
  String get getUserEmail => firebaseUser?.email ?? "";
  String get getDisplayName => firebaseUser?.displayName ?? "";

  /// 앱 실행 시 main.dart에서 로드됨
  @override
  void onReady() {
    _firebaseUser = Rx<User?>(_auth.currentUser);
    _firebaseUser.bindStream(_auth.userChanges());
    FlutterNativeSplash.remove();
    setInitialScreen(_firebaseUser.value);
  }

  /// 초기 화면 설정
  setInitialScreen(User? user) async {
    if (user != null) {
      user.emailVerified
          ? Get.offAll(() => const HomeMenu())
          : Get.offAll(() => const MailVerification());
    } else {
      userStorage.write('isFirstTime', true);
      Get.offAll(() => const WelcomeScreen());
    }
  }

  /// [이메일 인증] - 로그인
  Future<void> loginWithEmailAndPassword(String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  /// [이메일 인증] - 회원가입
  Future<String?> registerWithEmailAndPassword(
      String email, String password) async {
    try {
      final UserCredential userCredential =
          await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      final User? user = userCredential.user;
      return user?.uid;
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  /// [이메일 인증] - 이메일 검증
  Future<void> sendEmailVerification() async {
    try {
      await _auth.currentUser?.sendEmailVerification();
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw '이메일 인증 메일 발송 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  /// [구글 인증] - 구글
  Future<UserCredential?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      final GoogleSignInAuthentication? googleAuth =
          await googleUser?.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth?.accessToken,
        idToken: googleAuth?.idToken,
      );
      return await FirebaseAuth.instance.signInWithCredential(credential);
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw 'Google 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  /// [로그아웃] - 모든 인증 방식에 유효
  Future<void> logout() async {
    try {
      await GoogleSignIn().signOut();
      await FirebaseAuth.instance.signOut();
      Get.offAll(() => const WelcomeScreen());
    } on FirebaseAuthException catch (e) {
      throw CFirebaseAuthException(e.code).message;
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (_) {
      throw '로그아웃 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }

  /// 현재 사용자 삭제
  Future<void> deleteUser() async {
    try {
      User? user = _auth.currentUser;
      if (user != null) {
        await user.delete();
        await logout();
      } else {
        throw '삭제할 사용자를 찾을 수 없습니다.';
      }
    } on FirebaseAuthException catch (e) {
      if (e.code == 'requires-recent-login') {
        throw '계정을 삭제하기 전에 다시 로그인해주세요.';
      } else {
        throw CFirebaseAuthException(e.code).message;
      }
    } on FirebaseException catch (e) {
      throw CFirebaseException(e.code).message;
    } on FormatException catch (_) {
      throw const CFormatException().message;
    } on PlatformException catch (e) {
      throw CPlatformException(e.code).message;
    } catch (e) {
      throw '계정 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }
}
