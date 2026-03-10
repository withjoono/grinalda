"""
커뮤니티 크롤러
입시 커뮤니티 게시글 수집 (오르비, 수만휘 등)
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio
import re

import httpx
from bs4 import BeautifulSoup

from src.utils.logger import log


class CommunityCrawler:
    """
    입시 커뮤니티 크롤러

    오르비, 수만휘 등 입시 커뮤니티에서
    관련 게시글을 수집합니다.
    """

    def __init__(self):
        self.sources = {
            "orbi": {
                "name": "오르비",
                "base_url": "https://orbi.kr",
                "enabled": True,
            },
            "sumanwhi": {
                "name": "수만휘",
                "base_url": "https://cafe.naver.com/suhui",
                "enabled": True,
            },
        }

        self.keywords = [
            "정시", "지원", "경쟁률", "배치", "합격", "커트",
            "모의지원", "어디가", "진학사", "유웨이",
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
        log.info("커뮤니티 크롤러 초기화 완료")

    async def close(self):
        """크롤러 종료"""
        if self._http_client:
            await self._http_client.aclose()

    async def crawl_all(
        self,
        max_per_source: int = 100,
    ) -> List[Dict[str, Any]]:
        """
        모든 소스에서 게시글 크롤링

        Args:
            max_per_source: 소스당 최대 수집 수

        Returns:
            게시글 리스트
        """
        all_posts = []

        for source_id, source_info in self.sources.items():
            if source_info.get("enabled"):
                try:
                    posts = await self._crawl_source(source_id, source_info, max_per_source)
                    all_posts.extend(posts)
                except Exception as e:
                    log.error(f"[{source_info['name']}] 크롤링 실패: {e}")

        log.info(f"총 {len(all_posts)}건 커뮤니티 게시글 수집 완료")
        return all_posts

    async def _crawl_source(
        self,
        source_id: str,
        source_info: Dict[str, Any],
        max_posts: int,
    ) -> List[Dict[str, Any]]:
        """개별 소스 크롤링"""
        posts = []

        try:
            if source_id == "orbi":
                posts = await self._crawl_orbi(max_posts)
            elif source_id == "sumanwhi":
                posts = await self._crawl_sumanwhi(max_posts)

            log.info(f"[{source_info['name']}] {len(posts)}건 수집")

        except Exception as e:
            log.error(f"[{source_info['name']}] 크롤링 오류: {e}")

        return posts

    async def _crawl_orbi(self, max_posts: int) -> List[Dict[str, Any]]:
        """오르비 크롤링"""
        posts = []
        base_url = self.sources["orbi"]["base_url"]

        # 입시 관련 게시판들
        boards = [
            "/board/united",      # 통합게시판
            "/board/question",    # 질문게시판
            "/board/counsel",     # 입시상담
        ]

        for board in boards:
            try:
                response = await self._http_client.get(f"{base_url}{board}")
                response.raise_for_status()

                soup = BeautifulSoup(response.text, "html.parser")

                # 게시글 목록 파싱
                post_items = soup.select("div.post-item, tr.post-row, li.article")

                for item in post_items[:max_posts // len(boards)]:
                    try:
                        title_elem = item.select_one("a.title, span.title")
                        if not title_elem:
                            continue

                        title = title_elem.get_text(strip=True)

                        # 입시 관련 키워드 필터링
                        if not any(kw in title for kw in self.keywords):
                            continue

                        link = title_elem.get("href", "")
                        if not link.startswith("http"):
                            link = base_url + link

                        author_elem = item.select_one("span.author, a.author")
                        author = author_elem.get_text(strip=True) if author_elem else "익명"

                        date_elem = item.select_one("span.date, time")
                        posted_at = date_elem.get_text(strip=True) if date_elem else ""

                        view_elem = item.select_one("span.view, span.hit")
                        views = self._extract_number(view_elem.get_text()) if view_elem else 0

                        posts.append({
                            "source": "오르비",
                            "board": board,
                            "title": title,
                            "url": link,
                            "author": author,
                            "posted_at": posted_at,
                            "view_count": views,
                            "crawled_at": datetime.now().isoformat(),
                        })

                    except Exception as e:
                        log.debug(f"오르비 게시글 파싱 실패: {e}")

                await asyncio.sleep(0.5)  # Rate limiting

            except Exception as e:
                log.warning(f"오르비 게시판 크롤링 실패 ({board}): {e}")

        return posts

    async def _crawl_sumanwhi(self, max_posts: int) -> List[Dict[str, Any]]:
        """
        수만휘(네이버 카페) 크롤링

        네이버 카페는 직접 크롤링이 어려워
        네이버 검색 API나 모바일 버전을 활용합니다.
        """
        posts = []

        # 네이버 카페 검색을 통한 수집
        search_url = "https://search.naver.com/search.naver"

        for keyword in self.keywords[:5]:
            try:
                params = {
                    "where": "article",
                    "query": f"site:cafe.naver.com/suhui {keyword}",
                    "sm": "tab_opt",
                    "nso": "so:dd,p:1w",  # 최신순, 1주일
                }

                response = await self._http_client.get(search_url, params=params)
                response.raise_for_status()

                soup = BeautifulSoup(response.text, "html.parser")

                # 검색 결과 파싱
                article_items = soup.select("div.total_area, li.sh_cafe_top")

                for item in article_items[:max_posts // len(self.keywords)]:
                    try:
                        title_elem = item.select_one("a.api_txt_lines, a.sh_cafe_title")
                        if not title_elem:
                            continue

                        title = title_elem.get_text(strip=True)
                        url = title_elem.get("href", "")

                        desc_elem = item.select_one("div.total_dsc, p.sh_cafe_passage")
                        description = desc_elem.get_text(strip=True) if desc_elem else ""

                        posts.append({
                            "source": "수만휘",
                            "title": title,
                            "url": url,
                            "content": description,
                            "keyword": keyword,
                            "crawled_at": datetime.now().isoformat(),
                        })

                    except Exception as e:
                        log.debug(f"수만휘 게시글 파싱 실패: {e}")

                await asyncio.sleep(0.5)

            except Exception as e:
                log.warning(f"수만휘 검색 실패 ({keyword}): {e}")

        return posts

    def _extract_number(self, text: str) -> int:
        """텍스트에서 숫자 추출"""
        if not text:
            return 0
        match = re.search(r"[\d,]+", text.replace(",", ""))
        return int(match.group()) if match else 0

    async def fetch_post_content(self, url: str) -> Optional[str]:
        """
        게시글 상세 내용 가져오기

        Args:
            url: 게시글 URL

        Returns:
            게시글 본문
        """
        try:
            response = await self._http_client.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # 본문 선택자
            content_selectors = [
                "div.post-content",
                "div.article-content",
                "div.content",
                "article",
            ]

            for selector in content_selectors:
                content_elem = soup.select_one(selector)
                if content_elem:
                    for tag in content_elem.select("script, style"):
                        tag.decompose()
                    return content_elem.get_text(strip=True)

            return None

        except Exception as e:
            log.warning(f"게시글 내용 가져오기 실패 ({url}): {e}")
            return None

    def analyze_sentiment(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        게시글 감성 분석 (간단한 키워드 기반)

        Args:
            posts: 게시글 리스트

        Returns:
            감성 분석 결과
        """
        positive_keywords = ["합격", "안전", "여유", "추천", "좋음", "가능"]
        negative_keywords = ["위험", "쏠림", "경쟁", "불안", "포기", "어려움"]

        positive_count = 0
        negative_count = 0
        neutral_count = 0

        for post in posts:
            text = post.get("title", "") + " " + post.get("content", "")

            pos = sum(1 for kw in positive_keywords if kw in text)
            neg = sum(1 for kw in negative_keywords if kw in text)

            if pos > neg:
                positive_count += 1
            elif neg > pos:
                negative_count += 1
            else:
                neutral_count += 1

        total = len(posts)
        return {
            "total_posts": total,
            "positive": positive_count,
            "negative": negative_count,
            "neutral": neutral_count,
            "sentiment_score": (positive_count - negative_count) / total if total > 0 else 0,
        }


# 테스트
async def test_community_crawler():
    """커뮤니티 크롤러 테스트"""
    crawler = CommunityCrawler()
    try:
        await crawler.initialize()
        posts = await crawler.crawl_all(max_per_source=20)
        print(f"수집된 게시글: {len(posts)}건")
        for post in posts[:5]:
            print(f"- [{post['source']}] {post['title']}")

        # 감성 분석
        sentiment = crawler.analyze_sentiment(posts)
        print(f"감성 분석: {sentiment}")

    finally:
        await crawler.close()


if __name__ == "__main__":
    asyncio.run(test_community_crawler())
