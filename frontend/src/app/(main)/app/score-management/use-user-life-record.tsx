'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import {
  SchoolRecordAttendance,
  SchoolRecordCreativeActivityInput,
  SchoolRecordBehaviorOpinionInput,
  SchoolRecordSelectSubjectInput,
  SchoolRecordSubjectInput,
  useMySchoolRecord,
  useSaveSchoolRecord,
} from '@/apis/hooks/use-school-record';
import { useParseSchoolRecord } from '@/apis/hooks/use-parse-school-record';
import { normalizeSubjectName } from '@/lib/utils';

const makeInitialSubjectItem = (grade: number): SchoolRecordSubjectInput => ({
  grade,
  semester: 1,
  subjectGroupId: 0,
  subjectName: '',
  units: 0,
  score: 0,
  average: 0,
  standardDeviation: 0,
  achievement: '',
  numberOfStudents: 0,
  gradeRank: 0,
  note: '',
});

const makeInitialSelectSubjectItem = (
  grade: number
): SchoolRecordSelectSubjectInput => ({
  grade,
  semester: 1,
  subjectGroupId: 0,
  subjectName: '',
  units: 0,
  score: 0,
  average: 0,
  achievement: '',
  numberOfStudents: 0,
  achievementRatioA: 0,
  achievementRatioB: 0,
  achievementRatioC: 0,
  note: '',
});

const makeInitialAttendanceItem = (grade: number): SchoolRecordAttendance => ({
  grade,
  totalDays: 0,
  absenceSick: 0,
  absenceUnexcused: 0,
  absenceEtc: 0,
  tardySick: 0,
  tardyUnexcused: 0,
  tardyEtc: 0,
  leaveSick: 0,
  leaveUnexcused: 0,
  leaveEtc: 0,
  cutSick: 0,
  cutUnexcused: 0,
  cutEtc: 0,
  note: '',
});

