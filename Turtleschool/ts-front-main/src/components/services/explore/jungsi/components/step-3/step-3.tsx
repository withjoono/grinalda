import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/custom/button";
import { useExploreJungsiStepper } from "../../context/explore-jungsi-provider";
import { useGetRegularAdmissions } from "@/stores/server/features/jungsi/queries";
import { useGetMockExamStandardScores } from "@/stores/server/features/mock-exam/queries";
import { calc정시위험도 } from "@/lib/calculations/regular-v2/risk";
import JungsiStep3TableComponent from "./step-3-data-table";
import { IRegularAdmission } from "@/stores/server/features/jungsi/interfaces";
import { JungsiStep3Chart } from "./step-3-chart";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { JungsiReport } from "@/components/reports/jungsi-report";
import LoadingSpinner from "@/components/loading-spinner";
import {
  calc정시환산점수,
  prepare정시환산점수,
} from "@/lib/calculations/regular-v2/calc";
import { calc정시유불리 } from "@/lib/calculations/regular-v2/advantage";

export interface ProcessedAdmission extends IRegularAdmission {
  myScore?: number;
  risk?: number;
  standardScore?: number;
  errorMessage?: string;
}

export const JungsiStep3: React.FC = () => {
  const { prevStep, nextStep, updateFormData, formData } =
    useExploreJungsiStepper();
  const { data: regularAdmissions } = useGetRegularAdmissions({
    year: 2024,
    admission_type: formData.admissionType,
  });
  const { data: mockExamScores } = useGetMockExamStandardScores();

  const [processedAdmissions, setProcessedAdmissions] = useState<
    ProcessedAdmission[]
  >([]);
  const [selectedAdmissions, setSelectedAdmissions] = useState<number[]>([]);
  const [isSorted, setIsSorted] = useState(false);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const selectedItems = useMemo(() => {
    if (!regularAdmissions) return [];
    return [
      ...new Set([...formData.step1SelectedIds, ...formData.step2SelectedIds]),
    ];
  }, [formData.step1SelectedIds, formData.step2SelectedIds, regularAdmissions]);

  useEffect(() => {
    const processAdmissions = async () => {
      if (!regularAdmissions || !mockExamScores) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const filtered = regularAdmissions.filter((admission) =>
        selectedItems.includes(admission.id),
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
          processed.push({
            ...admission,
            myScore,
            risk,
            standardScore: standardScore.점수 || 0,
          });
        } else {
          processed.push({
            ...admission,
            errorMessage: calculatedScore.result || "계산 오류",
          });
        }
      }

      setProcessedAdmissions(processed);
      setIsLoading(false);
    };

    processAdmissions();
  }, [regularAdmissions, mockExamScores, selectedItems]);

  const toggleSelection = (id: number) => {
    setSelectedAdmissions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedAdmissions.length === processedAdmissions.length) {
      setSelectedAdmissions([]);
    } else {
      setSelectedAdmissions(processedAdmissions.map((item) => item.id));
    }
  };

  const handleNextClick = async () => {
    updateFormData("step3SelectedIds", selectedAdmissions);
    nextStep();
  };

  const resetSelectedItems = () => {
    setSelectedAdmissionId(null);
  };

  const onClickDetail = (admissionId: number) => {
    setSelectedAdmissionId(admissionId);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return <LoadingSpinner className="pt-40" />;
  }

  if (selectedAdmissionId) {
    return (
      <div className="mx-auto max-w-screen-lg space-y-6">
        <div className="sticky top-20 z-10 flex justify-center">
          <Button className="w-1/3" onClick={resetSelectedItems}>
            목록으로
          </Button>
        </div>
        <JungsiReport admissionId={selectedAdmissionId} />
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 pt-4 md:space-y-6">
      <p className="text-red-500">
        ⭐ 차트에서는 원활한 대학 비교를 위해 총점과 점수가{" "}
        <b>1000점으로 통일</b>되어 있습니다.
      </p>
      <div className="py-4">
        <div className="h-[500px] w-full overflow-x-auto">
          <JungsiStep3Chart
            data={processedAdmissions}
            onSelectAdmission={(id) => {
              setSelectedAdmissions((prev) =>
                prev.includes(id)
                  ? prev.filter((item) => item !== id)
                  : [...prev, id],
              );
            }}
            selectedAdmissions={selectedAdmissions}
            isSorted={isSorted}
          />
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <Switch
            id="sort-switch"
            checked={isSorted}
            onCheckedChange={setIsSorted}
          />
          <Label htmlFor="sort-switch">추합컷 정렬</Label>
        </div>

        <JungsiStep3TableComponent
          admissions={processedAdmissions}
          selectedAdmissions={selectedAdmissions}
          toggleSelection={toggleSelection}
          onSelectAll={handleSelectAll}
          onClickDetail={onClickDetail}
        />
      </div>

      <div className="flex items-center justify-center gap-4 py-12">
        <Button variant={"outline"} onClick={prevStep}>
          이전 단계
        </Button>
        <Button
          onClick={handleNextClick}
          disabled={selectedAdmissions.length === 0}
        >
          다음 단계
        </Button>
      </div>
    </div>
  );
};

export default JungsiStep3;
