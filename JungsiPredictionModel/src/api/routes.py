"""
API 라우트 정의
NestJS 백엔드 연동 버전
"""
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from fastapi.responses import JSONResponse

from .schemas import (
    # NestJS 연동 스키마
    PredictRequest, PredictResponse,
    RAGQueryRequest, RAGResponse,
    CompetitionRequest, CompetitionResponse,
    HealthResponse, ErrorResponse, RiskLevel,
    # 레거시 스키마
    LegacyPredictionRequest, LegacyPredictionResponse,
    LegacyPredictionResultResponse,
    StudentScoreInput, DepartmentInput,
)
from src.ml.features import StudentScore, DepartmentInfo, RealtimeData, RAGFeatures
from src.ml.predictor import AdmissionPredictor
from src.rag.rag_pipeline import RAGPipeline, RAGQuery
from src.crawlers.crawler_manager import CrawlerManager
from src.utils.logger import log

router = APIRouter()

# 모델 버전
MODEL_VERSION = "1.0.0"

# 서비스 인스턴스 (의존성 주입용)
predictor: Optional[AdmissionPredictor] = None
rag_pipeline: Optional[RAGPipeline] = None
crawler_manager: Optional[CrawlerManager] = None


def get_predictor() -> AdmissionPredictor:
    """예측기 의존성"""
    global predictor
    if predictor is None:
        predictor = AdmissionPredictor()
    return predictor


async def get_rag() -> RAGPipeline:
    """RAG 파이프라인 의존성"""
    global rag_pipeline
    if rag_pipeline is None:
        rag_pipeline = RAGPipeline(use_local=True)
        await rag_pipeline.initialize()
    return rag_pipeline


def get_crawler() -> CrawlerManager:
    """크롤러 매니저 의존성"""
    global crawler_manager
    if crawler_manager is None:
        crawler_manager = CrawlerManager()
    return crawler_manager


def probability_to_risk_level(probability: float) -> str:
    """확률을 위험 수준으로 변환"""
    if probability >= 80:
        return RiskLevel.VERY_LOW.value
    elif probability >= 60:
        return RiskLevel.LOW.value
    elif probability >= 40:
        return RiskLevel.MODERATE.value
    elif probability >= 20:
        return RiskLevel.HIGH.value
    else:
        return RiskLevel.VERY_HIGH.value


def risk_level_to_recommendation(risk_level: str) -> str:
    """위험 수준을 추천 메시지로 변환"""
    messages = {
        RiskLevel.VERY_LOW.value: "매우 안전한 선택입니다. 합격 가능성이 높습니다.",
        RiskLevel.LOW.value: "안전한 선택입니다. 무난한 합격이 예상됩니다.",
        RiskLevel.MODERATE.value: "적정 지원입니다. 경쟁에 따라 결과가 달라질 수 있습니다.",
        RiskLevel.HIGH.value: "상향 지원입니다. 도전적인 선택입니다.",
        RiskLevel.VERY_HIGH.value: "매우 상향 지원입니다. 합격이 어려울 수 있습니다.",
    }
    return messages.get(risk_level, "")


# === 헬스체크 ===

@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """시스템 헬스체크"""
    return HealthResponse(
        status="healthy",
        version=MODEL_VERSION,
        timestamp=datetime.now(),
        services={
            "api": "running",
            "predictor": "ready" if predictor else "not_initialized",
            "rag": "ready" if rag_pipeline else "not_initialized",
            "crawler": "ready" if crawler_manager else "not_initialized",
        }
    )


# === 합격 예측 (NestJS 연동) ===

