"""
기본 크롤러 클래스
모든 크롤러의 베이스 클래스
"""
from abc import ABC, abstractmethod
from typing import Optional, Dict, List, Any
from datetime import datetime
import asyncio
import random

import httpx
from playwright.async_api import async_playwright, Browser, Page
from fake_useragent import UserAgent
from tenacity import retry, stop_after_attempt, wait_exponential

from src.utils.logger import log


class BaseCrawler(ABC):
    """
    기본 크롤러 추상 클래스

    모든 크롤러는 이 클래스를 상속받아 구현합니다.
    - 동적 페이지: Playwright 사용
    - 정적 페이지: httpx 사용
    """

    def __init__(
        self,
        name: str,
        base_url: str,
        use_playwright: bool = True,
        proxy: Optional[str] = None,
        timeout: int = 30000,
    ):
        self.name = name
        self.base_url = base_url
        self.use_playwright = use_playwright
        self.proxy = proxy
        self.timeout = timeout
        self.ua = UserAgent()

        # Playwright 관련
        self._browser: Optional[Browser] = None
        self._playwright = None

        # HTTP 클라이언트
        self._http_client: Optional[httpx.AsyncClient] = None

        # 상태
        self.is_initialized = False
        self.last_crawl_time: Optional[datetime] = None
        self.crawl_count = 0
        self.error_count = 0

    async def initialize(self):
        """크롤러 초기화"""
        if self.is_initialized:
            return

        log.info(f"[{self.name}] 크롤러 초기화 중...")

        if self.use_playwright:
            self._playwright = await async_playwright().start()
            launch_options = {
                "headless": True,
                "args": [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--disable-gpu",
                ],
            }
            if self.proxy:
                launch_options["proxy"] = {"server": self.proxy}

            self._browser = await self._playwright.chromium.launch(**launch_options)
            log.info(f"[{self.name}] Playwright 브라우저 시작됨")

        # HTTP 클라이언트 초기화
        self._http_client = httpx.AsyncClient(
            timeout=self.timeout / 1000,
            follow_redirects=True,
            headers={"User-Agent": self.ua.random},
        )

        self.is_initialized = True
        log.info(f"[{self.name}] 크롤러 초기화 완료")

    async def close(self):
        """크롤러 종료"""
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()
        if self._http_client:
            await self._http_client.aclose()

        self.is_initialized = False
        log.info(f"[{self.name}] 크롤러 종료됨")

    async def _get_page(self) -> Page:
        """새 페이지 생성"""
        if not self._browser:
            raise RuntimeError("브라우저가 초기화되지 않았습니다.")

        context = await self._browser.new_context(
            user_agent=self.ua.random,
            viewport={"width": 1920, "height": 1080},
            locale="ko-KR",
        )
        page = await context.new_page()
        page.set_default_timeout(self.timeout)
        return page

    async def _random_delay(self, min_sec: float = 1.0, max_sec: float = 3.0):
        """랜덤 딜레이 (봇 감지 방지)"""
        delay = random.uniform(min_sec, max_sec)
        await asyncio.sleep(delay)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def _fetch_with_retry(self, url: str, method: str = "GET", **kwargs) -> httpx.Response:
        """재시도 로직이 포함된 HTTP 요청"""
        if not self._http_client:
            raise RuntimeError("HTTP 클라이언트가 초기화되지 않았습니다.")

        response = await self._http_client.request(method, url, **kwargs)
        response.raise_for_status()
        return response

    @abstractmethod
    async def crawl_competition_rates(
        self,
        year: int,
        admission_type: str = "정시",
    ) -> List[Dict[str, Any]]:
        """
        경쟁률 크롤링 (추상 메서드)

        Args:
            year: 입시 연도
            admission_type: 전형 유형 (정시/수시)

        Returns:
            경쟁률 데이터 리스트
            [
                {
                    "university": "서울대학교",
                    "department": "경영학과",
                    "admission_type": "정시",
                    "selection_type": "가군",
                    "quota": 30,
                    "applicants": 450,
                    "competition_rate": 15.0,
                    "crawled_at": datetime
                },
                ...
            ]
        """
        pass

    @abstractmethod
    async def crawl_mock_applications(
        self,
        year: int,
    ) -> List[Dict[str, Any]]:
        """
        모의지원 현황 크롤링 (추상 메서드)

        Args:
            year: 입시 연도

        Returns:
            모의지원 데이터 리스트
        """
        pass

    async def run(self, year: int) -> Dict[str, Any]:
        """
        크롤러 실행

        Args:
            year: 입시 연도

        Returns:
            크롤링 결과
        """
        try:
            if not self.is_initialized:
                await self.initialize()

            log.info(f"[{self.name}] 크롤링 시작 - {year}년도")
            start_time = datetime.now()

            # 경쟁률 크롤링
            competition_data = await self.crawl_competition_rates(year)
            await self._random_delay()

            # 모의지원 크롤링
            mock_data = await self.crawl_mock_applications(year)

            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()

            self.last_crawl_time = end_time
            self.crawl_count += 1

            result = {
                "source": self.name,
                "year": year,
                "crawled_at": end_time.isoformat(),
                "duration_seconds": duration,
                "competition_rates": competition_data,
                "mock_applications": mock_data,
                "stats": {
                    "competition_count": len(competition_data),
                    "mock_count": len(mock_data),
                },
            }

            log.info(
                f"[{self.name}] 크롤링 완료 - "
                f"경쟁률: {len(competition_data)}건, "
                f"모의지원: {len(mock_data)}건, "
                f"소요시간: {duration:.2f}초"
            )

            return result

        except Exception as e:
            self.error_count += 1
            log.error(f"[{self.name}] 크롤링 실패: {e}")
            raise

    def get_status(self) -> Dict[str, Any]:
        """크롤러 상태 반환"""
        return {
            "name": self.name,
            "is_initialized": self.is_initialized,
            "last_crawl_time": self.last_crawl_time.isoformat() if self.last_crawl_time else None,
            "crawl_count": self.crawl_count,
            "error_count": self.error_count,
        }
