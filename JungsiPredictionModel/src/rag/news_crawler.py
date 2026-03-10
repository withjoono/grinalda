"""
뉴스 크롤러
입시 관련 뉴스 수집
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import re
import asyncio

import httpx
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from src.utils.logger import log


class NewsCrawler:
    """
    입시 뉴스 크롤러

    네이버 뉴스, 조선에듀, 베리타스알파 등에서
    입시 관련 뉴스를 수집합니다.
    """

    def __init__(self):
        self.sources = {
            "naver": {
                "name": "네이버뉴스",
                "search_url": "https://search.naver.com/search.naver",
                "enabled": True,
            },
            "chosun_edu": {
                "name": "조선에듀",
                "base_url": "https://edu.chosun.com",
                "enabled": True,
            },
            "veritas": {
                "name": "베리타스알파",
                "base_url": "https://www.veritas-a.com",
                "enabled": True,
            },
            "dhnews": {
                "name": "대학저널",
                "base_url": "https://www.dhnews.co.kr",
                "enabled": True,
            },
        }

        self.keywords = [
            "정시 경쟁률", "정시 지원", "정시 모집",
            "수능 성적", "대학 입시", "합격선 예측",
            "모의지원", "배치표", "입시 전략",
        ]

        self._http_client: Optional[httpx.AsyncClient] = None

    async def initialize(self):
        """크롤러 초기화"""
        self._http_client = httpx.AsyncClient(
            timeout=30,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
        )
        log.info("뉴스 크롤러 초기화 완료")

    async def close(self):
        """크롤러 종료"""
        if self._http_client:
            await self._http_client.aclose()

    async def crawl_all(
        self,
        days: int = 7,
        max_per_source: int = 50,
    ) -> List[Dict[str, Any]]:
        """
        모든 소스에서 뉴스 크롤링

        Args:
            days: 최근 N일간 뉴스
            max_per_source: 소스당 최대 수집 수

        Returns:
            뉴스 기사 리스트
        """
        all_articles = []

        tasks = []
        for source_id, source_info in self.sources.items():
            if source_info.get("enabled"):
                tasks.append(
                    self._crawl_source(source_id, source_info, days, max_per_source)
                )

        results = await asyncio.gather(*tasks, return_exceptions=True)

        for result in results:
            if isinstance(result, list):
                all_articles.extend(result)
            elif isinstance(result, Exception):
                log.error(f"뉴스 크롤링 오류: {result}")

        log.info(f"총 {len(all_articles)}건 뉴스 수집 완료")
        return all_articles

    async def _crawl_source(
        self,
        source_id: str,
        source_info: Dict[str, Any],
        days: int,
        max_articles: int,
    ) -> List[Dict[str, Any]]:
        """개별 소스 크롤링"""
        articles = []

        try:
            if source_id == "naver":
                articles = await self._crawl_naver_news(days, max_articles)
            elif source_id == "chosun_edu":
                articles = await self._crawl_chosun_edu(days, max_articles)
            elif source_id == "veritas":
                articles = await self._crawl_veritas(days, max_articles)
            elif source_id == "dhnews":
                articles = await self._crawl_dhnews(days, max_articles)

            log.info(f"[{source_info['name']}] {len(articles)}건 수집")

        except Exception as e:
            log.error(f"[{source_info['name']}] 크롤링 실패: {e}")

        return articles

    async def _crawl_naver_news(
        self,
        days: int,
        max_articles: int,
    ) -> List[Dict[str, Any]]:
        """네이버 뉴스 검색"""
        articles = []

        for keyword in self.keywords[:3]:  # 주요 키워드만
            try:
                params = {
                    "where": "news",
                    "query": keyword,
                    "sort": "1",  # 최신순
                    "pd": "4",   # 1주일
                }

                response = await self._http_client.get(
                    self.sources["naver"]["search_url"],
                    params=params,
                )
                response.raise_for_status()

                soup = BeautifulSoup(response.text, "html.parser")

                # 뉴스 항목 파싱
                news_items = soup.select("div.news_wrap, div.news_area, li.bx")

                for item in news_items[:max_articles // len(self.keywords)]:
                    try:
                        title_elem = item.select_one("a.news_tit, a.title")
                        if not title_elem:
                            continue

                        title = title_elem.get_text(strip=True)
                        url = title_elem.get("href", "")

                        desc_elem = item.select_one("div.news_dsc, div.dsc_wrap")
                        description = desc_elem.get_text(strip=True) if desc_elem else ""

                        source_elem = item.select_one("a.info.press, span.info")
                        source = source_elem.get_text(strip=True) if source_elem else "네이버뉴스"

                        articles.append({
                            "title": title,
                            "url": url,
                            "content": description,
                            "source": source,
                            "keyword": keyword,
                            "crawled_at": datetime.now().isoformat(),
                        })

                    except Exception as e:
                        log.debug(f"뉴스 항목 파싱 실패: {e}")
                        continue

                await asyncio.sleep(0.5)  # Rate limiting

            except Exception as e:
                log.warning(f"네이버 뉴스 검색 실패 ({keyword}): {e}")

        return articles

    async def _crawl_chosun_edu(
        self,
        days: int,
        max_articles: int,
    ) -> List[Dict[str, Any]]:
        """조선에듀 크롤링"""
        articles = []
        base_url = self.sources["chosun_edu"]["base_url"]

        try:
            # 입시 섹션
            response = await self._http_client.get(f"{base_url}/category/입시")
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # 기사 목록 파싱
            article_items = soup.select("div.article-item, li.article")

            for item in article_items[:max_articles]:
                try:
                    title_elem = item.select_one("h3 a, a.title")
                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)
                    url = title_elem.get("href", "")
                    if not url.startswith("http"):
                        url = base_url + url

                    date_elem = item.select_one("span.date, time")
                    published_at = date_elem.get_text(strip=True) if date_elem else None

                    articles.append({
                        "title": title,
                        "url": url,
                        "content": "",  # 상세 페이지에서 수집 필요
                        "source": "조선에듀",
                        "published_at": published_at,
                        "crawled_at": datetime.now().isoformat(),
                    })

                except Exception as e:
                    log.debug(f"조선에듀 항목 파싱 실패: {e}")

        except Exception as e:
            log.warning(f"조선에듀 크롤링 실패: {e}")

        return articles

    async def _crawl_veritas(
        self,
        days: int,
        max_articles: int,
    ) -> List[Dict[str, Any]]:
        """베리타스알파 크롤링"""
        articles = []
        base_url = self.sources["veritas"]["base_url"]

        try:
            # 대입 섹션
            response = await self._http_client.get(f"{base_url}/news/articleList.html?sc_section_code=S1N2")
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # 기사 목록 파싱
            article_items = soup.select("div.list-block, ul.type2 li")

            for item in article_items[:max_articles]:
                try:
                    title_elem = item.select_one("a.title, h4 a")
                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)
                    url = title_elem.get("href", "")
                    if not url.startswith("http"):
                        url = base_url + url

                    summary_elem = item.select_one("p.summary, div.summary")
                    summary = summary_elem.get_text(strip=True) if summary_elem else ""

                    articles.append({
                        "title": title,
                        "url": url,
                        "content": summary,
                        "source": "베리타스알파",
                        "crawled_at": datetime.now().isoformat(),
                    })

                except Exception as e:
                    log.debug(f"베리타스 항목 파싱 실패: {e}")

        except Exception as e:
            log.warning(f"베리타스알파 크롤링 실패: {e}")

        return articles

    async def _crawl_dhnews(
        self,
        days: int,
        max_articles: int,
    ) -> List[Dict[str, Any]]:
        """대학저널 크롤링"""
        articles = []
        base_url = self.sources["dhnews"]["base_url"]

        try:
            response = await self._http_client.get(f"{base_url}/news/articleList.html?sc_section_code=S1N1")
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")
            article_items = soup.select("ul.type2 li, div.list-block")

            for item in article_items[:max_articles]:
                try:
                    title_elem = item.select_one("a")
                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)
                    url = title_elem.get("href", "")
                    if not url.startswith("http"):
                        url = base_url + url

                    articles.append({
                        "title": title,
                        "url": url,
                        "content": "",
                        "source": "대학저널",
                        "crawled_at": datetime.now().isoformat(),
                    })

                except Exception as e:
                    log.debug(f"대학저널 항목 파싱 실패: {e}")

        except Exception as e:
            log.warning(f"대학저널 크롤링 실패: {e}")

        return articles

    async def fetch_article_content(self, url: str) -> Optional[str]:
        """
        기사 상세 내용 가져오기

        Args:
            url: 기사 URL

        Returns:
            기사 본문
        """
        try:
            response = await self._http_client.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # 일반적인 본문 선택자
            content_selectors = [
                "div.article-body",
                "div.article_body",
                "div#article-body",
                "div.view_cont",
                "div.news_content",
                "article",
            ]

            for selector in content_selectors:
                content_elem = soup.select_one(selector)
                if content_elem:
                    # 불필요한 요소 제거
                    for tag in content_elem.select("script, style, iframe, .ad"):
                        tag.decompose()
                    return content_elem.get_text(strip=True)

            return None

        except Exception as e:
            log.warning(f"기사 내용 가져오기 실패 ({url}): {e}")
            return None


# 테스트
async def test_news_crawler():
    """뉴스 크롤러 테스트"""
    crawler = NewsCrawler()
    try:
        await crawler.initialize()
        articles = await crawler.crawl_all(days=3, max_per_source=10)
        print(f"수집된 뉴스: {len(articles)}건")
        for article in articles[:3]:
            print(f"- {article['title']}")
    finally:
        await crawler.close()


if __name__ == "__main__":
    asyncio.run(test_news_crawler())
