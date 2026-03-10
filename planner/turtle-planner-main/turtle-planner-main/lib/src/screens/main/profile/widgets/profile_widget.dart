import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/core/user_controller.dart';
import 'package:turtle_planner/src/utils/constants/app_sizes.dart';

class ProfileWidget extends StatelessWidget {
  const ProfileWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final userController = Get.find<UserController>();
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.all(AppSizes.defaultSpace),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Obx(() => RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: userController.user.value.name,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: colorScheme.onSurface,
                      ),
                    ),
                    TextSpan(
                      text: '  @${userController.user.value.id}',
                      style: TextStyle(
                        fontSize: 14,
                        color: colorScheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              )),
          const SizedBox(height: 8),
          Text(
            '학습일: -',
            style: TextStyle(
              fontSize: 14,
              color: colorScheme.primary,
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 40, // 버튼 높이를 약간 늘림
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: colorScheme.primary),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: EdgeInsets.zero, // 내부 패딩 제거
              ),
              child: Text(
                '프로필 편집',
                style: TextStyle(
                  color: colorScheme.primary,
                  fontSize: 14, // 텍스트 크기 조정
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
