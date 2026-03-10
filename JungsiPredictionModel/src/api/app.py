"""
FastAPI 애플리케이션
"""
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from .routes import router
from config.settings import get_settings
from src.utils.logger import log


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """애플리케이션 라이프사이클 관리"""
    # 시작 시
    log.info("정시 합격 예측 API 서버 시작")
    log.info(f"환경: {settings.ENV}")

    # TODO: 서비스 초기화
    # - 데이터베이스 연결
    # - 모델 로드
    # - 캐시 연결

    yield

    # 종료 시
    log.info("정시 합격 예측 API 서버 종료")
    # TODO: 리소스 정리


def create_app() -> FastAPI:
    """FastAPI 앱 생성"""
    app = FastAPI(
        title="정시 합격 예측 API",
        description="""
## 정시 합격 예측 시스템

머신러닝 + RAG 기반 대학 입시 합격 예측 플랫폼

### 주요 기능
- **합격 예측**: 학생 성적과 학과 정보를 바탕으로 합격 확률 예측
- **지원 추천**: 전략에 따른 최적 지원 조합 추천
- **RAG 질의**: 실시간 뉴스와 커뮤니티 데이터 기반 입시 정보 제공
- **경쟁률 조회**: 실시간 경쟁률 및 과거 데이터 조회

### 특징
- 실시간 경쟁률 반영
- 커뮤니티 여론 분석 (쏠림 지수)
- XGBoost + LightGBM + CatBoost 앙상블 모델
- Google Cloud RAG 파이프라인
        """,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS 설정
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # 프로덕션에서는 특정 도메인만 허용
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 라우터 등록
    app.include_router(router, prefix="/api/v1")

    # 예외 핸들러
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """유효성 검사 에러 핸들러"""
        return JSONResponse(
            status_code=422,
            content={
                "error": "Validation Error",
                "detail": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """일반 에러 핸들러"""
        log.error(f"처리되지 않은 예외: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "detail": str(exc) if settings.DEBUG else "서버 오류가 발생했습니다.",
            },
        )

    # 루트 엔드포인트
    @app.get("/")
    async def root():
        """루트 엔드포인트"""
        return {
            "service": "정시 합격 예측 API",
            "version": "1.0.0",
            "docs": "/docs",
            "health": "/api/v1/health",
        }

    return app


# 앱 인스턴스 생성
app = create_app()


# 개발 서버 실행
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.api.app:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
