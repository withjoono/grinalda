import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import '../../data/models/user_model.dart';
import '../../data/repositories/authentication_repository.dart';
import '../core/user_controller.dart';
import '../../utils/constants/app_images.dart';
import '../../utils/helper/helper_controller.dart';
import '../../utils/helper/network_manager.dart';
import '../../utils/popups/full_screen_loader.dart';

class LoginController extends GetxController {
  static LoginController get instance => Get.find();

  final showPassword = false.obs;
  final rememberMe = false.obs;
  final localStorage = GetStorage();
  final email = TextEditingController();
  final password = TextEditingController();
  GlobalKey<FormState> loginFormKey = GlobalKey<FormState>();

  final isLoading = false.obs;
  final isGoogleLoading = false.obs;

  final _authRepo = AuthenticationRepository.instance;
  final userController = UserController.instance;

  @override
  void onInit() {
    email.text = localStorage.read('REMEMBER_ME_EMAIL') ?? '';
    password.text = localStorage.read('REMEMBER_ME_PASSWORD') ?? '';
    super.onInit();
  }

  @override
  void onClose() {
    email.dispose();
    password.dispose();
    super.onClose();
  }

  Future<void> login() async {
    if (!loginFormKey.currentState!.validate()) return;

    try {
      isLoading.value = true;
      FullScreenLoader.openLoadingDialog(
          '로그인 중...', AppImages.docerLottieImage);

      // Check Internet Connectivity
      final isConnected = await NetworkManager.instance.isConnected();
      if (!isConnected) {
        throw '인터넷 연결을 확인해주세요.';
      }

      // Save Data if Remember Me is selected
      if (rememberMe.value) {
        localStorage.write('REMEMBER_ME_EMAIL', email.text.trim());
        localStorage.write('REMEMBER_ME_PASSWORD', password.text.trim());
      }

      await _authRepo.loginWithEmailAndPassword(
          email.text.trim(), password.text.trim());

      // Fetch user data
      await userController.fetchUserRecord();

      Helper.successSnackBar(title: '성공', message: '로그인에 성공했습니다.');

      // Let AuthRepo handle screen redirection
      _authRepo.setInitialScreen(_authRepo.firebaseUser);
    } catch (e) {
      Helper.errorSnackBar(title: '오류', message: e.toString());
    } finally {
      isLoading.value = false;
      FullScreenLoader.stopLoading();
    }
  }

  Future<void> googleSignIn() async {
    try {
      isGoogleLoading.value = true;
      FullScreenLoader.openLoadingDialog(
          'Google 로그인 중...', AppImages.docerLottieImage);

      // Check Internet Connectivity
      final isConnected = await NetworkManager.instance.isConnected();
      if (!isConnected) {
        throw '인터넷 연결을 확인해주세요.';
      }

      // Perform Google Sign In
      final userCredential = await _authRepo.signInWithGoogle();

      if (userCredential != null) {
        // Check if user exists in our database
        final user = UserModel(
          email: userCredential.user!.email ?? '',
          name: userCredential.user!.displayName ?? '',
        );

        await userController.saveUserRecord(user);

        Helper.successSnackBar(title: '성공', message: 'Google 로그인에 성공했습니다.');

        // Let AuthRepo handle screen redirection
        _authRepo.setInitialScreen(_authRepo.firebaseUser);
      } else {
        throw 'Google 로그인에 실패했습니다.';
      }
    } catch (e) {
      Helper.errorSnackBar(title: '오류', message: e.toString());
    } finally {
      isGoogleLoading.value = false;
      FullScreenLoader.stopLoading();
    }
  }

  void togglePasswordVisibility() {
    showPassword.value = !showPassword.value;
  }

  void toggleRememberMe() {
    rememberMe.value = !rememberMe.value;
  }
}
