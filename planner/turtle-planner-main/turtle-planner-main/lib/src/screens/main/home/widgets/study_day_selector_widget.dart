import 'package:flutter/material.dart';
import 'package:get/get.dart';

class StudyDaysSelectorWidget extends StatefulWidget {
  final List<int> initialSelection;

  const StudyDaysSelectorWidget({super.key, required this.initialSelection});

  @override
  _StudyDaysSelectorWidgetState createState() =>
      _StudyDaysSelectorWidgetState();
}

class _StudyDaysSelectorWidgetState extends State<StudyDaysSelectorWidget> {
  late List<bool> _selectedDays;
  final List<String> _weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  @override
  void initState() {
    super.initState();
    _selectedDays =
        List.generate(7, (index) => widget.initialSelection.contains(index));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Get.back(),
        ),
        title: const Text('학습 요일'),
        actions: [
          TextButton(
            child: const Text('확인'),
            onPressed: () {
              List<int> selectedDays = [];
              for (int i = 0; i < _selectedDays.length; i++) {
                if (_selectedDays[i]) selectedDays.add(i);
              }
              Get.back(result: selectedDays);
            },
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: 7,
        itemBuilder: (context, index) {
          return CheckboxListTile(
            title: Text(_weekdays[index]),
            value: _selectedDays[index],
            onChanged: (bool? value) {
              setState(() {
                _selectedDays[index] = value!;
              });
            },
          );
        },
      ),
    );
  }
}
