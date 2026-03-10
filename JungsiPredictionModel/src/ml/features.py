"""
Feature Engineering
입시 예측을 위한 피처 생성 및 전처리
"""
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

from src.utils.logger import log


@dataclass
class StudentScore:
    """학생 성적 데이터"""
    korean_standard: int = 0      # 국어 표준점수
    math_standard: int = 0        # 수학 표준점수
    english_grade: int = 0        # 영어 등급
    inquiry1_standard: int = 0    # 탐구1 표준점수
    inquiry2_standard: int = 0    # 탐구2 표준점수

    korean_percentile: float = 0  # 국어 백분위
    math_percentile: float = 0    # 수학 백분위
    inquiry1_percentile: float = 0
    inquiry2_percentile: float = 0

    math_type: str = "미적분"     # 수학 유형
    inquiry_type: str = "과탐"   # 탐구 유형 (과탐/사탐)


@dataclass
class DepartmentInfo:
    """학과 정보"""
    university: str
    department: str
    tier: str = ""               # 대학 티어
    category: str = ""           # 계열 (인문/자연/예체능)
    selection_type: str = ""     # 군 (가/나/다)

    # 과거 데이터
    historical_cutoff: float = 0
    historical_rate: float = 0
    historical_chungwon: float = 0


@dataclass
class RealtimeData:
    """실시간 데이터"""
    current_competition_rate: float = 0
    current_applicants: int = 0
    quota: int = 0

    # 시계열 데이터
    hours_until_deadline: int = 0
    day_index: int = 0           # 지원 시작 후 n일차

    # 변화율
    rate_change_1h: float = 0
    rate_change_24h: float = 0
    rate_vs_last_year: float = 0


@dataclass
class RAGFeatures:
    """RAG 기반 피처"""
    sentiment_score: float = 0   # 커뮤니티 감성 점수
    mention_count: int = 0       # 최근 언급 횟수
    쏠림_index: float = 0        # 쏠림 지수
    news_sentiment: float = 0    # 뉴스 감성


