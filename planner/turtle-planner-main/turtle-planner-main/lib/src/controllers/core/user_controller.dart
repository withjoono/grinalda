import 'package:get/get.dart';
import 'package:turtle_planner/src/data/models/user_model.dart';
import 'package:turtle_planner/src/data/repositories/authentication_repository.dart';
import 'package:turtle_planner/src/data/repositories/user_repository.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class UserController extends GetxController {
  static UserController get instance => Get.find();

  final _authRepo = AuthenticationRepository.instance;
  final _userRepo = UserRepository.instance;

  Rx<UserModel> user = UserModel.empty().obs;
  final isLoading = false.obs;

  @override
  void onInit() {
    fetchUserRecord();
    super.onInit();
  }

  /// Fetch user record
  Future<void> fetchUserRecord() async {
    try {
      isLoading.value = true;
      final userId = _authRepo.getUserID;
      if (userId.isNotEmpty) {
        final userDetails = await _userRepo.getUserDetails(userId);
        user(userDetails);
      }
    } catch (e) {
      user(UserModel.empty());
      Helper.errorSnackBar(title: "에러", message: '사용자 정보를 불러오는데 실패했습니다: $e');
    } finally {
      isLoading.value = false;
    }
  }

  /// Save user Record
  Future<void> saveUserRecord(UserModel user) async {
    try {
      isLoading.value = true;
      await _userRepo.createUser(user);
      this.user(user);
    } catch (e) {
      Helper.errorSnackBar(title: "에러", message: '사용자 정보 저장에 실패했습니다: $e');
    } finally {
      isLoading.value = false;
    }
  }

  /// Update user record
  Future<void> updateUserRecord(UserModel updatedUser) async {
    try {
      isLoading.value = true;
      await _userRepo.updateUserRecord(updatedUser);
      user(updatedUser);
    } catch (e) {
      Helper.errorSnackBar(title: "에러", message: '사용자 정보 업데이트에 실패했습니다: $e');
    } finally {
      isLoading.value = false;
    }
  }

  /// Delete user account
  Future<void> deleteUserAccount() async {
    try {
      isLoading.value = true;
      await _userRepo.deleteUser();
      await _authRepo.deleteUser();
      logout(); // 계정 삭제 후 로그아웃
    } catch (e) {
      Helper.errorSnackBar(title: "에러", message: '계정 삭제에 실패했습니다: $e');
    } finally {
      isLoading.value = false;
    }
  }

  /// Logout
  Future<void> logout() async {
    try {
      await _authRepo.logout();
      user(UserModel.empty());
    } catch (e) {
      Helper.errorSnackBar(title: "에러", message: '로그아웃에 실패했습니다: $e');
    }
  }
}
