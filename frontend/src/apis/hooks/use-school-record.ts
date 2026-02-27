import { toUrl } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '../utils';
import { ApiRoutes } from '@/constants/routes';
import { bookmarkKeys } from './use-bookmarks';

export interface SchoolRecordSubjectInput {
  grade: number;
  semester: number;
  subjectGroupId: number;
  subjectName: string;
  units: number;
  score: number;
  average: number;
  standardDeviation: number;
  achievement: string;
  numberOfStudents: number;
  gradeRank?: number;
  note?: string;
}

export interface SchoolRecordSubject {
  grade: number;
  semester: number;
  subjectGroup: {
    id: number;
    name: string;
    code: string;
  };
  subjectName: string;
  units: number;
  score: number;
  average: number;
  standardDeviation: number;
  achievement: string;
  numberOfStudents: number;
  gradeRank?: number;
  note?: string;
}

export interface SchoolRecordSelectSubject {
  grade: number;
  semester: number;
  subjectGroup: {
    id: number;
    name: string;
    code: string;
  };
  subjectName: string;
  units: number;
  score: number;
  average: number;
  achievement: string;
  numberOfStudents: number;
  achievementRatioA: number;
  achievementRatioB: number;
  achievementRatioC: number;
  note?: string;
}

export interface SchoolRecordSelectSubjectInput {
  grade: number;
  semester: number;
  subjectGroupId: number;
  subjectName: string;
  units: number;
  score: number;
  average: number;
  achievement: string;
  numberOfStudents: number;
  achievementRatioA: number;
  achievementRatioB: number;
  achievementRatioC: number;
  note?: string;
}

export interface SchoolRecordSportArtInput {
  grade: number;
  semester: number;
  subjectGroupId: number;
  subjectName: string;
  units: number;
  achievement: string;
  note?: string;
}

export interface SchoolRecordSportArt {
  grade: number;
  semester: number;
  subjectGroup: {
    id: number;
    name: string;
    code: string;
  };
  subjectName: string;
  units: number;
  achievement: string;
  note?: string;
}

export interface SchoolRecordAttendance {
  grade: number;
  totalDays: number;
  absenceSick: number;
  absenceUnexcused: number;
  absenceEtc: number;
  tardySick: number;
  tardyUnexcused: number;
  tardyEtc: number;
  leaveSick: number;
  leaveUnexcused: number;
  leaveEtc: number;
  cutSick: number;
  cutUnexcused: number;
  cutEtc: number;
  note?: string;
}

export interface SchoolRecordCreativeActivity {
  id: number;
  grade: number;
  activityType: string;
  content: string | null;
}

export interface SchoolRecordCreativeActivityInput {
  grade: number;
  activityType: string;
  content?: string;
}

export interface SchoolRecordBehaviorOpinion {
  id: number;
  grade: number;
  content: string | null;
}

export interface SchoolRecordBehaviorOpinionInput {
  grade: number;
  content?: string;
}

export interface SaveSchoolRecordRequest {
  subjects?: SchoolRecordSubjectInput[];
  selectSubjects?: SchoolRecordSelectSubjectInput[];
  sportArts?: SchoolRecordSportArtInput[];
  attendances?: SchoolRecordAttendance[];
  creativeActivities?: SchoolRecordCreativeActivityInput[];
  behaviorOpinions?: SchoolRecordBehaviorOpinionInput[];
}

export interface UserSchoolRecord {
  subjects: SchoolRecordSubject[];
  selectSubjects: SchoolRecordSelectSubject[];
  sportArts: SchoolRecordSportArt[];
  attendances: SchoolRecordAttendance[];
  creativeActivities: SchoolRecordCreativeActivity[];
  behaviorOpinions: SchoolRecordBehaviorOpinion[];
}

export const schoolRecordKeys = {
  mySchoolRecord: ['my-school-record'] as const,
};

export const useMySchoolRecord = () => {
  return useQuery({
    queryKey: schoolRecordKeys.mySchoolRecord,
    queryFn: () =>
      Api.get<UserSchoolRecord>(toUrl(ApiRoutes.SCHOOL_RECORD.GET)),
  });
};

export const useSaveSchoolRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: SaveSchoolRecordRequest }) =>
      Api.post(toUrl(ApiRoutes.SCHOOL_RECORD.SAVE), data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: schoolRecordKeys.mySchoolRecord,
      });
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.preApplyIds,
      });
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: ['pre-apply-scores'] as const,
      });
    },
  });
};

export const useDeleteSchoolRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Api.delete(toUrl(ApiRoutes.SCHOOL_RECORD.DELETE)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: schoolRecordKeys.mySchoolRecord,
      });
    },
  });
};
