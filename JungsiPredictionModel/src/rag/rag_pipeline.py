"""
RAG 파이프라인
Retrieval-Augmented Generation 핵심 로직
"""
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import asyncio

import google.generativeai as genai
from google.cloud import aiplatform

from config.settings import get_settings
from .embeddings import EmbeddingService, get_embedding_service
from .vector_store import VectorStoreService, LocalVectorStore, SearchResult
from .document_processor import DocumentProcessor, TextChunk
from .news_crawler import NewsCrawler
from .community_crawler import CommunityCrawler
from src.utils.logger import log


@dataclass
class RAGQuery:
    """RAG 쿼리"""
    question: str
    context_type: Optional[str] = None  # news, community, admission, all
    university: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None


@dataclass
class RAGResponse:
    """RAG 응답"""
    answer: str
    sources: List[Dict[str, Any]]
    confidence: float
    metadata: Dict[str, Any]


class RAGPipeline:
    """
    RAG 파이프라인

    검색 → 컨텍스트 구성 → LLM 생성
    """

    def __init__(self, use_local: bool = False):
        self.settings = get_settings()
        self.use_local = use_local

        # 서비스 초기화
        self.embedding_service = get_embedding_service(use_local)
        self.vector_store = LocalVectorStore() if use_local else VectorStoreService()
        self.document_processor = DocumentProcessor()

        # 크롤러
        self.news_crawler = NewsCrawler()
        self.community_crawler = CommunityCrawler()

        # Gemini LLM
        self._llm = None
        self._initialized = False

    async def initialize(self):
        """파이프라인 초기화"""
        if self._initialized:
            return

        try:
            # 임베딩 서비스 초기화
            self.embedding_service.initialize()

            # 벡터 스토어 초기화
            if hasattr(self.vector_store, 'initialize'):
                self.vector_store.initialize()

            # Gemini 초기화
            if self.settings.GCP_PROJECT_ID:
                genai.configure(api_key=None)  # GCP 인증 사용
                self._llm = genai.GenerativeModel(self.settings.VERTEX_AI_LLM_MODEL)
            else:
                log.warning("GCP 프로젝트 ID가 설정되지 않음, LLM 기능 제한")

            # 크롤러 초기화
            await self.news_crawler.initialize()
            await self.community_crawler.initialize()

            self._initialized = True
            log.info("RAG 파이프라인 초기화 완료")

        except Exception as e:
            log.error(f"RAG 파이프라인 초기화 실패: {e}")
            raise

    async def close(self):
        """파이프라인 종료"""
        await self.news_crawler.close()
        await self.community_crawler.close()

    async def query(
        self,
        query: RAGQuery,
        top_k: int = 5,
    ) -> RAGResponse:
        """
        RAG 쿼리 실행

        Args:
            query: RAG 쿼리
            top_k: 검색할 문서 수

        Returns:
            RAG 응답
        """
        if not self._initialized:
            await self.initialize()

        try:
            # 1. 쿼리 임베딩
            query_embedding = self.embedding_service.embed_query(query.question)

            # 2. 벡터 검색
            search_results = self.vector_store.search(
                query_embedding=query_embedding,
                top_k=top_k,
                filter_metadata=self._build_filter(query),
            )

            # 3. 컨텍스트 구성
            context = self._build_context(search_results, query)

            # 4. LLM 생성
            answer = await self._generate_answer(query.question, context)

            # 5. 응답 구성
            sources = [
                {
                    "id": r.id,
                    "content": r.content[:200] + "..." if len(r.content) > 200 else r.content,
                    "score": r.score,
                    "metadata": r.metadata,
                }
                for r in search_results
            ]

            return RAGResponse(
                answer=answer,
                sources=sources,
                confidence=self._calculate_confidence(search_results),
                metadata={
                    "query": query.question,
                    "top_k": top_k,
                    "sources_count": len(sources),
                    "timestamp": datetime.now().isoformat(),
                },
            )

        except Exception as e:
            log.error(f"RAG 쿼리 실패: {e}")
            return RAGResponse(
                answer=f"죄송합니다. 질문을 처리하는 중 오류가 발생했습니다: {str(e)}",
                sources=[],
                confidence=0.0,
                metadata={"error": str(e)},
            )

    def _build_filter(self, query: RAGQuery) -> Optional[Dict[str, Any]]:
        """메타데이터 필터 구성"""
        filters = {}

        if query.context_type and query.context_type != "all":
            filters["type"] = query.context_type

        if query.university:
            filters["university"] = query.university

        if query.year:
            filters["year"] = query.year

        return filters if filters else None

    def _build_context(
        self,
        search_results: List[SearchResult],
        query: RAGQuery,
    ) -> str:
        """검색 결과로 컨텍스트 구성"""
        if not search_results:
            return "관련 정보를 찾을 수 없습니다."

        context_parts = []

        for i, result in enumerate(search_results, 1):
            source_type = result.metadata.get("type", "unknown")
            source_name = result.metadata.get("source", "")

            context_parts.append(
                f"[정보 {i}] ({source_type} - {source_name})\n{result.content}"
            )

        return "\n\n---\n\n".join(context_parts)

    async def _generate_answer(self, question: str, context: str) -> str:
        """LLM으로 답변 생성"""
        if not self._llm:
            # LLM 없이 컨텍스트만 반환
            return f"검색된 정보:\n\n{context}"

        try:
            prompt = f"""당신은 대한민국 대학 입시 전문가입니다.
아래 정보를 바탕으로 학생의 질문에 정확하고 도움이 되는 답변을 해주세요.

## 참고 정보
{context}

## 학생 질문
{question}

## 답변 지침
1. 제공된 정보를 바탕으로 답변하세요
2. 확실하지 않은 정보는 "~일 수 있습니다"로 표현하세요
3. 숫자와 통계는 정확히 인용하세요
4. 학생에게 도움이 되는 실질적인 조언을 포함하세요
5. 답변은 한국어로 작성하세요

## 답변:"""

            response = self._llm.generate_content(prompt)
            return response.text

        except Exception as e:
            log.error(f"LLM 생성 실패: {e}")
            return f"답변 생성 중 오류가 발생했습니다. 검색된 정보:\n\n{context[:500]}..."

    def _calculate_confidence(self, search_results: List[SearchResult]) -> float:
        """응답 신뢰도 계산"""
        if not search_results:
            return 0.0

        # 평균 유사도 점수 기반
        avg_score = sum(r.score for r in search_results) / len(search_results)

        # 0~1 범위로 정규화
        return min(max(avg_score, 0.0), 1.0)

    async def index_news(self, days: int = 7) -> int:
        """
        뉴스 인덱싱

        Args:
            days: 수집할 기간

        Returns:
            인덱싱된 문서 수
        """
        if not self._initialized:
            await self.initialize()

        log.info(f"뉴스 인덱싱 시작 (최근 {days}일)")

        # 뉴스 수집
        articles = await self.news_crawler.crawl_all(days=days)

        indexed_count = 0
        for article in articles:
            try:
                # 청킹
                chunks = self.document_processor.process_news_article(
                    title=article.get("title", ""),
                    content=article.get("content", ""),
                    source=article.get("source", ""),
                    url=article.get("url", ""),
                )

                # 임베딩 및 저장
                for chunk in chunks:
                    embedding = self.embedding_service.embed_document(chunk.content)
                    self.vector_store.add(
                        doc_id=f"news_{indexed_count}",
                        content=chunk.content,
                        embedding=embedding,
                        metadata=chunk.metadata,
                    )
                    indexed_count += 1

            except Exception as e:
                log.warning(f"뉴스 인덱싱 실패: {e}")

        log.info(f"뉴스 인덱싱 완료: {indexed_count}건")
        return indexed_count

    async def index_community(self, max_posts: int = 100) -> int:
        """
        커뮤니티 게시글 인덱싱

        Args:
            max_posts: 소스당 최대 수집 수

        Returns:
            인덱싱된 문서 수
        """
        if not self._initialized:
            await self.initialize()

        log.info("커뮤니티 게시글 인덱싱 시작")

        # 게시글 수집
        posts = await self.community_crawler.crawl_all(max_per_source=max_posts)

        indexed_count = 0
        for post in posts:
            try:
                # 청킹
                chunks = self.document_processor.process_community_post(
                    title=post.get("title", ""),
                    content=post.get("content", ""),
                    source=post.get("source", ""),
                    author=post.get("author"),
                    url=post.get("url"),
                )

                # 임베딩 및 저장
                for chunk in chunks:
                    embedding = self.embedding_service.embed_document(chunk.content)
                    self.vector_store.add(
                        doc_id=f"community_{indexed_count}",
                        content=chunk.content,
                        embedding=embedding,
                        metadata=chunk.metadata,
                    )
                    indexed_count += 1

            except Exception as e:
                log.warning(f"커뮤니티 게시글 인덱싱 실패: {e}")

        log.info(f"커뮤니티 게시글 인덱싱 완료: {indexed_count}건")
        return indexed_count

    async def index_admission_data(
        self,
        data: List[Dict[str, Any]],
    ) -> int:
        """
        입시 데이터 인덱싱

        Args:
            data: 입시 데이터 리스트

        Returns:
            인덱싱된 문서 수
        """
        if not self._initialized:
            await self.initialize()

        log.info(f"입시 데이터 인덱싱 시작: {len(data)}건")

        indexed_count = 0
        for item in data:
            try:
                chunks = self.document_processor.process_admission_data(
                    university=item.get("university", ""),
                    department=item.get("department", ""),
                    year=item.get("year", 2025),
                    data=item,
                )

                for chunk in chunks:
                    embedding = self.embedding_service.embed_document(chunk.content)
                    self.vector_store.add(
                        doc_id=f"admission_{indexed_count}",
                        content=chunk.content,
                        embedding=embedding,
                        metadata=chunk.metadata,
                    )
                    indexed_count += 1

            except Exception as e:
                log.warning(f"입시 데이터 인덱싱 실패: {e}")

        log.info(f"입시 데이터 인덱싱 완료: {indexed_count}건")
        return indexed_count

    def get_stats(self) -> Dict[str, Any]:
        """파이프라인 통계"""
        return {
            "initialized": self._initialized,
            "use_local": self.use_local,
            "vector_store": self.vector_store.get_stats() if hasattr(self.vector_store, 'get_stats') else {},
            "llm_available": self._llm is not None,
        }