@router.post("/predict", response_model=PredictResponse, tags=["Prediction"])
async def predict_admission(
    request: PredictRequest,
    pred: AdmissionPredictor = Depends(get_predictor),
):
    """
    합격 확률 예측 (NestJS 연동)

    대학 ID, 입학전형 ID, 성적을 입력받아 합격 확률을 예측합니다.
    """
    try:
        # 학생 성적 변환
        student = StudentScore(
            korean_standard=request.scores.korean,
            math_standard=request.scores.math,
            english_grade=request.scores.english,
            inquiry1_standard=request.scores.inquiry1,
            inquiry2_standard=request.scores.inquiry2,
            korean_percentile=request.scores.korean_percentile or 0,
            math_percentile=request.scores.math_percentile or 0,
            inquiry1_percentile=request.scores.inquiry1_percentile or 0,
            inquiry2_percentile=request.scores.inquiry2_percentile or 0,
            math_type=request.scores.math_type or "미적분",
            inquiry_type="과탐" if request.track == "자연" else "사탐",
        )

        # 학과 정보 (ID 기반 - 실제로는 DB에서 조회)
        # TODO: university_id, admission_id로 DB에서 학과 정보 조회
        dept = DepartmentInfo(
            university=f"대학_{request.university_id}",
            department=f"학과_{request.admission_id}",
            tier="",  # DB에서 조회
            category=request.track,
            selection_type="",  # DB에서 조회
        )

        # 예측 수행
        result = pred.predict(student, dept)

        # 확률을 백분율로 변환 (0-100)
        probability_percent = result.probability * 100
        risk_level = probability_to_risk_level(probability_percent)

        # 환산 점수 계산
        converted_score = (
            request.scores.korean +
            request.scores.math +
            request.scores.inquiry1 +
            request.scores.inquiry2 +
            (10 - request.scores.english) * 5  # 영어 등급 환산
        )

        # 응답 생성
        return PredictResponse(
            probability=round(probability_percent, 2),
            risk_level=risk_level,
            expected_competition=round(result.predicted_final_rate or 5.0, 2),
            converted_score=round(converted_score, 2),
            estimated_cutline=round(result.predicted_cutoff or converted_score - 20, 2),
            model_version=MODEL_VERSION,
            analysis={
                "score_gap": round((result.score_vs_cutoff or 0), 2),
                "confidence": round(result.confidence, 4),
                "factors": result.factors or {},
            },
            probability_range={
                "lower": round(result.probability_lower * 100, 2),
                "upper": round(result.probability_upper * 100, 2),
            },
            recommendation=risk_level_to_recommendation(risk_level),
            factors=result.factors,
        )

    except Exception as e:
        log.error(f"예측 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# === RAG 질의응답 ===

@router.post("/rag/query", response_model=RAGResponse, tags=["RAG"])
async def rag_query(
    request: RAGQueryRequest,
    rag: RAGPipeline = Depends(get_rag),
):
    """
    RAG 기반 질의응답

    입시 관련 질문에 대해 뉴스, 커뮤니티 데이터를
    기반으로 답변합니다.
    """
    try:
        # TODO: university_id로 대학명 조회
        university_name = request.university or (
            f"대학_{request.university_id}" if request.university_id else None
        )

        query = RAGQuery(
            question=request.question,
            university=university_name,
            department=request.department,
            year=request.year,
        )

        response = await rag.query(query)

        return RAGResponse(
            answer=response.answer,
            sources=response.sources,
            confidence=response.confidence,
            metadata=response.metadata,
        )

    except Exception as e:
        log.error(f"RAG 질의 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/rag/index", tags=["RAG"])
async def index_data(
    background_tasks: BackgroundTasks,
    index_news: bool = Query(True, description="뉴스 인덱싱"),
    index_community: bool = Query(True, description="커뮤니티 인덱싱"),
    days: int = Query(7, description="수집 기간 (일)"),
    rag: RAGPipeline = Depends(get_rag),
):
    """
    RAG 데이터 인덱싱 (백그라운드)

    뉴스와 커뮤니티 데이터를 수집하고 인덱싱합니다.
    """
    async def index_task():
        if index_news:
            await rag.index_news(days=days)
        if index_community:
            await rag.index_community()

    background_tasks.add_task(index_task)

    return {
        "status": "indexing_started",
        "index_news": index_news,
        "index_community": index_community,
        "days": days,
    }


# === 경쟁률 조회 ===

@router.get("/competition", response_model=List[CompetitionResponse], tags=["Competition"])
async def get_competition_rates(
    university_id: Optional[int] = Query(None, description="대학 ID"),
    admission_id: Optional[int] = Query(None, description="입학전형 ID"),
    university: Optional[str] = Query(None, description="대학명 (레거시)"),
    department: Optional[str] = Query(None, description="학과명 (레거시)"),
    year: int = Query(2025, description="연도"),
    limit: int = Query(50, le=200, description="최대 결과 수"),
):
    """
    경쟁률 조회

    실시간 또는 캐시된 경쟁률 데이터를 반환합니다.
    """
    # TODO: 데이터베이스에서 조회
    # university_id 또는 university로 필터링

    # 더미 데이터
    return [
        CompetitionResponse(
            university_id=university_id or 1,
            admission_id=admission_id or 1,
            university_name=university or "연세대학교",
            department_name=department or "경영학과",
            year=year,
            admission_type="정시",
            current_rate=8.5,
            quota=30,
            applicants=255,
            source="어디가",
            crawled_at=datetime.now(),
            rate_change=1.15,
            predicted_final_rate=7.4,
            historical_rates=[
                {"year": 2024, "final_rate": 7.4},
                {"year": 2023, "final_rate": 6.8},
            ],
        )
    ]


@router.post("/competition/crawl", tags=["Competition"])
async def crawl_competition(
    background_tasks: BackgroundTasks,
    year: int = Query(2025, description="연도"),
    sources: Optional[List[str]] = Query(None, description="소스 (adiga/jinhak/uway)"),
    crawler: CrawlerManager = Depends(get_crawler),
):
    """
    경쟁률 크롤링 (백그라운드)

    실시간으로 경쟁률 데이터를 수집합니다.
    """
    async def crawl_task():
        await crawler.initialize()
        await crawler.crawl_all(year, sources=sources)
        await crawler.close()

    background_tasks.add_task(crawl_task)

    return {
        "status": "crawling_started",
        "year": year,
        "sources": sources or ["all"],
    }


# === 대학/학과 검색 ===

@router.get("/universities", tags=["Search"])
async def search_universities(
    query: str = Query(..., min_length=1, description="검색어"),
    tier: Optional[str] = Query(None, description="티어 필터"),
    limit: int = Query(20, le=100),
):
    """대학 검색"""
    # TODO: 데이터베이스에서 검색
    return {
        "query": query,
        "results": [
            {"id": 1, "name": "연세대학교", "tier": "sky", "region": "서울"},
            {"id": 2, "name": "연세대학교(미래)", "tier": "regional", "region": "강원"},
        ],
        "total": 2,
    }


@router.get("/departments", tags=["Search"])
async def search_departments(
    query: str = Query(..., min_length=1, description="검색어"),
    university_id: Optional[int] = Query(None, description="대학 ID"),
    university: Optional[str] = Query(None, description="대학 필터 (레거시)"),
    category: Optional[str] = Query(None, description="계열 필터"),
    limit: int = Query(20, le=100),
):
    """학과 검색"""
    # TODO: 데이터베이스에서 검색
    return {
        "query": query,
        "results": [
            {
                "id": 1,
                "admission_id": 101,
                "university_id": 1,
                "university": "연세대학교",
                "department": "경영학과",
                "category": "인문",
                "selection_type": "가군",
            },
        ],
        "total": 1,
    }


# === 통계 ===

@router.get("/stats/popular", tags=["Statistics"])
async def get_popular_departments(
    year: int = Query(2025),
    limit: int = Query(20, le=50),
):
    """인기 학과 순위"""
    # TODO: 경쟁률 기반 인기 학과 조회
    return {
        "year": year,
        "rankings": [
            {"rank": 1, "university_id": 1, "admission_id": 101, "university": "서울대학교", "department": "의예과", "rate": 45.2},
            {"rank": 2, "university_id": 2, "admission_id": 201, "university": "연세대학교", "department": "의예과", "rate": 42.8},
            {"rank": 3, "university_id": 3, "admission_id": 301, "university": "고려대학교", "department": "의예과", "rate": 38.5},
        ],
    }


@router.get("/stats/trends", tags=["Statistics"])
async def get_trends(
    university_id: Optional[int] = Query(None, description="대학 ID"),
    admission_id: Optional[int] = Query(None, description="입학전형 ID"),
    university: str = Query(None, description="대학명 (레거시)"),
    department: str = Query(None, description="학과명 (레거시)"),
    years: int = Query(5, description="조회 년수"),
):
    """경쟁률 추이"""
    # TODO: 과거 데이터 조회
    return {
        "university_id": university_id,
        "admission_id": admission_id,
        "university": university or "연세대학교",
        "department": department or "경영학과",
        "trends": [
            {"year": 2024, "rate": 7.4, "cutoff": 385},
            {"year": 2023, "rate": 6.8, "cutoff": 382},
            {"year": 2022, "rate": 7.1, "cutoff": 380},
        ],
    }


# === 레거시 API (하위 호환성) ===

@router.post("/predict/legacy", response_model=LegacyPredictionResponse, tags=["Legacy"])
async def predict_admission_legacy(
    request: LegacyPredictionRequest,
    pred: AdmissionPredictor = Depends(get_predictor),
):
    """
    합격 확률 예측 (레거시)

    기존 형식의 요청/응답을 지원합니다.
    """
    try:
        student = StudentScore(
            korean_standard=request.student.korean_standard,
            math_standard=request.student.math_standard,
            english_grade=request.student.english_grade,
            inquiry1_standard=request.student.inquiry1_standard,
            inquiry2_standard=request.student.inquiry2_standard,
            korean_percentile=request.student.korean_percentile or 0,
            math_percentile=request.student.math_percentile or 0,
            inquiry1_percentile=request.student.inquiry1_percentile or 0,
            inquiry2_percentile=request.student.inquiry2_percentile or 0,
            math_type=request.student.math_type or "미적분",
            inquiry_type=request.student.inquiry_type or "과탐",
        )

        departments = [
            DepartmentInfo(
                university=dept.university,
                department=dept.department,
                tier=dept.tier or "",
                category=dept.category or "",
                selection_type=dept.selection_type or "",
            )
            for dept in request.departments
        ]

        results = pred.predict_multiple(student, departments)

        predictions = [
            LegacyPredictionResultResponse(
                university=r.university,
                department=r.department,
                probability=round(r.probability, 4),
                probability_lower=round(r.probability_lower, 4),
                probability_upper=round(r.probability_upper, 4),
                recommendation=r.recommendation,
                confidence=round(r.confidence, 4),
                predicted_final_rate=round(r.predicted_final_rate, 2) if r.predicted_final_rate else None,
                predicted_cutoff=round(r.predicted_cutoff, 2) if r.predicted_cutoff else None,
                score_vs_cutoff=round(r.score_vs_cutoff, 2) if r.score_vs_cutoff else None,
                factors=r.factors,
            )
            for r in results
        ]

        summary = {
            "total_departments": len(predictions),
            "상향": len([p for p in predictions if p.recommendation == "상향"]),
            "적정": len([p for p in predictions if p.recommendation == "적정"]),
            "안전": len([p for p in predictions if p.recommendation in ["안전", "매우안전"]]),
            "best_choice": predictions[0].department if predictions else None,
            "safest_choice": max(predictions, key=lambda x: x.probability).department if predictions else None,
        }

        return LegacyPredictionResponse(
            predictions=predictions,
            summary=summary,
            timestamp=datetime.now(),
        )

    except Exception as e:
        log.error(f"예측 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))
