"""
데이터베이스 모델 정의
정시 합격 예측 시스템의 핵심 테이블
"""
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text,
    ForeignKey, Index, UniqueConstraint, Numeric, JSON, Enum as SQLEnum
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func

from .connection import Base


class University(Base):
    """대학교 정보"""
    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, comment="대학 코드")
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="대학명")
    english_name: Mapped[Optional[str]] = mapped_column(String(200), comment="영문명")
    region: Mapped[Optional[str]] = mapped_column(String(50), comment="지역")
    tier: Mapped[Optional[str]] = mapped_column(String(20), comment="티어 (sky/top10/in_seoul/etc)")
    university_type: Mapped[Optional[str]] = mapped_column(String(20), comment="유형 (4년제/전문대)")
    is_national: Mapped[bool] = mapped_column(Boolean, default=False, comment="국공립 여부")
    website: Mapped[Optional[str]] = mapped_column(String(200), comment="홈페이지")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # 관계
    departments: Mapped[List["Department"]] = relationship("Department", back_populates="university")

    __table_args__ = (
        Index("ix_universities_name", "name"),
        Index("ix_universities_tier", "tier"),
    )


class Department(Base):
    """학과/모집단위 정보"""
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    university_id: Mapped[int] = mapped_column(Integer, ForeignKey("universities.id"), nullable=False)
    code: Mapped[Optional[str]] = mapped_column(String(50), comment="학과 코드")
    name: Mapped[str] = mapped_column(String(200), nullable=False, comment="학과명")
    college: Mapped[Optional[str]] = mapped_column(String(100), comment="단과대학")
    category: Mapped[Optional[str]] = mapped_column(String(50), comment="계열 (인문/자연/예체능)")
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False, comment="인기학과 여부")
    keywords: Mapped[Optional[str]] = mapped_column(Text, comment="키워드 (검색용)")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # 관계
    university: Mapped["University"] = relationship("University", back_populates="departments")
    competition_rates: Mapped[List["CompetitionRate"]] = relationship("CompetitionRate", back_populates="department")
    historical_admissions: Mapped[List["HistoricalAdmission"]] = relationship("HistoricalAdmission", back_populates="department")

    __table_args__ = (
        UniqueConstraint("university_id", "name", name="uq_department_univ_name"),
        Index("ix_departments_name", "name"),
        Index("ix_departments_category", "category"),
    )


class CompetitionRate(Base):
    """실시간 경쟁률 데이터"""
    __tablename__ = "competition_rates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[int] = mapped_column(Integer, ForeignKey("departments.id"), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False, comment="입시 연도")
    admission_type: Mapped[str] = mapped_column(String(20), nullable=False, comment="전형 (정시/수시)")
    selection_type: Mapped[Optional[str]] = mapped_column(String(20), comment="군 (가군/나군/다군)")

    quota: Mapped[int] = mapped_column(Integer, nullable=False, comment="모집인원")
    applicants: Mapped[int] = mapped_column(Integer, default=0, comment="지원자수")
    competition_rate: Mapped[float] = mapped_column(Numeric(10, 2), default=0, comment="경쟁률")

    source: Mapped[str] = mapped_column(String(50), nullable=False, comment="데이터 소스")
    data_type: Mapped[str] = mapped_column(String(20), default="공식", comment="데이터 유형 (공식/모의지원)")
    crawled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="크롤링 시각")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # 관계
    department: Mapped["Department"] = relationship("Department", back_populates="competition_rates")

    __table_args__ = (
        Index("ix_competition_rates_year", "year"),
        Index("ix_competition_rates_crawled_at", "crawled_at"),
        Index("ix_competition_rates_dept_year", "department_id", "year"),
    )


class DailyCompetitionHistory(Base):
    """날짜별/시간별 경쟁률 변화 기록"""
    __tablename__ = "daily_competition_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[int] = mapped_column(Integer, ForeignKey("departments.id"), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False, comment="입시 연도")
    admission_type: Mapped[str] = mapped_column(String(20), nullable=False, comment="전형")

    record_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="기록 일시")
    day_index: Mapped[int] = mapped_column(Integer, comment="지원 시작일로부터 n일차")
    hour: Mapped[int] = mapped_column(Integer, comment="시간대 (0-23)")

    applicants: Mapped[int] = mapped_column(Integer, default=0, comment="지원자수")
    competition_rate: Mapped[float] = mapped_column(Numeric(10, 2), default=0, comment="경쟁률")
    rate_change_1h: Mapped[Optional[float]] = mapped_column(Numeric(10, 4), comment="1시간 대비 변화율")
    rate_change_24h: Mapped[Optional[float]] = mapped_column(Numeric(10, 4), comment="24시간 대비 변화율")
    rate_vs_last_year: Mapped[Optional[float]] = mapped_column(Numeric(10, 4), comment="작년 동시각 대비")

    source: Mapped[str] = mapped_column(String(50), nullable=False, comment="데이터 소스")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        Index("ix_daily_history_dept_year", "department_id", "year"),
        Index("ix_daily_history_record_date", "record_date"),
        Index("ix_daily_history_day_hour", "day_index", "hour"),
    )


