import 'package:flutter/material.dart';

Widget markedCellBuilder(
    BuildContext context, DateTime day, List<Object?> events) {
  if (events.isNotEmpty) {
    return ListView.builder(
      shrinkWrap: true,
      itemCount: events.length,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (context, index) {
        return const Column(
          children: [
            SizedBox(height: 20),
            SizedBox(
              height: 24,
              width: 24,
              child: Text("🐢"),
            ),
            Text(
              "",
              style: TextStyle(
                fontSize: 12,
              ),
            )
          ],
        );
      },
    );
  }
  return const SizedBox(
    height: 76,
  );
}
