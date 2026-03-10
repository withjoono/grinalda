import React from "react";
import { cn } from "@/lib/utils";

interface ScoreComparisonProps {
  myScore?: number | null;
  stableScore: number;
  riskScore: number;
  className?: string;
  totalScore: number;
}

export const ScoreComparison: React.FC<ScoreComparisonProps> = ({
  myScore,
  stableScore,
  riskScore,
  className,
  totalScore,
}) => {
  let icon = "😴";
  let subText = "마이페이지에서 성적 혹은 생기부를 등록해주세요.";
  let comparisonScore = 0;
  let isHigher = true;

  if (myScore) {
    const diffStable = +(myScore - stableScore).toFixed(2);
    const temp = (50 / totalScore) * 1000;
    if (myScore >= stableScore) {
      icon = diffStable >= temp ? "🥳" : "🔥";
      comparisonScore = diffStable;
      isHigher = true;
      subText =
        diffStable >= temp
          ? "더 높은 곳에 지원해볼 수 있을 것 같아요!!"
          : "안전하게 지원하기에 좋아요.";
    } else if (myScore >= riskScore) {
      icon = "🤔";
      comparisonScore = diffStable;
      isHigher = false;
      subText = "도전해 볼 만할 것 같아요. 한 번 고민해보세요!";
    } else {
      icon = "😰";
      comparisonScore = diffStable;
      isHigher = false;
      subText = "위험해요ㅜㅜ 다른 대학을 고려해보세요.";
    }
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="text-5xl lg:text-7xl">{icon}</span>
      <div className="text-sm">
        {myScore ? (
          <span className="text-lg font-semibold lg:text-xl">
            안정권보다{" "}
            <b className={cn(isHigher ? "text-primary" : "text-blue-500")}>
              {Math.abs(comparisonScore)}
            </b>{" "}
            점 {isHigher ? "높아요" : "낮아요"}
          </span>
        ) : (
          <span className="text-lg font-semibold lg:text-xl">
            성적이 없어요 ㅜㅜ
          </span>
        )}
        <p className="text-sm text-foreground/70 lg:text-base">{subText}</p>
      </div>
    </div>
  );
};
