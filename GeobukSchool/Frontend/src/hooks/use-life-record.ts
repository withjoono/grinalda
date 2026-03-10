import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  IEditLifeRecordBody,
  ISchoolRecordAttendance,
  ISchoolRecordSelectSubject,
  ISchoolRecordSubject,
} from "@/stores/server/features/me/interfaces";
import { useGetSchoolRecords } from "@/stores/server/features/me/queries";
import { useEditLifeRecord } from "@/stores/server/features/me/mutations";
import { PARSING_API } from "@/stores/server/features/parsing/apis";
import { IMainSubject, ISubject } from "@/types/subject.type";

const makeInitialNormalGyogwaItem = (
  grade: string,
): Omit<ISchoolRecordSubject, "id"> => ({
  grade,
  semester: "1",
  main_subject_code: "",
  main_subject_name: "",
  subject_code: "",
  subject_name: "",
  unit: "",
  raw_score: "",
  sub_subject_average: "",
  standard_deviation: "",
  achievement: "",
  students_num: "",
  ranking: "",
  etc: "",
});

const makeInitialCourseGyogwaItem = (
  grade: string,
): Omit<ISchoolRecordSelectSubject, "id"> => ({
  grade,
  semester: "1",
  main_subject_code: "",
  main_subject_name: "",
  subject_code: "",
  subject_name: "",
  unit: "",
  raw_score: "",
  sub_subject_average: "",
  achievement: "",
  achievementa: "",
  achievementb: "",
  achievementc: "",
  students_num: "",
  etc: "",
});

const makeInitialAttendanceItem = (
  grade: string,
): Omit<ISchoolRecordAttendance, "id"> => ({
  grade,
  absent_disease: 0,
  absent_etc: 0,
  absent_unrecognized: 0,
  class_days: 0,
  etc: "",
  late_disease: 0,
  late_etc: 0,
  late_unrecognized: 0,
  leave_early_disease: 0,
  leave_early_etc: 0,
  leave_early_unrecognized: 0,
  result_disease: 0,
  result_early_etc: 0,
  result_unrecognized: 0,
});

