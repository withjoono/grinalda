import 'package:get/get.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/models/study_record_model.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';
import 'package:turtle_planner/src/controllers/core/study_record_controller.dart';
import 'package:turtle_planner/src/controllers/screens/home/home_controller.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class TodayStudyController extends GetxController {
  final StudyPlanController _studyPlanController = StudyPlanController.instance;
  final StudyRecordController _studyRecordController =
      StudyRecordController.instance;
  final StudyTagRepository _studyTagRepo = Get.find<StudyTagRepository>();
  final HomeController _homeController = Get.find<HomeController>();

  // 오늘의 학습 계획 목록 (선택 날짜)
  final RxList<StudyPlanModel> studyPlans = <StudyPlanModel>[].obs;
  // 데이터 로딩 상태
  final RxBool isLoading = true.obs;
  // 현재 선택된 필터 태그
  final RxString filterTag = 'all'.obs;

  @override
  void onInit() {
    super.onInit();
    ever(_homeController.selectedDate, (_) => loadStudyPlans());
    ever(_studyPlanController.plans, (_) => loadStudyPlans());
    // 날짜가 변경될 때 필터를 'all'로 재설정
    ever(_homeController.selectedDate, (_) => filterTag.value = 'all');
    loadStudyPlans();
  }

  // 모든 StudyTag 객체를 가져오는 메서드
  StudyTagModel? getStudyTagById(String tagId) {
    return _studyTagRepo.getStudyTagById(tagId);
  }

  List<StudyTagModel> getAllStudyTags() {
    return _studyTagRepo.getAllStudyTags();
  }

  // 선택된 날짜의 학습 계획을 로드하는 함수
  Future<void> loadStudyPlans() async {
    isLoading(true);
    try {
      final selectedDate = _homeController.selectedDate.value;
      final allPlans = _studyPlanController.plans;
      studyPlans.value = allPlans
          .where((plan) =>
              plan.studyDays.contains(selectedDate.weekday % 7) &&
              !selectedDate.isBefore(plan.startDate) &&
              !selectedDate.isAfter(plan.goalDate))
          .toList();
      print('Loaded ${studyPlans.length} study plans for date: $selectedDate');
    } catch (e) {
      print('학습 계획 로딩 중 오류 발생: $e');
      Get.snackbar('오류', '학습 계획을 불러오는 데 실패했습니다. 다시 시도해 주세요.');
    } finally {
      isLoading(false);
    }
  }

  // 현재 필터 태그에 따라 필터링된 학습 계획 목록을 반환하는 함수
  List<StudyPlanModel> getFilteredStudyPlans() {
    if (filterTag.value == 'all') {
      return studyPlans;
    }
    return studyPlans.where((plan) => plan.tagId == filterTag.value).toList();
  }

  // 현재 표시된 학습 계획들의 모든 고유한 태그 목록을 반환하는 함수
  List<StudyTagModel> getAvailableStudyTags() {
    Set<String> tagIds = {'all'};
    for (var plan in studyPlans) {
      tagIds.add(plan.tagId);
    }

    List<StudyTagModel> availableTags = [
      StudyTagModel(
          id: 'all', name: '전체', colorValue: 0xFF000000, isSystemTag: true)
    ];

    for (var tagId in tagIds) {
      if (tagId != 'all') {
        StudyTagModel? tag = getStudyTagById(tagId);
        if (tag != null) {
          availableTags.add(tag);
        }
      }
    }

    return availableTags;
  }

  // 선택된 날짜까지의 학습 진행 상황을 반환하는 함수
  Future<int> getTodayProgress(
      StudyPlanModel plan, DateTime selectedDate) async {
    try {
      final records =
          _studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        plan.startDate,
        selectedDate,
        studyPlanId: plan.id,
      );
      return records.fold<int>(0, (sum, record) => sum + record.amount);
    } catch (e) {
      print('진행 상황 조회 중 오류 발생: $e');
      return 0;
    }
  }

  // 일일 목표량을 계산하는 함수
  Future<int> calculateDailyGoal(
      StudyPlanModel plan, DateTime selectedDate) async {
    int remainingDays = getRemainingStudyDays(plan, selectedDate);
    int remainingAmount =
        plan.totalAmount - await getTodayProgress(plan, selectedDate);
    if (remainingDays <= 0) return 0;
    return (remainingAmount / remainingDays).ceil();
  }

  // 선택된 날짜가 목표일 이후라면 남은 학습일은 0
  int getRemainingStudyDays(StudyPlanModel plan, DateTime selectedDate) {
    selectedDate = selectedDate;
    if (selectedDate.isAfter(plan.goalDate.subtract(const Duration(days: 1)))) {
      return 0;
    }

    // 선택된 날짜가 시작일 이전이라면 시작일부터 계산
    DateTime startDate =
        selectedDate.isBefore(plan.startDate) ? plan.startDate : selectedDate;

    int remainingDays = 0;
    for (DateTime date = startDate;
        date.isBefore(plan.goalDate);
        date = date.add(const Duration(days: 1))) {
      if (plan.studyDays.contains(date.weekday % 7)) {
        remainingDays++;
      }
    }
    return remainingDays;
  }

  // 주어진 학습 계획이 오늘의 학습일인지 확인하는 함수
  bool isStudyDay(StudyPlanModel plan) {
    int dayIndex = _homeController.selectedDate.value.weekday % 7;
    return plan.studyDays.contains(dayIndex);
  }

  Future<int> getCompletedAmountForDate(
      StudyPlanModel plan, DateTime date) async {
    try {
      DateTime startOfDay = DateTime.utc(date.year, date.month, date.day);
      DateTime endOfDay = startOfDay;
      var records = _studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startOfDay,
        endOfDay,
        studyPlanId: plan.id,
      );
      return records.fold<int>(0, (sum, record) => sum + record.amount);
    } catch (e) {
      print('날짜별 완료량 조회 중 오류 발생: $e');
      return 0;
    }
  }

  // 다음 학습요일을 반환해줌 (선택된 날짜를 기준으로 ex. 목요일에 만나요!)
  String getNextStudyDay(StudyPlanModel plan) {
    return Helper.getNextStudyDay(plan, _homeController.selectedDate.value);
  }

  Future<StudyRecordModel?> getExistingStudyRecord(
      StudyPlanModel plan, DateTime date) async {
    try {
      // 날짜의 시작과 끝을 설정
      DateTime startOfDay = DateTime.utc(date.year, date.month, date.day);
      DateTime endOfDay = startOfDay;

      var records = _studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startOfDay,
        endOfDay,
        studyPlanId: plan.id,
      );
      return records.isNotEmpty ? records.first : null;
    } catch (e) {
      print('기존 학습 기록 조회 중 오류 발생: $e');
      return null;
    }
  }

  // 학습기록을 수정하거나 새로 생성함
  Future<void> updateOrAddStudyProgress(
      StudyPlanModel plan, int newAmount, int duration,
      [String? recordId]) async {
    try {
      final selectedDate = _homeController.selectedDate.value;
      final existingRecord = await getExistingStudyRecord(plan, selectedDate);
      final oldAmount = existingRecord?.amount ?? 0;
      final difference = newAmount - oldAmount;

      final newRecord = StudyRecordModel(
        id: recordId ?? '',
        studyPlanId: plan.id,
        date: selectedDate,
        amount: newAmount,
        duration: duration,
      );

      if (recordId != null) {
        await _studyRecordController.updateStudyRecord(newRecord);
      } else {
        await _studyRecordController.addStudyRecord(newRecord);
      }

      // StudyPlanController의 updateStudyPlanProgress 호출
      await _studyPlanController.updateStudyPlanProgress(plan.id, difference);

      await loadStudyPlans();
      await _studyRecordController.fetchAllStudyRecords();
    } catch (e) {
      print('학습 진행 상황 업데이트 중 오류 발생: $e');
      Helper.errorSnackBar(
          title: '오류', message: '학습 진행 상황을 업데이트하는 데 실패했습니다. 다시 시도해 주세요.');
    }
  }

  // plan의 시작일과 두번째 인자 date 범위의 학습시간을 모두 더해줌
  Future<int> getTotalCompletedAmount(
      StudyPlanModel plan, DateTime date) async {
    try {
      var records = _studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        plan.startDate,
        date,
        studyPlanId: plan.id,
      );
      return records.fold<int>(0, (sum, record) => sum + record.amount);
    } catch (e) {
      print('총 완료량 조회 중 오류 발생: $e');
      return 0;
    }
  }

  // 두번째 인자 date의 학습시간을 반환
  Future<int> getDailyCompletedAmount(
      StudyPlanModel plan, DateTime date) async {
    try {
      DateTime startOfDay = date;
      DateTime endOfDay = startOfDay;
      var records = _studyRecordController.getStudyRecordsByDateRangeAndPlanId(
        startOfDay,
        endOfDay,
        studyPlanId: plan.id,
      );
      return records.fold<int>(0, (sum, record) => sum + record.amount);
    } catch (e) {
      print('일일 완료량 조회 중 오류 발생: $e');
      return 0;
    }
  }

  // 학습 계획의 진행 상태를 문자열과 진행률로 반환하는 함수
  Future<Map<String, dynamic>> getProgressStatus(StudyPlanModel plan) async {
    try {
      final selectedDate = _homeController.selectedDate.value;
      final dailyProgress = await getDailyCompletedAmount(plan, selectedDate);
      final dailyGoal = await calculateDailyGoal(plan, selectedDate);
      final status =
          Helper.getProgressStatusHelper(plan, dailyProgress, dailyGoal);
      final percentage = dailyGoal > 0 ? dailyProgress / dailyGoal : 0.0;
      return {
        'status': status,
        'percentage': percentage,
      };
    } catch (e) {
      print('진행 상태 조회 중 오류 발생: $e');
      return {
        'status': "진행 상태 불러오기 실패",
        'percentage': 0.0,
      };
    }
  }

  // 학습 계획의 진행률을 백분율로 반환하는 함수
  Future<double> getProgressPercentage(StudyPlanModel plan) async {
    try {
      final selectedDate = _homeController.selectedDate.value;
      final dailyProgress = await getDailyCompletedAmount(plan, selectedDate);
      final dailyGoal = await calculateDailyGoal(plan, selectedDate);
      if (dailyGoal == 0) return 0.0; // 0으로 나누는 것을 방지
      return dailyProgress / dailyGoal;
    } catch (e) {
      print('진행률 계산 중 오류 발생: $e');
      return 0.0;
    }
  }

  // 해당 계획의 오늘 학습한 분량이 목표치에 도달했는지 확인하는 함수
  Future<bool> isDailyGoalAchieved(StudyPlanModel plan) async {
    final selectedDate = _homeController.selectedDate.value;
    int dailyCompletedAmount =
        await getDailyCompletedAmount(plan, selectedDate);
    int dailyGoal = await calculateDailyGoal(plan, selectedDate);
    return dailyCompletedAmount >= dailyGoal;
  }
}