class MockApplication(Base):
    """모의지원 데이터 (진학사/유웨이)"""
    __tablename__ = "mock_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[int] = mapped_column(Integer, ForeignKey("departments.id"), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False, comment="입시 연도")

    source: Mapped[str] = mapped_column(String(50), nullable=False, comment="데이터 소스")
    applicants: Mapped[int] = mapped_column(Integer, default=0, comment="모의지원자수")
    competition_rate: Mapped[float] = mapped_column(Numeric(10, 2), default=0, comment="경쟁률")

    # 성적 구간별 분포
    score_distribution: Mapped[Optional[dict]] = mapped_column(JSON, comment="성적 구간별 지원자 분포")
    predicted_cutoff: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="예상 합격선")
    predicted_safe_score: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="안전 지원 점수")

    crawled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="크롤링 시각")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        Index("ix_mock_applications_dept_year", "department_id", "year"),
        Index("ix_mock_applications_source", "source"),
    )


class HistoricalAdmission(Base):
    """과거 합격 데이터 (10년치)"""
    __tablename__ = "historical_admissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[int] = mapped_column(Integer, ForeignKey("departments.id"), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False, comment="입시 연도")
    admission_type: Mapped[str] = mapped_column(String(20), nullable=False, comment="전형")
    selection_type: Mapped[Optional[str]] = mapped_column(String(20), comment="군")

    quota: Mapped[int] = mapped_column(Integer, comment="모집인원")
    applicants: Mapped[int] = mapped_column(Integer, comment="지원자수")
    final_competition_rate: Mapped[float] = mapped_column(Numeric(10, 2), comment="최종 경쟁률")

    # 합격선 정보
    cutoff_score: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="합격 커트라인 (환산점수)")
    cutoff_percentile: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), comment="합격 커트라인 (백분위)")
    average_score: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="합격자 평균 점수")
    highest_score: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="합격자 최고 점수")
    lowest_score: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="합격자 최저 점수")

    # 충원 정보
    chungwon_count: Mapped[Optional[int]] = mapped_column(Integer, comment="충원 인원")
    chungwon_rate: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), comment="충원율 (%)")
    final_chungwon_score: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="최종 충원 합격 점수")

    source: Mapped[str] = mapped_column(String(50), comment="데이터 소스")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # 관계
    department: Mapped["Department"] = relationship("Department", back_populates="historical_admissions")

    __table_args__ = (
        UniqueConstraint("department_id", "year", "admission_type", name="uq_historical_dept_year_type"),
        Index("ix_historical_year", "year"),
        Index("ix_historical_cutoff", "cutoff_score"),
    )


class StudentScore(Base):
    """학생 성적 데이터"""
    __tablename__ = "student_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[str]] = mapped_column(String(100), comment="사용자 ID (익명)")
    session_id: Mapped[str] = mapped_column(String(100), nullable=False, comment="세션 ID")

    year: Mapped[int] = mapped_column(Integer, nullable=False, comment="수능 연도")

    # 국어
    korean_raw: Mapped[Optional[int]] = mapped_column(Integer, comment="국어 원점수")
    korean_standard: Mapped[Optional[int]] = mapped_column(Integer, comment="국어 표준점수")
    korean_percentile: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), comment="국어 백분위")
    korean_grade: Mapped[Optional[int]] = mapped_column(Integer, comment="국어 등급")

    # 수학
    math_type: Mapped[Optional[str]] = mapped_column(String(20), comment="수학 유형 (미적/기하/확통)")
    math_raw: Mapped[Optional[int]] = mapped_column(Integer, comment="수학 원점수")
    math_standard: Mapped[Optional[int]] = mapped_column(Integer, comment="수학 표준점수")
    math_percentile: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), comment="수학 백분위")
    math_grade: Mapped[Optional[int]] = mapped_column(Integer, comment="수학 등급")

    # 영어
    english_grade: Mapped[Optional[int]] = mapped_column(Integer, comment="영어 등급")

    # 탐구1
    inquiry1_subject: Mapped[Optional[str]] = mapped_column(String(50), comment="탐구1 과목")
    inquiry1_raw: Mapped[Optional[int]] = mapped_column(Integer, comment="탐구1 원점수")
    inquiry1_standard: Mapped[Optional[int]] = mapped_column(Integer, comment="탐구1 표준점수")
    inquiry1_percentile: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), comment="탐구1 백분위")
    inquiry1_grade: Mapped[Optional[int]] = mapped_column(Integer, comment="탐구1 등급")

    # 탐구2
    inquiry2_subject: Mapped[Optional[str]] = mapped_column(String(50), comment="탐구2 과목")
    inquiry2_raw: Mapped[Optional[int]] = mapped_column(Integer, comment="탐구2 원점수")
    inquiry2_standard: Mapped[Optional[int]] = mapped_column(Integer, comment="탐구2 표준점수")
    inquiry2_percentile: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), comment="탐구2 백분위")
    inquiry2_grade: Mapped[Optional[int]] = mapped_column(Integer, comment="탐구2 등급")

    # 제2외국어/한문
    foreign_subject: Mapped[Optional[str]] = mapped_column(String(50), comment="제2외국어 과목")
    foreign_percentile: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), comment="제2외국어 백분위")
    foreign_grade: Mapped[Optional[int]] = mapped_column(Integer, comment="제2외국어 등급")

    # 총점 (환산)
    total_standard: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="총 환산 점수")
    total_percentile: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), comment="총 백분위")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("ix_student_scores_session", "session_id"),
        Index("ix_student_scores_year", "year"),
    )


