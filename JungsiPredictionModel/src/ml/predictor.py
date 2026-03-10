"""
합격 예측기
ML 모델을 사용한 합격 확률 예측
"""
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd

from .features import FeatureEngineer, StudentScore, DepartmentInfo, RealtimeData, RAGFeatures
from .models import EnsembleModel
from src.utils.logger import log


@dataclass
class PredictionResult:
    """예측 결과"""
    university: str
    department: str
    probability: float           # 합격 확률 (0-1)
    probability_lower: float     # 신뢰구간 하한
    probability_upper: float     # 신뢰구간 상한
    recommendation: str          # 추천 (상향/적정/안전/매우안전)
    confidence: float            # 모델 신뢰도

    # 추가 정보
    predicted_final_rate: float  # 예상 최종 경쟁률
    predicted_cutoff: float      # 예상 합격선
    score_vs_cutoff: float       # 성적 vs 합격선 차이

    # 상세 분석
    factors: Dict[str, Any]      # 주요 영향 요인


class AdmissionPredictor:
    """
    입시 합격 예측기

    학생 성적과 학과 정보를 바탕으로
    합격 확률과 추천을 제공합니다.
    """

    def __init__(self, model_path: Optional[str] = None):
        self.feature_engineer = FeatureEngineer()
        self.model = EnsembleModel()
        self.model_path = model_path

        if model_path and Path(model_path).exists():
            self.model.load(model_path)
            log.info(f"예측 모델 로드 완료: {model_path}")

    def predict(
        self,
        student: StudentScore,
        department: DepartmentInfo,
        realtime: Optional[RealtimeData] = None,
        rag: Optional[RAGFeatures] = None,
    ) -> PredictionResult:
        """
        단일 학과 합격 예측

        Args:
            student: 학생 성적
            department: 학과 정보
            realtime: 실시간 데이터
            rag: RAG 피처

        Returns:
            예측 결과
        """
        # 피처 생성
        features = self.feature_engineer.create_features(
            student, department, realtime, rag
        )
        X = pd.DataFrame([features])

        # 예측
        if self.model.is_trained:
            proba, lower, upper = self.model.predict_with_confidence(X)
            probability = float(proba[0])
            prob_lower = float(lower[0])
            prob_upper = float(upper[0])
        else:
            # 모델이 없으면 규칙 기반 예측
            probability = self._rule_based_prediction(features)
            prob_lower = max(0, probability - 0.15)
            prob_upper = min(1, probability + 0.15)

        # 추천 결정
        recommendation = self._get_recommendation(probability, prob_lower, prob_upper)

        # 예상 합격선 계산
        predicted_cutoff = self._predict_cutoff(department, realtime, rag)
        total_score = features.get("total_standard_443", 0)

        # 예상 최종 경쟁률
        predicted_final_rate = features.get("predicted_final_rate", department.historical_rate)

        # 주요 영향 요인 분석
        factors = self._analyze_factors(features, probability)

        return PredictionResult(
            university=department.university,
            department=department.department,
            probability=probability,
            probability_lower=prob_lower,
            probability_upper=prob_upper,
            recommendation=recommendation,
            confidence=self._calculate_confidence(features, probability),
            predicted_final_rate=predicted_final_rate,
            predicted_cutoff=predicted_cutoff,
            score_vs_cutoff=total_score - predicted_cutoff,
            factors=factors,
        )

    def predict_multiple(
        self,
        student: StudentScore,
        departments: List[DepartmentInfo],
        realtime_data: Optional[Dict[str, RealtimeData]] = None,
        rag_data: Optional[Dict[str, RAGFeatures]] = None,
    ) -> List[PredictionResult]:
        """
        여러 학과 동시 예측

        Args:
            student: 학생 성적
            departments: 학과 정보 리스트
            realtime_data: 학과별 실시간 데이터 {학과키: RealtimeData}
            rag_data: 학과별 RAG 데이터 {학과키: RAGFeatures}

        Returns:
            예측 결과 리스트 (합격 확률 순 정렬)
        """
        results = []

        for dept in departments:
            dept_key = f"{dept.university}_{dept.department}"
            realtime = realtime_data.get(dept_key) if realtime_data else None
            rag = rag_data.get(dept_key) if rag_data else None

            result = self.predict(student, dept, realtime, rag)
            results.append(result)

        # 합격 확률 순 정렬
        results.sort(key=lambda x: x.probability, reverse=True)

        return results

    def suggest_optimal_choices(
        self,
        student: StudentScore,
        departments: List[DepartmentInfo],
        realtime_data: Optional[Dict[str, RealtimeData]] = None,
        rag_data: Optional[Dict[str, RAGFeatures]] = None,
        strategy: str = "balanced",
    ) -> Dict[str, List[PredictionResult]]:
        """
        최적 지원 조합 추천

        Args:
            student: 학생 성적
            departments: 후보 학과 리스트
            realtime_data: 실시간 데이터
            rag_data: RAG 데이터
            strategy: 전략 (aggressive/balanced/conservative)

        Returns:
            {
                "상향": [...],
                "적정": [...],
                "안전": [...],
                "추천_조합": [...]
            }
        """
        # 모든 학과 예측
        all_results = self.predict_multiple(
            student, departments, realtime_data, rag_data
        )

        # 카테고리 분류
        상향 = [r for r in all_results if r.recommendation == "상향"]
        적정 = [r for r in all_results if r.recommendation == "적정"]
        안전 = [r for r in all_results if r.recommendation in ["안전", "매우안전"]]

        # 전략별 추천 조합
        if strategy == "aggressive":
            # 공격적: 상향 2개 + 적정 1개
            추천 = 상향[:2] + 적정[:1]
        elif strategy == "conservative":
            # 보수적: 적정 1개 + 안전 2개
            추천 = 적정[:1] + 안전[:2]
        else:
            # 균형: 상향 1개 + 적정 1개 + 안전 1개
            추천 = 상향[:1] + 적정[:1] + 안전[:1]

        # 군별 중복 제거
        추천 = self._remove_selection_conflicts(추천)

        return {
            "상향": 상향,
            "적정": 적정,
            "안전": 안전,
            "추천_조합": 추천,
            "전략": strategy,
        }

    def _rule_based_prediction(self, features: Dict[str, float]) -> float:
        """규칙 기반 예측 (모델 없을 때)"""
        # 기본 확률
        prob = 0.5

        # 성적 vs 합격선
        score_vs_cutoff = features.get("score_vs_cutoff", 0)
        if score_vs_cutoff > 10:
            prob += 0.3
        elif score_vs_cutoff > 5:
            prob += 0.2
        elif score_vs_cutoff > 0:
            prob += 0.1
        elif score_vs_cutoff > -5:
            prob -= 0.1
        elif score_vs_cutoff > -10:
            prob -= 0.2
        else:
            prob -= 0.3

        # 경쟁률 vs 작년
        rate_vs_last = features.get("rate_vs_last_year", 1)
        if rate_vs_last > 1.3:  # 30% 이상 증가
            prob -= 0.15
        elif rate_vs_last > 1.1:
            prob -= 0.05
        elif rate_vs_last < 0.9:
            prob += 0.1

        # 쏠림 지수
        쏠림 = features.get("쏠림_index", 0)
        prob -= 쏠림 * 0.1

        return max(0.05, min(0.95, prob))

    def _get_recommendation(
        self,
        prob: float,
        lower: float,
        upper: float,
    ) -> str:
        """추천 결정"""
        if prob >= 0.85 and lower >= 0.7:
            return "매우안전"
        elif prob >= 0.7 and lower >= 0.5:
            return "안전"
        elif prob >= 0.5 and lower >= 0.35:
            return "적정"
        else:
            return "상향"

    def _predict_cutoff(
        self,
        dept: DepartmentInfo,
        realtime: Optional[RealtimeData],
        rag: Optional[RAGFeatures],
    ) -> float:
        """예상 합격선 계산"""
        base_cutoff = dept.historical_cutoff

        if not realtime:
            return base_cutoff

        # 경쟁률 변화에 따른 보정
        rate_change = realtime.current_competition_rate / max(dept.historical_rate, 1)

        if rate_change > 1.3:
            # 30% 이상 경쟁률 증가 → 합격선 상승
            cutoff_adjustment = (rate_change - 1) * 10
        elif rate_change < 0.8:
            # 20% 이상 감소 → 합격선 하락
            cutoff_adjustment = (rate_change - 1) * 8
        else:
            cutoff_adjustment = (rate_change - 1) * 5

        # RAG 기반 보정
        if rag and rag.쏠림_index > 0.5:
            cutoff_adjustment += rag.쏠림_index * 3

        return base_cutoff + cutoff_adjustment

    def _calculate_confidence(
        self,
        features: Dict[str, float],
        probability: float,
    ) -> float:
        """예측 신뢰도 계산"""
        confidence = 0.7  # 기본 신뢰도

        # 데이터 완성도에 따른 보정
        if features.get("current_competition_rate", 0) > 0:
            confidence += 0.1

        if features.get("rate_vs_last_year", 0) != 0:
            confidence += 0.05

        if features.get("sentiment_score", 0) != 0:
            confidence += 0.05

        # 극단적인 확률은 신뢰도 낮음
        if probability > 0.9 or probability < 0.1:
            confidence -= 0.1

        return min(0.95, max(0.3, confidence))

    def _analyze_factors(
        self,
        features: Dict[str, float],
        probability: float,
    ) -> Dict[str, Any]:
        """주요 영향 요인 분석"""
        factors = {
            "긍정적_요인": [],
            "부정적_요인": [],
            "주요_지표": {},
        }

        # 성적 요인
        score_vs_cutoff = features.get("score_vs_cutoff", 0)
        if score_vs_cutoff > 5:
            factors["긍정적_요인"].append(f"성적이 작년 합격선보다 {score_vs_cutoff:.1f}점 높음")
        elif score_vs_cutoff < -5:
            factors["부정적_요인"].append(f"성적이 작년 합격선보다 {abs(score_vs_cutoff):.1f}점 낮음")

        # 경쟁률 요인
        rate_vs_last = features.get("rate_vs_last_year", 1)
        if rate_vs_last > 1.2:
            factors["부정적_요인"].append(f"경쟁률이 작년 대비 {(rate_vs_last-1)*100:.0f}% 상승")
        elif rate_vs_last < 0.85:
            factors["긍정적_요인"].append(f"경쟁률이 작년 대비 {(1-rate_vs_last)*100:.0f}% 하락")

        # 쏠림 요인
        쏠림 = features.get("쏠림_index", 0)
        if 쏠림 > 0.5:
            factors["부정적_요인"].append("커뮤니티에서 쏠림 우려 많음")

        # 주요 지표
        factors["주요_지표"] = {
            "현재_경쟁률": features.get("current_competition_rate", 0),
            "예상_최종_경쟁률": features.get("predicted_final_rate", 0),
            "내_환산점수": features.get("total_standard_443", 0),
            "작년_합격선": features.get("historical_cutoff", 0),
        }

        return factors

    def _remove_selection_conflicts(
        self,
        results: List[PredictionResult],
    ) -> List[PredictionResult]:
        """군 중복 제거"""
        selected = []
        used_selections = set()

        for result in results:
            # DepartmentInfo에서 selection_type 추출 필요
            # 여기서는 간단히 전달
            selection = getattr(result, "selection_type", "")
            if selection not in used_selections:
                selected.append(result)
                if selection:
                    used_selections.add(selection)

        return selected

    def get_time_based_prediction(
        self,
        student: StudentScore,
        department: DepartmentInfo,
        historical_rates: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        시간대별 예측 변화 분석

        Args:
            student: 학생 성적
            department: 학과 정보
            historical_rates: 과거 시간대별 경쟁률 데이터

        Returns:
            시간대별 예측 분석
        """
        predictions = []

        for rate_data in historical_rates:
            realtime = RealtimeData(
                current_competition_rate=rate_data.get("competition_rate", 0),
                hours_until_deadline=rate_data.get("hours_remaining", 0),
                day_index=rate_data.get("day_index", 0),
                rate_change_24h=rate_data.get("rate_change_24h", 0),
            )

            result = self.predict(student, department, realtime)
            predictions.append({
                "time": rate_data.get("datetime"),
                "probability": result.probability,
                "competition_rate": realtime.current_competition_rate,
                "recommendation": result.recommendation,
            })

        return {
            "department": f"{department.university} {department.department}",
            "timeline": predictions,
            "trend": self._analyze_prediction_trend(predictions),
        }

    def _analyze_prediction_trend(
        self,
        predictions: List[Dict[str, Any]],
    ) -> str:
        """예측 추세 분석"""
        if len(predictions) < 2:
            return "데이터 부족"

        probs = [p["probability"] for p in predictions]

        if probs[-1] - probs[0] > 0.1:
            return "합격 가능성 상승 중"
        elif probs[0] - probs[-1] > 0.1:
            return "합격 가능성 하락 중 (주의)"
        else:
            return "안정적"


# 편의 함수
def quick_predict(
    korean: int,
    math: int,
    english_grade: int,
    inquiry1: int,
    inquiry2: int,
    university: str,
    department: str,
    historical_cutoff: float = 0,
    historical_rate: float = 10,
) -> PredictionResult:
    """
    간단한 합격 예측

    Args:
        korean: 국어 표준점수
        math: 수학 표준점수
        english_grade: 영어 등급
        inquiry1: 탐구1 표준점수
        inquiry2: 탐구2 표준점수
        university: 대학명
        department: 학과명
        historical_cutoff: 작년 합격선
        historical_rate: 작년 경쟁률

    Returns:
        예측 결과
    """
    predictor = AdmissionPredictor()

    student = StudentScore(
        korean_standard=korean,
        math_standard=math,
        english_grade=english_grade,
        inquiry1_standard=inquiry1,
        inquiry2_standard=inquiry2,
    )

    dept = DepartmentInfo(
        university=university,
        department=department,
        historical_cutoff=historical_cutoff,
        historical_rate=historical_rate,
    )

    return predictor.predict(student, dept)
