import { useMemo } from "react";
import { IRegularAdmissionDetail } from "@/stores/server/features/jungsi/interfaces";
import { RecentScoreCutChart } from "@/components/score-visualizations/recent-score-cut-chart";
import { RecentPercentCutChart } from "@/components/score-visualizations/recent-percent-cut-chart";
import { LineChartIcon } from "lucide-react";

interface RecentGradeAnalysisSectionProps {
  myScore?: number | null;
  userPercentile: number;
  admission: IRegularAdmissionDetail;
}

export const RecentGradeAnalysisSection = ({
  myScore,
  admission,
  userPercentile,
}: RecentGradeAnalysisSectionProps) => {
  const chartData1 = useMemo(() => {
    if (!admission) return null;

    return admission.previous_results
      .filter((item) => item.min_cut !== null)
      .map((item) => {
        return {
          year: item.year,
          ranking: parseFloat(item.min_cut || "0"),
          myScore: myScore,
        };
      });
  }, [admission]);

  const chartData2 = useMemo(() => {
    if (!admission) return null;

    return admission.previous_results
      .filter((item) => item.percent !== null)
      .map((item) => {
        return {
          year: item.year,
          percent: parseFloat(item.percent || "0"),
          myPercent: userPercentile,
        };
      });
  }, [admission]);

  return (
    <section className="space-y-4">
      <h4 className="text-xl font-semibold">🧐 최근 입결 분석</h4>
      <div className="pt-2">
        <div className="flex max-w-xl flex-wrap items-start justify-start gap-2 text-sm sm:text-base">
          <div className="grid w-full grid-cols-5 text-sm">
            <p>년도</p>
            <p>최초합컷</p>
            <p>최초합컷 누백</p>
            <p>경쟁률</p>
            <p>충원인원</p>
          </div>
          {admission.previous_results.map((item, idx) => {
            return (
              <div key={idx} className="grid w-full grid-cols-5 font-bold">
                <p>{item.year}</p>
                <p>
                  {item.min_cut
                    ? parseFloat(item.min_cut + "").toFixed(2)
                    : "-"}
                </p>
                <p>
                  {item.percent
                    ? parseFloat(item.percent + "").toFixed(2)
                    : "-"}
                </p>
                <p>
                  {item.competition_ratio
                    ? parseFloat(item.competition_ratio + "").toFixed(2)
                    : "-"}
                </p>
                <p>
                  {item.recruitment_number
                    ? parseFloat(item.recruitment_number + "").toFixed(2)
                    : "-"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 items-center gap-4 pt-12 xl:grid-cols-2">
        <div>
          <h4 className="flex gap-2 text-lg font-semibold">
            <LineChartIcon className="text-primary" /> 환산점수 입결
          </h4>
          <RecentScoreCutChart
            data={chartData1 || []}
            myScore={myScore}
            className="h-[400px] w-full"
          />
        </div>
        <div>
          <h4 className="flex gap-2 text-lg font-semibold">
            <LineChartIcon className="text-primary" /> 상위누백 입결
          </h4>
          <RecentPercentCutChart
            data={chartData2 || []}
            myPercent={userPercentile}
            className="h-[400px] w-full"
          />
        </div>
      </div>
    </section>
  );
};
