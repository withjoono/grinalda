import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:hive_flutter/adapters.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:turtle_planner/app.dart';
import 'package:turtle_planner/firebase_options.dart';
import 'package:turtle_planner/src/data/models/study_plan_model.dart';
import 'package:turtle_planner/src/data/models/study_record_model.dart';
import 'package:turtle_planner/src/data/models/study_tag_model.dart';
import 'package:turtle_planner/src/data/repositories/authentication_repository.dart';

Future main() async {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();

  /// -- README(Update[]) -- GetX Local Storage
  await GetStorage.init();

  /// Hive 초기화 및 StudyRecord 어댑터 등록
  await Hive.initFlutter();
  Hive.registerAdapter(StudyRecordModelAdapter());
  Hive.registerAdapter(StudyTagModelAdapter());
  Hive.registerAdapter(StudyPlanModelAdapter());

  // Hive Box를 열기 전에 기존 데이터를 초기화할지 결정
  await _initializeHive();

  /// -- README(Docs[1]) -- Await Splash until other items Load
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);

  /// -- README(Docs[2]) -- Initialize Firebase & Authentication Repository
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)
      .then((_) => Get.put(AuthenticationRepository()));

  // 디바이스 오리엔테이션 설정(세로모드 고정)
  SystemChrome.setPreferredOrientations(
    [
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ],
  );

  // intl 패키지의 날짜 포맷팅을 위한 로케일 데이터 초기화
  await initializeDateFormatting("ko_KR", null);

  /// -- Main App Starts here (app.dart) ...
  runApp(const App());
}

/// Hive 초기화 함수
Future<void> _initializeHive() async {
  final box = await Hive.openBox('app_settings'); // 설정 박스
  const currentVersion = "1.0.0"; // 현재 앱 버전
  final storedVersion = box.get('app_version', defaultValue: '0.0.0') as String;

  if (storedVersion != currentVersion) {
    // 버전이 다르면 데이터 초기화
    await Hive.deleteBoxFromDisk('study_records');
    await Hive.openBox<StudyRecordModel>('study_records');
    await Hive.deleteBoxFromDisk('study_tags');
    await Hive.openBox<StudyTagModel>('study_tags');
    await Hive.deleteBoxFromDisk('study_plans');
    await Hive.openBox<StudyPlanModel>('study_plans');
    await box.put('app_version', currentVersion); // 현재 버전 저장
  } else {
    await Hive.openBox<StudyRecordModel>('study_records'); // 기존 박스 열기
    await Hive.openBox<StudyTagModel>('study_tags');
    await Hive.openBox<StudyPlanModel>('study_plans');
  }
}
