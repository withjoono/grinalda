import { useMemo } from "react";
import { useGetPreviousResults } from "@/stores/server/features/jungsi/queries";
import { IRegularAdmissionDetail } from "@/stores/server/features/jungsi/interfaces";
import { RecentScoreCutChart } from "@/components/score-visualizations/recent-score-cut-chart";
import { RecentPercentCutChart } from "@/components/score-visualizations/recent-percent-cut-chart";
import { LineChartIcon, Loader2 } from "lucide-react";

interface RecentGradeAnalysisSectionProps {
  myScore?: number | null;
  userPercentile: number;
  admissionId: number;
  admission: IRegularAdmissionDetail; // 폴백용 기존 데이터
}

export const RecentGradeAnalysisSection = ({
  myScore,
  admissionId,
  userPercentile,
  admission,
}: RecentGradeAnalysisSectionProps) => {
  // 새 API에서 입결 데이터 조회
  const { data: previousResultsData, isLoading, error } = useGetPreviousResults(admissionId);

  // 디버깅: 어떤 데이터가 사용되는지 확인
  console.log("[RecentGradeAnalysisSection] admissionId:", admissionId);
  console.log("[RecentGradeAnalysisSection] isLoading:", isLoading);
  console.log("[RecentGradeAnalysisSection] error:", error);
  console.log("[RecentGradeAnalysisSection] previousResultsData:", previousResultsData);
  console.log("[RecentGradeAnalysisSection] admission.previousResults:", admission.previousResults);

  // 새 API 데이터 우선 사용, 없으면 기존 데이터로 폴백
  const previousResults = previousResultsData?.previousResults ?? admission.previousResults ?? [];
  console.log("[RecentGradeAnalysisSection] Using previousResults:", previousResults);

  // 환산점수 입결 차트 데이터 (50%컷, 70%컷)
  const chartData1 = useMemo(() => {
    if (!previousResults.length) return [];

    return previousResults.map((item) => ({
      year: item.year,
      cut50: item.convertedScore50Cut ? parseFloat(item.convertedScore50Cut) : null,
      cut70: item.convertedScore70Cut ? parseFloat(item.convertedScore70Cut) : null,
      myScore: myScore,
    }));
  }, [previousResults, myScore]);

  // 상위누백 입결 차트 데이터 (50%컷, 70%컷)
  const chartData2 = useMemo(() => {
    if (!previousResults.length) return [];

    return previousResults.map((item) => ({
      year: item.year,
      cut50: item.percentile50Cut ? parseFloat(item.percentile50Cut) : null,
      cut70: item.percentile70Cut ? parseFloat(item.percentile70Cut) : null,
      myPercent: userPercentile,
    }));
  }, [previousResults, userPercentile]);

  // 숫자 포맷팅 헬퍼
  const formatNumber = (value: string | number | null | undefined, decimals = 2) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "-";
    return num.toFixed(decimals);
  };

  // 로딩 중 (폴백 데이터도 없는 경우에만)
  if (isLoading && !admission.previousResults?.length) {
    return (
      <section className="space-y-4">
        <h4 className="text-xl font-semibold">🧐 최근 입결 분석</h4>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-500">입결 데이터를 불러오는 중...</span>
        </div>
      </section>
    );
  }

  // 데이터 없음 (새 API도 없고 폴백도 없는 경우)
  if (!previousResults.length) {
    return (
      <section className="space-y-4">
        <h4 className="text-xl font-semibold">🧐 최근 입결 분석</h4>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-500">입결 데이터가 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h4 className="text-xl font-semibold">🧐 최근 입결 분석</h4>
      <div className="pt-2 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-primary">
              <th className="px-2 py-3 text-left font-semibold text-primary">년도</th>
              <th className="px-2 py-3 text-center font-semibold text-primary">모집인원(최종)</th>
              <th className="px-2 py-3 text-center font-semibold text-primary">경쟁률</th>
              <th className="px-2 py-3 text-center font-semibold text-primary">충원합격순위</th>
              <th className="px-2 py-3 text-center font-semibold text-primary">환산점수총점</th>
              <th className="px-2 py-3 text-center font-semibold text-primary">환산점수 50%컷</th>
              <th className="px-2 py-3 text-center font-semibold text-primary">환산점수 70%컷</th>
              <th className="px-2 py-3 text-center font-semibold text-primary">백분위50%컷</th>
              <th className="px-2 py-3 text-center font-semibold text-primary">백분위70%컷</th>
            </tr>
          </thead>
          <tbody>
            {previousResults.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-2 py-3 font-bold">{item.year}</td>
                <td className="px-2 py-3 text-center">{item.recruitmentNumber ?? "-"}</td>
                <td className="px-2 py-3 text-center">{formatNumber(item.competitionRatio)}</td>
                <td className="px-2 py-3 text-center">{formatNumber(item.additionalAcceptanceRank, 0)}</td>
                <td className="px-2 py-3 text-center">{formatNumber(item.convertedScoreTotal)}</td>
                <td className="px-2 py-3 text-center">{formatNumber(item.convertedScore50Cut)}</td>
                <td className="px-2 py-3 text-center">{formatNumber(item.convertedScore70Cut)}</td>
                <td className="px-2 py-3 text-center">{formatNumber(item.percentile50Cut)}</td>
                <td className="px-2 py-3 text-center">{formatNumber(item.percentile70Cut)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 items-center gap-4 pt-12 xl:grid-cols-2">
        <div>
          <h4 className="flex gap-2 text-lg font-semibold">
            <LineChartIcon className="text-primary" /> 환산점수 입결
          </h4>
          <RecentScoreCutChart
            data={chartData1}
            myScore={myScore}
            className="h-[400px] w-full"
          />
        </div>
        <div>
          <h4 className="flex gap-2 text-lg font-semibold">
            <LineChartIcon className="text-primary" /> 상위누백 입결
          </h4>
          <RecentPercentCutChart
            data={chartData2}
            myPercent={userPercentile}
            className="h-[400px] w-full"
          />
        </div>
      </div>
    </section>
  );
};
