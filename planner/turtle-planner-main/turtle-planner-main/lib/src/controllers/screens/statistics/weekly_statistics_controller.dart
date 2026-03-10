import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';
import 'package:turtle_planner/src/controllers/core/study_record_controller.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';

class TagStudyInfo {
  final StudyTagModel tag;
  final Duration duration;
  final double percentage;

  TagStudyInfo(this.tag, this.duration, this.percentage);
}

class WeeklyStatisticsController extends GetxController {
  static WeeklyStatisticsController get instance => Get.find();

  RxBool isLoading = true.obs;
  final studyRecordController = StudyRecordController.instance;
  final studyPlanController = StudyPlanController.instance;
  final studyTagRepository = StudyTagRepository.instance;

  final Rx<int> selectedYear = DateTime.now().year.obs;
  final Rx<int> selectedQuarter = ((DateTime.now().month - 1) ~/ 3 + 1).obs;
  final RxList<List<DateTime>> weekRanges = <List<DateTime>>[].obs;
  final Rx<List<DateTime>?> selectedWeek = Rx<List<DateTime>?>(null);
  final RxMap<String, List<Duration>> dailyStudyTime =
      <String, List<Duration>>{}.obs;
  final RxMap<String, Duration> weeklyTotalStudyTime = <String, Duration>{}.obs;

  @override
  void onInit() {
    super.onInit();
    updateWeekRanges();
    selectCurrentWeek();

    ever(selectedYear, (_) => updateWeeklyStudyTime());
    ever(selectedQuarter, (_) => updateWeeklyStudyTime());
    ever(selectedWeek, (_) => updateDailyStudyTime());
    ever(
        studyRecordController.allStudyRecords,
        (_) => {
              updateWeeklyStudyTime(),
              updateDailyStudyTime(),
            });
  }

  // 선택된 분기의 주 범위를 업데이트하는 메서드
  void updateWeekRanges() {
    final quarterStartMonth = (selectedQuarter.value - 1) * 3 + 1;
    final quarterEndMonth = quarterStartMonth + 2;

    DateTime startDate = DateTime(selectedYear.value, quarterStartMonth, 1);
    DateTime endDate = DateTime(selectedYear.value, quarterEndMonth + 1, 0);

    startDate = startDate.subtract(Duration(days: startDate.weekday % 7));
    endDate = endDate.add(Duration(days: 6 - endDate.weekday % 7));

    List<List<DateTime>> ranges = [];
    DateTime currentStart = startDate;

    while (currentStart.isBefore(endDate)) {
      DateTime currentEnd = currentStart.add(const Duration(days: 6));
      ranges.add([currentStart, currentEnd]);
      currentStart = currentEnd.add(const Duration(days: 1));
    }

    weekRanges.value = ranges;
    updateWeeklyStudyTime();
  }

  // 현재 주를 선택하는 메서드
  void selectCurrentWeek() {
    final now = DateTime.now();
    final currentWeek = weekRanges.firstWhere(
      (week) =>
          now.isAfter(week[0]) &&
          now.isBefore(week[1].add(const Duration(days: 1))),
      orElse: () => weekRanges.last,
    );
    selectedWeek.value = currentWeek;
  }

  // 분기를 이동하는 메서드
  void moveQuarter(bool forward) {
    if (forward) {
      if (selectedQuarter.value == 4) {
        selectedYear.value++;
        selectedQuarter.value = 1;
      } else {
        selectedQuarter.value++;
      }
    } else {
      if (selectedQuarter.value == 1) {
        selectedYear.value--;
        selectedQuarter.value = 4;
      } else {
        selectedQuarter.value--;
      }
    }
    updateWeekRanges();
    selectedWeek.value = forward ? weekRanges.first : weekRanges.last;
  }

  // 주 범위를 포맷팅하는 메서드
  String getFormattedDateRange(List<DateTime> range) {
    String formatDate(DateTime date) => '${date.month}/${date.day}';
    return '${formatDate(range[0])}~';
  }

  // 주를 선택하는 메서드
  void selectWeek(List<DateTime> week) {
    selectedWeek.value = List.from(week);
  }

