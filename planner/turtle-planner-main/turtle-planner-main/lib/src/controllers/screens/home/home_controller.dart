import 'package:get/get.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/models/study_record_model.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';
import 'package:turtle_planner/src/controllers/core/study_record_controller.dart';

class HomeController extends GetxController {
  static const int daysInWeek = 7;
  static const List<String> koreanWeekDays = [
    '월',
    '화',
    '수',
    '목',
    '금',
    '토',
    '일'
  ];

  final StudyPlanController _studyPlanController = StudyPlanController.instance;
  final StudyRecordController _studyRecordController =
      StudyRecordController.instance;

  final Rx<DateTime> selectedDate = Rx<DateTime>(DateTime.now().dateOnly);
  final Rx<DateTime> currentWeekStart = Rx<DateTime>(DateTime.now().dateOnly);
  final RxList<int> dailyStudyTimes = List.generate(daysInWeek, (_) => 0).obs;
  final RxList<int> dailyStudyPlanCounts =
      List.generate(daysInWeek, (_) => 0).obs;
  final RxInt weekOffset = 0.obs;
  final RxBool isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    _setupListeners();
    loadWeekData();
  }

  void _setupListeners() {
    ever(_studyPlanController.plans, (_) => loadWeekData());
    ever(_studyRecordController.allStudyRecords, (_) => loadWeekData());
    ever(selectedDate, (date) => print('Selected date: $date'));
  }

  DateTime getStartOfWeek(DateTime date) {
    return date.subtract(Duration(days: date.weekday % daysInWeek));
  }

  List<DateTime> getWeekDates(DateTime date) {
    final startOfWeek = getStartOfWeek(date);
    return List.generate(
        daysInWeek, (index) => startOfWeek.add(Duration(days: index)));
  }

  void setSelectedDate(DateTime date) {
    selectedDate.value = date.dateOnly;
    _updateWeekData();
  }

  void setSelectedDateWithCalendar(DateTime date) {
    final dateOnly = date.dateOnly;
    final currentWeekStart = getStartDateForOffset(weekOffset.value);
    final selectedWeekStart = getStartOfWeek(dateOnly);

    if (selectedWeekStart != currentWeekStart) {
      final weekDifference =
          selectedWeekStart.difference(currentWeekStart).inDays ~/ daysInWeek;
      final newOffset = weekOffset.value + weekDifference;

      updateCurrentWeek(
          dateOnly.isAfter(currentWeekStart.add(const Duration(days: 6)))
              ? newOffset + 1
              : newOffset);
    }

    selectedDate.value = dateOnly;
  }

  Future<void> updateCurrentWeek(int offset) async {
    if (offset <= 0) {
      weekOffset.value = offset;
      final newWeekStart = getStartDateForOffset(offset);
      currentWeekStart.value = newWeekStart;
      selectedDate.value = newWeekStart;
      await loadWeekData();
    }
  }

  String getKoreanWeekday(DateTime date) {
    return koreanWeekDays[date.weekday - 1];
  }

  bool isToday(DateTime date) {
    final now = DateTime.now().dateOnly;
    return date.isAtSameMomentAs(now);
  }

  DateTime getStartDateForOffset(int offset) {
    final now = DateTime.now().dateOnly;
    final startOfCurrentWeek = getStartOfWeek(now);
    return startOfCurrentWeek.add(Duration(days: daysInWeek * offset));
  }

  Future<void> loadWeekData() async {
    isLoading.value = true;
    try {
      final weekDates = getWeekDates(selectedDate.value);
      final weekPlans = _studyPlanController.getStudyPlansForDateRange(
          weekDates.first, weekDates.last);
      final weekRecords = _studyRecordController
          .getStudyRecordsByDateRangeAndPlanId(weekDates.first, weekDates.last);

      _calculateDailyStudyTimes(weekRecords);
      _calculateDailyStudyPlanCounts(weekPlans, weekDates);

      _logWeekData(weekDates);
    } catch (e) {
      print('주간 데이터 로드 중 오류 발생: $e');
    } finally {
      isLoading.value = false;
    }
  }

  void _calculateDailyStudyTimes(List<StudyRecordModel> records) {
    dailyStudyTimes.value = List.generate(daysInWeek, (_) => 0);
    for (var record in records) {
      int dayIndex = record.date.weekday % daysInWeek;
      dailyStudyTimes[dayIndex] += record.duration;
    }
    dailyStudyTimes.refresh();
  }

  void _calculateDailyStudyPlanCounts(
      List<StudyPlanModel> plans, List<DateTime> weekDates) {
    dailyStudyPlanCounts.value = List.generate(daysInWeek, (_) => 0);
    for (int i = 0; i < daysInWeek; i++) {
      DateTime currentDate = weekDates[i];
      int count = plans
          .where((plan) =>
              plan.studyDays.contains(currentDate.weekday % daysInWeek) &&
              !plan.startDate.isAfter(currentDate) &&
              !plan.goalDate.isBefore(currentDate))
          .length;
      dailyStudyPlanCounts[i] = count;
    }
    dailyStudyPlanCounts.refresh();
  }

  void _logWeekData(List<DateTime> weekDates) {
    print('주간 데이터 로드 완료: ${weekDates.first} - ${weekDates.last}');
    print('일일 학습 시간: $dailyStudyTimes');
    print('일일 학습 계획 수: $dailyStudyPlanCounts');
  }

  void _updateWeekData() {
    currentWeekStart.value = getStartOfWeek(selectedDate.value);
    weekOffset.value = currentWeekStart.value
            .difference(getStartOfWeek(DateTime.now().dateOnly))
            .inDays ~/
        daysInWeek;
  }

  int getStudyTimeForDay(int dayIndex) => dailyStudyTimes[dayIndex];
  int getStudyPlanCountForDay(int dayIndex) => dailyStudyPlanCounts[dayIndex];
}

extension DateTimeExtension on DateTime {
  DateTime get dateOnly => DateTime(year, month, day);
}
