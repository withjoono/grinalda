import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/custom/button";
import { useExploreJungsiStepper } from "../../context/explore-jungsi-provider";
import {
  useGetInterestRegularAdmissions,
  useGetRegularAdmissions,
} from "@/stores/server/features/jungsi/queries";
import { useGetMockExamStandardScores } from "@/stores/server/features/mock-exam/queries";
import { JungsiStep4Table, ProcessedAdmission } from "./step-4-data-table";
import { calc정시위험도 } from "@/lib/calculations/regular-v2/risk";
import { useAddInterestRegularAdmission } from "@/stores/server/features/jungsi/mutations";
import {
  calc정시환산점수,
  prepare정시환산점수,
} from "@/lib/calculations/regular-v2/calc";
import { calc정시유불리 } from "@/lib/calculations/regular-v2/advantage";
import JungsiStep4Chart from "./step-4-chart";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const JungsiStep4 = () => {
  const { prevStep, nextStep, updateFormData, formData } =
    useExploreJungsiStepper();
  const { data: regularAdmissions } = useGetRegularAdmissions({
    year: 2024,
    admission_type: formData.admissionType,
  });
  const { data: mockExamScores } = useGetMockExamStandardScores();
  const { refetch } = useGetInterestRegularAdmissions(
    formData.admissionType as "가" | "나" | "다",
  );
  const addInterestRegularAdmission = useAddInterestRegularAdmission();

  const [processedAdmissions, setProcessedAdmissions] = useState<
    ProcessedAdmission[]
  >([]);
  const [selectedAdmissions, setSelectedAdmissions] = useState<number[]>([]);
  const [sortType, setSortType] = useState<
    "none" | "maxCut" | "normalizedScoreDifference"
  >("normalizedScoreDifference");
  const sortedAdmissions = useMemo(() => {
    switch (sortType) {
      case "normalizedScoreDifference":
        return [...processedAdmissions].sort(
          (a, b) =>
            (b.normalizedScoreDifference || -10000) -
            (a.normalizedScoreDifference || -10000),
        );
      default:
        return processedAdmissions;
    }
  }, [processedAdmissions, sortType]);

  useEffect(() => {
    const processAdmissions = async () => {
      if (!regularAdmissions || !mockExamScores) return;

      const filtered = regularAdmissions.filter((admission) =>
        formData.step3SelectedIds.includes(admission.id),
      );
      const processed: ProcessedAdmission[] = [];

      for (const admission of filtered) {
        const params = prepare정시환산점수(mockExamScores.data, {
          score_calculation: admission.score_calculation || "",
          major:
            mockExamScores.academic_division === "NaturalSciences"
              ? "이과"
              : "문과",
        });
        const calculatedScore = await calc정시환산점수(params);

        if (calculatedScore.success && calculatedScore.내점수 !== undefined) {
          const myScore = calculatedScore.내점수;
          const risk = calc정시위험도(myScore, {
            risk_10: parseFloat(admission.risk_plus_5 || "0"),
            risk_9: parseFloat(admission.risk_plus_4 || "0"),
            risk_8: parseFloat(admission.risk_plus_3 || "0"),
            risk_7: parseFloat(admission.risk_plus_2 || "0"),
            risk_6: parseFloat(admission.risk_plus_1 || "0"),
            risk_5: parseFloat(admission.risk_minus_1 || "0"),
            risk_4: parseFloat(admission.risk_minus_2 || "0"),
            risk_3: parseFloat(admission.risk_minus_3 || "0"),
            risk_2: parseFloat(admission.risk_minus_4 || "0"),
            risk_1: parseFloat(admission.risk_minus_5 || "0"),
          });
          const standardScore = await calc정시유불리({
            학교: admission.score_calculation || "",
            표점합: calculatedScore.표점합 || 0,
          });

          const scoreDifference = myScore - (standardScore.점수 || 0);
          const normalizedScoreDifference =
            (scoreDifference / (admission.total_score || 1000)) * 1000;

          processed.push({
            ...admission,
            myScore,
            risk,
            standardScore: standardScore.점수 || 0,
            scoreDifference,
            normalizedScoreDifference,
          });
        } else {
          processed.push({
            ...admission,
            errorMessage: calculatedScore.result || "계산 오류",
          });
        }
      }

      setProcessedAdmissions(processed);
    };

    processAdmissions();
  }, [regularAdmissions, mockExamScores]);

  const handleNextClick = async () => {
    updateFormData("step4SelectedIds", selectedAdmissions);
    await addInterestRegularAdmission.mutateAsync({
      targetIds: selectedAdmissions,
      admissionType: formData.admissionType as "가" | "나" | "다",
    });
    await refetch();
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center px-2 py-12">
      <div>
        <p>
          ⭐ <b>동점수 평균 지표</b>는 각 학교에서 <b>동점자(내 표점합)</b>의{" "}
          <b>평균 환산점수</b>를 나타내요.
        </p>
      </div>
      <div className="w-full max-w-screen-xl space-y-4">
        <div className="py-4">
          <div className="h-[500px] w-full overflow-x-auto">
            <JungsiStep4Chart
              data={sortedAdmissions}
              selectedAdmissions={selectedAdmissions}
              onSelectAdmission={(id) =>
                setSelectedAdmissions((prev) =>
                  prev.includes(id)
                    ? prev.filter((item) => item !== id)
                    : [...prev, id],
                )
              }
            />
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Switch
              id="sort-switch"
              checked={sortType === "normalizedScoreDifference"}
              onCheckedChange={() =>
                setSortType(
                  sortType === "normalizedScoreDifference"
                    ? "none"
                    : "normalizedScoreDifference",
                )
              }
            />
            <Label htmlFor="sort-switch">대학 환산 유불리 정렬</Label>
          </div>
        </div>
        <JungsiStep4Table
          admissions={sortedAdmissions}
          selectedAdmissions={selectedAdmissions}
          setSelectedAdmissions={setSelectedAdmissions}
        />
      </div>
      <div className="flex items-center justify-center gap-4 py-12">
        <Button variant="outline" onClick={prevStep}>
          이전 단계
        </Button>
        <Button
          onClick={handleNextClick}
          disabled={selectedAdmissions.length === 0}
        >
          관심대학 저장하기
        </Button>
      </div>
    </div>
  );
};
