from typing import Dict, Any, List
from fastapi import HTTPException
import json
from PyPDF2 import PdfReader
import io
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from app.config import settings
import re
import asyncio

class GradeParser:
    def __init__(self):
        self.chat = ChatOpenAI(
            temperature=settings.TEMPERATURE,
            model=settings.MODEL_NAME,
            max_tokens=settings.MAX_TOKENS,
        )

    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        try:
            pdf_reader = PdfReader(io.BytesIO(pdf_bytes))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"PDF 파일 처리 중 오류 발생: {str(e)}")

    def _extract_section(self, text: str, start_marker: str, end_marker: str) -> str:
        """특정 섹션의 내용을 추출하고 정제"""
        try:
            if start_marker == "^":
                pattern = f"(.*?){end_marker}"
            else:
                pattern = f"{start_marker}(.*?){end_marker}"
            
            match = re.search(pattern, text, re.DOTALL)
            if match:
                content = match.group(1).strip()
                # 페이지 하단의 학교 정보 등 제거
                content = re.sub(r'반\s*\d+\s*번호\d+이름\s*[\w\s]+\s*[\w\s]+교\s*\d+/\d+\s*\d+년\s*\d+월\s*\d+일', '', content)
                # 불필요한 줄바꿈 정리
                content = re.sub(r'\n+', '\n', content)
                return content
            return ""
        except Exception:
            return ""

    def _process_semester_data(self, text: str) -> Dict[str, str]:
        """학기별 데이터 분리"""
        semesters = {"1학기": "", "2학기": ""}
        
        # 현재 학기를 추적
        current_semester = None
        lines = text.split('\n')
        
        for line in lines:
            # 새로운 학기 시작 확인
            if line.startswith('1'):
                current_semester = "1학기"
                semesters["1학기"] += line[1:] + "\n"  # 학기 표시 숫자 제거
            elif line.startswith('2'):
                current_semester = "2학기"
                semesters["2학기"] += line[1:] + "\n"  # 학기 표시 숫자 제거
            elif current_semester and line.strip():  # 현재 학기가 설정되어 있고 빈 줄이 아닌 경우
                semesters[current_semester] += line + "\n"
        
        return semesters

    def split_by_year(self, text: str) -> List[Dict[str, str]]:
        """학년별, 영역별로 텍스트 분할"""
        try:
            year_starts = [(m.start(), m.group(1)) for m in re.finditer(r'\[(\d)학년\]', text)]
            
            if not year_starts:
                raise HTTPException(status_code=500, detail="학년별 정보를 찾을 수 없습니다")
            
            year_chunks = []
            for i, (start_pos, year) in enumerate(year_starts):
                next_pos = year_starts[i + 1][0] if i + 1 < len(year_starts) else len(text)
                year_content = text[start_pos:next_pos].strip()
                
                # 각 영역별로 분할
                sections = {
                    "일반": self._extract_section(year_content, "^", "세 부 능 력 및 특 기 사 항"),
                    "진로선택": self._extract_section(year_content, "진로 선택 과목", "세 부 능 력 및 특 기 사 항"),
                    "체육예술": self._extract_section(year_content, "체육ㆍ예술", "세 부 능 력 및 특 기 사 항")
                }
                
                # 각 섹션의 데이터를 학기별로 분리
                processed_sections = {}
                for section_name, section_content in sections.items():
                    if section_content.strip():
                        processed_sections[section_name] = self._process_semester_data(section_content)
                
                if any(section for section in processed_sections.values()):
                    year_chunks.append({
                        "year": f"{year}학년",
                        "content": processed_sections
                    })
            return year_chunks
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"텍스트 분할 중 오류 발생: {str(e)}"
            )

    def merge_results(self, results: List[Dict]) -> Dict[str, Any]:
        """학년별 결과를 하나로 병합"""
        merged = {
            "academic_records": {}
        }
        
        # 학년별 성적 정보 병합 (중복 없이)
        for result in results:
            if "academic_records" in result:
                for grade, grade_data in result["academic_records"].items():
                    if grade not in merged["academic_records"]:
                        merged["academic_records"][grade] = grade_data
        
        return merged
    
    
    async def process_chunk(self, chunk: Dict[str, Any], base_prompt: str) -> Dict[str, Any]:
        """각 학년 데이터를 비동기적으로 처리"""
        try:
            prompt = base_prompt.format(
                year=chunk["year"],
                text=chunk["content"]
            )
            
            messages = [HumanMessage(content=prompt)]
            response = await self.chat.ainvoke(messages)
            
            try:
                return json.loads(response.content.strip())
            except json.JSONDecodeError as je:
                print(f"{chunk['year']} JSON 파싱 오류: {str(je)}")
                return None
                
        except Exception as e:
            print(f"{chunk['year']} 처리 중 오류: {str(e)}")
            return None

    async def parse_grades(self, text: str) -> Dict[str, Any]:
        try:
            chunks = self.split_by_year(text)
            
            results = []
            
            base_prompt = """다음 {year} 생활기록부의 성적 정보를 JSON 형식으로 반환해주세요.
            
아래는 과목 분류 기준입니다:
1. 일반 과목: 텍스트의 "일반" 섹션에 있는 과목
2. 진로선택 과목: 텍스트의 "진로선택" 섹션에 있는 과목
3. 체육예술 과목: 텍스트의 "체육예술" 섹션에 있는 과목

각 섹션은 동일한 섹션에서의 데이터만 포함해야 합니다. (일반 섹션에 있는 데이터를 진로선택 섹션에 있는 데이터에 포함하지 않아야 합니다.)

반드시 아래 형식의 JSON으로만 응답해주세요:
{{
    "academic_records": {{
        "{year}": {{
            "1학기": {{
                "일반": [
                    {{
                        "교과명",
                        "과목명",
                        "단위수",
                        "원점수",
                        "과목평균",
                        "표준편차",
                        "성취도",
                        "수강자수",
                        "석차등급"
                    }}
                ],
                "진로선택": [
                    {{
                        "교과명",
                        "과목명",
                        "단위수",
                        "원점수",
                        "과목평균",
                        "성취도",
                        "수강자수",
                        "석차등급",
                        "성취도분포비율A",
                        "성취도분포비율B",
                        "성취도분포비율C"
                    }}
                ],
                "체육예술": [
                    {{
                        "교과명",
                        "과목명",
                        "단위수",
                        "성취도"
                    }}
                ]
            }},
            "2학기": {{
                "일반": [],
                "진로선택": [],
                "체육예술": []
            }}
        }}
    }}
}}

주의사항:
1. 값은 모두 문자열로 반환해야 합니다. (예: 11.2 -> "11.2")
2. 값이 없는 경우 null로 반환해야 합니다.
3. 원점수/과목평균(표준편차)의 값이 91/75.1(10.2)인 경우 원점수는 91, 과목평균은 75.1, 표준편차는 10.2로 반환해야 합니다.
4. 원점수/과목평균의 값이 91/75.1인 경우 원점수는 91, 과목평균은 75.1로 반환해야 합니다.
5. 성취도(수강자수)의 값이 A(112)인 경우 성취도는 A, 수강자수는 112로 반환해야 합니다.
6. 성취도별분포비율이 A(19.6) B(61.6) C(18.8)인 경우 성취도분포비율A는 19.6, 성취도분포비율B는 61.6, 성취도분포비율C는 18.8로 반환해야 합니다.
7. 교과명과 과목명은 반드시 존재하며 이름에 '\n'이 포함되는 경우를 고려해야합니다. 
    예시 1: "사회(역사/도덕\n포함)\r통합사회"의 경우 교과명: 사회(역사/도덕포함), 과목명: 통합사회
    예시 2: "기술・가정/제2\n외국어/한문/교\n양기술·가정"의 경우 교과명: 기술・가정/제2 외국어/한문/교양, 과목명: 기술·가정
8. 교과는 반드시 다음 배열 중 하나와 같습니다. ["국어", "수학", "영어", "사회(역사/도덕포함)", "과학", "기술・가정/제2외국어/한문/교양", "한국사", "체육", "예술", "과학계열", "국제계열", "예술계열", "외국어계열", "체육계열", "건설", "경영･금융", "기계", "농림･수산･해양", "디자인･문화 콘텐츠", "미용･관광･레저", "보건･복지", "선박 운항", "섬유･의류", "식품･가공", "음식 조리", "인쇄･출판･공예", "재료", "전기･전자", "정보･통신", "화학 공원", "환경･안전"]
9. 과목은 교과 바로 다음에 존재하며 띄어쓰기 없이 붙어있을 수도 있습니다.
    예시 1: "기술・가정/제2\n외국어/한문/교\n양기술·가정"는 교과명: "기술・가정/제2외국어/한문/교양", 과목명: "기술·가정"
10. 과목명 끝엔 Ⅰ같은 문자를 제외한 숫자는 포함되어있지 않습니다. 만약 존재한다면 단위수 일 수 있습니다.
    예시 1: "윤리와 사상4"면 과목명: "윤리와 사상", 단위수: "4"
    예시 2: "윤리와 사\n상4"면 과목명: "윤리와 사상", 단위수: "4"
11. 입력 수와 출력 수는 동일해야 합니다.
    예시 1: 1학년 1학기 "일반"의 과목이 8개라면 1학년 1학기 "일반"의 결과도 8개여야 합니다.
12. "성취도"와 "석차등급"은 "P"일 수 있으며 원점수/과목평균/표준편차/수강자수는 존재하지 않을 수 있습니다.

텍스트:
{text}"""
            
            # 모든 청크를 동시에 비동기적으로 처리
            tasks = [self.process_chunk(chunk, base_prompt) for chunk in chunks]
            results = await asyncio.gather(*tasks)
            
            # None 값 제거
            results = [r for r in results if r is not None]
            
            if not results:
                raise HTTPException(status_code=500, detail="성적 정보 추출 실패")
            
            return self.merge_results(results)
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))