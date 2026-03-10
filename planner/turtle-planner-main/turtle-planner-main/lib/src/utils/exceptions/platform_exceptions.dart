/// 플랫폼 관련 오류를 처리하기 위한 예외 클래스.
class CPlatformException implements Exception {
  final String code;

  CPlatformException(this.code);

  String get message {
    switch (code) {
      case 'INVALID_LOGIN_CREDENTIALS':
        return '잘못된 로그인 자격 증명입니다. 정보를 다시 확인해 주세요.';
      case 'too-many-requests':
        return '요청이 너무 많습니다. 나중에 다시 시도해 주세요.';
      case 'invalid-argument':
        return '인증 방법에 유효하지 않은 인수가 제공되었습니다.';
      case 'invalid-password':
        return '잘못된 비밀번호입니다. 다시 시도해 주세요.';
      case 'invalid-phone-number':
        return '제공된 전화번호가 유효하지 않습니다.';
      case 'operation-not-allowed':
        return '이 로그인 제공자는 귀하의 Firebase 프로젝트에서 비활성화되어 있습니다.';
      case 'session-cookie-expired':
        return 'Firebase 세션 쿠키가 만료되었습니다. 다시 로그인해 주세요.';
      case 'uid-already-exists':
        return '제공된 사용자 ID가 이미 다른 사용자에 의해 사용 중입니다.';
      case 'sign_in_failed':
        return '로그인에 실패했습니다. 다시 시도해 주세요.';
      case 'network-request-failed':
        return '네트워크 요청 실패. 인터넷 연결을 확인해 주세요.';
      case 'internal-error':
        return '내부 오류. 나중에 다시 시도해 주세요.';
      case 'invalid-verification-code':
        return '유효하지 않은 인증 코드입니다. 올바른 코드를 입력해 주세요.';
      case 'invalid-verification-id':
        return '유효하지 않은 인증 ID입니다. 새로운 인증 코드를 요청해 주세요.';
      case 'quota-exceeded':
        return '할당량 초과. 나중에 다시 시도해 주세요.';
      default:
        return '예기치 않은 플랫폼 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }
}
