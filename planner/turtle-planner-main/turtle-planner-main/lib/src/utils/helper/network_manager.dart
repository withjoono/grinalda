import 'dart:async';
import 'package:get/get.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/services.dart';
import 'package:turtle_planner/src/utils/helper/helper_controller.dart';

/// 네트워크 연결 상태를 관리하고 연결 변경을 확인하고 처리하는 메서드를 제공
class NetworkManager extends GetxController {
  static NetworkManager get instance => Get.find();

  final Connectivity _connectivity = Connectivity();
  late StreamSubscription<List<ConnectivityResult>> _connectivitySubscription;
  final RxList<ConnectivityResult> _connectionStatus =
      <ConnectivityResult>[].obs;

  /// 네트워크 매니저를 초기화하고 연결 상태를 지속적으로 확인하는 스트림을 설정
  @override
  void onInit() {
    super.onInit();
    _connectivitySubscription =
        _connectivity.onConnectivityChanged.listen(_updateConnectionStatus);
  }

  /// 연결 상태의 변화에 따라 상태를 업데이트하고 인터넷 연결이 없을 경우 관련 팝업을 표시
  Future<void> _updateConnectionStatus(List<ConnectivityResult> result) async {
    _connectionStatus.value = result;
    if (result.contains(ConnectivityResult.none)) {
      Helper.modernSnackBar(title: "", message: '인터넷 연결이 없습니다');
    }
  }

  /// 인터넷 연결 상태를 확인
  /// 연결되어 있으면 `true`, 그렇지 않으면 `false`를 반환
  Future<bool> isConnected() async {
    try {
      final result = await _connectivity.checkConnectivity();
      if (result.any((element) => element == ConnectivityResult.none)) {
        return false;
      } else {
        return true;
      }
    } on PlatformException catch (_) {
      return false;
    }
  }

  /// 활성화된 연결 스트림을 해제하거나 닫음
  @override
  void onClose() {
    super.onClose();
    _connectivitySubscription.cancel();
  }
}