class Prediction(Base):
    """합격 예측 결과"""
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_score_id: Mapped[int] = mapped_column(Integer, ForeignKey("student_scores.id"), nullable=False)
    department_id: Mapped[int] = mapped_column(Integer, ForeignKey("departments.id"), nullable=False)

    year: Mapped[int] = mapped_column(Integer, nullable=False, comment="입시 연도")
    admission_type: Mapped[str] = mapped_column(String(20), nullable=False, comment="전형")

    # 예측 결과
    probability: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False, comment="합격 확률 (0-1)")
    confidence: Mapped[float] = mapped_column(Numeric(5, 4), comment="예측 신뢰도")
    recommendation: Mapped[str] = mapped_column(String(20), comment="추천 (상향/적정/안전)")

    # 예측에 사용된 데이터
    current_competition_rate: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="현재 경쟁률")
    predicted_final_rate: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="예상 최종 경쟁률")
    predicted_cutoff: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), comment="예상 합격선")

    # 모델 정보
    model_version: Mapped[str] = mapped_column(String(50), comment="모델 버전")
    features_used: Mapped[Optional[dict]] = mapped_column(JSON, comment="사용된 피처")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        Index("ix_predictions_student", "student_score_id"),
        Index("ix_predictions_dept", "department_id"),
        Index("ix_predictions_prob", "probability"),
    )


class NewsArticle(Base):
    """뉴스 기사 (RAG용)"""
    __tablename__ = "news_articles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source: Mapped[str] = mapped_column(String(100), nullable=False, comment="출처")
    url: Mapped[str] = mapped_column(String(500), unique=True, nullable=False, comment="URL")
    title: Mapped[str] = mapped_column(String(500), nullable=False, comment="제목")
    content: Mapped[str] = mapped_column(Text, comment="본문")
    summary: Mapped[Optional[str]] = mapped_column(Text, comment="요약")

    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime, comment="발행일")
    crawled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    # 키워드 및 분류
    keywords: Mapped[Optional[List[str]]] = mapped_column(JSON, comment="키워드")
    category: Mapped[Optional[str]] = mapped_column(String(50), comment="카테고리")
    sentiment_score: Mapped[Optional[float]] = mapped_column(Numeric(3, 2), comment="감성 점수 (-1~1)")

    # 임베딩
    embedding_id: Mapped[Optional[str]] = mapped_column(String(100), comment="벡터 DB ID")
    is_embedded: Mapped[bool] = mapped_column(Boolean, default=False, comment="임베딩 완료 여부")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        Index("ix_news_published_at", "published_at"),
        Index("ix_news_source", "source"),
        Index("ix_news_is_embedded", "is_embedded"),
    )


class CommunityPost(Base):
    """커뮤니티 게시글 (RAG용)"""
    __tablename__ = "community_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source: Mapped[str] = mapped_column(String(100), nullable=False, comment="출처 (오르비/수만휘)")
    post_id: Mapped[str] = mapped_column(String(100), nullable=False, comment="원본 게시글 ID")
    url: Mapped[Optional[str]] = mapped_column(String(500), comment="URL")

    title: Mapped[str] = mapped_column(String(500), nullable=False, comment="제목")
    content: Mapped[str] = mapped_column(Text, comment="본문")

    author: Mapped[Optional[str]] = mapped_column(String(100), comment="작성자")
    view_count: Mapped[Optional[int]] = mapped_column(Integer, comment="조회수")
    comment_count: Mapped[Optional[int]] = mapped_column(Integer, comment="댓글수")
    like_count: Mapped[Optional[int]] = mapped_column(Integer, comment="좋아요")

    posted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, comment="작성일")
    crawled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    # 분석 결과
    keywords: Mapped[Optional[List[str]]] = mapped_column(JSON, comment="키워드")
    mentioned_universities: Mapped[Optional[List[str]]] = mapped_column(JSON, comment="언급된 대학")
    mentioned_departments: Mapped[Optional[List[str]]] = mapped_column(JSON, comment="언급된 학과")
    sentiment_score: Mapped[Optional[float]] = mapped_column(Numeric(3, 2), comment="감성 점수")

    # 임베딩
    embedding_id: Mapped[Optional[str]] = mapped_column(String(100), comment="벡터 DB ID")
    is_embedded: Mapped[bool] = mapped_column(Boolean, default=False, comment="임베딩 완료 여부")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("source", "post_id", name="uq_community_source_postid"),
        Index("ix_community_posted_at", "posted_at"),
        Index("ix_community_source", "source"),
        Index("ix_community_is_embedded", "is_embedded"),
    )
