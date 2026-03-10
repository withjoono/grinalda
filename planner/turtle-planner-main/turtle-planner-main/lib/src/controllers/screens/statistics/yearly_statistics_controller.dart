import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';
import 'package:turtle_planner/src/controllers/core/study_record_controller.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';

class YearlyStatisticsController extends GetxController {
  static YearlyStatisticsController get instance => Get.find();

  final studyRecordController = StudyRecordController.instance;
  final studyPlanController = StudyPlanController.instance;
  final studyTagRepository = StudyTagRepository.instance;

  final Rx<int> selectedYear = DateTime.now().year.obs;
  final Rx<Map<DateTime, int>> datasets = Rx<Map<DateTime, int>>({});

  static const int minYear = 2023;
  final int maxYear = DateTime.now().year;

  @override
  void onInit() {
    super.onInit();
    ever(selectedYear, (_) => updateDatasets());
    ever(studyRecordController.allStudyRecords, (_) => updateDatasets());
    updateDatasets();
  }

  void moveYear(bool forward) {
    int newYear = selectedYear.value + (forward ? 1 : -1);
    if (newYear >= minYear && newYear <= maxYear) {
      selectedYear.value = newYear;
    }
  }

  bool canMoveBack() => selectedYear.value > minYear;
  bool canMoveForward() => selectedYear.value < maxYear;

  void updateDatasets() {
    final startDate = DateTime(selectedYear.value, 1, 1);
    final endDate = getEndDate();
    final records = studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startDate, endDate);

    Map<DateTime, int> newDatasets = {};
    for (var record in records) {
      DateTime date =
          DateTime(record.date.year, record.date.month, record.date.day);
      newDatasets[date] = (newDatasets[date] ?? 0) + record.duration;
    }

    datasets.value = newDatasets;
  }

  DateTime getEndDate() {
    if (selectedYear.value == maxYear) {
      return DateTime.now();
    } else {
      return DateTime(selectedYear.value, 12, 31);
    }
  }

  Duration getTotalStudyTimeForYear() {
    int totalMinutes =
        datasets.value.values.fold(0, (total, minutes) => total + minutes);
    return Duration(minutes: totalMinutes);
  }

  Duration getAverageDailyStudyTimeForYear() {
    if (datasets.value.isEmpty) return Duration.zero;

    int totalMinutes =
        datasets.value.values.fold(0, (total, minutes) => total + minutes);
    int studyDays = datasets.value.length; // 실제 학습한 날짜 수
    return Duration(minutes: totalMinutes ~/ studyDays);
  }

  String formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    String twoDigitMinutes = twoDigits(duration.inMinutes.remainder(60));
    return "${duration.inHours}:$twoDigitMinutes";
  }

  String getFormattedYearRange() {
    return '${selectedYear.value}년';
  }

  String getFormattedStudyTimeForDate(DateTime date) {
    int minutes = datasets.value[date] ?? 0;
    int hours = minutes ~/ 60;
    int remainingMinutes = minutes % 60;

    if (hours > 0) {
      return '${hours}h ${remainingMinutes}m';
    } else {
      return '${remainingMinutes}m';
    }
  }
}