export const useLifeRecord = ({
  mainSubjects,
  subjects,
}: {
  mainSubjects: IMainSubject[];
  subjects: ISubject[];
}) => {
  const { data: schoolRecord, refetch: refetchSchoolRecord } =
    useGetSchoolRecords();
  const editLifeRecordMutation = useEditLifeRecord();

  const [isLoading, setIsLoading] = useState(false);
  const [currentGrade, setCurrentGrade] = useState("1");
  const [isDirty, setIsDirty] = useState(false);
  const [schoolrecordSubjectLearningList, setSchoolrecordSubjectLearningList] =
    useState<{
      [key: string]: Omit<ISchoolRecordSubject, "id">[];
    }>({ "1": [], "2": [], "3": [] });
  const [schoolrecordSelectSubjectList, setSchoolrecordSelectSubjectList] =
    useState<{
      [key: string]: Omit<ISchoolRecordSelectSubject, "id">[];
    }>({ "1": [], "2": [], "3": [] });
  const [
    schoolrecordAttendanceDetailList,
    setSchoolrecordAttendanceDetailList,
  ] = useState<{
    [key: string]: Omit<ISchoolRecordAttendance, "id">;
  }>({
    "1": makeInitialAttendanceItem("1"),
    "2": makeInitialAttendanceItem("2"),
    "3": makeInitialAttendanceItem("3"),
  });

  const mainSubjectNameToCodeMap = useMemo(() => {
    return mainSubjects.reduce<{
      [key: string]: string;
    }>((acc, curr) => {
      acc[curr.name] = curr.code;
      return acc;
    }, {});
  }, [mainSubjects]);

  const subjectNameToCodeMap = useMemo(() => {
    return subjects.reduce<{
      [key: string]: string;
    }>((acc, curr) => {
      acc[curr.name] = curr.code;
      return acc;
    }, {});
  }, [subjects]);

  const findMainSubjectCodeBySubjectName = (subjectName: string) => {
    return mainSubjectNameToCodeMap[subjectName] || "";
  };

  const findSubjectNameBySubjectCode = (subjectName: string) => {
    return subjectNameToCodeMap[subjectName] || "";
  };

  const parsingSchoolRecord = async (file: File) => {
    try {
      setIsLoading(true);
      const res = await PARSING_API.parsingSchoolRecord(file);

      if (res.data?.academic_records) {
        const subjectData = {
          "1": [
            ...(res.data.academic_records["1학년"]?.["1학기"]
              ? res.data.academic_records["1학년"]["1학기"].일반.map(
                  (item) => ({
                    grade: "1",
                    semester: "1",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    standard_deviation: item.표준편차 || null,
                    achievement: item.성취도 || null,
                    students_num: item.수강자수 || null,
                    ranking: item.석차등급 || null,
                    etc: "",
                  }),
                )
              : []),
            ...(res.data.academic_records["1학년"]?.["2학기"]
              ? res.data.academic_records["1학년"]["2학기"].일반.map(
                  (item) => ({
                    grade: "1",
                    semester: "2",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    standard_deviation: item.표준편차 || null,
                    achievement: item.성취도 || null,
                    students_num: item.수강자수 || null,
                    ranking: item.석차등급 || null,
                    etc: "",
                  }),
                )
              : []),
          ],
          "2": [
            ...(res.data.academic_records["2학년"]?.["1학기"]
              ? res.data.academic_records["2학년"]["1학기"].일반.map(
                  (item) => ({
                    grade: "2",
                    semester: "1",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    standard_deviation: item.표준편차 || null,
                    achievement: item.성취도 || null,
                    students_num: item.수강자수 || null,
                    ranking: item.석차등급 || null,
                    etc: "",
                  }),
                )
              : []),
            ...(res.data.academic_records["2학년"]?.["2학기"]
              ? res.data.academic_records["2학년"]["2학기"].일반.map(
                  (item) => ({
                    grade: "2",
                    semester: "2",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    standard_deviation: item.표준편차 || null,
                    achievement: item.성취도 || null,
                    students_num: item.수강자수 || null,
                    ranking: item.석차등급 || null,
                    etc: "",
                  }),
                )
              : []),
          ],
          "3": [
            ...(res.data.academic_records["3학년"]?.["1학기"]
              ? res.data.academic_records["3학년"]["1학기"].일반.map(
                  (item) => ({
                    grade: "3",
                    semester: "1",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    standard_deviation: item.표준편차 || null,
                    achievement: item.성취도 || null,
                    students_num: item.수강자수 || null,
                    ranking: item.석차등급 || null,
                    etc: "",
                  }),
                )
              : []),
            ...(res.data.academic_records["3학년"]?.["2학기"]
              ? res.data.academic_records["3학년"]["2학기"].일반.map(
                  (item) => ({
                    grade: "3",
                    semester: "2",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    standard_deviation: item.표준편차 || null,
                    achievement: item.성취도 || null,
                    students_num: item.수강자수 || null,
                    ranking: item.석차등급 || null,
                    etc: "",
                  }),
                )
              : []),
          ],
        };
        const selectSubjectData = {
          "1": [
            ...(res.data.academic_records["1학년"]?.["1학기"]
              ? res.data.academic_records["1학년"]["1학기"].진로선택.map(
                  (item) => ({
                    grade: "1",
                    semester: "1",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    achievement: item.성취도 || null,
                    achievementa: item.성취도분포비율A || null,
                    achievementb: item.성취도분포비율B || null,
                    achievementc: item.성취도분포비율C || null,
                    students_num: item.수강자수 || null,
                    etc: "",
                  }),
                )
              : []),
            ...(res.data.academic_records["1학년"]?.["2학기"]
              ? res.data.academic_records["1학년"]["2학기"].진로선택.map(
                  (item) => ({
                    grade: "1",
                    semester: "2",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    achievement: item.성취도 || null,
                    achievementa: item.성취도분포비율A || null,
                    achievementb: item.성취도분포비율B || null,
                    achievementc: item.성취도분포비율C || null,
                    students_num: item.수강자수 || null,
                    etc: "",
                  }),
                )
              : []),
          ],
          "2": [
            ...(res.data.academic_records["2학년"]?.["1학기"]
              ? res.data.academic_records["2학년"]["1학기"].진로선택.map(
                  (item) => ({
                    grade: "2",
                    semester: "1",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    achievement: item.성취도 || null,
                    achievementa: item.성취도분포비율A || null,
                    achievementb: item.성취도분포비율B || null,
                    achievementc: item.성취도분포비율C || null,
                    students_num: item.수강자수 || null,
                    etc: "",
                  }),
                )
              : []),
            ...(res.data.academic_records["2학년"]?.["2학기"]
              ? res.data.academic_records["2학년"]["2학기"].진로선택.map(
                  (item) => ({
                    grade: "2",
                    semester: "2",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    achievement: item.성취도 || null,
                    achievementa: item.성취도분포비율A || null,
                    achievementb: item.성취도분포비율B || null,
                    achievementc: item.성취도분포비율C || null,
                    students_num: item.수강자수 || null,
                    etc: "",
                  }),
                )
              : []),
          ],
          "3": [
            ...(res.data.academic_records["3학년"]?.["1학기"]
              ? res.data.academic_records["3학년"]["1학기"].진로선택.map(
                  (item) => ({
                    grade: "3",
                    semester: "1",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    achievement: item.성취도 || null,
                    achievementa: item.성취도분포비율A || null,
                    achievementb: item.성취도분포비율B || null,
                    achievementc: item.성취도분포비율C || null,
                    students_num: item.수강자수 || null,
                    etc: "",
                  }),
                )
              : []),
            ...(res.data.academic_records["3학년"]?.["2학기"]
              ? res.data.academic_records["3학년"]["2학기"].진로선택.map(
                  (item) => ({
                    grade: "3",
                    semester: "2",
                    main_subject_code: findMainSubjectCodeBySubjectName(
                      item.교과명,
                    ),
                    main_subject_name: item.교과명,
                    subject_code: findSubjectNameBySubjectCode(item.과목명),
                    subject_name: item.과목명,
                    unit: item.단위수 || null,
                    raw_score: item.원점수 || null,
                    sub_subject_average: item.과목평균 || null,
                    achievement: item.성취도 || null,
                    achievementa: item.성취도분포비율A || null,
                    achievementb: item.성취도분포비율B || null,
                    achievementc: item.성취도분포비율C || null,
                    students_num: item.수강자수 || null,
                    etc: "",
                  }),
                )
              : []),
          ],
        };
        setSchoolrecordSubjectLearningList(subjectData);

        setSchoolrecordSelectSubjectList(selectSubjectData);

        setIsDirty(true);
      }
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        toast.error(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (schoolRecord) {
      setSchoolrecordAttendanceDetailList(() => {
        const newState = schoolRecord.attendance.reduce<{
          [key: string]: Omit<ISchoolRecordAttendance, "id">;
        }>((acc, curr) => {
          if (curr?.grade && ["1", "2", "3"].includes(curr.grade)) {
            const { id, ...attendanceWithoutId } = curr;
            acc[curr.grade] = attendanceWithoutId;
          }
          return acc;
        }, {});

        // 누락된 학년에 대해 초기값 설정
        ["1", "2", "3"].forEach((grade) => {
          if (!newState[grade]) {
            newState[grade] = makeInitialAttendanceItem(grade);
          }
        });

        return newState;
      });

      setSchoolrecordSelectSubjectList(
        schoolRecord.selectSubjects.reduce<{
          [key: string]: Omit<ISchoolRecordSelectSubject, "id">[];
        }>((acc, curr) => {
          if (curr?.grade) {
            if (!acc[curr.grade]) acc[curr.grade] = [];
            const { id, ...subjectWithoutId } = curr;
            acc[curr.grade].push(subjectWithoutId);
          }
          return acc;
        }, {}),
      );
      setSchoolrecordSubjectLearningList(
        schoolRecord.subjects.reduce<{
          [key: string]: Omit<ISchoolRecordSubject, "id">[];
        }>((acc, curr) => {
          if (curr?.grade) {
            if (!acc[curr.grade]) acc[curr.grade] = [];
            const { id, ...subjectWithoutId } = curr;
            acc[curr.grade].push(subjectWithoutId);
          }
          return acc;
        }, {}),
      );
    }
  }, [schoolRecord]);

  const onChangeSubjectValue = useCallback(
    (index: number, type: string, value: string) => {
      setSchoolrecordSubjectLearningList((prev) => ({
        ...prev,
        [currentGrade]: prev[currentGrade].map((item, i) =>
          i === index ? { ...item, [type]: value } : item,
        ),
      }));
      setIsDirty(true);
    },
    [currentGrade],
  );

  const onChangeSelectSubjectValue = useCallback(
    (index: number, type: string, value: string) => {
      setSchoolrecordSelectSubjectList((prev) => ({
        ...prev,
        [currentGrade]: prev[currentGrade].map((item, i) =>
          i === index ? { ...item, [type]: value } : item,
        ),
      }));
      setIsDirty(true);
    },
    [currentGrade],
  );

  const onChangeAttendanceValue = useCallback(
    (type: string, value: string | number) => {
      setSchoolrecordAttendanceDetailList((prev) => ({
        ...prev,
        [currentGrade]: { ...prev[currentGrade], [type]: Number(value) },
      }));
      setIsDirty(true);
    },
    [currentGrade],
  );

  const onClickAddOrDelLine = useCallback(
    (isAdd: boolean, isSelectSubject: boolean) => {
      const setter = isSelectSubject
        ? setSchoolrecordSelectSubjectList
        : setSchoolrecordSubjectLearningList;
      const makeInitialItem = isSelectSubject
        ? makeInitialCourseGyogwaItem
        : makeInitialNormalGyogwaItem;

      setter((prev: { [key: string]: any[] }) => {
        const currentList = prev[currentGrade] || [];
        const newList = isAdd
          ? [...currentList, makeInitialItem(currentGrade)]
          : currentList.length > 0
            ? currentList.slice(0, -1)
            : [];
        return { ...prev, [currentGrade]: newList };
      });
      setIsDirty(true);
    },
    [currentGrade],
  );

  const onClickSaveGrade = useCallback(async () => {
    if (!isDirty) {
      toast.info("변경된 내용이 없습니다.");
      return;
    }

    // Validation logic...
    let isValidate = true;
    Object.values(schoolrecordSubjectLearningList)
      .flat()
      .forEach((item) => {
        if (item.main_subject_code === "" || item.achievement === "") {
          isValidate = false;
        }
      });
    Object.values(schoolrecordSelectSubjectList)
      .flat()
      .forEach((item) => {
        if (item.main_subject_code === "" || item.achievement === "") {
          isValidate = false;
        }
      });

    if (!isValidate) {
      toast.error(
        "필드 입력이 잘못되었습니다. 교과와 성취도는 반드시 입력되어야합니다.",
      );
      return;
    }

    const validatedAttendances = Object.values(
      schoolrecordAttendanceDetailList,
    ).map((attendance) => {
      const convertedAttendance: Partial<ISchoolRecordAttendance> = {};
      for (const [key, value] of Object.entries(attendance)) {
        if (key === "grade" || key === "etc") {
          (convertedAttendance as any)[key] = value;
        } else {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            isValidate = false;
            toast.error(
              `출결 정보의 ${key} 필드에 유효하지 않은 값이 있습니다.`,
            );
            return null;
          }
          (convertedAttendance as any)[key] = numValue;
        }
      }
      return convertedAttendance as ISchoolRecordAttendance;
    });

    if (!isValidate || validatedAttendances.some((item) => item === null)) {
      toast.error(
        "출결 데이터가 잘못되었습니다. 문자열 혹은 공백이 포함되어있는지 확인해주세요.",
      );
      return;
    }

    const payload: IEditLifeRecordBody = {
      attendances: validatedAttendances.filter(
        (n) => n !== null,
      ) as ISchoolRecordAttendance[],
      selectSubjects: Object.values(schoolrecordSelectSubjectList).flat(),
      subjects: Object.values(schoolrecordSubjectLearningList).flat(),
    };

    try {
      const result = await editLifeRecordMutation.mutateAsync(payload);
      if (result.success) {
        toast.success("성적이 성공적으로 저장되었습니다.");
        await refetchSchoolRecord();
        setIsDirty(false);
      } else {
        throw new Error("저장 실패");
      }
    } catch (error) {
      toast.error("성적을 저장하는데 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, [
    isDirty,
    schoolrecordAttendanceDetailList,
    schoolrecordSelectSubjectList,
    schoolrecordSubjectLearningList,
    editLifeRecordMutation,
    refetchSchoolRecord,
  ]);

  const currentSubjects = useMemo(
    () => schoolrecordSubjectLearningList[currentGrade] || [],
    [schoolrecordSubjectLearningList, currentGrade],
  );
  const currentSelectSubjects = useMemo(
    () => schoolrecordSelectSubjectList[currentGrade] || [],
    [schoolrecordSelectSubjectList, currentGrade],
  );
  const currentAttendance = useMemo(
    () => schoolrecordAttendanceDetailList[currentGrade] || null,
    [schoolrecordAttendanceDetailList, currentGrade],
  );

  return {
    currentGrade,
    setCurrentGrade,
    schoolrecordSubjectLearningList: currentSubjects,
    schoolrecordSelectSubjectList: currentSelectSubjects,
    schoolrecordAttendanceDetailList: currentAttendance,
    onChangeAttendanceValue,
    onChangeSelectSubjectValue,
    onChangeSubjectValue,
    onClickAddOrDelLine,
    onClickSaveGrade,
    isLoading,
    parsingSchoolRecord,
  };
};
