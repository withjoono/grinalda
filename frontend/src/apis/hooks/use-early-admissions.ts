import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';
import { University } from './use-universities';
import { SearchTag } from './use-search-tags';
import { AdmissionType } from './use-admission-types';

export const earlyAdmissionKeys = {
  all: ['all-early-admissions'] as const,
};

// 전년도 대학발표 통계자료
export interface PrevResultStatistics {
  id: number;
  passStatistics: string; // 전년도 대학발표 합격자 통계
  convertedTotalScore: string; // 교과환산 총점
  convertedScore50: string; // 교과환산 50컷
  convertedScore70: string; // 교과환산 70컷
  gradeScore50: string; // 교과등급 50컷
  gradeScore70: string; // 교과등급 70컷
  changesFromPrevYear: string; // 전년도 대비 변경내용 및 포인트
  waitlistRateInfo: string; // 전년도 예비합격 순위 및 충원율
}

// 전형 일정
export interface ScheduleInfo {
  id: number;
  applicationPeriod: string; // 원서접수기간
  examLocationAnnouncement: string; // 실기(면접)일정 및 고사장안내
  examDate: string; // 실기(면접,논술)시험일
  resultAnnouncement: string; // 합격자발표
  otherInfo: string; // 기타
  documentSubmissionPeriod: string; // 서류제출 기한(해당자)
}

// 전형 추가 정보
export interface AdditionalInfo {
  id: number;
  eligibilityCriteria: string; // 지원자격기준
  minimumAcademicRequirement: string; // 최저학력기준
  gedAllowed: string; // 검정고시가능여부
}

// 학생부 반영 방법
export interface RecordReflectionMethodInfo {
  id: number;
  firstGradeRatio: string; // 1학년 반영비율
  secondGradeRatio: string; // 2학년 반영비율
  thirdGradeRatio: string; // 3학년 반영비율
  subjectRatio: string; // 교과 반영비율
  attendanceRatio: string; // 출석 반영비율
  volunteerRatio: string; // 봉사 반영비율
  reflectedSubjects: string; // 반영교과
  gradeIndicator: string; // 활용지표
  grade1Score: string; // 1등급 반영점수
  grade2Score: string;
  grade3Score: string;
  grade4Score: string;
  grade5Score: string;
  grade6Score: string;
  grade7Score: string;
  grade8Score: string;
  grade9Score: string;
}

// 수시전형 목록 조회용
export interface EarlyAdmissionListItem {
  id: number;
  year: number;
  departmentName: string;
  admissionName: string;
  quota: string;
  totalApplicants: string;
  competitionRate: string;
  lastYearQuota: string;
  lastYearApplicants: string;
  lastYearCompetitionRate: string;
  elementReflectionRatioInfo: string;
  practicalSubjectInfo: string;
  studentRecordRatio: string; // 학생부비율(ex. 150/500)
  convertCut: string; // 예상점수_환산점
  gradeCut: string; // 예상점수_등급
  university: University;
  searchTags: SearchTag[];
  admissionType: AdmissionType;
}

// 수시전형 상세 조회용 인터페이스
export interface EarlyAdmissionDetail extends EarlyAdmissionListItem {
  earlyAdmissionSchedule: ScheduleInfo;
  earlyAdmissionAdditionalInfo: AdditionalInfo;
  schoolRecordReflectionMethod: RecordReflectionMethodInfo;
  earlyAdmissionPrevResult: PrevResultStatistics;
}

// [GET] /early-admissions 모든 수시전형 조회
export const useAllEarlyAdmissions = () => {
  return useQuery({
    queryKey: earlyAdmissionKeys.all,
    queryFn: () => {
      return Api.get<EarlyAdmissionListItem[]>(
        toUrl(ApiRoutes.DATA.EARLY_ADMISSIONS)
      );
    },
  });
};

// [GET] /early-admissions/:id 수시전형 상세 조회
export const useEarlyAdmissionDetail = (id: number) => {
  return useQuery({
    queryKey: [earlyAdmissionKeys.all, id],
    queryFn: () => {
      return Api.get<EarlyAdmissionDetail>(
        toUrl(ApiRoutes.DATA.EARLY_ADMISSION_DETAIL, { id: id.toString() })
      );
    },
  });
};