# 편의 함수
async def ask_rag(
    question: str,
    university: Optional[str] = None,
    department: Optional[str] = None,
    year: Optional[int] = None,
) -> RAGResponse:
    """
    간단한 RAG 질문

    Args:
        question: 질문
        university: 대학명 필터
        department: 학과명 필터
        year: 연도 필터

    Returns:
        RAG 응답
    """
    pipeline = RAGPipeline(use_local=True)
    try:
        await pipeline.initialize()
        query = RAGQuery(
            question=question,
            university=university,
            department=department,
            year=year,
        )
        return await pipeline.query(query)
    finally:
        await pipeline.close()


# 테스트
async def test_rag_pipeline():
    """RAG 파이프라인 테스트"""
    pipeline = RAGPipeline(use_local=True)

    try:
        await pipeline.initialize()

        # 뉴스 인덱싱
        news_count = await pipeline.index_news(days=3)
        print(f"인덱싱된 뉴스: {news_count}건")

        # 커뮤니티 인덱싱
        community_count = await pipeline.index_community(max_posts=20)
        print(f"인덱싱된 커뮤니티 게시글: {community_count}건")

        # 질의
        query = RAGQuery(
            question="올해 연세대 경영학과 경쟁률은 어떤가요?",
            university="연세대",
        )
        response = await pipeline.query(query)

        print(f"\n질문: {query.question}")
        print(f"답변: {response.answer}")
        print(f"신뢰도: {response.confidence:.2f}")
        print(f"출처: {len(response.sources)}건")

    finally:
        await pipeline.close()


if __name__ == "__main__":
    asyncio.run(test_rag_pipeline())
