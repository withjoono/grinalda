import { useEffect, useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import isEqual from "lodash/isEqual";

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
  IMockExamRawScore,
  ISaveMockExamRawScoresData,
} from "@/stores/server/features/mock-exam/interfaces";
import {
  useGetMockExamRawScores,
  useGetMockExamStandardScores,
} from "@/stores/server/features/mock-exam/queries";
import { useSaveMockExamRawScores } from "@/stores/server/features/mock-exam/mutations";

const formSchema = z.object({
  ko_select_code: z.string(),
  ko_score_common: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(76, "점수의 범위가 올바르지 않습니다."),
  ko_score_select: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(24, "점수의 범위가 올바르지 않습니다."),
  math_select_code: z.string(),
  math_score_common: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(74, "점수의 범위가 올바르지 않습니다."),
  math_score_select: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(26, "점수의 범위가 올바르지 않습니다."),
  eng_score: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(100, "점수의 범위가 올바르지 않습니다."),
  history_score: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(50, "점수의 범위가 올바르지 않습니다."),
  research_1_select_code: z.string(),
  research_1_score: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(50, "점수의 범위가 올바르지 않습니다."),
  research_2_select_code: z.string(),
  research_2_score: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(50, "점수의 범위가 올바르지 않습니다."),
  lang_select_code: z.string(),
  lang_score: z.coerce
    .number()
    .min(0, "점수의 범위가 올바르지 않습니다.")
    .max(50, "점수의 범위가 올바르지 않습니다."),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const MockExamRawForm = () => {
  // Mutations
  const saveMockExamRawScores = useSaveMockExamRawScores();
  //Queries
  const { data: rawScores, refetch: refreshRawScores } =
    useGetMockExamRawScores();
  const { refetch: refreshStandardScores } = useGetMockExamStandardScores();

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
      ko_score_common: 0,
      ko_score_select: 0,
      ko_select_code: "S1",
      math_score_common: 0,
      math_score_select: 0,
      math_select_code: "S4",
      eng_score: 0,
      history_score: 0,
      research_1_select_code: "S10",
      research_1_score: 0,
      research_2_select_code: "S11",
      research_2_score: 0,
      lang_select_code: "S27",
      lang_score: 0,
    },
  });

  const onSubmit = async (values: FormSchemaType) => {
    if (values.research_1_select_code === values.research_2_select_code) {
      toast.error("탐구 과목 선택이 잘못되었습니다.");
      return;
    }
    if (isEqual(initialValues, values)) {
      toast.info("변경된 사항이 없습니다.");
      return;
    }
    const data: ISaveMockExamRawScoresData[] = [];
    data.push({
      subject_code: "S3", // 공통국어
      raw_score: values.ko_score_common,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: values.ko_select_code,
      raw_score: values.ko_score_select,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: "S7", // 공통수학
      raw_score: values.math_score_common,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: values.math_select_code,
      raw_score: values.math_score_select,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: "S8", // 영어
      raw_score: values.eng_score,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: "S9", // 한국사
      raw_score: values.history_score,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: values.research_1_select_code, // 선택 1
      raw_score: values.research_1_score,
      schedule_id: 5, // 2025년 6모 아이디
    });
    data.push({
      subject_code: values.research_2_select_code, // 선택 2
      raw_score: values.research_2_score,
      schedule_id: 5, // 2025년 6모 아이디
    });
    if (values.lang_select_code !== "none") {
      data.push({
        subject_code: values.lang_select_code, // 제2외국어
        raw_score: values.lang_score,
        schedule_id: 5, // 2025년 6모 아이디
      });
    }

    const result = await saveMockExamRawScores.mutateAsync(data);

    if (result.success) {
      toast.success("성공적으로 모의고사 점수를 등록했습니다.");
      setInitialValues(values);
      refreshRawScores();
      refreshStandardScores();
    } else {
      toast.error(result.error);
    }
  };

  useEffect(() => {
    if (rawScores) {
      initializeForm(rawScores);
    }
  }, [rawScores]);

  const initializeForm = (data: IMockExamRawScore[]) => {
    const ko_score_common = data.find((item) => item.subject_code === "S3");
    const ko_score_select = data.find(
      (item) => item.subject_code === "S1" || item.subject_code === "S2",
    );
    const math_score_common = data.find((item) => item.subject_code === "S7");
    const math_score_select = data.find(
      (item) =>
        item.subject_code === "S4" ||
        item.subject_code === "S5" ||
        item.subject_code === "S6",
    );
    const eng_score = data.find((item) => item.subject_code === "S8");
    const history_score = data.find((item) => item.subject_code === "S9");
    const science_scores = data.filter((item) =>
      ["S10", "S11", "S12", "S13", "S14", "S15", "S16", "S17"].includes(
        item.subject_code,
      ),
    );
    const society_scores = data.filter((item) =>
      ["S18", "S19", "S20", "S21", "S22", "S23", "S24", "S25", "S26"].includes(
        item.subject_code,
      ),
    );
    const lang_score = data.find((item) =>
      ["S27", "S28", "S29", "S30", "S31", "S32", "S33", "S34", "S35"].includes(
        item.subject_code,
      ),
    );

    const initialValues = {
      ko_score_common: parseInt(ko_score_common?.raw_score || "0"),
      ko_score_select: parseInt(ko_score_select?.raw_score || "0"),
      math_score_common: parseInt(math_score_common?.raw_score || "0"),
      math_score_select: parseInt(math_score_select?.raw_score || "0"),
      eng_score: parseInt(eng_score?.raw_score || "0"),
      history_score: parseInt(history_score?.raw_score || "0"),
      research_1_score:
        science_scores.length > 0
          ? parseInt(science_scores[0]?.raw_score || "0")
          : parseInt(society_scores[0]?.raw_score || "0"),
      research_2_score:
        science_scores.length > 1
          ? parseInt(science_scores[1]?.raw_score || "0")
          : society_scores.length > 1
            ? parseInt(society_scores[1]?.raw_score || "0")
            : parseInt(society_scores[0]?.raw_score || "0"),
      lang_score: parseInt(lang_score?.raw_score || "0"),
      ko_select_code: ko_score_select?.subject_code || "S1",
      math_select_code: math_score_select?.subject_code || "S4",
      research_1_select_code:
        science_scores.length > 0
          ? science_scores[0]?.subject_code || "S10"
          : society_scores[0]?.subject_code || "S18",
      research_2_select_code:
        science_scores.length > 1
          ? science_scores[1]?.subject_code || "S11"
          : society_scores.length > 1
            ? society_scores[1]?.subject_code || "S20"
            : society_scores[0]?.subject_code || "S19",
      lang_select_code: lang_score?.subject_code || "none",
    };

    form.setValue("ko_score_common", initialValues.ko_score_common);
    form.setValue("ko_score_select", initialValues.ko_score_select);
    form.setValue("math_score_common", initialValues.math_score_common);
    form.setValue("math_score_select", initialValues.math_score_select);
    form.setValue("eng_score", initialValues.eng_score);
    form.setValue("history_score", initialValues.history_score);
    form.setValue("research_1_score", initialValues.research_1_score);
    form.setValue("research_2_score", initialValues.research_2_score);
    form.setValue("lang_score", initialValues.lang_score);

    form.setValue("ko_select_code", initialValues.ko_select_code);
    form.setValue("math_select_code", initialValues.math_select_code);
    form.setValue(
      "research_1_select_code",
      initialValues.research_1_select_code,
    );
    form.setValue(
      "research_2_select_code",
      initialValues.research_2_select_code,
    );
    form.setValue("lang_select_code", initialValues.lang_select_code);

    if (science_scores.length === 1) {
      setResearch_1("science");
      setResearch_2("society");
    } else if (science_scores.length === 2) {
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
              name="ko_score_common"
              label="공통 (0~76)"
            />
            <ScoreInput
              form={form}
              name="ko_score_select"
              label="선택과목 (0~24)"
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
              name="math_score_common"
              label="공통 (0~74)"
            />
            <ScoreInput
              form={form}
              name="math_score_select"
              label="선택과목 (0~26)"
            />
          </div>
        </div>
        <SimpleSection
          title="💬 영어"
          name="eng_score"
          label="원점수 (0~100)"
          form={form}
        />
        <SimpleSection
          title="🇰🇷 한국사"
          name="history_score"
          label="원점수 (0~50)"
          form={form}
        />
        <div className="space-y-2">
          <ResearchSection
            title="🌳 탐구 1"
            form={form}
            researchType={research_1}
            setResearchType={setResearch_1}
            name="research_1_select_code"
          />
          <ScoreInput
            form={form}
            name="research_1_score"
            label="원점수 (0~50)"
          />
        </div>
        <div className="space-y-2">
          <ResearchSection
            title="🌳 탐구 2"
            form={form}
            researchType={research_2}
            setResearchType={setResearch_2}
            name="research_2_select_code"
          />
          <ScoreInput
            form={form}
            name="research_2_score"
            label="원점수 (0~50)"
          />
        </div>
        <div className="space-y-2">
          <LanguageSection form={form} />
          {form.watch().lang_select_code !== "none" && (
            <ScoreInput form={form} name="lang_score" label="원점수 (0~50)" />
          )}
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit">저장하기</Button>
        </div>
      </form>
    </Form>
  );
};

