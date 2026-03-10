import { useEffect, useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import isEqual from "lodash/isEqual";
import { useQueryClient } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MOCK_EXAM_SUBJECT_CODE,
  ISubjectInfo,
} from "@/constants/mock-exam-subject-code";
import {
  IMockExamStandardScore,
  ISaveMockExamStandardScoresData,
} from "@/stores/server/features/mock-exam/interfaces";
import { useSaveMockExamSrandardScores } from "@/stores/server/features/mock-exam/mutations";
import { useGetMockExamStandardScores, mockExamQueryKeys } from "@/stores/server/features/mock-exam/queries";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import 표점백분변환표 from "./표점백분변환표.json";
import { getMockExamSubjectName } from "@/constants/mock-exam-subject-codes";

const percentileTable = 표점백분변환표 as {
  [key: string]: {
    [key: string]: {
      백분위: string;
      등급: string;
      누백: string;
    };
  };
};

const formSchema = z.object({
  ko_select_code: z.string(),
  ko_score_standard: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(200, "점수의 범위가 올바르지 않습니다."),
  ko_score_grade: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(9, "점수의 범위가 올바르지 않습니다."),
  ko_score_percentile: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(100, "점수의 범위가 올바르지 않습니다."),

  math_select_code: z.string(),
  math_score_standard: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(200, "점수의 범위가 올바르지 않습니다."),
  math_score_grade: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(9, "점수의 범위가 올바르지 않습니다."),
  math_score_percentile: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(100, "점수의 범위가 올바르지 않습니다."),

  eng_grade: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(9, "점수의 범위가 올바르지 않습니다."),

  history_grade: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(9, "점수의 범위가 올바르지 않습니다."),

  research_1_select_code: z.string(),
  research_1_score_standard: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(200, "점수의 범위가 올바르지 않습니다."),
  research_1_score_grade: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(9, "점수의 범위가 올바르지 않습니다."),
  research_1_score_percentile: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(100, "점수의 범위가 올바르지 않습니다."),

  research_2_select_code: z.string(),
  research_2_score_standard: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(200, "점수의 범위가 올바르지 않습니다."),
  research_2_score_grade: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(9, "점수의 범위가 올바르지 않습니다."),
  research_2_score_percentile: z.coerce
    .number()
    .min(1, "점수의 범위가 올바르지 않습니다.")
    .max(100, "점수의 범위가 올바르지 않습니다."),

  lang_select_code: z.string(),
  lang_grade: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(50, "점수의 범위가 올바르지 않습니다."),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const MockExamStandardForm = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetCurrentUser();
  // Mutations
  const saveMockExamStandardScores = useSaveMockExamSrandardScores();
  const { data: standardScores } =
    useGetMockExamStandardScores();

  const [remainingEdits, setRemainingEdits] = useState(0);

  const [research_1, setResearch_1] = useState<"science" | "society">(
    "science",
  );
  const [research_2, setResearch_2] = useState<"science" | "society">(
    "science",
  );

  const [initialValues, setInitialValues] = useState<FormSchemaType | null>(
    null,
  );

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      ko_score_standard: 0,
      ko_score_grade: 0,
      ko_score_percentile: 0,
      ko_select_code: "S1",
      math_score_standard: 0,
      math_score_grade: 0,
      math_score_percentile: 0,
      math_select_code: "S4",
      eng_grade: 0,
      history_grade: 0,
      research_1_select_code: "S10",
      research_1_score_standard: 0,
      research_1_score_grade: 0,
      research_1_score_percentile: 0,
      research_2_select_code: "S11",
      research_2_score_standard: 0,
      research_2_score_grade: 0,
      research_2_score_percentile: 0,
      lang_select_code: "S27",
      lang_grade: 0,
    },
  });

  // TODO: 임시 코드

  const EDIT_COUNT_VERSION = "v3"; // 버전을 변경하면 모든 사용자의 카운트가 초기화됨
  const STORAGE_KEY = `mockExamRemainingEdits_${user?.id}_${EDIT_COUNT_VERSION}`;
  useEffect(() => {
    // 개발 환경에서는 무제한 수정 허용
    if (import.meta.env.DEV) {
      setRemainingEdits(999);
      return;
    }

    const remainingEdits = localStorage.getItem(STORAGE_KEY);
    localStorage.removeItem(`mockExamRemainingEdits_${user?.id}_v1`);
    localStorage.removeItem(`mockExamRemainingEdits_${user?.id}_v2`);
    if (!remainingEdits) {
      // 이전버전 제거
      localStorage.setItem(STORAGE_KEY, "1");
      setRemainingEdits(1);
    } else {
      setRemainingEdits(Number(remainingEdits));
    }
    // user?.id와 STORAGE_KEY는 의도적으로 제외 (마운트 시에만 실행)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: FormSchemaType) => {
    // 개발 환경에서는 횟수 제한 무시
    if (!import.meta.env.DEV) {
      const remainingEdits = Number(localStorage.getItem(STORAGE_KEY) || "0");

      if (remainingEdits <= 0) {
        toast.error("수정 가능한 횟수를 모두 사용하셨습니다.");
        return;
      }
    }

    if (values.research_1_select_code === values.research_2_select_code) {
      toast.error("탐구 과목 선택이 잘못되었습니다.");
      return;
    }
    if (isEqual(initialValues, values)) {
      toast.info("변경된 사항이 없습니다.");
      return;
    }
    const data: ISaveMockExamStandardScoresData[] = [];
    data.push({
      subject_code: "S3", // 공통국어
      standard_score: values.ko_score_standard,
      percentile: values.ko_score_percentile,
      grade: values.ko_score_grade,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: values.ko_select_code,
      standard_score: values.ko_score_standard,
      percentile: values.ko_score_percentile,
      grade: values.ko_score_grade,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: "S7", // 공통수학
      standard_score: values.math_score_standard,
      percentile: values.math_score_percentile,
      grade: values.math_score_grade,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: values.math_select_code,
      standard_score: values.math_score_standard,
      percentile: values.math_score_percentile,
      grade: values.math_score_grade,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: "S8", // 영어
      standard_score: values.eng_grade,
      percentile: 0,
      grade: values.eng_grade,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: "S9", // 한국사
      standard_score: values.history_grade,
      percentile: 0,
      grade: values.history_grade,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: values.research_1_select_code, // 선택 1
      standard_score: values.research_1_score_standard,
      percentile: values.research_1_score_percentile,
      grade: values.research_1_score_grade,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: values.research_2_select_code, // 선택 2
      standard_score: values.research_2_score_standard,
      percentile: values.research_2_score_percentile,
      grade: values.research_2_score_grade,
      schedule_id: 5, // 2025년 6모 아이디
    });
    if (values.lang_select_code !== "none") {
      data.push({
        subject_code: values.lang_select_code, // 제2외국어
        standard_score: values.lang_grade,
        percentile: 0,
        grade: values.lang_grade,
        schedule_id: 5, // 2025년 6모 아이디
      });
    }

    const result = await saveMockExamStandardScores.mutateAsync(data);

    if (result.success) {
      // TODO: 임시 코드 (개발 환경에서는 횟수 차감 안 함)
      if (!import.meta.env.DEV) {
        const remainingEdits = Number(localStorage.getItem(STORAGE_KEY) || "0");
        const newRemainingEdits = remainingEdits - 1;
        localStorage.setItem(STORAGE_KEY, String(newRemainingEdits));
        setRemainingEdits(newRemainingEdits);
      }

      // 저장한 값으로 initialValues를 업데이트하여 폼이 그대로 유지되도록 함
      setInitialValues(values);

      // React Query 캐시를 무효화하여 다음 페이지 방문 시 최신 데이터를 가져오도록 함
      queryClient.invalidateQueries({ queryKey: mockExamQueryKeys.standardScores() });

      toast.success("성공적으로 모의고사 점수를 등록했습니다.");
    } else {
      toast.error(result.error);
    }
  };

  useEffect(() => {
    if (standardScores) {
      initializeForm(
        standardScores.data.map((item) => ({
          subjectCode: item.code,
          grade: item.grade,
          standardScore: item.standardScore,
          percentile: item.percentile,
        })),
      );
    }
    // initializeForm은 useCallback으로 감싸지 않음 (form.setValue 의존성 문제)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standardScores]);

  const initializeForm = (data: IMockExamStandardScore[]) => {
    // const ko_score_common = data.find((item) => item.subjectCode === "S3");
    const ko_select_code = data.find(
      (item) => item.subjectCode === "S1" || item.subjectCode === "S2",
    );
    // const math_score_common = data.find((item) => item.subjectCode === "S7");
    const math_select_code = data.find(
      (item) =>
        item.subjectCode === "S4" ||
        item.subjectCode === "S5" ||
        item.subjectCode === "S6",
    );
    const eng_score = data.find((item) => item.subjectCode === "S8");
    const history_score = data.find((item) => item.subjectCode === "S9");
    const science_select_codes = data.filter((item) =>
      ["S10", "S11", "S12", "S13", "S14", "S15", "S16", "S17"].includes(
        item.subjectCode,
      ),
    );
    const society_select_codes = data.filter((item) =>
      ["S18", "S19", "S20", "S21", "S22", "S23", "S24", "S25", "S26"].includes(
        item.subjectCode,
      ),
    );
    const lang_select_codes = data.find((item) =>
      ["S27", "S28", "S29", "S30", "S31", "S32", "S33", "S34", "S35"].includes(
        item.subjectCode,
      ),
    );

    const initialValues: FormSchemaType = {
      ko_score_standard: parseInt(ko_select_code?.standardScore || "0"),
      ko_score_grade: ko_select_code?.grade || 0,
      ko_score_percentile: ko_select_code?.percentile || 0,

      math_score_standard: parseInt(math_select_code?.standardScore || "0"),
      math_score_grade: math_select_code?.grade || 0,
      math_score_percentile: math_select_code?.percentile || 0,

      eng_grade: eng_score?.grade || 0,

      history_grade: history_score?.grade || 0,

      research_1_score_standard:
        science_select_codes.length > 0
          ? parseInt(science_select_codes[0]?.standardScore || "0")
          : parseInt(society_select_codes[0]?.standardScore || "0"),
      research_1_score_grade:
        science_select_codes.length > 0
          ? science_select_codes[0]?.grade || 0
          : society_select_codes[0]?.grade || 0,
      research_1_score_percentile:
        science_select_codes.length > 0
          ? science_select_codes[0]?.percentile || 0
          : society_select_codes[0]?.percentile || 0,

      research_2_score_standard:
        science_select_codes.length > 1
          ? parseInt(science_select_codes[1]?.standardScore || "0")
          : society_select_codes.length > 1
            ? parseInt(society_select_codes[1]?.standardScore || "0")
            : parseInt(society_select_codes[0]?.standardScore || "0"),
      research_2_score_grade:
        science_select_codes.length > 1
          ? science_select_codes[1]?.grade || 0
          : society_select_codes.length > 1
            ? society_select_codes[1]?.grade || 0
            : society_select_codes[0]?.grade || 0,
      research_2_score_percentile:
        science_select_codes.length > 1
          ? science_select_codes[1]?.percentile || 0
          : society_select_codes.length > 1
            ? society_select_codes[1]?.percentile || 0
            : society_select_codes[0]?.percentile || 0,

      lang_grade: lang_select_codes?.grade || 0,

      ko_select_code: ko_select_code?.subjectCode || "S1",
      math_select_code: math_select_code?.subjectCode || "S4",
      research_1_select_code:
        science_select_codes.length > 0
          ? science_select_codes[0]?.subjectCode || "S10"
          : society_select_codes[0]?.subjectCode || "S18",
      research_2_select_code:
        science_select_codes.length > 1
          ? science_select_codes[1]?.subjectCode || "S11"
          : society_select_codes.length > 1
            ? society_select_codes[1]?.subjectCode || "S20"
            : society_select_codes[0]?.subjectCode || "S19",
      lang_select_code: lang_select_codes?.subjectCode || "none",
    };

    form.setValue("ko_score_standard", initialValues.ko_score_standard);
    form.setValue("ko_score_grade", initialValues.ko_score_grade);
    form.setValue("ko_score_percentile", initialValues.ko_score_percentile);
    form.setValue("math_score_standard", initialValues.math_score_standard);
    form.setValue("math_score_grade", initialValues.math_score_grade);
    form.setValue("math_score_percentile", initialValues.math_score_percentile);
    form.setValue("eng_grade", initialValues.eng_grade);
    form.setValue("history_grade", initialValues.history_grade);
    form.setValue(
      "research_1_score_standard",
      initialValues.research_1_score_standard,
    );
    form.setValue(
      "research_2_score_standard",
      initialValues.research_2_score_standard,
    );
    form.setValue("lang_grade", initialValues.lang_grade);

    form.setValue("ko_select_code", initialValues.ko_select_code);
    form.setValue("math_select_code", initialValues.math_select_code);
    form.setValue(
      "research_1_select_code",
      initialValues.research_1_select_code,
    );
    form.setValue(
      "research_1_score_standard",
      initialValues.research_1_score_standard,
    );
    form.setValue(
      "research_1_score_grade",
      initialValues.research_1_score_grade,
    );
    form.setValue(
      "research_1_score_percentile",
      initialValues.research_1_score_percentile,
    );
    form.setValue(
      "research_2_select_code",
      initialValues.research_2_select_code,
    );
    form.setValue(
      "research_2_score_standard",
      initialValues.research_2_score_standard,
    );
    form.setValue(
      "research_2_score_grade",
      initialValues.research_2_score_grade,
    );
    form.setValue(
      "research_2_score_percentile",
      initialValues.research_2_score_percentile,
    );
    form.setValue("lang_select_code", initialValues.lang_select_code);

    if (science_select_codes.length === 1) {
      setResearch_1("science");
      setResearch_2("society");
    } else if (science_select_codes.length === 2) {
      setResearch_1("science");
      setResearch_2("science");
    } else {
      setResearch_1("society");
      setResearch_2("society");
    }

    setInitialValues(initialValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-8">
        <div className="space-y-2">
          <Section
            title="✏️ 국어"
            form={form}
            subjects={MOCK_EXAM_SUBJECT_CODE["kor"].select || []}
            name="ko_select_code"
          />
          <div className="flex gap-2">
            <ScoreInput
              form={form}
              name="ko_score_standard"
              label="표준점수 (0~200)"
              onChange={(e) => {
                const value = e.target.value;
                const koTable = percentileTable["국어"];
                const keys = Object.keys(koTable).map(Number);

                // 점수들을 내림차순으로 정렬
                const sortedScores = keys.sort((a, b) => b - a);

                // 입력된 점수보다 작은 첫 번째 값을 찾음
                const lowerScore =
                  sortedScores.find((s) => s <= Number(value)) ||
                  sortedScores[sortedScores.length - 1];

                form.setValue("ko_score_standard", Number(value));
                form.setValue(
                  "ko_score_grade",
                  Number(koTable[lowerScore].등급),
                );
                form.setValue(
                  "ko_score_percentile",
                  Number(koTable[lowerScore].백분위),
                );
              }}
            />
            <ScoreInput
              form={form}
              name="ko_score_grade"
              label="등급 (1~9)"
              disabled={true}
            />
            <ScoreInput
              form={form}
              name="ko_score_percentile"
              label="백분위 (0~100)"
              disabled={true}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Section
            title="🧮 수학"
            form={form}
            subjects={MOCK_EXAM_SUBJECT_CODE["math"].select || []}
            name="math_select_code"
          />
          <div className="flex gap-2">
            <ScoreInput
              form={form}
              name="math_score_standard"
              label="표준점수 (0~200)"
              onChange={(e) => {
                const value = e.target.value;
                const mathTable = percentileTable["수학"];
                const keys = Object.keys(mathTable).map(Number);

                // 점수들을 내림차순으로 정렬
                const sortedScores = keys.sort((a, b) => b - a);

                // 입력된 점수보다 작은 첫 번째 값을 찾음
                const lowerScore =
                  sortedScores.find((s) => s <= Number(value)) ||
                  sortedScores[sortedScores.length - 1];

                form.setValue("math_score_standard", Number(value));
                form.setValue(
                  "math_score_grade",
                  Number(mathTable[lowerScore].등급),
                );
                form.setValue(
                  "math_score_percentile",
                  Number(mathTable[lowerScore].백분위),
                );
              }}
            />
            <ScoreInput
              form={form}
              name="math_score_grade"
              label="등급 (1~9)"
              disabled={true}
            />
            <ScoreInput
              form={form}
              name="math_score_percentile"
              label="백분위 (0~100)"
              disabled={true}
            />
          </div>
        </div>
        <SimpleSection
          title="💬 영어"
          name="eng_grade"
          label="등급 (1~9)"
          form={form}
        />
        <SimpleSection
          title="🇰🇷 한국사"
          name="history_grade"
          label="등급 (1~9)"
          form={form}
        />
        <div className="space-y-2">
          <ResearchSection
            title="🌳 탐구 1"
            form={form}
            researchType={research_1}
            setResearchType={setResearch_1}
            name="research_1_select_code"
            onSelect={(code: string) => {
              const subjectName = getMockExamSubjectName(code);
              const researchTable = percentileTable[subjectName];
              const keys = Object.keys(researchTable).map(Number);
              const sortedScores = keys.sort((a, b) => b - a);
              const score = form.watch().research_1_score_standard;
              const lowerScore =
                sortedScores.find((s) => s <= Number(score)) ||
                sortedScores[sortedScores.length - 1];
              form.setValue(
                "research_1_score_grade",
                Number(researchTable[lowerScore].등급),
              );
              form.setValue(
                "research_1_score_percentile",
                Number(researchTable[lowerScore].백분위),
              );
            }}
          />
          <div className="flex gap-2">
            <ScoreInput
              form={form}
              name="research_1_score_standard"
              label="표준점수 (0~200)"
              onChange={(e) => {
                const value = e.target.value;
                const selectedSubject = form.watch().research_1_select_code;
                const subjectName = getMockExamSubjectName(selectedSubject);
                const researchTable = percentileTable[subjectName];
                const keys = Object.keys(researchTable).map(Number);

                // 점수들을 내림차순으로 정렬
                const sortedScores = keys.sort((a, b) => b - a);

                // 입력된 점수보다 작은 첫 번째 값을 찾음
                const lowerScore =
                  sortedScores.find((s) => s <= Number(value)) ||
                  sortedScores[sortedScores.length - 1];

                form.setValue("research_1_score_standard", Number(value));
                form.setValue(
                  "research_1_score_grade",
                  Number(researchTable[lowerScore].등급),
                );
                form.setValue(
                  "research_1_score_percentile",
                  Number(researchTable[lowerScore].백분위),
                );
              }}
            />
            <ScoreInput
              form={form}
              name="research_1_score_grade"
              label="등급 (1~9)"
              disabled={true}
            />
            <ScoreInput
              form={form}
              name="research_1_score_percentile"
              label="백분위 (0~100)"
              disabled={true}
            />
          </div>
        </div>
        <div className="space-y-2">
          <ResearchSection
            title="🌳 탐구 2"
            form={form}
            researchType={research_2}
            setResearchType={setResearch_2}
            name="research_2_select_code"
            onSelect={(code: string) => {
              const subjectName = getMockExamSubjectName(code);
              const researchTable = percentileTable[subjectName];
              const keys = Object.keys(researchTable).map(Number);
              const sortedScores = keys.sort((a, b) => b - a);
              const score = form.watch().research_2_score_standard;
              const lowerScore =
                sortedScores.find((s) => s <= Number(score)) ||
                sortedScores[sortedScores.length - 1];
              form.setValue(
                "research_2_score_grade",
                Number(researchTable[lowerScore].등급),
              );
              form.setValue(
                "research_2_score_percentile",
                Number(researchTable[lowerScore].백분위),
              );
            }}
          />
          <div className="flex gap-2">
            <ScoreInput
              form={form}
              name="research_2_score_standard"
              label="표준점수 (0~200)"
              onChange={(e) => {
                const value = e.target.value;
                const selectedSubject = form.watch().research_2_select_code;
                const subjectName = getMockExamSubjectName(selectedSubject);
                const researchTable = percentileTable[subjectName];
                const keys = Object.keys(researchTable).map(Number);

                // 점수들을 내림차순으로 정렬
                const sortedScores = keys.sort((a, b) => b - a);

                // 입력된 점수보다 작은 첫 번째 값을 찾음
                const lowerScore =
                  sortedScores.find((s) => s <= Number(value)) ||
                  sortedScores[sortedScores.length - 1];

                form.setValue("research_2_score_standard", Number(value));
                form.setValue(
                  "research_2_score_grade",
                  Number(researchTable[lowerScore].등급),
                );
                form.setValue(
                  "research_2_score_percentile",
                  Number(researchTable[lowerScore].백분위),
                );
              }}
            />
            <ScoreInput
              form={form}
              name="research_2_score_grade"
              label="등급 (1~9)"
              disabled={true}
            />
            <ScoreInput
              form={form}
              name="research_2_score_percentile"
              label="백분위 (0~100)"
              disabled={true}
            />
          </div>
        </div>
        <div className="space-y-2">
          <LanguageSection form={form} />
          {form.watch().lang_select_code !== "none" && (
            <ScoreInput form={form} name="lang_grade" label="등급 (1~9)" />
          )}
        </div>
        <div className="flex justify-end pt-4">
          <div className="flex flex-col items-end gap-2">
            <Button type="submit">저장하기</Button>

            <p className="text-sm text-muted-foreground">
              {import.meta.env.DEV
                ? "[개발 모드] 무제한 수정 가능"
                : `해당 시험의 수정 가능 횟수가 ${remainingEdits}회 남았습니다.`
              }
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
};

type SectionProps = {
  title: string;
  form: UseFormReturn<FormSchemaType>;
  subjects: ISubjectInfo[];
  name: keyof FormSchemaType;
};

const Section = ({ title, form, subjects, name }: SectionProps) => (
  <div className="space-y-2">
    <h3 className="text-xl font-semibold">{title}</h3>
    <div>
      <Label htmlFor={name}>선택과목</Label>
      <div className="flex items-center gap-2">
        {subjects.map((subject) => (
          <Button
            type="button"
            key={subject.subjectCode}
            onClick={() => form.setValue(name, subject.subjectCode)}
            variant={
              form.watch(name) === subject.subjectCode ? "default" : "outline"
            }
          >
            {subject.label}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

type ScoreInputProps = {
  form: UseFormReturn<FormSchemaType>;
  name: keyof FormSchemaType;
  label: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ScoreInput = ({
  form,
  name,
  label,
  disabled,
  onChange,
}: ScoreInputProps) => {
  return onChange ? (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full max-w-sm">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={label}
              type="number"
              {...field}
              disabled={disabled}
              onChange={onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ) : (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full max-w-sm">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={label}
              type="number"
              {...field}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type SimpleSectionProps = {
  title: string;
  name: keyof FormSchemaType;
  label: string;
  form: UseFormReturn<FormSchemaType>;
};

const SimpleSection = ({ title, name, label, form }: SimpleSectionProps) => (
  <div className="space-y-2">
    <h3 className="text-xl font-semibold">{title}</h3>
    <div className="flex items-center gap-4">
      <ScoreInput form={form} name={name} label={label} />
    </div>
  </div>
);

type ResearchSectionProps = {
  title: string;
  form: UseFormReturn<FormSchemaType>;
  researchType: "science" | "society";
  setResearchType: React.Dispatch<React.SetStateAction<"science" | "society">>;
  name: keyof FormSchemaType;
  onSelect: (code: string) => void;
};

const ResearchSection = ({
  title,
  form,
  researchType,
  setResearchType,
  name,
  onSelect,
}: ResearchSectionProps) => (
  <div className="space-y-2">
    <h3 className="text-xl font-semibold">{title}</h3>
    <div className="flex items-center gap-2">
      <Button
        type="button"
        onClick={() => {
          setResearchType("science");
          const code =
            MOCK_EXAM_SUBJECT_CODE["science"].select?.[0]?.subjectCode || "";
          form.setValue(name, code);

          onSelect(code);
        }}
        variant={researchType === "science" ? "default" : "outline"}
      >
        과학탐구
      </Button>
      <Button
        type="button"
        onClick={() => {
          setResearchType("society");
          const code =
            MOCK_EXAM_SUBJECT_CODE["society"].select?.[0]?.subjectCode || "";
          form.setValue(name, code);
          onSelect(code);
        }}
        variant={researchType === "society" ? "default" : "outline"}
      >
        사회탐구
      </Button>
    </div>
    <div>
      <Label htmlFor={name}>선택과목</Label>
      <div className="flex flex-wrap items-center gap-2">
        {researchType === "science"
          ? MOCK_EXAM_SUBJECT_CODE["science"].select?.map((subject) => (
              <Button
                type="button"
                key={subject.subjectCode}
                onClick={() => {
                  form.setValue(name, subject.subjectCode);
                  onSelect(subject.subjectCode);
                }}
                variant={
                  form.watch(name) === subject.subjectCode
                    ? "default"
                    : "outline"
                }
              >
                {subject.label}
              </Button>
            ))
          : MOCK_EXAM_SUBJECT_CODE["society"].select?.map((subject) => (
              <Button
                type="button"
                key={subject.subjectCode}
                onClick={() => {
                  form.setValue(name, subject.subjectCode);
                  onSelect(subject.subjectCode);
                }}
                variant={
                  form.watch(name) === subject.subjectCode
                    ? "default"
                    : "outline"
                }
              >
                {subject.label}
              </Button>
            ))}
      </div>
    </div>
  </div>
);

type LanguageSectionProps = {
  form: UseFormReturn<FormSchemaType>;
};

const LanguageSection = ({ form }: LanguageSectionProps) => (
  <div className="space-y-2">
    <h3 className="text-xl font-semibold">🌏 제2외국어</h3>
    <div>
      <Label htmlFor="lang_select_code">선택과목</Label>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          key={"none"}
          onClick={() => form.setValue("lang_select_code", "none")}
          variant={
            form.watch().lang_select_code === "none" ? "default" : "outline"
          }
        >
          선택안함
        </Button>
        {MOCK_EXAM_SUBJECT_CODE["lang"].select?.map((subject) => (
          <Button
            type="button"
            key={subject.subjectCode}
            onClick={() => {
              form.setValue("lang_select_code", subject.subjectCode);
            }}
            variant={
              form.watch().lang_select_code === subject.subjectCode
                ? "default"
                : "outline"
            }
          >
            {subject.label}
          </Button>
        ))}
      </div>
    </div>
  </div>
);
