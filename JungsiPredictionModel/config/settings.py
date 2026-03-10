"""
정시 합격 예측 시스템 - 설정 파일
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional
from functools import lru_cache


class Settings(BaseSettings):
    """애플리케이션 설정"""

    # 환경
    ENV: str = Field(default="development", description="실행 환경")
    DEBUG: bool = Field(default=True, description="디버그 모드")

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:password@localhost:5432/jungsi_prediction",
        description="PostgreSQL 연결 URL",
    )
    DATABASE_POOL_SIZE: int = Field(default=10, description="DB 커넥션 풀 크기")

    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379/0", description="Redis URL")

    # Google Cloud
    GCP_PROJECT_ID: str = Field(default="", description="GCP 프로젝트 ID")
    GCP_LOCATION: str = Field(default="asia-northeast3", description="GCP 리전")
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = Field(
        default=None, description="GCP 서비스 계정 키 경로"
    )

    # Vertex AI
    VERTEX_AI_EMBEDDING_MODEL: str = Field(
        default="text-embedding-005", description="임베딩 모델"
    )
    VERTEX_AI_LLM_MODEL: str = Field(
        default="gemini-1.5-pro", description="LLM 모델"
    )
    VECTOR_SEARCH_INDEX_ENDPOINT: str = Field(
        default="", description="Vector Search 인덱스 엔드포인트"
    )

    # Crawling
    CRAWL_INTERVAL_NORMAL: int = Field(
        default=3600, description="평상시 크롤링 간격 (초)"
    )
    CRAWL_INTERVAL_APPLICATION: int = Field(
        default=600, description="지원 기간 크롤링 간격 (초)"
    )
    CRAWL_INTERVAL_FINAL: int = Field(
        default=300, description="마감 직전 크롤링 간격 (초)"
    )
    CRAWL_USER_AGENT: str = Field(
        default="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        description="크롤링 User-Agent",
    )
    PROXY_ROTATION_ENABLED: bool = Field(
        default=False, description="프록시 로테이션 사용 여부"
    )

    # API
    API_HOST: str = Field(default="0.0.0.0", description="API 호스트")
    API_PORT: int = Field(default=8000, description="API 포트")
    API_SECRET_KEY: str = Field(
        default="your-secret-key-change-in-production",
        description="API 시크릿 키",
    )

    # ML Model
    ML_MODEL_PATH: str = Field(
        default="models/ensemble_model.joblib",
        description="학습된 모델 경로",
    )
    ML_PREDICTION_THRESHOLD: float = Field(
        default=0.5, description="합격 예측 임계값"
    )

    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = Field(
        default=100, description="분당 최대 요청 수"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """설정 싱글톤 반환"""
    return Settings()


# 크롤링 대상 설정
CRAWL_TARGETS = {
    "adiga": {
        "name": "어디가",
        "base_url": "https://adiga.kr",
        "competition_url": "https://adiga.kr/PageCntnts/PsgEfrt/PsgCompRate.do",
        "enabled": True,
        "priority": 1,
    },
    "jinhak": {
        "name": "진학사",
        "base_url": "https://www.jinhak.com",
        "mock_apply_url": "https://www.jinhak.com/MoService",
        "enabled": True,
        "priority": 2,
    },
    "uway": {
        "name": "유웨이",
        "base_url": "https://www.uway.com",
        "mock_apply_url": "https://www.uway.com/jungsi",
        "enabled": True,
        "priority": 3,
    },
}

# 대학 티어 분류
UNIVERSITY_TIERS = {
    "sky": ["서울대학교", "연세대학교", "고려대학교"],
    "top10": [
        "성균관대학교", "한양대학교", "서강대학교",
        "중앙대학교", "경희대학교", "한국외국어대학교", "이화여자대학교"
    ],
    "in_seoul": [
        "건국대학교", "동국대학교", "홍익대학교", "국민대학교",
        "숭실대학교", "세종대학교", "단국대학교", "광운대학교"
    ],
}

# 인기 학과 분류
POPULAR_DEPARTMENTS = {
    "의약": ["의예과", "치의예과", "한의예과", "약학과", "수의예과"],
    "경영경제": ["경영학과", "경제학과", "국제통상학과"],
    "공학": ["컴퓨터공학과", "전자공학과", "기계공학과", "화학공학과"],
    "자연과학": ["수학과", "물리학과", "화학과", "생명과학과"],
    "AI": ["인공지능학과", "AI융합학부", "데이터사이언스학과"],
}
