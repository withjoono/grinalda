export interface Member {
  id: number;

  email: string;

  role_type: string; // MemberRoleEnum 참고

  // 휴대폰 번호
  phone: string;

  // sms 인증여부
  ck_sms: { type: 'Buffer'; data: number[] };

  // sms 수신동의
  ck_sms_agree: { type: 'Buffer'; data: number[] };

  // 개인정보 유효기간
  expiration_period: number | null;

  // 닉네임
  nickname: string | null;
  // 소개
  introduction: string | null;
  // 프로필 이미지
  profile_image_url: string | null;
  // 주소
  address: string | null;

  // oauth 공급자
  provider_type: string | null; // AuthProviderEnum 참고
  // oauth ID
  oauth_id: string | null;

  // 학생타입분류ID
  s_type_id: number | null;
  // 고등학교분류ID
  hst_type_id: number | null;
  // 학년타입분류ID
  g_type_id: number | null;
  // 졸업예정년도
  graduate_year: string | null;
  // 문과 or 이과 구분
  major: string | null;

  // 정지여부
  account_stop_yn: string; // N / Y

  create_dt: Date;

  update_dt: Date;
}
