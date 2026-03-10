import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/core/user_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class ProfileBottomWidget extends StatelessWidget {
  const ProfileBottomWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final userController = Get.find<UserController>();

    void showDeleteAccountDialog() {
      Get.defaultDialog(
        title: '회원 탈퇴',
        middleText: '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
        textConfirm: '탈퇴',
        textCancel: '취소',
        confirmTextColor: Colors.white,
        onConfirm: () {
          userController.deleteUserAccount();
          Get.back();
        },
        onCancel: () => Get.back(),
      );
    }

    return Container(
      padding: const EdgeInsets.all(AppSizes.defaultSpace),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 40,
            child: OutlinedButton(
              onPressed: () => userController.logout(),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: colorScheme.onSurface.withOpacity(0.4)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: EdgeInsets.zero,
              ),
              child: Text(
                '로그아웃',
                style: TextStyle(
                  color: colorScheme.onSurface.withOpacity(0.4),
                  fontSize: 14,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Align(
            alignment: Alignment.centerRight,
            child: GestureDetector(
              onTap: showDeleteAccountDialog,
              child: Text(
                '회원탈퇴',
                style: TextStyle(
                  color: colorScheme.onSurface.withOpacity(0.6),
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
