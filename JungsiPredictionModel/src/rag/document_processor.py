"""
문서 처리기
텍스트 청킹, 전처리, 메타데이터 추출
"""
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import re
from datetime import datetime

from src.utils.logger import log


@dataclass
class TextChunk:
    """텍스트 청크"""
    content: str
    metadata: Dict[str, Any]
    start_index: int
    end_index: int


class DocumentProcessor:
    """
    문서 처리기

    텍스트를 청킹하고 전처리하여 RAG 파이프라인에 적합한 형태로 변환합니다.
    """

    def __init__(
        self,
        chunk_size: int = 500,
        chunk_overlap: int = 50,
        min_chunk_size: int = 100,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.min_chunk_size = min_chunk_size

        # 입시 관련 키워드
        self.admission_keywords = [
            "정시", "수시", "경쟁률", "커트라인", "합격선", "모집",
            "지원", "원서", "배치", "추가합격", "충원", "예비",
            "등급컷", "표준점수", "백분위", "환산점수",
        ]

        # 대학명 패턴
        self.university_pattern = re.compile(
            r"(서울대|연세대|고려대|성균관대|한양대|서강대|중앙대|경희대|"
            r"이화여대|한국외대|서울시립대|건국대|동국대|홍익대|국민대|"
            r"숭실대|세종대|단국대|광운대|인하대|아주대|경북대|부산대|"
            r"전남대|전북대|충남대|충북대|강원대|제주대|울산대|"
            r"포항공대|KAIST|GIST|DGIST|UNIST)[가-힣]*"
        )

    def preprocess_text(self, text: str) -> str:
        """
        텍스트 전처리

        Args:
            text: 원본 텍스트

        Returns:
            전처리된 텍스트
        """
        if not text:
            return ""

        # 연속 공백 제거
        text = re.sub(r"\s+", " ", text)

        # 특수문자 정리
        text = re.sub(r"[^\w\s가-힣.,!?():\-/]", "", text)

        # 앞뒤 공백 제거
        text = text.strip()

        return text

    def chunk_text(
        self,
        text: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> List[TextChunk]:
        """
        텍스트 청킹

        Args:
            text: 원본 텍스트
            metadata: 기본 메타데이터

        Returns:
            청크 리스트
        """
        text = self.preprocess_text(text)
        if not text:
            return []

        metadata = metadata or {}
        chunks = []

        # 문장 단위로 먼저 분리
        sentences = self._split_into_sentences(text)

        current_chunk = ""
        current_start = 0

        for sentence in sentences:
            # 현재 청크에 문장 추가 시 크기 확인
            if len(current_chunk) + len(sentence) <= self.chunk_size:
                current_chunk += sentence + " "
            else:
                # 현재 청크 저장
                if len(current_chunk.strip()) >= self.min_chunk_size:
                    chunk_metadata = metadata.copy()
                    chunk_metadata.update(self._extract_metadata(current_chunk))

                    chunks.append(TextChunk(
                        content=current_chunk.strip(),
                        metadata=chunk_metadata,
                        start_index=current_start,
                        end_index=current_start + len(current_chunk),
                    ))

                # 오버랩 처리
                overlap_text = current_chunk[-self.chunk_overlap:] if self.chunk_overlap else ""
                current_start += len(current_chunk) - len(overlap_text)
                current_chunk = overlap_text + sentence + " "

        # 마지막 청크 처리
        if len(current_chunk.strip()) >= self.min_chunk_size:
            chunk_metadata = metadata.copy()
            chunk_metadata.update(self._extract_metadata(current_chunk))

            chunks.append(TextChunk(
                content=current_chunk.strip(),
                metadata=chunk_metadata,
                start_index=current_start,
                end_index=current_start + len(current_chunk),
            ))

        return chunks

    def _split_into_sentences(self, text: str) -> List[str]:
        """문장 분리"""
        # 한국어 문장 분리 패턴
        pattern = r"(?<=[.!?。])\s+"
        sentences = re.split(pattern, text)
        return [s.strip() for s in sentences if s.strip()]

    def _extract_metadata(self, text: str) -> Dict[str, Any]:
        """
        텍스트에서 메타데이터 추출

        Args:
            text: 텍스트

        Returns:
            추출된 메타데이터
        """
        metadata = {}

        # 대학명 추출
        universities = self.university_pattern.findall(text)
        if universities:
            metadata["mentioned_universities"] = list(set(universities))

        # 입시 키워드 추출
        found_keywords = [
            kw for kw in self.admission_keywords
            if kw in text
        ]
        if found_keywords:
            metadata["admission_keywords"] = found_keywords

        # 숫자 패턴 (경쟁률, 점수 등)
        rate_pattern = re.search(r"(\d+\.?\d*)\s*:\s*1", text)
        if rate_pattern:
            metadata["competition_rate_mentioned"] = float(rate_pattern.group(1))

        score_pattern = re.search(r"(\d{2,3})점", text)
        if score_pattern:
            metadata["score_mentioned"] = int(score_pattern.group(1))

        # 연도 추출
        year_pattern = re.search(r"20\d{2}년?", text)
        if year_pattern:
            metadata["year_mentioned"] = year_pattern.group()

        return metadata

    def process_news_article(
        self,
        title: str,
        content: str,
        source: str,
        url: str,
        published_at: Optional[datetime] = None,
    ) -> List[TextChunk]:
        """
        뉴스 기사 처리

        Args:
            title: 제목
            content: 본문
            source: 출처
            url: URL
            published_at: 발행일

        Returns:
            청크 리스트
        """
        # 제목과 본문 결합
        full_text = f"{title}\n\n{content}"

        base_metadata = {
            "type": "news",
            "title": title,
            "source": source,
            "url": url,
            "published_at": published_at.isoformat() if published_at else None,
        }

        return self.chunk_text(full_text, base_metadata)

    def process_community_post(
        self,
        title: str,
        content: str,
        source: str,
        author: Optional[str] = None,
        posted_at: Optional[datetime] = None,
        url: Optional[str] = None,
    ) -> List[TextChunk]:
        """
        커뮤니티 게시글 처리

        Args:
            title: 제목
            content: 본문
            source: 출처 (오르비, 수만휘 등)
            author: 작성자
            posted_at: 작성일
            url: URL

        Returns:
            청크 리스트
        """
        full_text = f"{title}\n\n{content}"

        base_metadata = {
            "type": "community",
            "title": title,
            "source": source,
            "author": author,
            "url": url,
            "posted_at": posted_at.isoformat() if posted_at else None,
        }

        return self.chunk_text(full_text, base_metadata)

    def process_admission_data(
        self,
        university: str,
        department: str,
        year: int,
        data: Dict[str, Any],
    ) -> List[TextChunk]:
        """
        입시 데이터를 텍스트로 변환 후 처리

        Args:
            university: 대학명
            department: 학과명
            year: 연도
            data: 입시 데이터

        Returns:
            청크 리스트
        """
        # 구조화된 데이터를 자연어로 변환
        text_parts = [
            f"{year}학년도 {university} {department}",
        ]

        if "competition_rate" in data:
            text_parts.append(f"경쟁률: {data['competition_rate']}:1")

        if "quota" in data:
            text_parts.append(f"모집인원: {data['quota']}명")

        if "applicants" in data:
            text_parts.append(f"지원자: {data['applicants']}명")

        if "cutoff_score" in data:
            text_parts.append(f"합격선: {data['cutoff_score']}점")

        if "chungwon_rate" in data:
            text_parts.append(f"충원율: {data['chungwon_rate']}%")

        full_text = " / ".join(text_parts)

        base_metadata = {
            "type": "admission_data",
            "university": university,
            "department": department,
            "year": year,
            **data,
        }

        # 입시 데이터는 청킹하지 않고 하나의 청크로
        return [TextChunk(
            content=full_text,
            metadata=base_metadata,
            start_index=0,
            end_index=len(full_text),
        )]

    def extract_sentiment(self, text: str) -> float:
        """
        간단한 감성 분석

        Args:
            text: 텍스트

        Returns:
            감성 점수 (-1 ~ 1)
        """
        positive_words = [
            "합격", "안전", "여유", "상승", "좋은", "최고", "성공", "충원",
            "기대", "가능성", "희망", "안정", "추천",
        ]
        negative_words = [
            "불합격", "위험", "경쟁", "하락", "어려운", "최저", "실패",
            "쏠림", "급등", "불안", "주의", "포기", "변수",
        ]

        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)

        total = positive_count + negative_count
        if total == 0:
            return 0.0

        return (positive_count - negative_count) / total


# 유틸리티 함수
def summarize_text(text: str, max_length: int = 200) -> str:
    """
    텍스트 요약 (간단한 추출 기반)

    Args:
        text: 원본 텍스트
        max_length: 최대 길이

    Returns:
        요약된 텍스트
    """
    if len(text) <= max_length:
        return text

    # 첫 문장들 추출
    sentences = re.split(r"[.!?]\s+", text)
    summary = ""

    for sentence in sentences:
        if len(summary) + len(sentence) <= max_length:
            summary += sentence + ". "
        else:
            break

    return summary.strip() or text[:max_length] + "..."
