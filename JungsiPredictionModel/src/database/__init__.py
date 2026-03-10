"""데이터베이스 모듈"""
from .connection import get_db, get_async_db, engine, async_engine, Base
from .models import (
    University,
    Department,
    CompetitionRate,
    DailyCompetitionHistory,
    MockApplication,
    HistoricalAdmission,
    StudentScore,
    Prediction,
    NewsArticle,
    CommunityPost,
)

__all__ = [
    "get_db",
    "get_async_db",
    "engine",
    "async_engine",
    "Base",
    "University",
    "Department",
    "CompetitionRate",
    "DailyCompetitionHistory",
    "MockApplication",
    "HistoricalAdmission",
    "StudentScore",
    "Prediction",
    "NewsArticle",
    "CommunityPost",
]
