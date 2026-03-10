import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/screens/home/home_controller.dart';
import 'package:turtle_planner/src/screens/main/home/widgets/weekly_date_selector_item_widget.dart';
import 'package:turtle_planner/src/screens/main/home/widgets/skeleton_date_widget.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class WeeklyDateSelector extends StatefulWidget {
  const WeeklyDateSelector({super.key});

  @override
  _WeeklyDateSelectorState createState() => _WeeklyDateSelectorState();
}

class _WeeklyDateSelectorState extends State<WeeklyDateSelector> {
  final HomeController controller = Get.find<HomeController>();
  late PageController _pageController;
  List<List<DateTime>?> weekDatesList = List.generate(3, (_) => null);

  @override
  void initState() {
    super.initState();
    _pageController = PageController(
      initialPage: 1,
      viewportFraction: 1,
    );
    _updateWeekDatesList();
    controller.onInit();
  }

  void _updateWeekDatesList() {
    weekDatesList[1] = controller.getWeekDates(
        controller.getStartDateForOffset(controller.weekOffset.value));
    weekDatesList[0] = null;
    weekDatesList[2] = null;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 110,
      child: Obx(() {
        final isLoading = controller.isLoading.value;
        return AbsorbPointer(
          absorbing: isLoading,
          child: NotificationListener<ScrollNotification>(
            onNotification: (ScrollNotification notification) {
              if (notification is ScrollEndNotification && !isLoading) {
                final currentPage = _pageController.page?.round() ?? 1;
                if (currentPage != 1) {
                  final newOffset =
                      controller.weekOffset.value + (currentPage - 1).toInt();

                  if (newOffset <= 0) {
                    controller.updateCurrentWeek(newOffset).then((_) {
                      if (mounted) {
                        setState(() {
                          _updateWeekDatesList();
                        });
                        Future.microtask(() => _pageController.jumpToPage(1));
                      }
                    });
                  } else {
                    Helper.warningSnackBar(
                      title: '알림',
                      message: '마지막 페이지에요!',
                    );
                    Future.microtask(
                      () => _pageController.animateToPage(
                        1,
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      ),
                    );
                  }
                }
              }
              return false;
            },
            child: PageView.builder(
              controller: _pageController,
              physics: isLoading ? const NeverScrollableScrollPhysics() : null,
              itemBuilder: (context, index) {
                _updateWeekDatesList();
                return _buildWeekView(
                  weekDatesList[index],
                  isCurrentWeek: index == 1,
                  isLoading: isLoading,
                );
              },
              itemCount: 3,
            ),
          ),
        );
      }),
    );
  }

  Widget _buildWeekView(List<DateTime>? weekDates,
      {required bool isCurrentWeek, required bool isLoading}) {
    return LayoutBuilder(
      builder: (context, constraints) {
        const totalGapWidth = 48.0;
        final itemWidth = (constraints.maxWidth - totalGapWidth) / 7;

        if (isLoading) {
          return _buildSkeletonWeek(itemWidth);
        }

        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const NeverScrollableScrollPhysics(),
          child: Row(
            children: [
              if (weekDates == null)
                _buildSkeletonWeek(itemWidth)
              else if (weekDates.isEmpty)
                SizedBox(width: constraints.maxWidth)
              else
                Row(
                  children: List.generate(7, (index) {
                    final date = weekDates[index];
                    return Row(
                      children: [
                        WeeklyDateSelectorItemWidget(
                          date: date,
                          itemWidth: itemWidth,
                        ),
                        if (index < 6) const SizedBox(width: 8),
                      ],
                    );
                  }),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSkeletonWeek(double itemWidth) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const NeverScrollableScrollPhysics(),
      child: Row(
        children: List.generate(
          7,
          (index) => Row(
            children: [
              SkeletonDateItemWidget(itemWidth: itemWidth),
              if (index < 6) const SizedBox(width: 8),
            ],
          ),
        ),
      ),
    );
  }
}
