/// Firebase 관련 오류를 처리하기 위한 커스텀 예외 클래스.
class CFirebaseException implements Exception {
  final String code;

  CFirebaseException(this.code);

  String get message {
    switch (code) {
      case 'unknown':
        return '알 수 없는 Firebase 오류가 발생했습니다. 다시 시도해 주세요.';
      case 'invalid-custom-token':
        return '커스텀 토큰 형식이 올바르지 않습니다. 커스텀 토큰을 확인해 주세요.';
      case 'custom-token-mismatch':
        return '커스텀 토큰이 다른 대상에 해당합니다.';
      case 'user-disabled':
        return '사용자 계정이 비활성화되었습니다.';
      case 'user-not-found':
        return '해당 이메일 또는 UID에 대한 사용자를 찾을 수 없습니다.';
      case 'invalid-email':
        return '유효하지 않은 이메일 주소입니다. 올바른 이메일을 입력해 주세요.';
      case 'email-already-in-use':
        return '이미 등록된 이메일 주소입니다. 다른 이메일을 사용해 주세요.';
      case 'wrong-password':
        return '잘못된 비밀번호입니다. 비밀번호를 확인하고 다시 시도해 주세요.';
      case 'weak-password':
        return '비밀번호가 너무 약합니다. 더 강력한 비밀번호를 선택해 주세요.';
      case 'provider-already-linked':
        return '계정이 이미 다른 제공자와 연결되어 있습니다.';
      case 'operation-not-allowed':
        return '이 작업은 허용되지 않습니다. 지원팀에 문의하세요.';
      case 'invalid-credential':
        return '제공된 자격 증명이 잘못되었거나 만료되었습니다.';
      case 'invalid-verification-code':
        return '유효하지 않은 인증 코드입니다. 올바른 코드를 입력해 주세요.';
      case 'invalid-verification-id':
        return '유효하지 않은 인증 ID입니다. 새로운 인증 코드를 요청해 주세요.';
      case 'captcha-check-failed':
        return 'reCAPTCHA 응답이 유효하지 않습니다. 다시 시도해 주세요.';
      case 'app-not-authorized':
        return '이 앱은 제공된 API 키로 Firebase 인증을 사용할 권한이 없습니다.';
      case 'keychain-error':
        return '키체인 오류가 발생했습니다. 키체인을 확인하고 다시 시도해 주세요.';
      case 'internal-error':
        return '내부 인증 오류가 발생했습니다. 나중에 다시 시도해 주세요.';
      case 'invalid-app-credential':
        return '앱 자격 증명이 유효하지 않습니다. 올바른 앱 자격 증명을 제공해 주세요.';
      case 'user-mismatch':
        return '제공된 자격 증명이 이전에 로그인한 사용자와 일치하지 않습니다.';
      case 'requires-recent-login':
        return '이 작업은 민감하여 최근 인증이 필요합니다. 다시 로그인해 주세요.';
      case 'quota-exceeded':
        return '할당량 초과. 나중에 다시 시도해 주세요.';
      case 'account-exists-with-different-credential':
        return '같은 이메일을 사용하는 계정이 이미 다른 로그인 방식으로 존재합니다.';
      case 'missing-iframe-start':
        return '이메일 템플릿에 iframe 시작 태그가 누락되었습니다.';
      case 'missing-iframe-end':
        return '이메일 템플릿에 iframe 종료 태그가 누락되었습니다.';
      case 'missing-iframe-src':
        return '이메일 템플릿에 iframe src 속성이 누락되었습니다.';
      case 'auth-domain-config-required':
        return '작업 코드 확인 링크에 authDomain 구성이 필요합니다.';
      case 'missing-app-credential':
        return '앱 자격 증명이 누락되었습니다. 유효한 앱 자격 증명을 제공해 주세요.';
      case 'session-cookie-expired':
        return 'Firebase 세션 쿠키가 만료되었습니다. 다시 로그인해 주세요.';
      case 'uid-already-exists':
        return '제공된 사용자 ID가 이미 다른 사용자에 의해 사용 중입니다.';
      case 'web-storage-unsupported':
        return '웹 스토리지가 지원되지 않거나 비활성화되어 있습니다.';
      case 'app-deleted':
        return '이 FirebaseApp 인스턴스가 삭제되었습니다.';
      case 'user-token-mismatch':
        return '제공된 사용자 토큰이 인증된 사용자의 ID와 일치하지 않습니다.';
      case 'invalid-message-payload':
        return '이메일 템플릿 확인 메시지 페이로드가 유효하지 않습니다.';
      case 'invalid-sender':
        return '이메일 템플릿 발신자가 유효하지 않습니다. 발신자 이메일을 확인해 주세요.';
      case 'invalid-recipient-email':
        return '수신자 이메일 주소가 유효하지 않습니다. 올바른 수신자 이메일을 제공해 주세요.';
      case 'missing-action-code':
        return '작업 코드가 누락되었습니다. 유효한 작업 코드를 제공해 주세요.';
      case 'user-token-expired':
        return '사용자 토큰이 만료되어 인증이 필요합니다. 다시 로그인해 주세요.';
      case 'INVALID_LOGIN_CREDENTIALS':
        return '잘못된 로그인 자격 증명입니다.';
      case 'expired-action-code':
        return '작업 코드가 만료되었습니다. 새로운 작업 코드를 요청해 주세요.';
      case 'invalid-action-code':
        return '유효하지 않은 작업 코드입니다. 코드를 확인하고 다시 시도해 주세요.';
      case 'credential-already-in-use':
        return '이 자격 증명이 이미 다른 사용자 계정과 연결되어 있습니다.';
      default:
        return '예기치 않은 Firebase 오류가 발생했습니다. 다시 시도해 주세요.';
    }
  }
}
