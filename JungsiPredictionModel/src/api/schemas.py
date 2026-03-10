"""
API 스키마 (Pydantic 모델)
NestJS 백엔드 연동 버전
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


# === Enums ===

class RiskLevel(str, Enum):
    """위험 수준"""
    VERY_LOW = "very_low"      # 매우안전
    LOW = "low"                # 안전
    MODERATE = "moderate"      # 적정
    HIGH = "high"              # 상향
    VERY_HIGH = "very_high"    # 극상향


class Track(str, Enum):
    """계열"""
    NATURAL = "자연"
    HUMANITIES = "인문"
    ART_PHYSICAL = "예체능"
    MEDICAL = "의약학"


# === NestJS 연동 스키마 (Primary) ===

class ScoresInput(BaseModel):
    """성적 입력 (NestJS 연동)"""
    korean: int = Field(..., ge=0, le=200, description="국어 표준점수")
    math: int = Field(..., ge=0, le=200, description="수학 표준점수")
    english: int = Field(..., ge=1, le=9, description="영어 등급")
    inquiry1: int = Field(..., ge=0, le=100, description="탐구1 표준점수")
    inquiry2: int = Field(..., ge=0, le=100, description="탐구2 표준점수")
    history: Optional[int] = Field(None, ge=1, le=9, description="한국사 등급")
    second_foreign: Optional[int] = Field(None, ge=1, le=9, description="제2외국어/한문 등급")

    # 추가 정보 (선택)
    korean_percentile: Optional[float] = Field(None, ge=0, le=100, description="국어 백분위")
    math_percentile: Optional[float] = Field(None, ge=0, le=100, description="수학 백분위")
    inquiry1_percentile: Optional[float] = Field(None, ge=0, le=100, description="탐구1 백분위")
    inquiry2_percentile: Optional[float] = Field(None, ge=0, le=100, description="탐구2 백분위")
    math_type: Optional[str] = Field(None, description="수학 유형 (미적분/기하/확통)")
    inquiry_subjects: Optional[List[str]] = Field(None, description="탐구 과목명")

    class Config:
        json_schema_extra = {
            "example": {
                "korean": 131,
                "math": 140,
                "english": 1,
                "inquiry1": 68,
                "inquiry2": 65,
                "history": 1,
                "second_foreign": None
            }
        }


class PredictRequest(BaseModel):
    """합격 예측 요청 (NestJS 연동)"""
    university_id: int = Field(..., description="대학 ID")
    admission_id: int = Field(..., description="입학전형 ID (학과+전형)")
    scores: ScoresInput = Field(..., description="성적 정보")
    track: str = Field(..., description="계열 (자연/인문/예체능/의약학)")

    class Config:
        json_schema_extra = {
            "example": {
                "university_id": 123,
                "admission_id": 456,
                "scores": {
                    "korean": 131,
                    "math": 140,
                    "english": 1,
                    "inquiry1": 68,
                    "inquiry2": 65,
                    "history": 1,
                    "second_foreign": None
                },
                "track": "자연"
            }
        }


class PredictResponse(BaseModel):
    """합격 예측 응답 (NestJS 연동)"""
    probability: float = Field(..., ge=0, le=100, description="합격 확률 (%)")
    risk_level: str = Field(..., description="위험 수준 (very_low/low/moderate/high/very_high)")
    expected_competition: float = Field(..., description="예상 최종 경쟁률")
    converted_score: float = Field(..., description="환산 점수")
    estimated_cutline: float = Field(..., description="예상 합격선")
    model_version: str = Field(..., description="모델 버전")
    analysis: Dict[str, Any] = Field(default_factory=dict, description="상세 분석")

    # 추가 정보
    probability_range: Optional[Dict[str, float]] = Field(
        None,
        description="확률 신뢰구간 {lower, upper}"
    )
    recommendation: Optional[str] = Field(None, description="추천 메시지")
    factors: Optional[Dict[str, Any]] = Field(None, description="영향 요인")

    class Config:
        json_schema_extra = {
            "example": {
                "probability": 75.5,
                "risk_level": "moderate",
                "expected_competition": 5.2,
                "converted_score": 850.5,
                "estimated_cutline": 820.0,
                "model_version": "1.0.0",
                "analysis": {
                    "score_gap": 30.5,
                    "competition_trend": "increasing",
                    "similar_cases": 125
                }
            }
        }


class RAGQueryRequest(BaseModel):
    """RAG 질의 요청"""
    question: str = Field(..., min_length=5, max_length=500, description="질문")
    university_id: Optional[int] = Field(None, description="대학 ID 필터")
    admission_id: Optional[int] = Field(None, description="입학전형 ID 필터")
    year: Optional[int] = Field(None, description="연도 필터")

    # 기존 호환성
    university: Optional[str] = Field(None, description="대학명 (레거시)")
    department: Optional[str] = Field(None, description="학과명 (레거시)")

    class Config:
        json_schema_extra = {
            "example": {
                "question": "올해 연세대 경영학과 경쟁률은 어떤가요?",
                "university_id": 123
            }
        }


class RAGResponse(BaseModel):
    """RAG 응답"""
    answer: str = Field(..., description="답변")
    sources: List[Dict[str, Any]] = Field(default_factory=list, description="출처")
    confidence: float = Field(..., ge=0, le=1, description="신뢰도")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="메타데이터")


class CompetitionRequest(BaseModel):
    """경쟁률 조회 요청"""
    university_id: Optional[int] = Field(None, description="대학 ID")
    admission_id: Optional[int] = Field(None, description="입학전형 ID")
    year: int = Field(2025, description="연도")

    # 기존 호환성
    university: Optional[str] = Field(None, description="대학명 (레거시)")
    department: Optional[str] = Field(None, description="학과명 (레거시)")


class CompetitionResponse(BaseModel):
    """경쟁률 응답"""
    university_id: int = Field(..., description="대학 ID")
    admission_id: int = Field(..., description="입학전형 ID")
    university_name: str = Field(..., description="대학명")
    department_name: str = Field(..., description="학과명")
    year: int = Field(..., description="연도")
    admission_type: str = Field(..., description="전형 유형")
    current_rate: float = Field(..., description="현재 경쟁률")
    quota: int = Field(..., description="모집인원")
    applicants: int = Field(..., description="지원자수")
    source: str = Field(..., description="데이터 출처")
    crawled_at: datetime = Field(..., description="수집 시각")

    # 분석 데이터
    rate_change: Optional[float] = Field(None, description="작년 대비 변화율")
    predicted_final_rate: Optional[float] = Field(None, description="예상 최종 경쟁률")
    historical_rates: Optional[List[Dict[str, Any]]] = Field(None, description="과거 경쟁률")


class HealthResponse(BaseModel):
    """헬스체크 응답"""
    status: str = Field(..., description="상태")
    version: str = Field(..., description="버전")
    timestamp: datetime = Field(..., description="시각")
    services: Dict[str, str] = Field(..., description="서비스 상태")


class ErrorResponse(BaseModel):
    """에러 응답"""
    error: str = Field(..., description="에러 유형")
    message: str = Field(..., description="에러 메시지")
    detail: Optional[Any] = Field(None, description="상세 정보")
    timestamp: datetime = Field(default_factory=datetime.now, description="발생 시각")


# === 레거시 스키마 (하위 호환성) ===

class StudentScoreInput(BaseModel):
    """학생 성적 입력 (레거시)"""
    korean_standard: int = Field(..., ge=0, le=200, description="국어 표준점수")
    math_standard: int = Field(..., ge=0, le=200, description="수학 표준점수")
    english_grade: int = Field(..., ge=1, le=9, description="영어 등급")
    inquiry1_standard: int = Field(..., ge=0, le=100, description="탐구1 표준점수")
    inquiry2_standard: int = Field(..., ge=0, le=100, description="탐구2 표준점수")

    korean_percentile: Optional[float] = Field(None, ge=0, le=100)
    math_percentile: Optional[float] = Field(None, ge=0, le=100)
    inquiry1_percentile: Optional[float] = Field(None, ge=0, le=100)
    inquiry2_percentile: Optional[float] = Field(None, ge=0, le=100)

    math_type: Optional[str] = Field("미적분")
    inquiry_type: Optional[str] = Field("과탐")


class DepartmentInput(BaseModel):
    """학과 입력 (레거시)"""
    university: str = Field(..., description="대학명")
    department: str = Field(..., description="학과명")
    tier: Optional[str] = Field(None)
    category: Optional[str] = Field(None)
    selection_type: Optional[str] = Field(None)


class LegacyPredictionRequest(BaseModel):
    """합격 예측 요청 (레거시)"""
    student: StudentScoreInput
    departments: List[DepartmentInput] = Field(..., min_length=1, max_length=20)
    include_realtime: bool = Field(True)
    include_rag: bool = Field(True)


class LegacyPredictionResultResponse(BaseModel):
    """예측 결과 응답 (레거시)"""
    university: str
    department: str
    probability: float = Field(..., ge=0, le=1)
    probability_lower: float
    probability_upper: float
    recommendation: str
    confidence: float

    predicted_final_rate: Optional[float] = None
    predicted_cutoff: Optional[float] = None
    score_vs_cutoff: Optional[float] = None
    factors: Optional[Dict[str, Any]] = None


class LegacyPredictionResponse(BaseModel):
    """전체 예측 응답 (레거시)"""
    predictions: List[LegacyPredictionResultResponse]
    summary: Dict[str, Any]
    timestamp: datetime
