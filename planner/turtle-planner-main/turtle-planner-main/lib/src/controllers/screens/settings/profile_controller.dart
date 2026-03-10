import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/data/models/user_model.dart';
import 'package:turtle_planner/src/data/repositories/authentication_repository.dart';
import 'package:turtle_planner/src/data/repositories/user_repository.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class ProfileController extends GetxController {
  static ProfileController get instance => Get.find();

  /// Repositories
  final _authRepo = AuthenticationRepository.instance;
  final _userRepo = UserRepository.instance;

  /// TextField Controllers
  final nameController = TextEditingController();
  final emailController = TextEditingController();

  /// Form Key
  final profileFormKey = GlobalKey<FormState>();

  /// Loading state
  final isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    loadUserData();
  }

  /// Load user data
  Future<void> loadUserData() async {
    try {
      isLoading.value = true;
      final currentUserUid = _authRepo.getUserID;
      if (currentUserUid.isNotEmpty) {
        final user = await _userRepo.getUserDetails(currentUserUid);
        nameController.text = user.name;
        emailController.text = user.email;
      } else {
        Helper.warningSnackBar(title: '주의', message: '사용자를 찾을 수 없습니다!');
      }
    } catch (e) {
      Helper.errorSnackBar(title: '에러', message: '사용자 정보를 불러오는데 실패했습니다: $e');
    } finally {
      isLoading.value = false;
    }
  }

  /// Update User Data
  Future<void> updateRecord() async {
    try {
      if (!profileFormKey.currentState!.validate()) return;

      isLoading.value = true;
      final user = UserModel(
        email: emailController.text.trim(), // Email won't change
        name: nameController.text.trim(),
      );
      await _userRepo.updateUserRecord(user);
      Helper.successSnackBar(title: "성공", message: '프로필이 업데이트되었습니다!');
    } catch (e) {
      Helper.errorSnackBar(title: '에러', message: '프로필 업데이트에 실패했습니다: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> deleteUser() async {
    try {
      isLoading.value = true;
      await _userRepo.deleteUser();
      await _authRepo.deleteUser();
      Helper.successSnackBar(title: '성공', message: '계정이 삭제되었습니다!');
      // Navigate to welcome or login screen
      // Get.offAll(() => WelcomeScreen());
    } catch (e) {
      Helper.errorSnackBar(title: '에러', message: '계정 삭제에 실패했습니다: $e');
    } finally {
      isLoading.value = false;
    }
  }
}
