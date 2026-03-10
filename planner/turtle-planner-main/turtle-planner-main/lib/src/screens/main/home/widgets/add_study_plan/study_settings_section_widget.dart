import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/common_widgets/labels/form_label_widget.dart';
import 'package:turtle_planner/src/common_widgets/selectors/box_selector_widget.dart';
import 'package:turtle_planner/src/common_widgets/badges/study_tag_badge_widget.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/utils/constants/app_enums.dart';
import 'study_tag_selector_page.dart';

class StudySettingsSectionWidget extends StatelessWidget {
  final Rx<StudyTagModel> selectedTag;
  final String selectedUnit;
  final int totalAmount;
  final Function(String) onUnitChanged;
  final Function(int) onTotalAmountChanged;

  const StudySettingsSectionWidget({
    super.key,
    required this.selectedTag,
    required this.selectedUnit,
    required this.totalAmount,
    required this.onUnitChanged,
    required this.onTotalAmountChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const FormLabelWidget(
          text: '학습 설정',
          size: LabelSize.md,
        ),
        const SizedBox(height: 10),
        Obx(() => BoxSelectorWidget(
              label: '🏷️ 학습 태그',
              value: StudyTagBadgeWidget(
                text: selectedTag.value.name,
                color: selectedTag.value.color,
              ),
              onTap: () => _showStudyTagSelectorDialog(context),
              labelSize: LabelSize.md,
            )),
        const SizedBox(height: 10),
        BoxSelectorWidget(
          label: '📏 학습 단위',
          value: selectedUnit,
          onTap: () => showUnitSelector(context, selectedUnit, onUnitChanged),
          labelSize: LabelSize.md,
        ),
        const SizedBox(height: 10),
        BoxSelectorWidget(
          label: '🔥 총 학습량',
          value: '$totalAmount $selectedUnit',
          onTap: () => showTotalAmountInputDialog(
              context, totalAmount, selectedUnit, onTotalAmountChanged),
          labelSize: LabelSize.md,
        ),
      ],
    );
  }

  void _showStudyTagSelectorDialog(BuildContext context) {
    Get.to(() => StudyTagSelectorPage(
          selectedTag: selectedTag.value,
          onTagSelected: (tag) {
            selectedTag.value = tag;
            Get.back();
          },
        ));
  }

  void showUnitSelector(BuildContext context, String currentUnit,
      Function(String) onUnitChanged) {
    showCupertinoModalPopup<void>(
      context: context,
      builder: (BuildContext context) => CupertinoActionSheet(
        title: const Text('단위 선택'),
        actions: <CupertinoActionSheetAction>[
          CupertinoActionSheetAction(
            onPressed: () => _selectUnit(context, '페이지', onUnitChanged),
            child: const Text('페이지'),
          ),
          CupertinoActionSheetAction(
            onPressed: () => _selectUnit(context, '단어', onUnitChanged),
            child: const Text('단어'),
          ),
          CupertinoActionSheetAction(
            onPressed: () => _selectUnit(context, '문제', onUnitChanged),
            child: const Text('문제'),
          ),
          CupertinoActionSheetAction(
            onPressed: () => _selectUnit(context, '강의', onUnitChanged),
            child: const Text('강의'),
          ),
        ],
        cancelButton: CupertinoActionSheetAction(
          isDefaultAction: true,
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('취소'),
        ),
      ),
    );
  }

  void _selectUnit(
      BuildContext context, String unit, Function(String) onUnitChanged) {
    onUnitChanged(unit);
    Navigator.pop(context);
  }

  void showTotalAmountInputDialog(BuildContext context, int currentAmount,
      String unit, Function(int) onAmountChanged) {
    String tempAmount = currentAmount.toString();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('총 학습량 입력'),
          content: TextField(
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              hintText: '학습량을 입력하세요',
              suffixText: unit,
            ),
            onChanged: (value) {
              tempAmount = value;
            },
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('취소'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('확인'),
              onPressed: () {
                int? newAmount = int.tryParse(tempAmount);
                if (newAmount != null && newAmount > 0) {
                  onAmountChanged(newAmount);
                  Navigator.of(context).pop();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('올바른 숫자를 입력해주세요.')),
                  );
                }
              },
            ),
          ],
        );
      },
    );
  }
}
