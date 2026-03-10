import 'package:get/get.dart';
import 'package:turtle_planner/src/data/models/study_record_model.dart';
import 'package:turtle_planner/src/data/repositories/study_record_repository.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

class StudyRecordController extends GetxController {
  static StudyRecordController get instance => Get.find();

  RxBool isLoading = true.obs;
  RxList<StudyRecordModel> allStudyRecords = <StudyRecordModel>[].obs;
  final _studyRecordRepository = Get.put(StudyRecordRepository());

  @override
  void onInit() async {
    super.onInit();
    await fetchAllStudyRecords();
  }

  /// 모든 학습 기록을 가져오는 메서드
  Future<void> fetchAllStudyRecords() async {
    try {
      // 학습 기록을 불러오는 동안 로더 표시
      isLoading.value = true;

      // 저장소에서 모든 학습 기록 가져오기
      final fetchedRecords = await _studyRecordRepository.getAllStudyRecords();
      // 학습 기록 리스트 업데이트
      allStudyRecords.assignAll(fetchedRecords);
    } catch (e) {
      Helper.errorSnackBar(title: '오류 발생', message: e.toString());
    } finally {
      isLoading.value = false;
    }
  }

  /// 시작 날짜, 종료 날짜, 학습 계획 ID(선택적)로 학습 기록 조회
  List<StudyRecordModel> getStudyRecordsByDateRangeAndPlanId(
      DateTime startDate, DateTime endDate,
      {String? studyPlanId}) {
    return allStudyRecords.where((record) {
      bool dateInRange = (record.date.isAtSameMomentAs(startDate) ||
              record.date.isAfter(startDate)) &&
          record.date.isBefore(endDate.add(const Duration(days: 1)));

      if (studyPlanId != null) {
        return record.studyPlanId == studyPlanId && dateInRange;
      } else {
        return dateInRange;
      }
    }).toList();
  }

  /// 학습 계획 ID로 학습 기록 조회
  List<StudyRecordModel> getStudyRecordsByPlanId(String studyPlanId) {
    return allStudyRecords
        .where((record) => record.studyPlanId == studyPlanId)
        .toList();
  }

  /// 새로운 학습 기록 추가
  Future<void> addStudyRecord(StudyRecordModel record) async {
    try {
      await _studyRecordRepository.addStudyRecord(record);
      allStudyRecords.add(record);
    } catch (e) {
      Helper.errorSnackBar(
          title: '오류 발생', message: '학습 기록 추가 실패: ${e.toString()}');
    }
  }

  /// 학습 기록 업데이트
  Future<void> updateStudyRecord(StudyRecordModel record) async {
    try {
      await _studyRecordRepository.updateStudyRecord(record);
      int index = allStudyRecords.indexWhere((r) => r.id == record.id);
      if (index != -1) {
        allStudyRecords[index] = record;
      }
    } catch (e) {
      Helper.errorSnackBar(
          title: '오류 발생', message: '학습 기록 업데이트 실패: ${e.toString()}');
    }
  }

  /// 학습 기록 삭제
  Future<void> deleteStudyRecord(String recordId) async {
    try {
      StudyRecordModel record =
          allStudyRecords.firstWhere((r) => r.id == recordId);
      await _studyRecordRepository.deleteStudyRecord(
          recordId, record.studyPlanId, record.date);
      allStudyRecords.removeWhere((r) => r.id == recordId);
    } catch (e) {
      Helper.errorSnackBar(
          title: '오류 발생', message: '학습 기록 삭제 실패: ${e.toString()}');
    }
  }

  /// 특정 StudyPlan에 관련된 모든 StudyRecord 삭제
  Future<void> deleteStudyRecordsByPlanId(String planId) async {
    try {
      // 해당 planId를 가진 모든 StudyRecord 찾기
      List<StudyRecordModel> recordsToDelete = allStudyRecords
          .where((record) => record.studyPlanId == planId)
          .toList();

      // 각 StudyRecord 삭제
      for (var record in recordsToDelete) {
        await _studyRecordRepository.deleteStudyRecord(
            record.id, record.studyPlanId, record.date);
      }

      // 로컬 리스트에서도 삭제
      allStudyRecords.removeWhere((record) => record.studyPlanId == planId);

      print('Deleted ${recordsToDelete.length} study records for plan $planId');
    } catch (e) {
      Helper.errorSnackBar(
          title: '오류 발생', message: '학습 기록 삭제 실패: ${e.toString()}');
    }
  }

  /// 캐시 초기화
  Future<void> clearCache() async {
    await _studyRecordRepository.clearCache();
    allStudyRecords.clear();
    await fetchAllStudyRecords();
  }
}
