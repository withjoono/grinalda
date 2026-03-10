import { RiskBadge } from "@/components/custom/risk-badge";
import { ScoreComparison } from "@/components/score-visualizations/score-comparison";
import { ScoreRiskChart } from "@/components/score-visualizations/score-risk-chart";
import { IRegularAdmissionDetail } from "@/stores/server/features/jungsi/interfaces";

interface SubjectRiskSectionProps {
  userName: string;
  admission: IRegularAdmissionDetail;
  myScore?: number | null;
  subjectRisk?: number | null;
}

export const SubjectRiskSection = ({
  admission,
  userName,
  myScore,
  subjectRisk,
}: SubjectRiskSectionProps) => {
  return (
    <section className="grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center gap-4 border-l-4 border-primary pl-2 text-xl md:text-2xl">
          <span className="font-semibold">해당 전형 위험도</span>
          {myScore && subjectRisk ? (
            <RiskBadge risk={Math.floor(subjectRisk)} />
          ) : (
            <p className="">😴 성적X</p>
          )}
        </div>
        <p className="text-sm text-foreground/60 md:text-base">
          <b className="text-primary">{userName}</b>의 교과 위험도 예측입니다.
        </p>
        <ScoreComparison
          myScore={myScore}
          stableScore={parseFloat(admission?.risk_plus_2 || "0")}
          riskScore={parseFloat(admission?.risk_minus_1 || "0")}
          totalScore={admission.total_score || 1000}
          className="mt-4"
        />

        <div className="space-y-1 pt-4 text-sm">
          <p>
            총점: <b>{admission.total_score || "-"}</b>
          </p>
          <p>
            최초컷:{" "}
            <b className="text-primary">
              {admission.min_cut
                ? parseFloat(admission.min_cut).toFixed(2)
                : "-"}
            </b>
          </p>
          <p>
            추합컷:{" "}
            <b className="text-primary">
              {admission.max_cut
                ? parseFloat(admission.max_cut).toFixed(2)
                : "-"}
            </b>
          </p>
        </div>
      </div>
      <ScoreRiskChart
        myScore={myScore}
        stableScore={parseFloat(admission?.risk_plus_2 || "0")}
        middleScore={parseFloat(admission?.risk_minus_1 || "0")}
        className="h-[300px] w-full"
        totalScore={admission.total_score || 1000}
      />
    </section>
  );
};
