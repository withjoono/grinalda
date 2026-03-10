import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/data/models/user_model.dart';
import 'package:turtle_planner/src/screens/auth/mail_verification/mail_verification.dart';
import 'package:turtle_planner/src/data/repositories/authentication_repository.dart';
import 'package:turtle_planner/src/data/repositories/user_repository.dart';
import 'package:turtle_planner/src/utils/constants/app_images.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';
import 'package:turtle_planner/src/utils/helper/network_manager.dart';
import 'package:turtle_planner/src/utils/popups/full_screen_loader.dart';

class SignUpController extends GetxController {
  static SignUpController get instance => Get.find();

  final showPassword = false.obs;
  final isGoogleLoading = false.obs;
  GlobalKey<FormState> signupFormKey = GlobalKey<FormState>();

  // TextField Controllers to get data from TextFields
  final email = TextEditingController();
  final password = TextEditingController();
  final name = TextEditingController();

  /// Loader
  final isLoading = false.obs;

  @override
  void onClose() {
    email.dispose();
    password.dispose();
    name.dispose();
    super.onClose();
  }

  /// Register New User using either [EmailAndPassword] OR [PhoneNumber] authentication
  Future<void> createUser() async {
    try {
      if (!signupFormKey.currentState!.validate()) return;

      isLoading.value = true;
      FullScreenLoader.openLoadingDialog(
          '계정 생성 중...', AppImages.docerLottieImage);

      // Check Internet Connectivity
      final isConnected = await NetworkManager.instance.isConnected();
      if (!isConnected) {
        throw '인터넷 연결을 확인해주세요.';
      }

      // Get User and Pass it to Controller
      final user = UserModel(
        email: email.text.trim(),
        password: password.text.trim(),
        name: name.text.trim(),
      );

      // Authenticate User first
      final auth = AuthenticationRepository.instance;
      await auth.registerWithEmailAndPassword(user.email, user.password!);

      // Create user in Firestore
      await UserRepository.instance.createUser(user);

      Helper.successSnackBar(title: '성공', message: '계정이 성공적으로 생성되었습니다.');

      auth.setInitialScreen(auth.firebaseUser);
      Get.to(() => const MailVerification());
    } catch (e) {
      Helper.errorSnackBar(title: '오류', message: e.toString());
    } finally {
      isLoading.value = false;
      FullScreenLoader.stopLoading();
    }
  }

  void togglePasswordVisibility() {
    showPassword.value = !showPassword.value;
  }
}