class FeatureEngineer:
    """
    Feature Engineering

    학생 성적, 학과 정보, 실시간 데이터, RAG 데이터를
    ML 모델 입력에 적합한 피처로 변환합니다.
    """

    def __init__(self):
        # 대학 티어 인코딩
        self.tier_encoding = {
            "sky": 5,
            "top10": 4,
            "in_seoul": 3,
            "regional_top": 2,
            "regional": 1,
            "": 0,
        }

        # 계열 인코딩
        self.category_encoding = {
            "인문": 1,
            "자연": 2,
            "예체능": 3,
            "의약": 4,
            "": 0,
        }

        # 군 인코딩
        self.selection_encoding = {
            "가군": 1,
            "나군": 2,
            "다군": 3,
            "": 0,
        }

        # 수학 유형 인코딩
        self.math_type_encoding = {
            "미적분": 1,
            "기하": 2,
            "확률과통계": 3,
            "확통": 3,
            "": 0,
        }

        # 탐구 유형 인코딩
        self.inquiry_type_encoding = {
            "과탐": 1,
            "사탐": 2,
            "직탐": 3,
            "": 0,
        }

    def create_features(
        self,
        student: StudentScore,
        department: DepartmentInfo,
        realtime: Optional[RealtimeData] = None,
        rag: Optional[RAGFeatures] = None,
    ) -> Dict[str, float]:
        """
        전체 피처 생성

        Args:
            student: 학생 성적
            department: 학과 정보
            realtime: 실시간 데이터
            rag: RAG 기반 피처

        Returns:
            피처 딕셔너리
        """
        features = {}

        # 1. 학생 성적 피처
        features.update(self._create_student_features(student))

        # 2. 학과 정보 피처
        features.update(self._create_department_features(department))

        # 3. 실시간 피처
        if realtime:
            features.update(self._create_realtime_features(realtime))

        # 4. RAG 피처
        if rag:
            features.update(self._create_rag_features(rag))

        # 5. 파생 피처
        features.update(self._create_derived_features(student, department, realtime))

        return features

    def _create_student_features(self, student: StudentScore) -> Dict[str, float]:
        """학생 성적 피처"""
        features = {
            # 원점수 / 표준점수
            "korean_standard": student.korean_standard,
            "math_standard": student.math_standard,
            "inquiry1_standard": student.inquiry1_standard,
            "inquiry2_standard": student.inquiry2_standard,
            "inquiry_avg_standard": (student.inquiry1_standard + student.inquiry2_standard) / 2,

            # 백분위
            "korean_percentile": student.korean_percentile,
            "math_percentile": student.math_percentile,
            "inquiry1_percentile": student.inquiry1_percentile,
            "inquiry2_percentile": student.inquiry2_percentile,
            "inquiry_avg_percentile": (student.inquiry1_percentile + student.inquiry2_percentile) / 2,

            # 영어 등급 (낮을수록 좋음)
            "english_grade": student.english_grade,
            "english_penalty": self._calculate_english_penalty(student.english_grade),

            # 총점 (다양한 반영 비율)
            "total_standard_443": self._calculate_total_443(student),
            "total_standard_433": self._calculate_total_433(student),
            "total_standard_equal": self._calculate_total_equal(student),

            # 유형 인코딩
            "math_type": self.math_type_encoding.get(student.math_type, 0),
            "inquiry_type": self.inquiry_type_encoding.get(student.inquiry_type, 0),

            # 과목간 편차
            "score_std": np.std([
                student.korean_standard,
                student.math_standard,
                student.inquiry1_standard,
                student.inquiry2_standard,
            ]),
            "korean_math_diff": student.korean_standard - student.math_standard,
        }

        return features

    def _create_department_features(self, dept: DepartmentInfo) -> Dict[str, float]:
        """학과 정보 피처"""
        features = {
            # 인코딩된 범주형 변수
            "tier": self.tier_encoding.get(dept.tier, 0),
            "category": self.category_encoding.get(dept.category, 0),
            "selection_type": self.selection_encoding.get(dept.selection_type, 0),

            # 과거 데이터
            "historical_cutoff": dept.historical_cutoff,
            "historical_rate": dept.historical_rate,
            "historical_chungwon": dept.historical_chungwon,

            # 인기도 지표 (경쟁률 기반)
            "popularity_index": min(dept.historical_rate / 10, 3.0),  # 정규화
        }

        return features

    def _create_realtime_features(self, rt: RealtimeData) -> Dict[str, float]:
        """실시간 피처"""
        features = {
            # 현재 경쟁률
            "current_competition_rate": rt.current_competition_rate,
            "current_applicants": rt.current_applicants,
            "quota": rt.quota,

            # 시간 관련
            "hours_until_deadline": rt.hours_until_deadline,
            "day_index": rt.day_index,
            "deadline_urgency": 1 / (rt.hours_until_deadline + 1),  # 마감 임박 지수

            # 변화율
            "rate_change_1h": rt.rate_change_1h,
            "rate_change_24h": rt.rate_change_24h,
            "rate_vs_last_year": rt.rate_vs_last_year,

            # 추세 지표
            "is_rate_increasing": 1 if rt.rate_change_1h > 0 else 0,
            "rate_acceleration": rt.rate_change_1h - rt.rate_change_24h / 24,

            # 예측된 최종 경쟁률 (간단한 선형 추정)
            "predicted_final_rate": self._predict_final_rate(rt),
        }

        return features

    def _create_rag_features(self, rag: RAGFeatures) -> Dict[str, float]:
        """RAG 기반 피처"""
        features = {
            "sentiment_score": rag.sentiment_score,
            "mention_count": rag.mention_count,
            "mention_count_log": np.log1p(rag.mention_count),  # 로그 스케일
            "쏠림_index": rag.쏠림_index,
            "news_sentiment": rag.news_sentiment,

            # 종합 여론 지수
            "public_opinion_index": (
                rag.sentiment_score * 0.4 +
                rag.news_sentiment * 0.3 +
                (1 - rag.쏠림_index) * 0.3
            ),
        }

        return features

    def _create_derived_features(
        self,
        student: StudentScore,
        dept: DepartmentInfo,
        realtime: Optional[RealtimeData] = None,
    ) -> Dict[str, float]:
        """파생 피처"""
        features = {}

        # 성적 vs 합격선 비교
        total_score = self._calculate_total_443(student)
        if dept.historical_cutoff > 0:
            features["score_vs_cutoff"] = total_score - dept.historical_cutoff
            features["score_cutoff_ratio"] = total_score / dept.historical_cutoff
            features["is_above_cutoff"] = 1 if total_score >= dept.historical_cutoff else 0

        # 실시간 경쟁률 vs 과거 비교
        if realtime and dept.historical_rate > 0:
            features["rate_vs_historical"] = realtime.current_competition_rate / dept.historical_rate
            features["is_rate_higher"] = 1 if realtime.current_competition_rate > dept.historical_rate else 0

        # 계열 적합성 (자연계열 + 과탐이면 높은 점수)
        if dept.category == "자연" and student.inquiry_type == "과탐":
            features["category_fit"] = 1.0
        elif dept.category == "인문" and student.inquiry_type == "사탐":
            features["category_fit"] = 1.0
        else:
            features["category_fit"] = 0.5

        return features

    def _calculate_english_penalty(self, grade: int) -> float:
        """영어 등급별 감점"""
        # 대학마다 다르지만 일반적인 패턴
        penalties = {
            1: 0, 2: 0.5, 3: 1.0, 4: 1.5, 5: 2.0,
            6: 3.0, 7: 4.0, 8: 5.0, 9: 6.0
        }
        return penalties.get(grade, 0)

    def _calculate_total_443(self, student: StudentScore) -> float:
        """국수탐 4:4:3 반영 총점"""
        inquiry_avg = (student.inquiry1_standard + student.inquiry2_standard) / 2
        return (
            student.korean_standard * 0.4 +
            student.math_standard * 0.4 +
            inquiry_avg * 0.3
        ) * 10 / 4  # 정규화

    def _calculate_total_433(self, student: StudentScore) -> float:
        """국수탐 4:3:3 반영 총점"""
        inquiry_avg = (student.inquiry1_standard + student.inquiry2_standard) / 2
        return (
            student.korean_standard * 0.4 +
            student.math_standard * 0.3 +
            inquiry_avg * 0.3
        ) * 10 / 4

    def _calculate_total_equal(self, student: StudentScore) -> float:
        """균등 반영 총점"""
        inquiry_avg = (student.inquiry1_standard + student.inquiry2_standard) / 2
        return (
            student.korean_standard +
            student.math_standard +
            inquiry_avg
        ) / 3

    def _predict_final_rate(self, rt: RealtimeData) -> float:
        """최종 경쟁률 예측 (간단한 선형 모델)"""
        if rt.hours_until_deadline <= 0:
            return rt.current_competition_rate

        # 과거 패턴 기반 예측
        # 보통 마지막 24시간에 30-50% 증가
        remaining_ratio = rt.hours_until_deadline / (24 * 7)  # 7일 기준
        growth_factor = 1.3 + (0.2 * (1 - remaining_ratio))  # 마감 가까울수록 증가

        return rt.current_competition_rate * growth_factor

    def prepare_training_data(
        self,
        records: List[Dict[str, Any]],
    ) -> Tuple[pd.DataFrame, pd.Series]:
        """
        학습 데이터 준비

        Args:
            records: 과거 합격/불합격 기록 리스트
                {
                    "student": StudentScore,
                    "department": DepartmentInfo,
                    "realtime": RealtimeData,
                    "rag": RAGFeatures,
                    "label": 1 or 0 (합격/불합격)
                }

        Returns:
            (피처 DataFrame, 라벨 Series)
        """
        feature_list = []
        labels = []

        for record in records:
            features = self.create_features(
                student=record.get("student", StudentScore()),
                department=record.get("department", DepartmentInfo("", "")),
                realtime=record.get("realtime"),
                rag=record.get("rag"),
            )
            feature_list.append(features)
            labels.append(record.get("label", 0))

        X = pd.DataFrame(feature_list)
        y = pd.Series(labels)

        # 결측치 처리
        X = X.fillna(0)

        log.info(f"학습 데이터 준비 완료: {len(X)}개 샘플, {len(X.columns)}개 피처")

        return X, y

    def get_feature_names(self) -> List[str]:
        """모든 피처 이름 반환"""
        dummy = self.create_features(
            StudentScore(),
            DepartmentInfo("", ""),
            RealtimeData(),
            RAGFeatures(),
        )
        return list(dummy.keys())


