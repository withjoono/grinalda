import 'package:flutter/material.dart';
import 'package:get/get.dart';

class YearSelectorWidget extends StatelessWidget {
  final RxInt selectedYear;
  final Function(int) onYearChanged;

  const YearSelectorWidget(
      {super.key, required this.selectedYear, required this.onYearChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => onYearChanged(selectedYear.value - 1),
          ),
          Obx(() => Text("${selectedYear.value}년",
              style:
                  const TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
          IconButton(
            icon: const Icon(Icons.arrow_forward),
            onPressed: () => onYearChanged(selectedYear.value + 1),
          ),
        ],
      ),
    );
  }
}
