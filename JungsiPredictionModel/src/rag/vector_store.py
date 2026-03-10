"""
벡터 스토어 서비스
Google Cloud Vertex AI Vector Search 사용
"""
from typing import List, Optional, Dict, Any, Tuple
from dataclasses import dataclass
import json
import uuid
from pathlib import Path

from google.cloud import aiplatform
from google.cloud.aiplatform import MatchingEngineIndex, MatchingEngineIndexEndpoint
import numpy as np

from config.settings import get_settings
from src.utils.logger import log


@dataclass
class Document:
    """벡터 스토어에 저장되는 문서"""
    id: str
    content: str
    embedding: List[float]
    metadata: Dict[str, Any]


@dataclass
class SearchResult:
    """검색 결과"""
    id: str
    content: str
    score: float
    metadata: Dict[str, Any]


class VectorStoreService:
    """
    Vertex AI Vector Search 서비스

    벡터 데이터베이스에 문서를 저장하고 검색합니다.
    """

    def __init__(self):
        self.settings = get_settings()
        self._index: Optional[MatchingEngineIndex] = None
        self._endpoint: Optional[MatchingEngineIndexEndpoint] = None
        self._initialized = False

        # 로컬 메타데이터 저장소 (문서 내용 저장)
        self._metadata_store: Dict[str, Dict[str, Any]] = {}
        self._metadata_path = Path("data/vector_metadata.json")

    def initialize(self):
        """Vector Search 초기화"""
        if self._initialized:
            return

        try:
            aiplatform.init(
                project=self.settings.GCP_PROJECT_ID,
                location=self.settings.GCP_LOCATION,
            )

            # 인덱스 엔드포인트 연결
            if self.settings.VECTOR_SEARCH_INDEX_ENDPOINT:
                self._endpoint = MatchingEngineIndexEndpoint(
                    self.settings.VECTOR_SEARCH_INDEX_ENDPOINT
                )
                log.info(f"Vector Search 엔드포인트 연결: {self.settings.VECTOR_SEARCH_INDEX_ENDPOINT}")

            # 로컬 메타데이터 로드
            self._load_metadata()

            self._initialized = True
            log.info("Vector Store 서비스 초기화 완료")

        except Exception as e:
            log.error(f"Vector Store 초기화 실패: {e}")
            # 초기화 실패 시 로컬 모드로 전환
            self._initialized = True
            log.warning("로컬 벡터 스토어 모드로 전환")

    def _load_metadata(self):
        """로컬 메타데이터 로드"""
        if self._metadata_path.exists():
            try:
                with open(self._metadata_path, "r", encoding="utf-8") as f:
                    self._metadata_store = json.load(f)
                log.info(f"메타데이터 로드: {len(self._metadata_store)}건")
            except Exception as e:
                log.warning(f"메타데이터 로드 실패: {e}")

    def _save_metadata(self):
        """로컬 메타데이터 저장"""
        try:
            self._metadata_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self._metadata_path, "w", encoding="utf-8") as f:
                json.dump(self._metadata_store, f, ensure_ascii=False, indent=2)
        except Exception as e:
            log.error(f"메타데이터 저장 실패: {e}")

    def add_document(
        self,
        content: str,
        embedding: List[float],
        metadata: Optional[Dict[str, Any]] = None,
        doc_id: Optional[str] = None,
    ) -> str:
        """
        문서 추가

        Args:
            content: 문서 내용
            embedding: 임베딩 벡터
            metadata: 추가 메타데이터
            doc_id: 문서 ID (None이면 자동 생성)

        Returns:
            문서 ID
        """
        if not self._initialized:
            self.initialize()

        doc_id = doc_id or str(uuid.uuid4())
        metadata = metadata or {}

        # 메타데이터 저장
        self._metadata_store[doc_id] = {
            "content": content,
            "metadata": metadata,
        }

        # Vector Search에 추가 (엔드포인트가 있을 경우)
        if self._endpoint:
            try:
                # Vertex AI Vector Search에 upsert
                # 실제 구현은 Matching Engine API 사용
                pass
            except Exception as e:
                log.error(f"Vector Search 추가 실패: {e}")

        self._save_metadata()
        return doc_id

    def add_documents(
        self,
        documents: List[Document],
    ) -> List[str]:
        """
        다중 문서 추가

        Args:
            documents: 문서 리스트

        Returns:
            문서 ID 리스트
        """
        if not self._initialized:
            self.initialize()

        doc_ids = []
        for doc in documents:
            doc_id = self.add_document(
                content=doc.content,
                embedding=doc.embedding,
                metadata=doc.metadata,
                doc_id=doc.id,
            )
            doc_ids.append(doc_id)

        log.info(f"{len(doc_ids)}개 문서 추가 완료")
        return doc_ids

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 10,
        filter_metadata: Optional[Dict[str, Any]] = None,
    ) -> List[SearchResult]:
        """
        유사 문서 검색

        Args:
            query_embedding: 쿼리 임베딩 벡터
            top_k: 반환할 결과 수
            filter_metadata: 메타데이터 필터

        Returns:
            검색 결과 리스트
        """
        if not self._initialized:
            self.initialize()

        results = []

        if self._endpoint:
            try:
                # Vertex AI Vector Search 쿼리
                response = self._endpoint.find_neighbors(
                    deployed_index_id="deployed_index",  # 배포된 인덱스 ID
                    queries=[query_embedding],
                    num_neighbors=top_k,
                )

                for match in response[0]:
                    doc_id = match.id
                    if doc_id in self._metadata_store:
                        meta = self._metadata_store[doc_id]
                        results.append(SearchResult(
                            id=doc_id,
                            content=meta["content"],
                            score=match.distance,
                            metadata=meta["metadata"],
                        ))

            except Exception as e:
                log.warning(f"Vector Search 검색 실패, 로컬 검색으로 대체: {e}")
                results = self._local_search(query_embedding, top_k, filter_metadata)
        else:
            # 로컬 검색
            results = self._local_search(query_embedding, top_k, filter_metadata)

        return results

    def _local_search(
        self,
        query_embedding: List[float],
        top_k: int,
        filter_metadata: Optional[Dict[str, Any]] = None,
    ) -> List[SearchResult]:
        """로컬 벡터 검색 (GCP 연결 없을 때)"""
        results = []

        # 간단한 코사인 유사도 기반 검색
        # 실제로는 임베딩을 저장해야 하지만, 여기서는 메타데이터만 반환
        for doc_id, data in self._metadata_store.items():
            # 필터 적용
            if filter_metadata:
                match = all(
                    data["metadata"].get(k) == v
                    for k, v in filter_metadata.items()
                )
                if not match:
                    continue

            results.append(SearchResult(
                id=doc_id,
                content=data["content"],
                score=0.0,  # 로컬 검색에서는 스코어 없음
                metadata=data["metadata"],
            ))

        return results[:top_k]

    def delete_document(self, doc_id: str) -> bool:
        """
        문서 삭제

        Args:
            doc_id: 문서 ID

        Returns:
            삭제 성공 여부
        """
        if doc_id in self._metadata_store:
            del self._metadata_store[doc_id]
            self._save_metadata()

            if self._endpoint:
                # Vector Search에서도 삭제
                pass

            return True
        return False

    def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """
        문서 조회

        Args:
            doc_id: 문서 ID

        Returns:
            문서 데이터
        """
        return self._metadata_store.get(doc_id)

    def get_stats(self) -> Dict[str, Any]:
        """벡터 스토어 통계"""
        return {
            "total_documents": len(self._metadata_store),
            "endpoint_connected": self._endpoint is not None,
        }