export const useUserLifeRecord = ({
  subjectNameToIdMapper,
}: {
  subjectNameToIdMapper: { [key: string]: number };
}) => {
  const {
    data: schoolRecord,
    refetch: refetchSchoolRecord,
    isLoading,
    error,
  } = useMySchoolRecord();
  const { mutateAsync: saveSchoolRecord } = useSaveSchoolRecord();
  const { mutateAsync: parseSchoolRecord } = useParseSchoolRecord();

  const [currentGrade, setCurrentGrade] = useState(1);
  const [isDirty, setIsDirty] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [subjects, setSubjects] = useState<{
    [key: number]: SchoolRecordSubjectInput[];
  }>({ 1: [], 2: [], 3: [] });
  const [selectSubjects, setSelectSubjects] = useState<{
    [key: number]: SchoolRecordSelectSubjectInput[];
  }>({ 1: [], 2: [], 3: [] });
  const [attendances, setAttendances] = useState<{
    [key: number]: SchoolRecordAttendance;
  }>({
    1: makeInitialAttendanceItem(1),
    2: makeInitialAttendanceItem(2),
    3: makeInitialAttendanceItem(3),
  });
  const [creativeActivities, setCreativeActivities] = useState<
    SchoolRecordCreativeActivityInput[]
  >([]);
  const [behaviorOpinions, setBehaviorOpinions] = useState<
    SchoolRecordBehaviorOpinionInput[]
  >([]);

  useEffect(() => {
    if (schoolRecord) {
      // 출석 정보 설정
      setAttendances(() => {
        const newState = schoolRecord.attendances.reduce<{
          [key: number]: SchoolRecordAttendance;
        }>((acc, curr) => {
          if (curr?.grade && [1, 2, 3].includes(curr.grade)) {
            acc[curr.grade] = curr;
          }
          return acc;
        }, {});

        [1, 2, 3].forEach((grade) => {
          if (!newState[grade]) {
            newState[grade] = makeInitialAttendanceItem(grade);
          }
        });

        return newState;
      });

      // 선택과목 설정
      setSelectSubjects(
        schoolRecord.selectSubjects.reduce<{
          [key: number]: SchoolRecordSelectSubjectInput[];
        }>((acc, curr) => {
          if (curr?.grade) {
            if (!acc[curr.grade]) acc[curr.grade] = [];
            acc[curr.grade].push({
              ...curr,
              subjectGroupId: curr.subjectGroup.id,
            });
          }
          return acc;
        }, {})
      );

      // 일반과목 설정
      setSubjects(
        schoolRecord.subjects.reduce<{
          [key: number]: SchoolRecordSubjectInput[];
        }>((acc, curr) => {
          if (curr?.grade) {
            if (!acc[curr.grade]) acc[curr.grade] = [];
            acc[curr.grade].push({
              ...curr,
              subjectGroupId: curr.subjectGroup.id,
            });
          }
          return acc;
        }, {})
      );
    }
  }, [schoolRecord]);

  const onClickParseSchoolRecord = useCallback(
    async (file: File) => {
      if (isUploading || !subjectNameToIdMapper) return;

      try {
        setIsUploading(true);
        const res = await parseSchoolRecord(file);

        if (res.data?.academic_records) {
          const subjectData = {
            1: [
              ...(res.data.academic_records['1학년']?.['1학기']
                ? res.data.academic_records['1학년']['1학기'].일반.map(
                  (item) => ({
                    grade: 1,
                    semester: 1,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.과목명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    standardDeviation: Number(item.표준편차) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    gradeRank: Number(item.석차등급) || 0,
                    note: '',
                  })
                )
                : []),
              ...(res.data.academic_records['1학년']?.['2학기']
                ? res.data.academic_records['1학년']['2학기'].일반.map(
                  (item) => ({
                    grade: 1,
                    semester: 2,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.과목명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    standardDeviation: Number(item.표준편차) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    gradeRank: Number(item.석차등급) || 0,
                    note: '',
                  })
                )
                : []),
            ],
            2: [
              ...(res.data.academic_records['2학년']?.['1학기']
                ? res.data.academic_records['2학년']['1학기'].일반.map(
                  (item) => ({
                    grade: 2,
                    semester: 1,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.과목명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    standardDeviation: Number(item.표준편차) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    gradeRank: Number(item.석차등급) || 0,
                    note: '',
                  })
                )
                : []),
              ...(res.data.academic_records['2학년']?.['2학기']
                ? res.data.academic_records['2학년']['2학기'].일반.map(
                  (item) => ({
                    grade: 2,
                    semester: 2,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.과목명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    standardDeviation: Number(item.표준편차) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    gradeRank: Number(item.석차등급) || 0,
                    note: '',
                  })
                )
                : []),
            ],
            3: [
              ...(res.data.academic_records['3학년']?.['1학기']
                ? res.data.academic_records['3학년']['1학기'].일반.map(
                  (item) => ({
                    grade: 3,
                    semester: 1,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.과목명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    standardDeviation: Number(item.표준편차) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    gradeRank: Number(item.석차등급) || 0,
                    note: '',
                  })
                )
                : []),
              ...(res.data.academic_records['3학년']?.['2학기']
                ? res.data.academic_records['3학년']['2학기'].일반.map(
                  (item) => ({
                    grade: 3,
                    semester: 2,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.과목명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    standardDeviation: Number(item.표준편차) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    gradeRank: Number(item.석차등급) || 0,
                    note: '',
                  })
                )
                : []),
            ],
          };
          const selectSubjectData = {
            1: [
              ...(res.data.academic_records['1학년']?.['1학기']
                ? res.data.academic_records['1학년']['1학기'].진로선택.map(
                  (item) => ({
                    grade: 1,
                    semester: 1,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.교과명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    achievementRatioA: Number(item.성취도분포비율A) || 0,
                    achievementRatioB: Number(item.성취도분포비율B) || 0,
                    achievementRatioC: Number(item.성취도분포비율C) || 0,
                    note: '',
                  })
                )
                : []),
              ...(res.data.academic_records['1학년']?.['2학기']
                ? res.data.academic_records['1학년']['2학기'].진로선택.map(
                  (item) => ({
                    grade: 1,
                    semester: 2,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.교과명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    achievementRatioA: Number(item.성취도분포비율A) || 0,
                    achievementRatioB: Number(item.성취도분포비율B) || 0,
                    achievementRatioC: Number(item.성취도분포비율C) || 0,
                    note: '',
                  })
                )
                : []),
            ],
            2: [
              ...(res.data.academic_records['2학년']?.['1학기']
                ? res.data.academic_records['2학년']['1학기'].진로선택.map(
                  (item) => ({
                    grade: 2,
                    semester: 1,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.교과명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    achievementRatioA: Number(item.성취도분포비율A) || 0,
                    achievementRatioB: Number(item.성취도분포비율B) || 0,
                    achievementRatioC: Number(item.성취도분포비율C) || 0,
                    note: '',
                  })
                )
                : []),
              ...(res.data.academic_records['2학년']?.['2학기']
                ? res.data.academic_records['2학년']['2학기'].진로선택.map(
                  (item) => ({
                    grade: 2,
                    semester: 2,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.교과명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    achievementRatioA: Number(item.성취도분포비율A) || 0,
                    achievementRatioB: Number(item.성취도분포비율B) || 0,
                    achievementRatioC: Number(item.성취도분포비율C) || 0,
                    note: '',
                  })
                )
                : []),
            ],
            3: [
              ...(res.data.academic_records['3학년']?.['1학기']
                ? res.data.academic_records['3학년']['1학기'].진로선택.map(
                  (item) => ({
                    grade: 3,
                    semester: 1,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.교과명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    achievementRatioA: Number(item.성취도분포비율A) || 0,
                    achievementRatioB: Number(item.성취도분포비율B) || 0,
                    achievementRatioC: Number(item.성취도분포비율C) || 0,
                    note: '',
                  })
                )
                : []),
              ...(res.data.academic_records['3학년']?.['2학기']
                ? res.data.academic_records['3학년']['2학기'].진로선택.map(
                  (item) => ({
                    grade: 3,
                    semester: 2,
                    subjectGroupId:
                      subjectNameToIdMapper[
                      normalizeSubjectName(item.교과명)
                      ],
                    subjectName: item.교과명,
                    units: Number(item.단위수) || 0,
                    score: Number(item.원점수) || 0,
                    average: Number(item.과목평균) || 0,
                    achievement: item.성취도 || '',
                    numberOfStudents: Number(item.수강자수) || 0,
                    achievementRatioA: Number(item.성취도분포비율A) || 0,
                    achievementRatioB: Number(item.성취도분포비율B) || 0,
                    achievementRatioC: Number(item.성취도분포비율C) || 0,
                    note: '',
                  })
                )
                : []),
            ],
          };
          setSubjects(subjectData);
          setSelectSubjects(selectSubjectData);

          // 세특 (detail_specialties) → subject.note 에 매핑
          if (res.data?.detail_specialties && res.data.detail_specialties.length > 0) {
            const ds = res.data.detail_specialties;
            // subjectData의 note에 세특 content 매핑
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updatedSubjects: any = { ...subjectData };
            for (const gradeKey of [1, 2, 3] as const) {
              if (updatedSubjects[gradeKey]) {
                updatedSubjects[gradeKey] = updatedSubjects[gradeKey].map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (sub: any) => {
                    const match = ds.find(
                      (d) =>
                        d.grade === sub.grade &&
                        d.semester === sub.semester &&
                        d.subject_name.trim() === sub.subjectName.trim()
                    );
                    return match ? { ...sub, note: match.content } : sub;
                  }
                );
              }
            }
            setSubjects(updatedSubjects);

            // selectSubjectData에도 매핑
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updatedSelectSubjects: any = { ...selectSubjectData };
            for (const gradeKey of [1, 2, 3] as const) {
              if (updatedSelectSubjects[gradeKey]) {
                updatedSelectSubjects[gradeKey] = updatedSelectSubjects[gradeKey].map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (sub: any) => {
                    const match = ds.find(
                      (d) =>
                        d.grade === sub.grade &&
                        d.semester === sub.semester &&
                        d.subject_name.trim() === sub.subjectName.trim()
                    );
                    return match ? { ...sub, note: match.content } : sub;
                  }
                );
              }
            }
            setSelectSubjects(updatedSelectSubjects);
          }

          // 창체/행특 데이터 저장
          if (res.data?.creative_activities) {
            setCreativeActivities(
              res.data.creative_activities.map(
                (item: { grade: number; activity_type: string; content: string }) => ({
                  grade: item.grade,
                  activityType: item.activity_type,
                  content: item.content || '',
                })
              )
            );
          }
          if (res.data?.behavior_opinions) {
            setBehaviorOpinions(
              res.data.behavior_opinions.map(
                (item: { grade: number; content: string }) => ({
                  grade: item.grade,
                  content: item.content || '',
                })
              )
            );
          }

          setIsDirty(true);
          toast.success('성적을 확인하고 저장 버튼을 눌러주세요.');
        }
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          toast.error(e.message);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [schoolRecord, parseSchoolRecord, subjectNameToIdMapper, isUploading]
  );

  const onChangeSubjectValue = useCallback(
    (index: number, type: string, value: number | string) => {
      setSubjects((prev) => ({
        ...prev,
        [currentGrade]: prev[currentGrade].map((item, i) =>
          i === index ? { ...item, [type]: value } : item
        ),
      }));
      setIsDirty(true);
    },
    [currentGrade]
  );

  const onChangeSelectSubjectValue = useCallback(
    (index: number, type: string, value: number | string) => {
      setSelectSubjects((prev) => ({
        ...prev,
        [currentGrade]: prev[currentGrade].map((item, i) =>
          i === index ? { ...item, [type]: value } : item
        ),
      }));
      setIsDirty(true);
    },
    [currentGrade]
  );

  const onChangeAttendanceValue = useCallback(
    (type: string, value: number | string) => {
      setAttendances((prev) => ({
        ...prev,
        [currentGrade]: { ...prev[currentGrade], [type]: Number(value) },
      }));
      setIsDirty(true);
    },
    [currentGrade]
  );

  const onClickAddOrDelLine = useCallback(
    (isAdd: boolean, isSelectSubject: boolean) => {
      if (isSelectSubject) {
        setSelectSubjects((prev) => {
          const currentList = prev[currentGrade] || [];
          const newList = isAdd
            ? [...currentList, makeInitialSelectSubjectItem(currentGrade)]
            : currentList.length > 0
              ? currentList.slice(0, -1)
              : [];
          return { ...prev, [currentGrade]: newList };
        });
      } else {
        setSubjects((prev) => {
          const currentList = prev[currentGrade] || [];
          const newList = isAdd
            ? [...currentList, makeInitialSubjectItem(currentGrade)]
            : currentList.length > 0
              ? currentList.slice(0, -1)
              : [];
          return { ...prev, [currentGrade]: newList };
        });
      }
      setIsDirty(true);
    },
    [currentGrade]
  );

  const onClickSaveGrade = useCallback(async () => {
    if (!isDirty) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    // 유효성 검사
    let isValid = true;

    // 과목 유효성 검사
    [
      ...Object.values(subjects).flat(),
      ...Object.values(selectSubjects).flat(),
    ].forEach((item) => {
      if (!item.subjectName || !item.achievement) {
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error('과목명과 성취도는 반드시 입력되어야 합니다.');
      return;
    }

    // 출석 데이터 유효성 검사
    Object.values(attendances).forEach((attendance) => {
      Object.entries(attendance).forEach(([key, value]) => {
        if (key !== 'grade' && key !== 'note') {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            isValid = false;
          }
        }
      });
    });

    if (!isValid) {
      toast.error('출결 데이터가 올바르지 않습니다.');
      return;
    }

    try {
      await saveSchoolRecord({
        data: {
          attendances: Object.values(attendances).map((attendance) => ({
            totalDays: attendance.totalDays,
            absenceSick: attendance.absenceSick,
            absenceUnexcused: attendance.absenceUnexcused,
            absenceEtc: attendance.absenceEtc,
            tardySick: attendance.tardySick,
            tardyUnexcused: attendance.tardyUnexcused,
            tardyEtc: attendance.tardyEtc,
            leaveSick: attendance.leaveSick,
            leaveUnexcused: attendance.leaveUnexcused,
            leaveEtc: attendance.leaveEtc,
            cutSick: attendance.cutSick,
            cutUnexcused: attendance.cutUnexcused,
            cutEtc: attendance.cutEtc,
            grade: attendance.grade,
            note: attendance.note || '',
          })),
          subjects: Object.values(subjects)
            .flat()
            .map((subject) => ({
              semester: subject.semester,
              subjectGroupId: subject.subjectGroupId,
              subjectName: subject.subjectName,
              units: subject.units,
              score: subject.score,
              average: subject.average,
              standardDeviation: subject.standardDeviation,
              achievement: subject.achievement,
              numberOfStudents: subject.numberOfStudents,
              gradeRank: subject.gradeRank,
              note: subject.note || '',
              grade: subject.grade,
            })),
          selectSubjects: Object.values(selectSubjects)
            .flat()
            .map((subject) => ({
              grade: subject.grade,
              semester: subject.semester,
              subjectGroupId: subject.subjectGroupId,
              subjectName: subject.subjectName,
              units: subject.units,
              score: subject.score,
              average: subject.average,
              achievement: subject.achievement,
              numberOfStudents: subject.numberOfStudents,
              achievementRatioA: subject.achievementRatioA,
              achievementRatioB: subject.achievementRatioB,
              achievementRatioC: subject.achievementRatioC,
              note: subject.note || '',
            })),
          creativeActivities,
          behaviorOpinions,
        },
      });

      toast.success('성적이 저장되었습니다.');
      setIsDirty(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('성적 저장에 실패했습니다.');
    }
  }, [isDirty, attendances, selectSubjects, subjects, saveSchoolRecord]);

  const currentSubjects = useMemo(
    () => subjects[currentGrade] || [],
    [subjects, currentGrade]
  );

  const currentSelectSubjects = useMemo(
    () => selectSubjects[currentGrade] || [],
    [selectSubjects, currentGrade]
  );

  const currentAttendance = useMemo(
    () => attendances[currentGrade] || 0,
    [attendances, currentGrade]
  );

  return {
    currentGrade,
    setCurrentGrade,
    subjects: currentSubjects,
    selectSubjects: currentSelectSubjects,
    attendance: currentAttendance,
    onChangeAttendanceValue,
    onChangeSelectSubjectValue,
    onChangeSubjectValue,
    onClickAddOrDelLine,
    onClickSaveGrade,
    isLoading,
    error,
    refetchSchoolRecord,
    onClickParseSchoolRecord, // 생기부 성적 파싱
    isUploading,
  };
};
