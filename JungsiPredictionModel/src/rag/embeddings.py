"""
임베딩 서비스
Google Cloud Vertex AI 임베딩 모델 사용
"""
from typing import List, Optional, Dict, Any
import asyncio
from functools import lru_cache

from google.cloud import aiplatform
from google.cloud.aiplatform import TextEmbeddingInput, TextEmbeddingModel
import numpy as np

from config.settings import get_settings
from src.utils.logger import log


class EmbeddingService:
    """
    텍스트 임베딩 서비스

    Google Cloud Vertex AI의 text-embedding 모델을 사용하여
    텍스트를 벡터로 변환합니다.
    """

    def __init__(self):
        self.settings = get_settings()
        self._model: Optional[TextEmbeddingModel] = None
        self._initialized = False

    def initialize(self):
        """Vertex AI 초기화"""
        if self._initialized:
            return

        try:
            aiplatform.init(
                project=self.settings.GCP_PROJECT_ID,
                location=self.settings.GCP_LOCATION,
            )

            self._model = TextEmbeddingModel.from_pretrained(
                self.settings.VERTEX_AI_EMBEDDING_MODEL
            )
            self._initialized = True
            log.info(f"임베딩 서비스 초기화 완료: {self.settings.VERTEX_AI_EMBEDDING_MODEL}")

        except Exception as e:
            log.error(f"임베딩 서비스 초기화 실패: {e}")
            raise

    def embed_text(self, text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> List[float]:
        """
        단일 텍스트 임베딩

        Args:
            text: 임베딩할 텍스트
            task_type: 태스크 유형
                - RETRIEVAL_DOCUMENT: 문서 임베딩 (검색 대상)
                - RETRIEVAL_QUERY: 쿼리 임베딩 (검색어)
                - SEMANTIC_SIMILARITY: 유사도 비교
                - CLASSIFICATION: 분류

        Returns:
            임베딩 벡터 (768차원)
        """
        if not self._initialized:
            self.initialize()

        try:
            inputs = [TextEmbeddingInput(text=text, task_type=task_type)]
            embeddings = self._model.get_embeddings(inputs)
            return embeddings[0].values

        except Exception as e:
            log.error(f"텍스트 임베딩 실패: {e}")
            raise

    def embed_texts(
        self,
        texts: List[str],
        task_type: str = "RETRIEVAL_DOCUMENT",
        batch_size: int = 100,
    ) -> List[List[float]]:
        """
        다중 텍스트 임베딩 (배치)

        Args:
            texts: 임베딩할 텍스트 리스트
            task_type: 태스크 유형
            batch_size: 배치 크기

        Returns:
            임베딩 벡터 리스트
        """
        if not self._initialized:
            self.initialize()

        all_embeddings = []

        # 배치 처리
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            try:
                inputs = [
                    TextEmbeddingInput(text=text, task_type=task_type)
                    for text in batch
                ]
                embeddings = self._model.get_embeddings(inputs)
                all_embeddings.extend([e.values for e in embeddings])

                log.debug(f"임베딩 배치 완료: {i + len(batch)}/{len(texts)}")

            except Exception as e:
                log.error(f"배치 임베딩 실패 ({i}-{i + batch_size}): {e}")
                # 실패한 배치는 빈 벡터로 대체
                all_embeddings.extend([[] for _ in batch])

        return all_embeddings

    def embed_query(self, query: str) -> List[float]:
        """
        검색 쿼리 임베딩

        Args:
            query: 검색 쿼리

        Returns:
            쿼리 임베딩 벡터
        """
        return self.embed_text(query, task_type="RETRIEVAL_QUERY")

    def embed_document(self, document: str) -> List[float]:
        """
        문서 임베딩

        Args:
            document: 문서 텍스트

        Returns:
            문서 임베딩 벡터
        """
        return self.embed_text(document, task_type="RETRIEVAL_DOCUMENT")

    @staticmethod
    def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """
        코사인 유사도 계산

        Args:
            vec1: 벡터 1
            vec2: 벡터 2

        Returns:
            코사인 유사도 (-1 ~ 1)
        """
        a = np.array(vec1)
        b = np.array(vec2)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

    def find_most_similar(
        self,
        query_embedding: List[float],
        document_embeddings: List[List[float]],
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        가장 유사한 문서 찾기

        Args:
            query_embedding: 쿼리 임베딩
            document_embeddings: 문서 임베딩 리스트
            top_k: 반환할 결과 수

        Returns:
            유사도 순 정렬된 결과
        """
        similarities = []
        for i, doc_emb in enumerate(document_embeddings):
            if doc_emb:  # 빈 벡터 제외
                sim = self.cosine_similarity(query_embedding, doc_emb)
                similarities.append({"index": i, "similarity": sim})

        # 유사도 순 정렬
        similarities.sort(key=lambda x: x["similarity"], reverse=True)

        return similarities[:top_k]


class LocalEmbeddingService:
    """
    로컬 임베딩 서비스 (테스트/개발용)

    GCP 연결 없이 테스트할 때 사용
    sentence-transformers 사용
    """

    def __init__(self, model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"):
        self.model_name = model_name
        self._model = None
        self._initialized = False

    def initialize(self):
        """모델 로드"""
        if self._initialized:
            return

        try:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name)
            self._initialized = True
            log.info(f"로컬 임베딩 모델 로드 완료: {self.model_name}")
        except ImportError:
            log.error("sentence-transformers가 설치되지 않았습니다.")
            raise
        except Exception as e:
            log.error(f"로컬 임베딩 모델 로드 실패: {e}")
            raise

    def embed_text(self, text: str, **kwargs) -> List[float]:
        """단일 텍스트 임베딩"""
        if not self._initialized:
            self.initialize()
        return self._model.encode(text).tolist()

    def embed_texts(self, texts: List[str], **kwargs) -> List[List[float]]:
        """다중 텍스트 임베딩"""
        if not self._initialized:
            self.initialize()
        return [emb.tolist() for emb in self._model.encode(texts)]

    def embed_query(self, query: str) -> List[float]:
        """검색 쿼리 임베딩"""
        return self.embed_text(query)

    def embed_document(self, document: str) -> List[float]:
        """문서 임베딩"""
        return self.embed_text(document)


# 팩토리 함수
def get_embedding_service(use_local: bool = False):
    """
    임베딩 서비스 팩토리

    Args:
        use_local: True면 로컬 모델 사용

    Returns:
        임베딩 서비스 인스턴스
    """
    settings = get_settings()

    if use_local or not settings.GCP_PROJECT_ID:
        log.info("로컬 임베딩 서비스 사용")
        return LocalEmbeddingService()
    else:
        log.info("Google Cloud 임베딩 서비스 사용")
        return EmbeddingService()
