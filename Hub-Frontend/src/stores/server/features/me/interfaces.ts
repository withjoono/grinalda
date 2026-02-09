export interface IUser {
  id: string;
  email: string | null;
  role_type: string | null;
  phone: string | null;
  ck_sms_agree: boolean;
  nickname: string;
  member_type: 'student' | 'teacher' | 'parent';
  user_type_code: string | null;
  user_type_detail_code: string | null;
  // 타입별 서브 프로필
  studentProfile?: {
    member_id: string;
    school_code: string | null;
    school_name: string | null;
    school_location: string | null;
    school_type: string | null;
    school_level: string | null;
    grade: number | null;
  };
  teacherProfile?: {
    member_id: string;
    school_level: string | null;
    subject: string | null;
  };
  parentProfile?: {
    member_id: string;
    parent_type: string | null;
  };
}

// 출결
export interface ISchoolRecordAttendance {
  id: number;
  absent_disease: number | null;
  absent_etc: number | null;
  absent_unrecognized: number | null;
  class_days: number | null;
  etc: string | null;
  grade: string | null;
  late_disease: number | null;
  late_etc: number | null;
  late_unrecognized: number | null;
  leave_early_disease: number | null;
  leave_early_etc: number | null;
  leave_early_unrecognized: number | null;
  result_disease: number | null;
  result_early_etc: number | null;
  result_unrecognized: number | null;
}

// 비교과 성적
export interface ISchoolRecordSelectSubject {
  id: number;
  achievement: string | null;
  achievementa: string | null;
  achievementb: string | null;
  achievementc: string | null;
  etc: string | null;
  grade: string | null;
  main_subject_code: string | null;
  main_subject_name: string;
  raw_score: string | null;
  semester: string | null;
  students_num: string | null;
  sub_subject_average: string | null;
  subject_code: string | null;
  subject_name: string;
  unit: string | null;
}

// 교과 성적
export interface ISchoolRecordSubject {
  id: number;
  achievement: string | null; // 성취도
  etc: string | null; // 비고
  grade: string | null; // 학년
  main_subject_code: string | null; // 교과코드
  main_subject_name: string; // 교과이름
  ranking: string | null; // 석차등급
  raw_score: string | null; // 원점수
  semester: string | null; // 학기
  standard_deviation: string | null; // 표준편차
  students_num: string | null; // 수강자수
  sub_subject_average: string | null; // 과목평균
  subject_code: string | null; // 과목
  subject_name: string | null; // 과목이름
  unit: string | null; // 단위수
}

export interface ISchoolRecord {
  attendance: ISchoolRecordAttendance[];
  selectSubjects: ISchoolRecordSelectSubject[];
  subjects: ISchoolRecordSubject[];
  volunteers: ISchoolRecordVolunteer[];
  isEmpty: boolean;
}

// *************** 내 모의고사 성적 평균낼때 사용 *************

// 과목별 합 (과목, 학년, 학기)
export interface ISubjectSumInfo {
  subject: string;
  grade: string;
  semester: string;
  totalRanking: number;
  totalUnits: number;
}

// 과목별 평균 등급
export interface IEachSubjectAverage {
  korean: { average: string; totalUnits: number };
  english: { average: string; totalUnits: number };
  science: { average: string; totalUnits: number };
  society: { average: string; totalUnits: number };
  math: { average: string; totalUnits: number };
}

// 봉사
export interface ISchoolRecordVolunteer {
  id: number;
  accumulate_time: string | null;
  activity_content: string | null;
  activity_time: string | null;
  date: string | null;
  grade: string | null;
  place: string | null;
}

// *************** Mutation *************

export interface IEditProfileBody {
  nickname?: string;
  phone?: string;
  ck_sms_agree?: boolean;
  // 학생 전용
  school_level?: string;
  grade?: number;
  school_code?: string;
  school_name?: string;
  // 선생님 전용
  subject?: string;
  teacher_school_level?: string;
  // 학부모 전용
  parent_type?: string;
}

export interface IEditLifeRecordBody {
  attendances: Omit<ISchoolRecordAttendance, "id">[];
  subjects: Omit<ISchoolRecordSubject, "id">[];
  selectSubjects: Omit<ISchoolRecordSelectSubject, "id">[];
}