type SectionProps = {
  title: string;
  form: UseFormReturn<FormSchemaType, any, undefined>;
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
  form: UseFormReturn<FormSchemaType, any, undefined>;
  name: keyof FormSchemaType;
  label: string;
};

const ScoreInput = ({ form, name, label }: ScoreInputProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full max-w-sm">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input placeholder="원점수" type="number" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

type SimpleSectionProps = {
  title: string;
  name: keyof FormSchemaType;
  label: string;
  form: UseFormReturn<FormSchemaType, any, undefined>;
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
  form: UseFormReturn<FormSchemaType, any, undefined>;
  researchType: "science" | "society";
  setResearchType: React.Dispatch<React.SetStateAction<"science" | "society">>;
  name: keyof FormSchemaType;
};

const ResearchSection = ({
  title,
  form,
  researchType,
  setResearchType,
  name,
}: ResearchSectionProps) => (
  <div className="space-y-2">
    <h3 className="text-xl font-semibold">{title}</h3>
    <div className="flex items-center gap-2">
      <Button
        type="button"
        onClick={() => {
          setResearchType("science");
          form.setValue(
            name,
            MOCK_EXAM_SUBJECT_CODE["science"].select?.[0]?.subjectCode || "",
          );
        }}
        variant={researchType === "science" ? "default" : "outline"}
      >
        과학탐구
      </Button>
      <Button
        type="button"
        onClick={() => {
          setResearchType("society");
          form.setValue(
            name,
            MOCK_EXAM_SUBJECT_CODE["society"].select?.[0]?.subjectCode || "",
          );
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
                onClick={() => form.setValue(name, subject.subjectCode)}
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
                onClick={() => form.setValue(name, subject.subjectCode)}
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
  form: UseFormReturn<FormSchemaType, any, undefined>;
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
