"""
진학사(jinhak.com) 크롤러
- 모의지원 현황 데이터 수집
- 실시간 경쟁률 및 합격 예측 데이터
"""
from typing import Dict, List, Any, Optional
from datetime import datetime
import re
import json

from bs4 import BeautifulSoup
from playwright.async_api import Page

from .base_crawler import BaseCrawler
from src.utils.logger import log


class JinhakCrawler(BaseCrawler):
    """
    진학사 크롤러

    진학사 모의지원 서비스에서 실시간
    지원 현황 및 합격 예측 데이터를 수집합니다.
    """

    def __init__(self, proxy: Optional[str] = None):
        super().__init__(
            name="진학사",
            base_url="https://www.jinhak.com",
            use_playwright=True,
            proxy=proxy,
        )
        # 진학사 모의지원 관련 URL
        self.mock_apply_url = "https://www.jinhak.com/MoService"
        self.competition_url = "https://www.jinhak.com/CompetitionRate"
        self.analysis_url = "https://www.jinhak.com/Analysis"

    async def crawl_competition_rates(
        self,
        year: int,
        admission_type: str = "정시",
    ) -> List[Dict[str, Any]]:
        """
        진학사 경쟁률 데이터 크롤링

        진학사는 모의지원 기반 경쟁률을 제공합니다.
        실제 어디가 경쟁률과 다를 수 있음.

        Args:
            year: 입시 연도
            admission_type: 전형 유형

        Returns:
            경쟁률 데이터 리스트
        """
        results = []
        page = None

        try:
            page = await self._get_page()
            log.info(f"[{self.name}] 모의지원 경쟁률 조회 중...")

            # 진학사 정시 모의지원 페이지
            jungsi_url = f"{self.base_url}/GJMoService/GJMoSu/Index.aspx"
            await page.goto(jungsi_url, wait_until="networkidle")
            await self._random_delay(2, 3)

            # 로그인 필요 여부 확인
            if await self._check_login_required(page):
                log.warning(f"[{self.name}] 로그인이 필요합니다. 공개 데이터만 수집합니다.")
                results = await self._crawl_public_data(page, year, admission_type)
            else:
                results = await self._crawl_member_data(page, year, admission_type)

        except Exception as e:
            log.error(f"[{self.name}] 경쟁률 크롤링 오류: {e}")
            raise

        finally:
            if page:
                await page.context.close()

        return results

    async def _check_login_required(self, page: Page) -> bool:
        """로그인 필요 여부 확인"""
        try:
            # 로그인 버튼 또는 로그인 폼 존재 여부 확인
            login_element = await page.query_selector(
                "a[href*='login'], button:has-text('로그인'), .login-btn"
            )
            return login_element is not None
        except Exception:
            return True

    async def _crawl_public_data(
        self,
        page: Page,
        year: int,
        admission_type: str,
    ) -> List[Dict[str, Any]]:
        """공개 데이터 크롤링 (비로그인)"""
        results = []

        try:
            # 무료 경쟁률 조회 페이지
            free_url = f"{self.base_url}/GJMoService/CompRate/Index.aspx"
            await page.goto(free_url, wait_until="networkidle")
            await self._random_delay(1, 2)

            # 연도 선택
            year_selector = page.locator("select[name*='year'], select#selYear")
            if await year_selector.count() > 0:
                await year_selector.select_option(str(year))
                await self._random_delay(0.5, 1)

            # 정시/수시 선택
            admission_selector = page.locator("select[name*='admission'], select#selAdmission")
            if await admission_selector.count() > 0:
                value = "J" if admission_type == "정시" else "S"
                await admission_selector.select_option(value)
                await self._random_delay(0.5, 1)

            # 대학 목록 순회
            universities = await self._get_university_options(page)
            log.info(f"[{self.name}] {len(universities)}개 대학 발견")

            for univ in universities[:30]:  # 테스트용 30개
                try:
                    univ_data = await self._crawl_university_data(
                        page, univ, year, admission_type
                    )
                    results.extend(univ_data)
                    await self._random_delay(0.3, 0.8)
                except Exception as e:
                    log.debug(f"[{self.name}] {univ['name']} 데이터 수집 실패: {e}")
                    continue

        except Exception as e:
            log.error(f"[{self.name}] 공개 데이터 크롤링 실패: {e}")

        return results

    async def _crawl_member_data(
        self,
        page: Page,
        year: int,
        admission_type: str,
    ) -> List[Dict[str, Any]]:
        """회원 데이터 크롤링 (로그인 상태)"""
        # 공개 데이터와 동일한 로직 사용
        # 실제로는 더 많은 데이터 접근 가능
        return await self._crawl_public_data(page, year, admission_type)

    async def _get_university_options(self, page: Page) -> List[Dict[str, str]]:
        """대학 선택 옵션 가져오기"""
        universities = []

        try:
            # 대학 셀렉트박스 찾기
            univ_select = page.locator(
                "select[name*='univ'], select#selUniv, select.univ-select"
            )

            if await univ_select.count() > 0:
                options = await univ_select.locator("option").all()
                for opt in options:
                    value = await opt.get_attribute("value")
                    text = await opt.inner_text()
                    if value and text.strip() and value != "":
                        universities.append({
                            "code": value,
                            "name": text.strip(),
                        })
            else:
                # HTML 직접 파싱
                content = await page.content()
                soup = BeautifulSoup(content, "html.parser")
                selects = soup.find_all("select")
                for sel in selects:
                    if "univ" in sel.get("name", "").lower() or "univ" in sel.get("id", "").lower():
                        for opt in sel.find_all("option"):
                            val = opt.get("value", "")
                            txt = opt.get_text(strip=True)
                            if val and txt:
                                universities.append({"code": val, "name": txt})
                        break

        except Exception as e:
            log.warning(f"[{self.name}] 대학 목록 추출 실패: {e}")

        return universities

    async def _crawl_university_data(
        self,
        page: Page,
        university: Dict[str, str],
        year: int,
        admission_type: str,
    ) -> List[Dict[str, Any]]:
        """개별 대학 데이터 크롤링"""
        results = []

        try:
            # 대학 선택
            univ_select = page.locator(
                "select[name*='univ'], select#selUniv, select.univ-select"
            )
            if await univ_select.count() > 0:
                await univ_select.select_option(university["code"])
                await self._random_delay(0.3, 0.6)

            # 조회 버튼 클릭
            search_btn = page.locator(
                "button:has-text('조회'), input[type='button'][value*='조회'], .btn-search"
            )
            if await search_btn.count() > 0:
                await search_btn.first.click()
                await page.wait_for_load_state("networkidle")
                await self._random_delay(0.5, 1)

            # 결과 테이블 파싱
            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 데이터 테이블 찾기
            tables = soup.find_all("table")
            for table in tables:
                # 경쟁률 관련 테이블인지 확인
                headers = table.find_all("th")
                header_text = " ".join([h.get_text() for h in headers])
                if any(kw in header_text for kw in ["경쟁률", "지원자", "모집"]):
                    rows = table.find_all("tr")[1:]
                    for row in rows:
                        cols = row.find_all(["td", "th"])
                        if len(cols) >= 3:
                            data = self._parse_jinhak_row(
                                cols, university["name"], year, admission_type
                            )
                            if data:
                                results.append(data)
                    break

        except Exception as e:
            log.debug(f"[{self.name}] {university['name']} 상세 크롤링 실패: {e}")

        return results

    def _parse_jinhak_row(
        self,
        cols: List,
        university: str,
        year: int,
        admission_type: str,
    ) -> Optional[Dict[str, Any]]:
        """진학사 테이블 행 파싱"""
        try:
            texts = [col.get_text(strip=True) for col in cols]

            def extract_number(s: str) -> float:
                s = s.replace(",", "").replace("명", "").replace(":", "").strip()
                match = re.search(r"[\d.]+", s)
                return float(match.group()) if match else 0

            # 진학사 테이블 구조에 맞게 파싱
            # 학과명, 군, 모집인원, 지원자수, 경쟁률, 합격예측
            department = texts[0] if texts else ""
            selection_type = texts[1] if len(texts) > 1 else ""

            quota = int(extract_number(texts[2])) if len(texts) > 2 else 0
            applicants = int(extract_number(texts[3])) if len(texts) > 3 else 0

            if len(texts) > 4 and texts[4]:
                competition_rate = extract_number(texts[4])
            elif quota > 0:
                competition_rate = round(applicants / quota, 2)
            else:
                competition_rate = 0

            if not department or quota == 0:
                return None

            return {
                "university": university,
                "department": department,
                "admission_type": admission_type,
                "selection_type": selection_type,
                "quota": quota,
                "applicants": applicants,
                "competition_rate": competition_rate,
                "year": year,
                "source": self.name,
                "data_type": "모의지원",
                "crawled_at": datetime.now().isoformat(),
            }

        except Exception as e:
            log.debug(f"행 파싱 오류: {e}")
            return None

    async def crawl_mock_applications(
        self,
        year: int,
    ) -> List[Dict[str, Any]]:
        """
        모의지원 상세 현황 크롤링

        지원자 분포, 합격 예측 등 상세 정보 수집
        """
        results = []
        page = None

        try:
            page = await self._get_page()
            log.info(f"[{self.name}] 모의지원 상세 현황 조회 중...")

            # 모의지원 현황 페이지
            mock_url = f"{self.base_url}/GJMoService/GJMoSu/MockApply.aspx"
            await page.goto(mock_url, wait_until="networkidle")
            await self._random_delay(1, 2)

            # 인기 학과 TOP 현황 수집
            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 인기 학과 테이블
            popular_section = soup.find("div", class_=re.compile(r"popular|top|rank"))
            if popular_section:
                items = popular_section.find_all("li") or popular_section.find_all("tr")
                for item in items[:20]:
                    text = item.get_text(strip=True)
                    # 파싱 로직
                    if text:
                        results.append({
                            "type": "popular_department",
                            "content": text,
                            "year": year,
                            "crawled_at": datetime.now().isoformat(),
                        })

            log.info(f"[{self.name}] 모의지원 현황 {len(results)}건 수집")

        except Exception as e:
            log.error(f"[{self.name}] 모의지원 현황 크롤링 오류: {e}")

        finally:
            if page:
                await page.context.close()

        return results

    async def crawl_prediction_data(
        self,
        year: int,
        score_data: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        """
        개인 성적 기반 합격 예측 데이터 크롤링

        Args:
            year: 입시 연도
            score_data: 학생 성적 데이터
                {
                    "korean": 국어 표준점수,
                    "math": 수학 표준점수,
                    "english": 영어 등급,
                    "science1": 탐구1 표준점수,
                    "science2": 탐구2 표준점수,
                }

        Returns:
            합격 예측 데이터 리스트
        """
        results = []
        # TODO: 성적 입력 후 예측 결과 크롤링 구현
        log.info(f"[{self.name}] 합격 예측 크롤링 (구현 예정)")
        return results


# 테스트용 코드
async def test_jinhak_crawler():
    """진학사 크롤러 테스트"""
    crawler = JinhakCrawler()
    try:
        await crawler.initialize()
        result = await crawler.run(2025)
        print(f"경쟁률 데이터: {len(result['competition_rates'])}건")
        print(f"모의지원 데이터: {len(result['mock_applications'])}건")
        if result["competition_rates"]:
            print(f"샘플: {result['competition_rates'][0]}")
    finally:
        await crawler.close()


if __name__ == "__main__":
    import asyncio
    asyncio.run(test_jinhak_crawler())
