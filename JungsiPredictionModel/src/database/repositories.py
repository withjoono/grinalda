"""
데이터베이스 리포지토리 (CRUD 연산)
"""
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from decimal import Decimal

from sqlalchemy import select, and_, or_, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import (
    University, Department, CompetitionRate, DailyCompetitionHistory,
    MockApplication, HistoricalAdmission, StudentScore, Prediction,
    NewsArticle, CommunityPost
)
from src.utils.logger import log


class UniversityRepository:
    """대학 리포지토리"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, university_id: int) -> Optional[University]:
        """ID로 대학 조회"""
        result = await self.session.execute(
            select(University).where(University.id == university_id)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Optional[University]:
        """이름으로 대학 조회"""
        result = await self.session.execute(
            select(University).where(University.name == name)
        )
        return result.scalar_one_or_none()

    async def get_by_code(self, code: str) -> Optional[University]:
        """코드로 대학 조회"""
        result = await self.session.execute(
            select(University).where(University.code == code)
        )
        return result.scalar_one_or_none()

    async def get_all(self, tier: Optional[str] = None) -> List[University]:
        """전체 대학 조회"""
        query = select(University)
        if tier:
            query = query.where(University.tier == tier)
        query = query.order_by(University.name)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def create(self, **kwargs) -> University:
        """대학 생성"""
        university = University(**kwargs)
        self.session.add(university)
        await self.session.flush()
        return university

    async def get_or_create(self, name: str, **kwargs) -> University:
        """대학 조회 또는 생성"""
        university = await self.get_by_name(name)
        if not university:
            kwargs["name"] = name
            if "code" not in kwargs:
                kwargs["code"] = name.replace(" ", "_")
            university = await self.create(**kwargs)
        return university


class DepartmentRepository:
    """학과 리포지토리"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, department_id: int) -> Optional[Department]:
        """ID로 학과 조회"""
        result = await self.session.execute(
            select(Department)
            .options(selectinload(Department.university))
            .where(Department.id == department_id)
        )
        return result.scalar_one_or_none()

    async def get_by_university_and_name(
        self, university_id: int, name: str
    ) -> Optional[Department]:
        """대학ID와 이름으로 학과 조회"""
        result = await self.session.execute(
            select(Department).where(
                and_(
                    Department.university_id == university_id,
                    Department.name == name
                )
            )
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        keyword: str,
        university_id: Optional[int] = None,
        category: Optional[str] = None,
        limit: int = 50,
    ) -> List[Department]:
        """학과 검색"""
        query = (
            select(Department)
            .options(selectinload(Department.university))
            .where(Department.name.ilike(f"%{keyword}%"))
        )
        if university_id:
            query = query.where(Department.university_id == university_id)
        if category:
            query = query.where(Department.category == category)
        query = query.limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def create(self, **kwargs) -> Department:
        """학과 생성"""
        department = Department(**kwargs)
        self.session.add(department)
        await self.session.flush()
        return department

    async def get_or_create(
        self, university_id: int, name: str, **kwargs
    ) -> Department:
        """학과 조회 또는 생성"""
        department = await self.get_by_university_and_name(university_id, name)
        if not department:
            kwargs["university_id"] = university_id
            kwargs["name"] = name
            department = await self.create(**kwargs)
        return department


