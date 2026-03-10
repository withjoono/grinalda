import 'package:flutter/material.dart';

class SkeletonDateItemWidget extends StatelessWidget {
  final double itemWidth;

  const SkeletonDateItemWidget({
    super.key,
    required this.itemWidth,
  });

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final skeletonColor = isDarkMode ? Colors.grey[700] : Colors.grey[300];

    return SizedBox(
      width: itemWidth,
      child: Column(
        children: [
          Container(
            width: itemWidth,
            height: 70,
            decoration: BoxDecoration(
              color: skeletonColor,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(height: 12),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
