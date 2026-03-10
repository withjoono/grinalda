import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';
import 'package:turtle_planner/src/controllers/core/study_record_controller.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';

// 태그별 학습 정보를 저장하는 클래스
class TagStudyInfo {
  final StudyTagModel tag;
  final Duration duration;
  final double percentage;

  TagStudyInfo(this.tag, this.duration, this.percentage);
}

class MonthlyStatisticsController extends GetxController {
  static MonthlyStatisticsController get instance => Get.find();

  final studyRecordController = StudyRecordController.instance;
  final studyPlanController = StudyPlanController.instance;
  final studyTagRepository = StudyTagRepository.instance;

  // 선택된 연도와 월을 저장하는 반응형 변수
  final Rx<int> selectedYear = DateTime.now().year.obs;
  final Rx<int> selectedMonth = DateTime.now().month.obs;

  @override
  void onInit() {
    super.onInit();
    // 연도, 월, 학습 기록이 변경될 때마다 업데이트
    ever(selectedYear, (_) => update());
    ever(selectedMonth, (_) => update());
    ever(studyRecordController.allStudyRecords, (_) => update());
  }

  // 연도를 이동하는 메서드
  void moveYear(bool forward) {
    selectedYear.value += forward ? 1 : -1;
  }

  // 월을 선택하는 메서드
  void selectMonth(int month) {
    selectedMonth.value = month;
  }

  // 선택된 월의 날짜 범위를 포맷팅하는 메서드
  String getFormattedMonthRange() {
    final startDate = DateTime(selectedYear.value, selectedMonth.value, 1);
    final endDate = DateTime(selectedYear.value, selectedMonth.value + 1, 0);
    final dateFormat = DateFormat('M월 d일', 'ko_KR');
    return '${dateFormat.format(startDate)} ~ ${dateFormat.format(endDate)}';
  }

  // 특정 월의 총 학습 시간을 계산하는 메서드
  Duration getTotalStudyTimeForMonth(int month) {
    final startDate = DateTime(selectedYear.value, month, 1);
    final endDate = DateTime(selectedYear.value, month + 1, 0);
    final records = studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startDate, endDate);
    return records.fold(Duration.zero,
        (total, record) => total + Duration(minutes: record.duration));
  }

  // 선택된 월의 총 학습 시간을 가져오는 메서드
  Duration getTotalStudyTimeForSelectedMonth() {
    return getTotalStudyTimeForMonth(selectedMonth.value);
  }

  // 선택된 월의 평균 일일 학습 시간을 계산하는 메서드
  Duration getAverageDailyStudyTimeForSelectedMonth() {
    final startDate = DateTime(selectedYear.value, selectedMonth.value, 1);
    final endDate = DateTime(selectedYear.value, selectedMonth.value + 1, 0);
    final records = studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startDate, endDate);

    if (records.isEmpty) return Duration.zero;

    // 실제로 학습한 날짜 수 계산
    final studyDays = records
        .map((record) =>
            DateTime(record.date.year, record.date.month, record.date.day))
        .toSet();
    final totalDuration = records.fold(Duration.zero,
        (total, record) => total + Duration(minutes: record.duration));

    return Duration(seconds: totalDuration.inSeconds ~/ studyDays.length);
  }

  // 선택된 월의 요일별 학습 시간을 계산하는 메서드
  List<Duration> getWeekdayStudyTimeForSelectedMonth() {
    final startDate = DateTime(selectedYear.value, selectedMonth.value, 1);
    final endDate = DateTime(selectedYear.value, selectedMonth.value + 1, 0);
    final records = studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startDate, endDate);

    List<Duration> weekdayDurations = List.filled(7, Duration.zero);
    for (var record in records) {
      int weekday = record.date.weekday % 7; // 0 (일요일) ~ 6 (토요일)
      weekdayDurations[weekday] += Duration(minutes: record.duration);
    }

    return weekdayDurations;
  }

  // 선택된 월의 태그별 학습 정보를 계산하는 메서드
  List<TagStudyInfo> getTagStudyInfoForSelectedMonth() {
    final startDate = DateTime(selectedYear.value, selectedMonth.value, 1);
    final endDate = DateTime(selectedYear.value, selectedMonth.value + 1, 0);
    final records = studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startDate, endDate);

    Map<String, Duration> tagDurations = {};
    Duration totalDuration = Duration.zero;

    for (var record in records) {
      StudyTagModel? tag =
          studyPlanController.getStudyTagByPlanId(record.studyPlanId);
      if (tag != null) {
        tagDurations[tag.id] = (tagDurations[tag.id] ?? Duration.zero) +
            Duration(minutes: record.duration);
        totalDuration += Duration(minutes: record.duration);
      }
    }

    List<TagStudyInfo> tagStudyInfoList = [];
    tagDurations.forEach((tagId, duration) {
      StudyTagModel? tag = studyTagRepository.getStudyTagById(tagId);
      if (tag != null) {
        double percentage = totalDuration.inMinutes > 0
            ? (duration.inMinutes / totalDuration.inMinutes) * 100
            : 0;
        tagStudyInfoList.add(TagStudyInfo(tag, duration, percentage));
      }
    });

    // 퍼센티지 기준으로 내림차순 정렬
    tagStudyInfoList.sort((a, b) => b.percentage.compareTo(a.percentage));
    return tagStudyInfoList;
  }

  // 시간을 포맷팅하는 메서드
  String formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    String twoDigitMinutes = twoDigits(duration.inMinutes.remainder(60));
    String twoDigitSeconds = twoDigits(duration.inSeconds.remainder(60));
    return "${twoDigits(duration.inHours)}:$twoDigitMinutes:$twoDigitSeconds";
  }
}
