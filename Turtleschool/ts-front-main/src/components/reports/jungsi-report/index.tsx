import React, { useState, useEffect, useMemo } from "react";
import NotFoundError from "@/components/errors/not-found-error";
import UnknownErrorPage from "@/components/errors/unknown-error";
import LoadingSpinner from "@/components/loading-spinner";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import { SubjectRiskSection } from "./subject-risk-section";
import { RecentGradeAnalysisSection } from "./recent-grade-analysis-section";
import { SusiReportHeader } from "../susi-report-header";
import { useGetRegularAdmissionDetail } from "@/stores/server/features/jungsi/queries";
import { useGetMockExamStandardScores } from "@/stores/server/features/mock-exam/queries";
import { JungsiDetailSection } from "./jungsi-detail-section";
import {
  calc정시환산점수,
  prepare정시환산점수,
} from "@/lib/calculations/regular-v2/calc";
import { calc정시위험도 } from "@/lib/calculations/regular-v2/risk";
import { 정시점수계산결과 } from "@/lib/calculations/regular-v2/types";
import { calculateUserPercentile } from "@/lib/calculations/regular-v2/calc-percentile";

interface RegularReportProps {
  admissionId: number;
}

export const JungsiReport: React.FC<RegularReportProps> = ({ admissionId }) => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: admission, status: admissionStatus } =
    useGetRegularAdmissionDetail({ admissionId });
  const { data: mockExamScores } = useGetMockExamStandardScores();

  const [calculatedScore, setCalculatedScore] =
    useState<정시점수계산결과 | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const userPercentile = useMemo(() => {
    if (!mockExamScores) return 0;
    return calculateUserPercentile(mockExamScores.data);
  }, [mockExamScores]);

  useEffect(() => {
    const calculateScore = async () => {
      if (!admission || !mockExamScores) return;

      const params = prepare정시환산점수(mockExamScores.data, {
        score_calculation: admission.score_calculation || "",
        major:
          mockExamScores.academic_division === "NaturalSciences"
            ? "이과"
            : "문과",
      });

      try {
        const result = await calc정시환산점수(params);
        setCalculatedScore(result);
        if (!result.success) {
          setCalculationError(
            result.result || "알 수 없는 오류가 발생했습니다.",
          );
        }
      } catch (error) {
        console.error("Score calculation error:", error);
        setCalculationError("점수 계산 중 오류가 발생했습니다.");
      }
    };

    calculateScore();
  }, [admission, mockExamScores]);

  const risk = useMemo(() => {
    if (
      !calculatedScore?.success ||
      calculatedScore.내점수 === undefined ||
      !admission
    )
      return null;

    return calc정시위험도(calculatedScore.내점수, {
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
  }, [calculatedScore, admission]);

  if (admissionStatus === "pending") {
    return <LoadingSpinner />;
  }

  if (admissionStatus === "error") {
    return <UnknownErrorPage />;
  }

  if (admission === null) {
    return <NotFoundError />;
  }

  return (
    <div className="pb-20">
      <div className="space-y-12">
        <SusiReportHeader
          title={`${admission.university.name} (${admission.university.region})`}
          subtitle={`${admission.general_field_name} - ${admission.admission_name}`}
          recruitmentUnitName={admission.recruitment_name || "-"}
          badges={`${admission.admission_type}, ${admission.university.establishment_type}`}
          risk={risk}
        />

        {calculationError && (
          <div
            className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <strong className="font-bold">오류 발생:</strong>
            <span className="block sm:inline"> {calculationError}</span>
          </div>
        )}

        {calculatedScore?.success && (
          <>
            <SubjectRiskSection
              myScore={calculatedScore.내점수}
              admission={admission}
              userName={currentUser?.nickname || ""}
              subjectRisk={risk}
            />

            <RecentGradeAnalysisSection
              myScore={calculatedScore.내점수}
              admission={admission}
              userPercentile={userPercentile}
            />
          </>
        )}

        <JungsiDetailSection admission={admission} />
      </div>
    </div>
  );
};