  // 선택된 주의 전체 날짜 범위를 포맷팅하는 메서드
  String getFullFormattedDateRange(List<DateTime> week) {
    final startDate = week[0];
    final endDate = week[1];
    final startFormat = DateFormat('M월 d일 (E)', 'ko_KR');
    final endFormat = DateFormat('M월 d일 (E)', 'ko_KR');
    return '${startFormat.format(startDate)} ~ ${endFormat.format(endDate)}';
  }

  // 주가 선택되었는지 확인하는 메서드
  bool isWeekSelected(List<DateTime> week) {
    return selectedWeek.value != null &&
        selectedWeek.value![0] == week[0] &&
        selectedWeek.value![1] == week[1];
  }

  // 주간 총 학습 시간을 업데이트하는 메서드
  void updateWeeklyStudyTime() {
    weeklyTotalStudyTime.clear();
    dailyStudyTime.clear();

    for (var week in weekRanges) {
      String weekKey =
          '${week[0].toIso8601String()}_${week[1].toIso8601String()}';
      List<Duration> dailyDurations = List.filled(7, Duration.zero);

      final records = studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        week[0],
        week[1],
      );

      for (var record in records) {
        int dayIndex = record.date.difference(week[0]).inDays;
        if (dayIndex >= 0 && dayIndex < 7) {
          dailyDurations[dayIndex] += Duration(minutes: record.duration);
        }
      }

      Duration totalDuration =
          dailyDurations.reduce((value, element) => value + element);
      weeklyTotalStudyTime[weekKey] = totalDuration;
      dailyStudyTime[weekKey] = dailyDurations;
    }
  }

  // 특정 주의 총 학습 시간을 가져오는 메서드
  Duration getWeeklyTotalStudyTime(List<DateTime> week) {
    String weekKey =
        '${week[0].toIso8601String()}_${week[1].toIso8601String()}';
    return weeklyTotalStudyTime[weekKey] ?? Duration.zero;
  }

  // 시간을 포맷팅하는 메서드
  String formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    String twoDigitMinutes = twoDigits(duration.inMinutes.remainder(60));
    String twoDigitSeconds = twoDigits(duration.inSeconds.remainder(60));
    return "${twoDigits(duration.inHours)}:$twoDigitMinutes:$twoDigitSeconds";
  }

  // 일별 학습 시간을 업데이트하는 메서드
  void updateDailyStudyTime() {
    if (selectedWeek.value == null) return;

    final startDate = selectedWeek.value![0];
    final endDate = selectedWeek.value![1];

    final records = studyRecordController.getStudyRecordsByDateRangeAndPlanId(
      startDate,
      endDate,
    );

    List<Duration> dailyDurations = List.filled(7, Duration.zero);

    for (var record in records) {
      int dayIndex = record.date.difference(startDate).inDays;
      if (dayIndex >= 0 && dayIndex < 7) {
        dailyDurations[dayIndex] += Duration(minutes: record.duration);
      }
    }

    String weekKey =
        '${startDate.toIso8601String()}_${endDate.toIso8601String()}';
    dailyStudyTime[weekKey] = dailyDurations;
  }

  // 선택된 주의 총 학습 시간을 가져오는 메서드
  Duration getTotalStudyTimeForSelectedWeek() {
    if (selectedWeek.value == null) return Duration.zero;
    String weekKey =
        '${selectedWeek.value![0].toIso8601String()}_${selectedWeek.value![1].toIso8601String()}';
    return weeklyTotalStudyTime[weekKey] ?? Duration.zero;
  }

  // 선택된 주의 평균 일일 학습 시간을 계산하는 메서드
  Duration getAverageDailyStudyTimeForSelectedWeek() {
    if (selectedWeek.value == null) return Duration.zero;
    String weekKey =
        '${selectedWeek.value![0].toIso8601String()}_${selectedWeek.value![1].toIso8601String()}';
    List<Duration> dailyDurations =
        dailyStudyTime[weekKey] ?? List.filled(7, Duration.zero);
    int studyDaysCount =
        dailyDurations.where((duration) => duration > Duration.zero).length;
    if (studyDaysCount == 0) return Duration.zero;
    Duration total = dailyDurations.reduce((value, element) => value + element);
    return Duration(seconds: total.inSeconds ~/ studyDaysCount);
  }

  // 선택된 주의 일별 학습 시간을 가져오는 메서드
  List<Duration> getDailyStudyTimeForSelectedWeek() {
    if (selectedWeek.value == null) return List.filled(7, Duration.zero);
    String weekKey =
        '${selectedWeek.value![0].toIso8601String()}_${selectedWeek.value![1].toIso8601String()}';
    return dailyStudyTime[weekKey] ?? List.filled(7, Duration.zero);
  }

  // 태그별 학습 비율을 계산하는 메서드
  List<PieChartSectionData> getTagStudyRatio(
      DateTime startDate, DateTime endDate) {
    Map<String, Duration> tagDurations = {};
    Duration totalDuration = Duration.zero;

    final records = studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startDate, endDate);

    for (var record in records) {
      StudyTagModel? tag =
          studyPlanController.getStudyTagByPlanId(record.studyPlanId);
      if (tag != null) {
        tagDurations[tag.id] = (tagDurations[tag.id] ?? Duration.zero) +
            Duration(minutes: record.duration);
        totalDuration += Duration(minutes: record.duration);
      }
    }

    if (totalDuration.inMinutes == 0) {
      return []; // 데이터가 없는 경우 빈 리스트 반환
    }

    print('Tag Durations: $tagDurations');

    List<PieChartSectionData> sections = [];
    tagDurations.forEach((tagId, duration) {
      StudyTagModel? tag = studyTagRepository.getStudyTagById(tagId);
      if (tag != null) {
        double percentage =
            (duration.inMinutes / totalDuration.inMinutes) * 100;
        sections.add(PieChartSectionData(
          color: Color(tag.colorValue),
          value: percentage,
          title: '${tag.name}\n${percentage.toStringAsFixed(1)}%',
          radius: 100,
          titleStyle: const TextStyle(
              fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
        ));
      } else {
        print('Tag not found for ID: $tagId');
      }
    });

    print('Pie Chart Sections: $sections');

    return sections;
  }

  // 선택된 주의 태그별 학습 비율을 가져오는 메서드
  List<PieChartSectionData> getTagStudyRatioForSelectedWeek() {
    if (selectedWeek.value == null) return [];
    return getTagStudyRatio(selectedWeek.value![0], selectedWeek.value![1]);
  }

  // 태그별 학습 정보를 계산하는 메서드
  List<TagStudyInfo> getTagStudyInfo(DateTime startDate, DateTime endDate) {
    Map<String, Duration> tagDurations = {};
    Duration totalDuration = Duration.zero;

    final records = studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startDate, endDate);

    for (var record in records) {
      StudyTagModel? tag =
          studyPlanController.getStudyTagByPlanId(record.studyPlanId);
      if (tag != null) {
        tagDurations[tag.id] = (tagDurations[tag.id] ?? Duration.zero) +
            Duration(minutes: record.duration);
        totalDuration += Duration(minutes: record.duration);
      }
    }

    if (totalDuration.inMinutes == 0) {
      return []; // 데이터가 없는 경우 빈 리스트 반환
    }

    List<TagStudyInfo> tagStudyInfoList = [];
    tagDurations.forEach((tagId, duration) {
      StudyTagModel? tag = studyTagRepository.getStudyTagById(tagId);
      if (tag != null) {
        double percentage =
            (duration.inMinutes / totalDuration.inMinutes) * 100;
        tagStudyInfoList.add(TagStudyInfo(tag, duration, percentage));
      } else {
        print('Tag not found for ID: $tagId');
      }
    });

    // 퍼센트 기준으로 내림차순 정렬
    tagStudyInfoList.sort((a, b) => b.percentage.compareTo(a.percentage));

    return tagStudyInfoList;
  }

  // 선택된 주의 태그별 학습 정보를 가져오는 메서드
  List<TagStudyInfo> getTagStudyInfoForSelectedWeek() {
    if (selectedWeek.value == null) return [];
    return getTagStudyInfo(selectedWeek.value![0], selectedWeek.value![1]);
  }
}
