import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import "package:turtle_planner/src/data/repositories/study_tag_repository.dart";

class TagColumnWidget extends StatelessWidget {
  final Map<String, List<StudyPlanModel>> groupedPlans;
  final ScrollController scrollController;
  final Function(String) onTagTap;
  final RxString selectedTag;
  final double tagWidth = 5.0 * 365 / 12 * 0.8; // 80% of month width
  final double rowHeight = 30.0;
  final double tagSpacing = 20.0;

  const TagColumnWidget({
    super.key,
    required this.groupedPlans,
    required this.scrollController,
    required this.onTagTap,
    required this.selectedTag,
  });

  @override
  Widget build(BuildContext context) {
    final StudyTagRepository tagRepository = Get.find<StudyTagRepository>();

    return SizedBox(
      width: tagWidth,
      child: SingleChildScrollView(
        controller: scrollController,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 60,
              alignment: Alignment.centerLeft,
              padding: const EdgeInsets.only(left: 8),
              child: const Text('태그',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            ),
            ...groupedPlans.entries.map((entry) {
              StudyTagModel? tag = tagRepository.getStudyTagById(entry.key);
              return Column(
                children: [
                  _buildTagRow(tag, entry.value.length),
                  SizedBox(height: tagSpacing),
                ],
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildTagRow(StudyTagModel? tag, int itemCount) {
    return Obx(() => GestureDetector(
          onTap: () => onTagTap(tag?.id ?? ''),
          child: Container(
            height: rowHeight,
            padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
            decoration: BoxDecoration(
              color: selectedTag.value == tag?.id
                  ? Colors.grey.withOpacity(0.2)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Row(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    color: tag != null ? Color(tag.colorValue) : Colors.grey,
                    shape: BoxShape.circle,
                  ),
                  margin: const EdgeInsets.only(right: 8),
                ),
                Expanded(
                  child: Text(
                    "${tag?.name ?? 'Unknown'} ($itemCount)",
                    style: TextStyle(
                      fontWeight: selectedTag.value == tag?.id
                          ? FontWeight.bold
                          : FontWeight.normal,
                      fontSize: 12,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ));
  }
}