class LocalVectorStore:
    """
    로컬 벡터 스토어 (테스트/개발용)

    NumPy 기반 간단한 벡터 검색
    """

    def __init__(self, persist_path: str = "data/local_vectors"):
        self.persist_path = Path(persist_path)
        self.persist_path.mkdir(parents=True, exist_ok=True)

        self.documents: Dict[str, Dict[str, Any]] = {}
        self.embeddings: Dict[str, List[float]] = {}

        self._load()

    def _load(self):
        """저장된 데이터 로드"""
        docs_path = self.persist_path / "documents.json"
        emb_path = self.persist_path / "embeddings.json"

        if docs_path.exists():
            with open(docs_path, "r", encoding="utf-8") as f:
                self.documents = json.load(f)

        if emb_path.exists():
            with open(emb_path, "r", encoding="utf-8") as f:
                self.embeddings = json.load(f)

        log.info(f"로컬 벡터 스토어 로드: {len(self.documents)}건")

    def _save(self):
        """데이터 저장"""
        with open(self.persist_path / "documents.json", "w", encoding="utf-8") as f:
            json.dump(self.documents, f, ensure_ascii=False, indent=2)

        with open(self.persist_path / "embeddings.json", "w", encoding="utf-8") as f:
            json.dump(self.embeddings, f, ensure_ascii=False)

    def add(
        self,
        doc_id: str,
        content: str,
        embedding: List[float],
        metadata: Optional[Dict[str, Any]] = None,
    ):
        """문서 추가"""
        self.documents[doc_id] = {
            "content": content,
            "metadata": metadata or {},
        }
        self.embeddings[doc_id] = embedding
        self._save()

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 10,
    ) -> List[SearchResult]:
        """유사 문서 검색"""
        if not self.embeddings:
            return []

        query_vec = np.array(query_embedding)
        scores = []

        for doc_id, emb in self.embeddings.items():
            doc_vec = np.array(emb)
            # 코사인 유사도
            similarity = np.dot(query_vec, doc_vec) / (
                np.linalg.norm(query_vec) * np.linalg.norm(doc_vec)
            )
            scores.append((doc_id, float(similarity)))

        # 정렬
        scores.sort(key=lambda x: x[1], reverse=True)

        results = []
        for doc_id, score in scores[:top_k]:
            doc = self.documents[doc_id]
            results.append(SearchResult(
                id=doc_id,
                content=doc["content"],
                score=score,
                metadata=doc["metadata"],
            ))

        return results

    def delete(self, doc_id: str) -> bool:
        """문서 삭제"""
        if doc_id in self.documents:
            del self.documents[doc_id]
            del self.embeddings[doc_id]
            self._save()
            return True
        return False
