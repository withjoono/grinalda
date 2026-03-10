"""
어디가(adiga.kr) 크롤러
- 공식 경쟁률 데이터 수집
- 대한민국 교육부 공식 포털
"""
from typing import Dict, List, Any, Optional
from datetime import datetime
import re
import json

from bs4 import BeautifulSoup
from playwright.async_api import Page

from .base_crawler import BaseCrawler
from src.utils.logger import log


class AdigaCrawler(BaseCrawler):
    """
    어디가 크롤러

    대한민국 교육부 공식 입시 포털에서
    실시간 경쟁률 데이터를 수집합니다.
    """

    def __init__(self, proxy: Optional[str] = None):
        super().__init__(
            name="어디가",
            base_url="https://adiga.kr",
            use_playwright=True,
            proxy=proxy,
        )
        # 어디가 API 엔드포인트
        self.competition_api = "https://adiga.kr/PageCntnts/PsgEfrt/PsgCompRate.do"
        self.university_list_api = "https://adiga.kr/PageCntnts/PsgEfrt/selectUnivList.do"

    async def crawl_competition_rates(
        self,
        year: int,
        admission_type: str = "정시",
    ) -> List[Dict[str, Any]]:
        """
        어디가 경쟁률 크롤링

        Args:
            year: 입시 연도 (예: 2025)
            admission_type: 전형 유형 ("정시" 또는 "수시")

        Returns:
            경쟁률 데이터 리스트
        """
        results = []
        page = None

        try:
            page = await self._get_page()
            log.info(f"[{self.name}] 경쟁률 페이지 접속 중...")

            # 어디가 메인 페이지 접속
            await page.goto(self.base_url, wait_until="networkidle")
            await self._random_delay(2, 4)

            # 정시/수시 선택에 따른 URL 구성
            admission_code = "JUNGSI" if admission_type == "정시" else "SUSI"

            # 경쟁률 조회 페이지로 이동
            competition_url = f"{self.competition_api}?admsSe={admission_code}&admYear={year}"
            await page.goto(competition_url, wait_until="networkidle")
            await self._random_delay(1, 2)

            # 대학 목록 가져오기
            universities = await self._get_university_list(page, year, admission_code)
            log.info(f"[{self.name}] {len(universities)}개 대학 발견")

            # 각 대학별 경쟁률 수집
            for univ in universities[:50]:  # 테스트용으로 50개만
                try:
                    univ_data = await self._crawl_university_competition(
                        page, univ, year, admission_type
                    )
                    results.extend(univ_data)
                    await self._random_delay(0.5, 1.5)
                except Exception as e:
                    log.warning(f"[{self.name}] {univ['name']} 크롤링 실패: {e}")
                    continue

            log.info(f"[{self.name}] 총 {len(results)}건 경쟁률 데이터 수집 완료")

        except Exception as e:
            log.error(f"[{self.name}] 경쟁률 크롤링 오류: {e}")
            raise

        finally:
            if page:
                await page.context.close()

        return results

    async def _get_university_list(
        self,
        page: Page,
        year: int,
        admission_code: str,
    ) -> List[Dict[str, str]]:
        """대학 목록 조회"""
        universities = []

        try:
            # AJAX 요청으로 대학 목록 가져오기
            response = await self._fetch_with_retry(
                self.university_list_api,
                method="POST",
                data={
                    "admYear": year,
                    "admsSe": admission_code,
                },
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": self.base_url,
                },
            )

            data = response.json()
            if isinstance(data, list):
                for item in data:
                    universities.append({
                        "code": item.get("univCd", ""),
                        "name": item.get("univNm", ""),
                        "region": item.get("locNm", ""),
                    })

        except Exception as e:
            log.warning(f"[{self.name}] 대학 목록 API 실패, HTML 파싱으로 대체: {e}")
            # HTML에서 직접 파싱
            universities = await self._parse_university_list_from_html(page)

        return universities

    async def _parse_university_list_from_html(self, page: Page) -> List[Dict[str, str]]:
        """HTML에서 대학 목록 파싱"""
        universities = []

        try:
            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 대학 선택 셀렉트박스에서 추출
            select = soup.find("select", {"id": "univCd"}) or soup.find(
                "select", {"name": "univCd"}
            )
            if select:
                options = select.find_all("option")
                for opt in options:
                    value = opt.get("value", "")
                    text = opt.get_text(strip=True)
                    if value and text and value != "":
                        universities.append({
                            "code": value,
                            "name": text,
                            "region": "",
                        })

        except Exception as e:
            log.error(f"[{self.name}] HTML 파싱 실패: {e}")

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
        univ_code = university["code"]
        univ_name = university["name"]

        try:
            # 대학 선택 후 학과 목록 조회
            await page.select_option("select#univCd", univ_code)
            await self._random_delay(0.3, 0.7)

            # 조회 버튼 클릭 또는 자동 조회 대기
            try:
                search_btn = page.locator("button:has-text('조회')")
                if await search_btn.count() > 0:
                    await search_btn.click()
                    await page.wait_for_load_state("networkidle")
            except Exception:
                pass

            await self._random_delay(0.5, 1)

            # 결과 테이블 파싱
            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # 경쟁률 테이블 찾기
            table = soup.find("table", class_=re.compile(r"(result|data|list)"))
            if not table:
                tables = soup.find_all("table")
                for t in tables:
                    if t.find("th", string=re.compile(r"(모집|경쟁률|지원)")):
                        table = t
                        break

            if table:
                rows = table.find_all("tr")[1:]  # 헤더 제외
                for row in rows:
                    cols = row.find_all(["td", "th"])
                    if len(cols) >= 4:
                        dept_data = self._parse_competition_row(
                            cols, univ_name, admission_type
                        )
                        if dept_data:
                            dept_data["year"] = year
                            dept_data["crawled_at"] = datetime.now().isoformat()
                            results.append(dept_data)

        except Exception as e:
            log.warning(f"[{self.name}] {univ_name} 상세 크롤링 실패: {e}")

        return results

    def _parse_competition_row(
        self,
        cols: List,
        university: str,
        admission_type: str,
    ) -> Optional[Dict[str, Any]]:
        """테이블 행 파싱"""
        try:
            # 컬럼 순서: 모집단위(학과), 전형유형, 모집인원, 지원자수, 경쟁률
            texts = [col.get_text(strip=True) for col in cols]

            department = texts[0] if len(texts) > 0 else ""
            selection_type = texts[1] if len(texts) > 1 else ""

            # 숫자 추출 함수
            def extract_number(s: str) -> float:
                match = re.search(r"[\d,]+\.?\d*", s.replace(",", ""))
                return float(match.group()) if match else 0

            quota = int(extract_number(texts[2])) if len(texts) > 2 else 0
            applicants = int(extract_number(texts[3])) if len(texts) > 3 else 0

            # 경쟁률 계산 또는 추출
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
                "source": self.name,
            }

        except Exception as e:
            log.debug(f"행 파싱 오류: {e}")
            return None

    async def crawl_mock_applications(
        self,
        year: int,
    ) -> List[Dict[str, Any]]:
        """
        어디가는 공식 경쟁률만 제공하므로
        모의지원 기능은 빈 리스트 반환
        """
        log.info(f"[{self.name}] 모의지원 데이터 없음 (공식 포털)")
        return []

    async def crawl_cutoff_data(
        self,
        year: int,
        admission_type: str = "정시",
    ) -> List[Dict[str, Any]]:
        """
        합격선(커트라인) 데이터 크롤링

        Args:
            year: 입시 연도
            admission_type: 전형 유형

        Returns:
            합격선 데이터 리스트
        """
        results = []
        page = None

        try:
            page = await self._get_page()

            # 입시결과 페이지로 이동
            result_url = f"{self.base_url}/PageCntnts/PsgAnls/PsgRslt.do"
            await page.goto(result_url, wait_until="networkidle")
            await self._random_delay(1, 2)

            # TODO: 합격선 데이터 파싱 구현
            log.info(f"[{self.name}] 합격선 데이터 크롤링 (구현 예정)")

        except Exception as e:
            log.error(f"[{self.name}] 합격선 크롤링 오류: {e}")

        finally:
            if page:
                await page.context.close()

        return results


# 테스트용 코드
async def test_adiga_crawler():
    """어디가 크롤러 테스트"""
    crawler = AdigaCrawler()
    try:
        await crawler.initialize()
        result = await crawler.run(2025)
        print(f"크롤링 결과: {len(result['competition_rates'])}건")
        if result["competition_rates"]:
            print(f"샘플 데이터: {result['competition_rates'][0]}")
    finally:
        await crawler.close()


if __name__ == "__main__":
    import asyncio
    asyncio.run(test_adiga_crawler())