class CompetitionRateRepository:
    """경쟁률 리포지토리"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_latest(
        self,
        department_id: int,
        year: int,
        admission_type: str = "정시",
    ) -> Optional[CompetitionRate]:
        """최신 경쟁률 조회"""
        result = await self.session.execute(
            select(CompetitionRate)
            .where(
                and_(
                    CompetitionRate.department_id == department_id,
                    CompetitionRate.year == year,
                    CompetitionRate.admission_type == admission_type,
                )
            )
            .order_by(desc(CompetitionRate.crawled_at))
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def get_by_date_range(
        self,
        department_id: int,
        year: int,
        start_date: datetime,
        end_date: datetime,
    ) -> List[CompetitionRate]:
        """기간별 경쟁률 조회"""
        result = await self.session.execute(
            select(CompetitionRate)
            .where(
                and_(
                    CompetitionRate.department_id == department_id,
                    CompetitionRate.year == year,
                    CompetitionRate.crawled_at >= start_date,
                    CompetitionRate.crawled_at <= end_date,
                )
            )
            .order_by(CompetitionRate.crawled_at)
        )
        return list(result.scalars().all())

    async def create(self, **kwargs) -> CompetitionRate:
        """경쟁률 데이터 생성"""
        rate = CompetitionRate(**kwargs)
        self.session.add(rate)
        await self.session.flush()
        return rate

    async def bulk_create(self, data_list: List[Dict[str, Any]]) -> int:
        """경쟁률 데이터 일괄 생성"""
        rates = [CompetitionRate(**data) for data in data_list]
        self.session.add_all(rates)
        await self.session.flush()
        return len(rates)

    async def get_aggregated_by_university(
        self,
        year: int,
        admission_type: str = "정시",
    ) -> List[Dict[str, Any]]:
        """대학별 경쟁률 집계"""
        result = await self.session.execute(
            select(
                University.name.label("university"),
                func.count(CompetitionRate.id).label("dept_count"),
                func.avg(CompetitionRate.competition_rate).label("avg_rate"),
                func.sum(CompetitionRate.applicants).label("total_applicants"),
            )
            .join(Department, Department.id == CompetitionRate.department_id)
            .join(University, University.id == Department.university_id)
            .where(
                and_(
                    CompetitionRate.year == year,
                    CompetitionRate.admission_type == admission_type,
                )
            )
            .group_by(University.id, University.name)
            .order_by(desc(func.avg(CompetitionRate.competition_rate)))
        )
        return [dict(row._mapping) for row in result.all()]


class DailyCompetitionHistoryRepository:
    """날짜별 경쟁률 기록 리포지토리"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_history(
        self,
        department_id: int,
        year: int,
    ) -> List[DailyCompetitionHistory]:
        """경쟁률 변화 기록 조회"""
        result = await self.session.execute(
            select(DailyCompetitionHistory)
            .where(
                and_(
                    DailyCompetitionHistory.department_id == department_id,
                    DailyCompetitionHistory.year == year,
                )
            )
            .order_by(DailyCompetitionHistory.record_date)
        )
        return list(result.scalars().all())

    async def get_same_time_last_year(
        self,
        department_id: int,
        year: int,
        day_index: int,
        hour: int,
    ) -> Optional[DailyCompetitionHistory]:
        """작년 같은 시점 데이터 조회"""
        result = await self.session.execute(
            select(DailyCompetitionHistory)
            .where(
                and_(
                    DailyCompetitionHistory.department_id == department_id,
                    DailyCompetitionHistory.year == year - 1,
                    DailyCompetitionHistory.day_index == day_index,
                    DailyCompetitionHistory.hour == hour,
                )
            )
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> DailyCompetitionHistory:
        """기록 생성"""
        history = DailyCompetitionHistory(**kwargs)
        self.session.add(history)
        await self.session.flush()
        return history


class HistoricalAdmissionRepository:
    """과거 합격 데이터 리포지토리"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_department(
        self,
        department_id: int,
        years: Optional[int] = 5,
    ) -> List[HistoricalAdmission]:
        """학과별 과거 데이터 조회"""
        query = (
            select(HistoricalAdmission)
            .where(HistoricalAdmission.department_id == department_id)
            .order_by(desc(HistoricalAdmission.year))
        )
        if years:
            query = query.limit(years)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_average_stats(
        self,
        department_id: int,
        years: int = 5,
    ) -> Dict[str, Any]:
        """과거 평균 통계"""
        result = await self.session.execute(
            select(
                func.avg(HistoricalAdmission.final_competition_rate).label("avg_rate"),
                func.avg(HistoricalAdmission.cutoff_score).label("avg_cutoff"),
                func.avg(HistoricalAdmission.chungwon_rate).label("avg_chungwon"),
                func.min(HistoricalAdmission.cutoff_score).label("min_cutoff"),
                func.max(HistoricalAdmission.cutoff_score).label("max_cutoff"),
            )
            .where(HistoricalAdmission.department_id == department_id)
            .order_by(desc(HistoricalAdmission.year))
            .limit(years)
        )
        row = result.first()
        return dict(row._mapping) if row else {}

    async def create(self, **kwargs) -> HistoricalAdmission:
        """데이터 생성"""
        admission = HistoricalAdmission(**kwargs)
        self.session.add(admission)
        await self.session.flush()
        return admission


class StudentScoreRepository:
    """학생 성적 리포지토리"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_session(self, session_id: str) -> Optional[StudentScore]:
        """세션 ID로 조회"""
        result = await self.session.execute(
            select(StudentScore)
            .where(StudentScore.session_id == session_id)
            .order_by(desc(StudentScore.created_at))
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> StudentScore:
        """성적 데이터 생성"""
        score = StudentScore(**kwargs)
        self.session.add(score)
        await self.session.flush()
        return score

    async def update(
        self, score_id: int, **kwargs
    ) -> Optional[StudentScore]:
        """성적 데이터 업데이트"""
        result = await self.session.execute(
            select(StudentScore).where(StudentScore.id == score_id)
        )
        score = result.scalar_one_or_none()
        if score:
            for key, value in kwargs.items():
                setattr(score, key, value)
            await self.session.flush()
        return score


class PredictionRepository:
    """예측 결과 리포지토리"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_student_score(
        self, student_score_id: int
    ) -> List[Prediction]:
        """학생 성적별 예측 조회"""
        result = await self.session.execute(
            select(Prediction)
            .where(Prediction.student_score_id == student_score_id)
            .order_by(desc(Prediction.probability))
        )
        return list(result.scalars().all())

    async def create(self, **kwargs) -> Prediction:
        """예측 결과 생성"""
        prediction = Prediction(**kwargs)
        self.session.add(prediction)
        await self.session.flush()
        return prediction

    async def bulk_create(self, predictions: List[Dict[str, Any]]) -> int:
        """예측 결과 일괄 생성"""
        objs = [Prediction(**p) for p in predictions]
        self.session.add_all(objs)
        await self.session.flush()
        return len(objs)


class NewsArticleRepository:
    """뉴스 기사 리포지토리"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_recent(
        self,
        days: int = 7,
        limit: int = 100,
    ) -> List[NewsArticle]:
        """최근 뉴스 조회"""
        since = datetime.now() - timedelta(days=days)
        result = await self.session.execute(
            select(NewsArticle)
            .where(NewsArticle.published_at >= since)
            .order_by(desc(NewsArticle.published_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_not_embedded(self, limit: int = 100) -> List[NewsArticle]:
        """임베딩 안 된 뉴스 조회"""
        result = await self.session.execute(
            select(NewsArticle)
            .where(NewsArticle.is_embedded == False)
            .order_by(desc(NewsArticle.published_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, **kwargs) -> NewsArticle:
        """뉴스 생성"""
        article = NewsArticle(**kwargs)
        self.session.add(article)
        await self.session.flush()
        return article

    async def mark_embedded(self, article_id: int, embedding_id: str):
        """임베딩 완료 표시"""
        result = await self.session.execute(
            select(NewsArticle).where(NewsArticle.id == article_id)
        )
        article = result.scalar_one_or_none()
        if article:
            article.is_embedded = True
            article.embedding_id = embedding_id
            await self.session.flush()


class CommunityPostRepository:
    """커뮤니티 게시글 리포지토리"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_recent(
        self,
        source: Optional[str] = None,
        days: int = 7,
        limit: int = 100,
    ) -> List[CommunityPost]:
        """최근 게시글 조회"""
        since = datetime.now() - timedelta(days=days)
        query = select(CommunityPost).where(CommunityPost.posted_at >= since)
        if source:
            query = query.where(CommunityPost.source == source)
        query = query.order_by(desc(CommunityPost.posted_at)).limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def search_by_keywords(
        self,
        keywords: List[str],
        limit: int = 50,
    ) -> List[CommunityPost]:
        """키워드로 게시글 검색"""
        conditions = [
            CommunityPost.title.ilike(f"%{kw}%") |
            CommunityPost.content.ilike(f"%{kw}%")
            for kw in keywords
        ]
        result = await self.session.execute(
            select(CommunityPost)
            .where(or_(*conditions))
            .order_by(desc(CommunityPost.posted_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, **kwargs) -> CommunityPost:
        """게시글 생성"""
        post = CommunityPost(**kwargs)
        self.session.add(post)
        await self.session.flush()
        return post

    async def get_not_embedded(self, limit: int = 100) -> List[CommunityPost]:
        """임베딩 안 된 게시글 조회"""
        result = await self.session.execute(
            select(CommunityPost)
            .where(CommunityPost.is_embedded == False)
            .order_by(desc(CommunityPost.posted_at))
            .limit(limit)
        )
        return list(result.scalars().all())
