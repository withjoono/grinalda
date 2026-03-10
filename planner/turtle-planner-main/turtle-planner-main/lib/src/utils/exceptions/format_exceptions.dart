/// Format 관련 오류를 처리하기 위한 커스텀 예외 클래스.
class CFormatException implements Exception {
  final String message;

  const CFormatException([this.message = '예기치 않은 형식 오류가 발생했습니다. 입력을 확인해 주세요.']);

  factory CFormatException.fromMessage(String message) {
    return CFormatException(message);
  }

  String get formattedMessage => message;

  factory CFormatException.fromCode(String code) {
    switch (code) {
      case 'invalid-email-format':
        return const CFormatException(
            '이메일 주소 형식이 올바르지 않습니다. 유효한 이메일을 입력해 주세요.');
      case 'invalid-phone-number-format':
        return const CFormatException(
            '제공된 전화번호 형식이 올바르지 않습니다. 유효한 번호를 입력해 주세요.');
      case 'invalid-date-format':
        return const CFormatException('날짜 형식이 올바르지 않습니다. 유효한 날짜를 입력해 주세요.');
      case 'invalid-url-format':
        return const CFormatException('URL 형식이 올바르지 않습니다. 유효한 URL을 입력해 주세요.');
      case 'invalid-credit-card-format':
        return const CFormatException(
            '신용카드 형식이 올바르지 않습니다. 유효한 신용카드 번호를 입력해 주세요.');
      case 'invalid-numeric-format':
        return const CFormatException('입력은 유효한 숫자 형식이어야 합니다.');
      default:
        return const CFormatException();
    }
  }
}
