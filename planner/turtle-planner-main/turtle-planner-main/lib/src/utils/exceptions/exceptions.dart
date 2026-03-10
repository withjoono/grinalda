/// 다양한 오류를 처리하기 위한 커스텀 예외 클래스
class CExceptions implements Exception {
  final String message;

  const CExceptions([this.message = '예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.']);

  factory CExceptions.fromCode(String code) {
    switch (code) {
      case 'email-already-in-use':
        return const CExceptions('이미 등록된 이메일 주소입니다. 다른 이메일을 사용해 주세요.');
      case 'invalid-email':
        return const CExceptions('유효하지 않은 이메일 주소입니다. 올바른 이메일을 입력해 주세요.');
      case 'weak-password':
        return const CExceptions('비밀번호가 너무 약합니다. 더 강력한 비밀번호를 선택해 주세요.');
      case 'user-disabled':
        return const CExceptions('이 사용자 계정이 비활성화되었습니다. 지원팀에 문의하세요.');
      case 'user-not-found':
        return const CExceptions('잘못된 로그인 정보입니다. 사용자를 찾을 수 없습니다.');
      case 'wrong-password':
        return const CExceptions('잘못된 비밀번호입니다. 비밀번호를 확인하고 다시 시도해 주세요.');
      case 'INVALID_LOGIN_CREDENTIALS':
        return const CExceptions('잘못된 로그인 자격 증명입니다. 정보를 다시 확인해 주세요.');
      case 'too-many-requests':
        return const CExceptions('요청이 너무 많습니다. 나중에 다시 시도해 주세요.');
      case 'invalid-argument':
        return const CExceptions('인증 방법에 유효하지 않은 인수가 제공되었습니다.');
      case 'invalid-password':
        return const CExceptions('잘못된 비밀번호입니다. 다시 시도해 주세요.');
      case 'invalid-phone-number':
        return const CExceptions('제공된 전화번호가 유효하지 않습니다.');
      case 'operation-not-allowed':
        return const CExceptions('이 로그인 제공자는 귀하의 Firebase 프로젝트에서 비활성화되어 있습니다.');
      case 'session-cookie-expired':
        return const CExceptions('Firebase 세션 쿠키가 만료되었습니다. 다시 로그인해 주세요.');
      case 'uid-already-exists':
        return const CExceptions('제공된 사용자 ID가 이미 다른 사용자에 의해 사용 중입니다.');
      case 'sign_in_failed':
        return const CExceptions('로그인에 실패했습니다. 다시 시도해 주세요.');
      case 'network-request-failed':
        return const CExceptions('네트워크 요청 실패. 인터넷 연결을 확인해 주세요.');
      case 'internal-error':
        return const CExceptions('내부 오류. 나중에 다시 시도해 주세요.');
      case 'invalid-verification-code':
        return const CExceptions('유효하지 않은 인증 코드입니다. 올바른 코드를 입력해 주세요.');
      case 'invalid-verification-id':
        return const CExceptions('유효하지 않은 인증 ID입니다. 새로운 인증 코드를 요청해 주세요.');
      case 'quota-exceeded':
        return const CExceptions('할당량 초과. 나중에 다시 시도해 주세요.');
      default:
        return const CExceptions();
    }
  }
}
