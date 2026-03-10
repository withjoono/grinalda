import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/labels/form_label_widget.dart';
import 'package:turtle_planner/src/common_widgets/selectors/study_tag_selector_widget.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';

class StudyTagSelectorPage extends StatelessWidget {
  final StudyTagModel selectedTag;
  final Function(StudyTagModel) onTagSelected;

  const StudyTagSelectorPage({
    super.key,
    required this.selectedTag,
    required this.onTagSelected,
  });

  @override
  Widget build(BuildContext context) {
    final StudyTagRepository tagRepository = Get.find<StudyTagRepository>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('학습 태그 선택'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const FormLabelWidget(
              text: '태그 선택',
              size: LabelSize.md,
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: tagRepository
                  .getSystemStudyTags()
                  .map((tag) => StudyTagSelectorWidget(
                        tag: tag,
                        isSelected: tag.id == selectedTag.id,
                        onTap: () => onTagSelected(tag),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 24),
            // const Text('사용자 태그',
            //     style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            // const SizedBox(height: 8),
            // Obx(() {
            //   final userTags = tagRepository.getUserStudyTags();
            //   if (userTags.isEmpty) {
            //     return Center(
            //       child: Column(
            //         children: [
            //           const Text('사용자 태그가 없어요', style: TextStyle(fontSize: 16)),
            //           const SizedBox(height: 8),
            //           ElevatedButton(
            //             onPressed: () {
            //               // TODO: 태그 생성 페이지로 이동
            //             },
            //             child: const Text('생성하기'),
            //           ),
            //         ],
            //       ),
            //     );
            //   } else {
            //     return Wrap(
            //       spacing: 8,
            //       runSpacing: 8,
            //       children: userTags
            //           .map((tag) => StudyTagSelectorWidget(
            //                 tag: tag,
            //                 isSelected: tag.id == selectedTag.id,
            //                 onTap: () => onTagSelected(tag),
            //               ))
            //           .toList(),
            //     );
            //   }
            // }),
          ],
        ),
      ),
    );
  }
}