# 유틸리티 함수
def create_sample_data(n_samples: int = 1000) -> List[Dict[str, Any]]:
    """
    샘플 학습 데이터 생성 (테스트용)
    """
    np.random.seed(42)
    samples = []

    for _ in range(n_samples):
        # 랜덤 성적 생성
        base_score = np.random.normal(130, 15)  # 표준점수 평균 130, 표준편차 15

        student = StudentScore(
            korean_standard=int(np.clip(base_score + np.random.normal(0, 5), 80, 150)),
            math_standard=int(np.clip(base_score + np.random.normal(0, 8), 80, 150)),
            english_grade=int(np.clip(np.random.exponential(2) + 1, 1, 9)),
            inquiry1_standard=int(np.clip(base_score * 0.5 + np.random.normal(0, 3), 40, 75)),
            inquiry2_standard=int(np.clip(base_score * 0.5 + np.random.normal(0, 3), 40, 75)),
            korean_percentile=np.clip(np.random.normal(85, 10), 0, 100),
            math_percentile=np.clip(np.random.normal(85, 12), 0, 100),
        )

        department = DepartmentInfo(
            university="테스트대학",
            department="테스트학과",
            tier=np.random.choice(["sky", "top10", "in_seoul", "regional"]),
            category=np.random.choice(["인문", "자연"]),
            historical_cutoff=np.random.uniform(350, 420),
            historical_rate=np.random.uniform(3, 20),
        )

        realtime = RealtimeData(
            current_competition_rate=np.random.uniform(2, 15),
            hours_until_deadline=np.random.randint(0, 168),
            rate_change_24h=np.random.uniform(-0.5, 0.5),
        )

        # 라벨 생성 (성적이 높으면 합격 확률 높음)
        prob = 1 / (1 + np.exp(-(base_score - 130) / 10))
        label = 1 if np.random.random() < prob else 0

        samples.append({
            "student": student,
            "department": department,
            "realtime": realtime,
            "label": label,
        })

    return samples
