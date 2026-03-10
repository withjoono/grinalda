import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';

class CalendarContentWidget extends StatelessWidget {
  final Map<String, List<StudyPlanModel>> groupedPlans;
  final RxInt selectedYear;
  final ScrollController verticalScrollController;
  final ScrollController horizontalScrollController;
  final RxString selectedTag;
  final RxInt selectedItemIndex;
  final double dayWidth = 5.0;
  final double monthWidth = 5.0 * 365 / 12;
  final double rowHeight = 30.0;
  final double rowSpacing = 5.0;
  final double tagSpacing = 20.0;

  const CalendarContentWidget({
    super.key,
    required this.groupedPlans,
    required this.selectedYear,
    required this.verticalScrollController,
    required this.horizontalScrollController,
    required this.selectedTag,
    required this.selectedItemIndex,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      controller: horizontalScrollController,
      child: SizedBox(
        width: 365 * dayWidth,
        child: Stack(
          children: [
            CustomPaint(
              size: Size(365 * dayWidth, double.infinity),
              painter: GridPainter(monthWidth),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildMonthRow(),
                Expanded(
                  child: SingleChildScrollView(
                    controller: verticalScrollController,
                    child: Column(
                      children: [
                        ...groupedPlans.entries.map((entry) {
                          return Column(
                            children: [
                              _buildStudyPlanBars(entry.key, entry.value),
                              SizedBox(height: tagSpacing),
                            ],
                          );
                        }),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            if (_isCurrentYearSelected())
              Positioned(
                left: _getCurrentDatePosition(),
                top: 0,
                bottom: 0,
                child: Container(
                  width: 2,
                  color: Colors.red,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthRow() {
    return SizedBox(
      height: 60,
      child: Row(
        children: List.generate(
          12,
          (index) => Container(
            width: monthWidth,
            padding: const EdgeInsets.all(8),
            alignment: Alignment.center,
            child: Text('${index + 1}월',
                style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
        ),
      ),
    );
  }

  Widget _buildStudyPlanBars(String tagId, List<StudyPlanModel> plans) {
    return SizedBox(
      height: plans.length * (rowHeight + rowSpacing),
      child: Stack(
        children: plans.asMap().entries.map((entry) {
          int index = entry.key;
          StudyPlanModel plan = entry.value;
          return Obx(() => _buildStudyPlanBar(plan, index,
              tagId == selectedTag.value && index == selectedItemIndex.value));
        }).toList(),
      ),
    );
  }

  Widget _buildStudyPlanBar(
      StudyPlanModel plan, int rowIndex, bool isSelected) {
    final startDate = plan.startDate;
    final endDate = plan.goalDate;
    final yearStartDate = DateTime(selectedYear.value, 1, 1);
    final yearEndDate = DateTime(selectedYear.value, 12, 31);

    final effectiveStartDate =
        startDate.isBefore(yearStartDate) ? yearStartDate : startDate;
    final effectiveEndDate =
        endDate.isAfter(yearEndDate) ? yearEndDate : endDate;

    final startOffset = effectiveStartDate.difference(yearStartDate).inDays;
    final duration = effectiveEndDate.difference(effectiveStartDate).inDays + 1;

    final StudyTagRepository tagRepository = Get.find<StudyTagRepository>();
    final tag = tagRepository.getStudyTagById(plan.tagId);
    final tagColor = tag != null ? Color(tag.colorValue) : Colors.blue;

    return Positioned(
      left: startOffset * dayWidth,
      top: rowIndex * (rowHeight + rowSpacing),
      child: Container(
        width: duration * dayWidth,
        height: rowHeight,
        decoration: BoxDecoration(
          color: tagColor,
          borderRadius: BorderRadius.circular(4),
          border: isSelected
              ? Border.all(
                  color: Get.isDarkMode ? Colors.white : Colors.black,
                  width: 2,
                )
              : null,
        ),
        child: Center(
          child: Text(
            plan.title,
            style: TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ),
    );
  }

  bool _isCurrentYearSelected() {
    return selectedYear.value == DateTime.now().year;
  }

  double _getCurrentDatePosition() {
    final now = DateTime.now();
    final yearStartDate = DateTime(selectedYear.value, 1, 1);
    final daysFromStart = now.difference(yearStartDate).inDays;
    return daysFromStart * dayWidth;
  }
}

class GridPainter extends CustomPainter {
  final double monthWidth;

  GridPainter(this.monthWidth);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.grey.withOpacity(0.2)
      ..strokeWidth = 1;

    for (int i = 0; i <= 12; i++) {
      final x = i * monthWidth;
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
