"""
크롤러 매니저
모든 크롤러를 통합 관리하고 스케줄링합니다.
"""
from typing import Dict, List, Any, Optional, Type
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import json
from pathlib import Path

from .base_crawler import BaseCrawler
from .adiga_crawler import AdigaCrawler
from .jinhak_crawler import JinhakCrawler
from .uway_crawler import UwayCrawler
from src.utils.logger import log


class CrawlMode(Enum):
    """크롤링 모드"""
    NORMAL = "normal"           # 평상시 (하루 1회)
    APPLICATION = "application"  # 지원 기간 (1시간마다)
    FINAL = "final"             # 마감 직전 (10분마다)


class CrawlerManager:
    """
    크롤러 매니저

    모든 크롤러를 통합 관리하고, 스케줄에 따라 실행합니다.
    """

    def __init__(self, data_dir: str = "data/raw"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)

        # 크롤러 인스턴스
        self.crawlers: Dict[str, BaseCrawler] = {
            "adiga": AdigaCrawler(),
            "jinhak": JinhakCrawler(),
            "uway": UwayCrawler(),
        }

        # 크롤링 모드
        self.mode = CrawlMode.NORMAL

        # 스케줄 설정 (초 단위)
        self.intervals = {
            CrawlMode.NORMAL: 3600 * 24,    # 24시간
            CrawlMode.APPLICATION: 3600,     # 1시간
            CrawlMode.FINAL: 600,            # 10분
        }

        # 상태
        self.is_running = False
        self.last_crawl_results: Dict[str, Any] = {}

    async def initialize(self):
        """모든 크롤러 초기화"""
        log.info("크롤러 매니저 초기화 중...")

        for name, crawler in self.crawlers.items():
            try:
                await crawler.initialize()
                log.info(f"[{name}] 크롤러 초기화 완료")
            except Exception as e:
                log.error(f"[{name}] 크롤러 초기화 실패: {e}")

        log.info("크롤러 매니저 초기화 완료")

    async def close(self):
        """모든 크롤러 종료"""
        log.info("크롤러 매니저 종료 중...")

        for name, crawler in self.crawlers.items():
            try:
                await crawler.close()
            except Exception as e:
                log.error(f"[{name}] 크롤러 종료 실패: {e}")

        log.info("크롤러 매니저 종료 완료")

    def set_mode(self, mode: CrawlMode):
        """크롤링 모드 설정"""
        self.mode = mode
        log.info(f"크롤링 모드 변경: {mode.value}")

    async def crawl_all(
        self,
        year: int,
        sources: Optional[List[str]] = None,
        parallel: bool = True,
    ) -> Dict[str, Any]:
        """
        모든 크롤러 실행

        Args:
            year: 입시 연도
            sources: 크롤링할 소스 목록 (None이면 전체)
            parallel: 병렬 실행 여부

        Returns:
            통합 크롤링 결과
        """
        start_time = datetime.now()
        results = {
            "timestamp": start_time.isoformat(),
            "year": year,
            "mode": self.mode.value,
            "sources": {},
            "aggregated": {
                "total_competition_rates": 0,
                "total_mock_applications": 0,
            },
            "errors": [],
        }

        # 크롤링할 소스 결정
        target_crawlers = {}
        if sources:
            for source in sources:
                if source in self.crawlers:
                    target_crawlers[source] = self.crawlers[source]
        else:
            target_crawlers = self.crawlers

        log.info(f"크롤링 시작 - 연도: {year}, 소스: {list(target_crawlers.keys())}")

        if parallel:
            # 병렬 실행
            tasks = [
                self._crawl_with_error_handling(name, crawler, year)
                for name, crawler in target_crawlers.items()
            ]
            crawl_results = await asyncio.gather(*tasks)

            for name, result in zip(target_crawlers.keys(), crawl_results):
                if result.get("error"):
                    results["errors"].append({
                        "source": name,
                        "error": result["error"],
                    })
                else:
                    results["sources"][name] = result
        else:
            # 순차 실행
            for name, crawler in target_crawlers.items():
                result = await self._crawl_with_error_handling(name, crawler, year)
                if result.get("error"):
                    results["errors"].append({
                        "source": name,
                        "error": result["error"],
                    })
                else:
                    results["sources"][name] = result

        # 결과 집계
        for source_result in results["sources"].values():
            results["aggregated"]["total_competition_rates"] += len(
                source_result.get("competition_rates", [])
            )
            results["aggregated"]["total_mock_applications"] += len(
                source_result.get("mock_applications", [])
            )

        # 소요 시간
        end_time = datetime.now()
        results["duration_seconds"] = (end_time - start_time).total_seconds()

        # 결과 저장
        await self._save_results(results, year)

        # 상태 업데이트
        self.last_crawl_results = results

        log.info(
            f"크롤링 완료 - "
            f"경쟁률: {results['aggregated']['total_competition_rates']}건, "
            f"모의지원: {results['aggregated']['total_mock_applications']}건, "
            f"소요시간: {results['duration_seconds']:.2f}초"
        )

        return results

    async def _crawl_with_error_handling(
        self,
        name: str,
        crawler: BaseCrawler,
        year: int,
    ) -> Dict[str, Any]:
        """에러 핸들링이 포함된 크롤링"""
        try:
            return await crawler.run(year)
        except Exception as e:
            log.error(f"[{name}] 크롤링 실패: {e}")
            return {"error": str(e)}

    async def _save_results(self, results: Dict[str, Any], year: int):
        """크롤링 결과 저장"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"crawl_{year}_{timestamp}.json"
        filepath = self.data_dir / filename

        try:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            log.info(f"크롤링 결과 저장: {filepath}")
        except Exception as e:
            log.error(f"결과 저장 실패: {e}")

    async def crawl_realtime(
        self,
        year: int,
        university: str,
        department: str,
    ) -> Dict[str, Any]:
        """
        특정 학과 실시간 경쟁률 조회

        Args:
            year: 입시 연도
            university: 대학명
            department: 학과명

        Returns:
            실시간 경쟁률 데이터
        """
        results = {
            "university": university,
            "department": department,
            "year": year,
            "timestamp": datetime.now().isoformat(),
            "sources": {},
        }

        # 모든 소스에서 해당 학과 검색
        all_results = await self.crawl_all(year, parallel=True)

        for source, data in all_results["sources"].items():
            for rate in data.get("competition_rates", []):
                if (
                    rate.get("university") == university
                    and rate.get("department") == department
                ):
                    results["sources"][source] = rate

        return results

    async def run_scheduled(
        self,
        year: int,
        duration_hours: Optional[int] = None,
    ):
        """
        스케줄에 따른 자동 크롤링

        Args:
            year: 입시 연도
            duration_hours: 실행 시간 (None이면 무한)
        """
        self.is_running = True
        start_time = datetime.now()
        iteration = 0

        log.info(f"스케줄 크롤링 시작 - 모드: {self.mode.value}")

        try:
            while self.is_running:
                iteration += 1
                log.info(f"스케줄 크롤링 #{iteration}")

                # 크롤링 실행
                await self.crawl_all(year)

                # 다음 실행까지 대기
                interval = self.intervals[self.mode]
                log.info(f"다음 크롤링까지 {interval}초 대기")

                # 종료 조건 확인
                if duration_hours:
                    elapsed = (datetime.now() - start_time).total_seconds() / 3600
                    if elapsed >= duration_hours:
                        log.info(f"지정된 시간({duration_hours}시간) 경과, 종료")
                        break

                await asyncio.sleep(interval)

        except asyncio.CancelledError:
            log.info("스케줄 크롤링 취소됨")
        finally:
            self.is_running = False

    def stop(self):
        """스케줄 크롤링 중지"""
        self.is_running = False
        log.info("스케줄 크롤링 중지 요청됨")

    def get_status(self) -> Dict[str, Any]:
        """매니저 상태 조회"""
        crawler_status = {}
        for name, crawler in self.crawlers.items():
            crawler_status[name] = crawler.get_status()

        return {
            "mode": self.mode.value,
            "is_running": self.is_running,
            "crawlers": crawler_status,
            "last_crawl": self.last_crawl_results.get("timestamp"),
        }

    async def get_aggregated_data(
        self,
        year: int,
        university: Optional[str] = None,
        department: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        저장된 크롤링 데이터 집계

        Args:
            year: 입시 연도
            university: 대학명 필터
            department: 학과명 필터

        Returns:
            집계된 경쟁률 데이터
        """
        aggregated = []

        # 저장된 파일들 읽기
        pattern = f"crawl_{year}_*.json"
        files = sorted(self.data_dir.glob(pattern), reverse=True)

        if not files:
            log.warning(f"저장된 데이터 없음: {year}년")
            return aggregated

        # 가장 최근 파일 읽기
        latest_file = files[0]
        with open(latest_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        # 데이터 집계
        seen = set()
        for source, source_data in data.get("sources", {}).items():
            for rate in source_data.get("competition_rates", []):
                # 필터 적용
                if university and rate.get("university") != university:
                    continue
                if department and rate.get("department") != department:
                    continue

                # 중복 제거 (대학+학과 기준)
                key = f"{rate.get('university')}_{rate.get('department')}"
                if key not in seen:
                    seen.add(key)
                    aggregated.append(rate)

        return aggregated


# 편의 함수
async def quick_crawl(year: int = 2025) -> Dict[str, Any]:
    """빠른 크롤링 실행"""
    manager = CrawlerManager()
    try:
        await manager.initialize()
        return await manager.crawl_all(year)
    finally:
        await manager.close()


# 테스트용 코드
async def test_crawler_manager():
    """크롤러 매니저 테스트"""
    manager = CrawlerManager()
    try:
        await manager.initialize()

        # 전체 크롤링
        result = await manager.crawl_all(2025)
        print(f"총 경쟁률 데이터: {result['aggregated']['total_competition_rates']}건")
        print(f"총 모의지원 데이터: {result['aggregated']['total_mock_applications']}건")

        # 상태 확인
        status = manager.get_status()
        print(f"매니저 상태: {status}")

    finally:
        await manager.close()


if __name__ == "__main__":
    asyncio.run(test_crawler_manager())
