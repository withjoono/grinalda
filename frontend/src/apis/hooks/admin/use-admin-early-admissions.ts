import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';
import {
  EarlyAdmissionDetail,
  earlyAdmissionKeys,
} from '../use-early-admissions';

export interface CreateEarlyAdmissionRequest {
  year: number;
  admissionName: string;
  departmentName: string;
  universityId: number;
  admissionTypeId: number;
  searchTagIds?: number[];
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

  // 전년도 대학발표 통계자료
  passStatistics?: string;
  convertedTotalScore?: string;
  convertedScore50?: string;
  convertedScore70?: string;
  gradeScore50?: string;
  gradeScore70?: string;
  changesFromPrevYear?: string;
  waitlistRateInfo?: string;

  // 스케줄 정보
  applicationPeriod?: string;
  examLocationAnnouncement?: string;
  examDate?: string;
  resultAnnouncement?: string;
  documentSubmissionPeriod?: string;
  otherInfo?: string;

  // 추가 정보
  eligibilityCriteria?: string;
  minimumAcademicRequirement?: string;
  gedAllowed?: boolean;

  // 학생부 반영 방법
  firstGradeRatio?: string;
  secondGradeRatio?: string;
  thirdGradeRatio?: string;
  subjectRatio?: string;
  attendanceRatio?: string;
  volunteerRatio?: string;

  reflectedSubjects?: string;
  gradeIndicator?: string;
  grade1Score?: string;
  grade2Score?: string;
  grade3Score?: string;
  grade4Score?: string;
  grade5Score?: string;
  grade6Score?: string;
  grade7Score?: string;
  grade8Score?: string;
  grade9Score?: string;
}

// [POST] /early-admissions 수시전형 추가
export const useCreateEarlyAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEarlyAdmissionRequest) => {
      return Api.post<EarlyAdmissionDetail>(
        toUrl(AdminApiRoutes.DATA.EARLY_ADMISSIONS.CREATE),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: earlyAdmissionKeys.all });
    },
  });
};

// [PATCH] /early-admissions/:id 수시전형 수정
export const useUpdateEarlyAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Partial<CreateEarlyAdmissionRequest> & { id: number }
    ) => {
      const { id, ...rest } = data;
      return Api.patch<EarlyAdmissionDetail>(
        toUrl(AdminApiRoutes.DATA.EARLY_ADMISSIONS.UPDATE, {
          id: id.toString(),
        }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: earlyAdmissionKeys.all });
    },
  });
};

// [DELETE] /early-admissions/:id 수시전형 삭제
export const useDeleteEarlyAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      return Api.delete(
        toUrl(AdminApiRoutes.DATA.EARLY_ADMISSIONS.DELETE, {
          id: id.toString(),
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: earlyAdmissionKeys.all });
    },
  });
};
