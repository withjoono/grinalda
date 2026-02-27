'use client';
import { useMemo } from 'react';

interface ScoreCalculationResult {
  preApplyCount: number;
  minScore: number;
  maxScore: number;
  avgScore: number;
  myRank: number;
  sameScoreCount: number;
  sortedScores: number[];
}

export const useScoreCalculation = (
  myScore: number,
  scores: number[]
): ScoreCalculationResult => {
  const preApplies = useMemo(() => {
    return [...scores].sort((a, b) => a - b);
  }, [scores]);
  const preApplyCount = preApplies.length;

  const { minScore, maxScore, avgScore } = useMemo(() => {
    return {
      minScore: preApplyCount > 0 ? preApplies[0] : 0,
      maxScore: preApplyCount > 0 ? preApplies[preApplyCount - 1] : 0,
      avgScore:
        preApplyCount > 0
          ? preApplies.reduce((acc, curr) => acc + Number(curr), 0) /
            preApplyCount
          : 0,
    };
  }, [preApplies, preApplyCount]);

  const sortedScores = useMemo(() => {
    return [...preApplies].sort((a, b) => b - a); // 내림차순 정렬
  }, [preApplies]);

  const myRank = useMemo(() => {
    const index = sortedScores.findIndex(
      (score) => Number(score).toFixed(2) === Number(myScore).toFixed(2)
    );
    return index !== -1 ? index + 1 : 0;
  }, [sortedScores, myScore]);

  const sameScoreCount = useMemo(() => {
    return (
      sortedScores.filter(
        (score) => Number(score).toFixed(2) === Number(myScore).toFixed(2)
      ).length - 1
    );
  }, [sortedScores, myScore]);

  return {
    preApplyCount,
    minScore,
    maxScore,
    avgScore: Number(avgScore.toFixed(2)),
    myRank: myRank > 0 ? myRank : 0,
    sameScoreCount: sameScoreCount > 0 ? sameScoreCount : 0,
    sortedScores,
  };
};
