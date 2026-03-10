"""
유웨이(uway.com) 크롤러
- 모의지원 현황 데이터 수집
- 합격 예측 및 배치표 데이터
"""
from typing import Dict, List, Any, Optional
from datetime import datetime
import re
import json

from bs4 import BeautifulSoup
from playwright.async_api import Page

from .base_crawler import BaseCrawler
from src.utils.logger import log


class UwayCrawler(BaseCrawler):
    """
    유웨이 크롤러

    유웨이 모의지원 서비스에서 실시간
    지원 현황 및 합격 예측 데이터를 수집합니다.
    """

    def __init__(self, proxy: Optional[str] = None):
        super().__init__(
            name="유웨이",
            base_url="https://www.uway.com",
            use_playwright=True,
            proxy=proxy,
        )
        # 유웨이 서비스 URL
        self.jungsi_url = "https://www.uway.com/Jungsi"
        self.mock_apply_url = "https://www.uway.com/Jungsi/MockApply"
        self.competition_url = "https://www.uway.com/Jungsi/CompRate"

    async def crawl_competition_rates(
        self,
        year: int,
        admission_type: str = "정시",
    ) -> List[Dict[str, Any]]:
        """
        유웨이 모의지원 경쟁률 크롤링

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

            # 유웨이 정시 페이지
            await page.goto(self.jungsi_url, wait_until="networkidle")
            await self._random_delay(2, 3)

            # 경쟁률 조회 메뉴로 이동
            try:
                comp_menu = page.locator("a:has-text('경쟁률'), a:has-text('모의지원')")
                if await comp_menu.count() > 0:
                    await comp_menu.first.click()
                    await page.wait_for_load_state("networkidle")
                    await self._random_delay(1, 2)
            except Exception as e:
                log.debug(f"메뉴 클릭 실패: {e}")

            # 대학 목록 순회하며 데이터 수집
            universities = await self._get_university_list(page)
            log.info(f"[{self.name}] {len(universities)}개 대학 발견")

            for univ in universities[:30]:  # 테스트용 30개
                try:
                    univ_data = await self._crawl_university_competition(
                        page, univ, year, admission_type
                    )
                    results.extend(univ_data)
                    await self._random_delay(0.3, 0.7)
                except Exception as e:
                    log.debug(f"[{self.name}] {univ.get('name', '')} 크롤링 실패: {e}")
                    continue

            log.info(f"[{self.name}] 총 {len(results)}건 데이터 수집")

        except Exception as e:
            log.error(f"[{self.name}] 경쟁률 크롤링 오류: {e}")
            raise

        finally:
            if page:
                await page.context.close()

        return results

    async def _get_university_list(self, page: Page) -> List[Dict[str, str]]:
        """대학 목록 가져오기"""
        universities = []

        try:
            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 대학 셀렉트박스 찾기
            selects = soup.find_all("select")
            for sel in selects:
                sel_name = (sel.get("name", "") + sel.get("id", "")).lower()
                if "univ" in sel_name or "school" in sel_name or "univ" in sel_name:
                    for opt in sel.find_all("option"):
                        val = opt.get("value", "")
                        txt = opt.get_text(strip=True)
                        if val and txt and val not in ["", "0", "-1"]:
                            universities.append({"code": val, "name": txt})
                    break

            # 셀렉트박스에서 못 찾으면 리스트에서 찾기
            if not universities:
                univ_items = soup.find_all(
                    ["li", "a"], class_=re.compile(r"univ|school|college")
                )
                for item in univ_items:
                    href = item.get("href", "")
                    text = item.get_text(strip=True)
                    if href and text:
                        # URL에서 대학 코드 추출
                        code_match = re.search(r"(\d+)", href)
                        code = code_match.group(1) if code_match else ""
                        if code:
                            universities.append({"code": code, "name": text})

        except Exception as e:
            log.warning(f"[{self.name}] 대학 목록 추출 실패: {e}")

        return universities

    async def _crawl_university_competition(
        self,
        page: Page,
        university: Dict[str, str],
        year: int,
        admission_type: str,
    ) -> List[Dict[str, Any]]:
        """개별 대학 경쟁률 크롤링"""
        results = []

        try:
            # 대학 선택
            univ_selects = page.locator("select")
            count = await univ_selects.count()

            for i in range(count):
                sel = univ_selects.nth(i)
                try:
                    options = await sel.locator("option").all_text_contents()
                    if university["name"] in options:
                        await sel.select_option(label=university["name"])
                        await self._random_delay(0.3, 0.5)
                        break
                except Exception:
                    continue

            # 조회 버튼 클릭
            search_btns = page.locator(
                "button:has-text('조회'), input[value*='조회'], .btn-search"
            )
            if await search_btns.count() > 0:
                await search_btns.first.click()
                await page.wait_for_load_state("networkidle")
                await self._random_delay(0.5, 1)

            # 결과 파싱
            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 테이블 찾기
            tables = soup.find_all("table")
            for table in tables:
                headers = [th.get_text(strip=True) for th in table.find_all("th")]
                if any(kw in " ".join(headers) for kw in ["모집", "지원", "경쟁"]):
                    rows = table.find_all("tr")[1:]
                    for row in rows:
                        cols = row.find_all(["td", "th"])
                        if len(cols) >= 3:
                            data = self._parse_uway_row(
                                cols, university["name"], year, admission_type
                            )
                            if data:
                                results.append(data)
                    break

        except Exception as e:
            log.debug(f"[{self.name}] {university.get('name', '')} 크롤링 오류: {e}")

        return results

    def _parse_uway_row(
        self,
        cols: List,
        university: str,
        year: int,
        admission_type: str,
    ) -> Optional[Dict[str, Any]]:
        """유웨이 테이블 행 파싱"""
        try:
            texts = [col.get_text(strip=True) for col in cols]

            def extract_number(s: str) -> float:
                s = s.replace(",", "").replace("명", "").strip()
                match = re.search(r"[\d.]+", s)
                return float(match.group()) if match else 0

            department = texts[0] if texts else ""

            # 군 정보 추출
            selection_type = ""
            for i, text in enumerate(texts[1:3], 1):
                if text in ["가군", "나군", "다군", "가", "나", "다"]:
                    selection_type = text.replace("군", "") + "군" if len(text) == 1 else text
                    break

            # 숫자 데이터 추출
            numbers = []
            for text in texts:
                num = extract_number(text)
                if num > 0:
                    numbers.append(num)

            if len(numbers) >= 2:
                quota = int(numbers[0]) if numbers[0] < 1000 else int(numbers[1])
                applicants = int(numbers[1]) if numbers[0] < 1000 else int(numbers[0])
                competition_rate = numbers[2] if len(numbers) > 2 else (
                    round(applicants / quota, 2) if quota > 0 else 0
                )
            else:
                return None

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

        지원자 분포, 성적 구간별 현황 등
        """
        results = []
        page = None

        try:
            page = await self._get_page()
            log.info(f"[{self.name}] 모의지원 현황 조회 중...")

            await page.goto(self.mock_apply_url, wait_until="networkidle")
            await self._random_delay(1, 2)

            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 인기 학과, 지원 현황 등 수집
            stat_sections = soup.find_all(
                "div", class_=re.compile(r"stat|rank|popular|trend")
            )

            for section in stat_sections:
                title = section.find(["h2", "h3", "h4", "span"])
                title_text = title.get_text(strip=True) if title else "unknown"

                items = section.find_all(["li", "tr", "div"])
                for item in items[:10]:
                    text = item.get_text(strip=True)
                    if text and len(text) > 5:
                        results.append({
                            "type": "mock_status",
                            "category": title_text,
                            "content": text,
                            "year": year,
                            "source": self.name,
                            "crawled_at": datetime.now().isoformat(),
                        })

            log.info(f"[{self.name}] 모의지원 현황 {len(results)}건 수집")

        except Exception as e:
            log.error(f"[{self.name}] 모의지원 현황 크롤링 오류: {e}")

        finally:
            if page:
                await page.context.close()

        return results

    async def crawl_placement_table(
        self,
        year: int,
        score_type: str = "표준점수",
    ) -> List[Dict[str, Any]]:
        """
        배치표 데이터 크롤링

        Args:
            year: 입시 연도
            score_type: 점수 유형 (표준점수/백분위)

        Returns:
            배치표 데이터
        """
        results = []
        page = None

        try:
            page = await self._get_page()
            log.info(f"[{self.name}] 배치표 조회 중...")

            placement_url = f"{self.jungsi_url}/Placement"
            await page.goto(placement_url, wait_until="networkidle")
            await self._random_delay(1, 2)

            # 배치표 데이터 수집
            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 배치표 테이블 파싱
            tables = soup.find_all("table", class_=re.compile(r"placement|batch"))
            for table in tables:
                rows = table.find_all("tr")
                for row in rows[1:]:  # 헤더 제외
                    cols = row.find_all(["td", "th"])
                    if len(cols) >= 4:
                        try:
                            score = cols[0].get_text(strip=True)
                            universities = []
                            for col in cols[1:]:
                                text = col.get_text(strip=True)
                                if text:
                                    universities.append(text)

                            if score and universities:
                                results.append({
                                    "score_range": score,
                                    "universities": universities,
                                    "score_type": score_type,
                                    "year": year,
                                    "source": self.name,
                                    "crawled_at": datetime.now().isoformat(),
                                })
                        except Exception:
                            continue

            log.info(f"[{self.name}] 배치표 {len(results)}건 수집")

        except Exception as e:
            log.error(f"[{self.name}] 배치표 크롤링 오류: {e}")

        finally:
            if page:
                await page.context.close()

        return results


# 테스트용 코드
async def test_uway_crawler():
    """유웨이 크롤러 테스트"""
    crawler = UwayCrawler()
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
    asyncio.run(test_uway_crawler())
