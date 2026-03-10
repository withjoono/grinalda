"""
API 테스트 (NestJS 연동 버전)
"""
import pytest
import sys
from pathlib import Path

# 프로젝트 루트 추가
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from src.api.app import app


@pytest.fixture
def client():
    """테스트 클라이언트"""
    return TestClient(app)


class TestHealthCheck:
    """헬스체크 테스트"""

    def test_root(self, client):
        """루트 엔드포인트"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "service" in data
        assert data["service"] == "정시 합격 예측 API"

    def test_health(self, client):
        """헬스체크 엔드포인트"""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "services" in data
        assert data["version"] == "1.0.0"


class TestPredictionAPI:
    """예측 API 테스트 (NestJS 연동)"""

    def test_predict_success(self, client):
        """예측 성공 (NestJS 형식)"""
        payload = {
            "university_id": 123,
            "admission_id": 456,
            "scores": {
                "korean": 131,
                "math": 140,
                "english": 1,
                "inquiry1": 68,
                "inquiry2": 65,
                "history": 1,
                "second_foreign": None
            },
            "track": "자연"
        }

        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 200

        data = response.json()
        # NestJS 응답 형식 검증
        assert "probability" in data
        assert "risk_level" in data
        assert "expected_competition" in data
        assert "converted_score" in data
        assert "estimated_cutline" in data
        assert "model_version" in data
        assert "analysis" in data

        # 값 범위 검증
        assert 0 <= data["probability"] <= 100
        assert data["risk_level"] in ["very_low", "low", "moderate", "high", "very_high"]
        assert data["model_version"] == "1.0.0"

    def test_predict_humanities_track(self, client):
        """인문계열 예측"""
        payload = {
            "university_id": 1,
            "admission_id": 100,
            "scores": {
                "korean": 140,
                "math": 130,
                "english": 2,
                "inquiry1": 65,
                "inquiry2": 63,
                "history": 1,
                "second_foreign": 2
            },
            "track": "인문"
        }

        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 200

    def test_predict_validation_error(self, client):
        """유효성 검사 에러"""
        payload = {
            "university_id": 123,
            "admission_id": 456,
            "scores": {
                "korean": 300,  # 200 초과 - 에러
                "math": 140,
                "english": 1,
                "inquiry1": 68,
                "inquiry2": 65
            },
            "track": "자연"
        }

        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 422

    def test_predict_missing_field(self, client):
        """필수 필드 누락"""
        payload = {
            "university_id": 123,
            # admission_id 누락
            "scores": {
                "korean": 131,
                "math": 140,
                "english": 1,
                "inquiry1": 68,
                "inquiry2": 65
            },
            "track": "자연"
        }

        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 422


class TestLegacyPredictionAPI:
    """레거시 예측 API 테스트"""

    def test_legacy_predict(self, client):
        """레거시 예측"""
        payload = {
            "student": {
                "korean_standard": 135,
                "math_standard": 140,
                "english_grade": 2,
                "inquiry1_standard": 68,
                "inquiry2_standard": 65,
            },
            "departments": [
                {
                    "university": "연세대학교",
                    "department": "경영학과",
                }
            ],
            "include_realtime": False,
            "include_rag": False,
        }

        response = client.post("/api/v1/predict/legacy", json=payload)
        assert response.status_code == 200

        data = response.json()
        assert "predictions" in data
        assert "summary" in data
        assert len(data["predictions"]) == 1


class TestRAGAPI:
    """RAG API 테스트"""

    def test_rag_query(self, client):
        """RAG 질의"""
        payload = {
            "question": "올해 연세대 경영학과 경쟁률은 어떤가요?",
            "university_id": 123
        }

        response = client.post("/api/v1/rag/query", json=payload)
        assert response.status_code == 200

        data = response.json()
        assert "answer" in data
        assert "confidence" in data
        assert "sources" in data

    def test_rag_query_with_legacy_params(self, client):
        """RAG 질의 (레거시 파라미터)"""
        payload = {
            "question": "연세대 경영학과 합격선은?",
            "university": "연세대학교",
            "department": "경영학과"
        }

        response = client.post("/api/v1/rag/query", json=payload)
        assert response.status_code == 200


class TestCompetitionAPI:
    """경쟁률 API 테스트"""

    def test_get_competition_rates(self, client):
        """경쟁률 조회"""
        response = client.get(
            "/api/v1/competition",
            params={
                "university_id": 1,
                "admission_id": 100,
                "year": 2025,
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

        # 응답 구조 검증
        item = data[0]
        assert "university_id" in item
        assert "admission_id" in item
        assert "university_name" in item
        assert "department_name" in item
        assert "current_rate" in item

    def test_get_competition_legacy_params(self, client):
        """경쟁률 조회 (레거시 파라미터)"""
        response = client.get(
            "/api/v1/competition",
            params={
                "university": "연세대학교",
                "department": "경영학과",
                "year": 2025,
            },
        )

        assert response.status_code == 200


class TestSearchAPI:
    """검색 API 테스트"""

    def test_search_universities(self, client):
        """대학 검색"""
        response = client.get(
            "/api/v1/universities",
            params={"query": "연세"},
        )

        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert "total" in data

        # ID 포함 확인
        if data["results"]:
            assert "id" in data["results"][0]
            assert "name" in data["results"][0]

    def test_search_departments(self, client):
        """학과 검색"""
        response = client.get(
            "/api/v1/departments",
            params={"query": "경영", "university_id": 1},
        )

        assert response.status_code == 200
        data = response.json()
        assert "results" in data

        # ID 포함 확인
        if data["results"]:
            assert "admission_id" in data["results"][0]
            assert "university_id" in data["results"][0]


class TestStatsAPI:
    """통계 API 테스트"""

    def test_get_popular_departments(self, client):
        """인기 학과"""
        response = client.get(
            "/api/v1/stats/popular",
            params={"year": 2025},
        )

        assert response.status_code == 200
        data = response.json()
        assert "rankings" in data

        # ID 포함 확인
        if data["rankings"]:
            assert "university_id" in data["rankings"][0]
            assert "admission_id" in data["rankings"][0]

    def test_get_trends(self, client):
        """경쟁률 추이"""
        response = client.get(
            "/api/v1/stats/trends",
            params={
                "university_id": 1,
                "admission_id": 100,
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "trends" in data


class TestErrorHandling:
    """에러 핸들링 테스트"""

    def test_invalid_endpoint(self, client):
        """존재하지 않는 엔드포인트"""
        response = client.get("/api/v1/invalid")
        assert response.status_code == 404

    def test_method_not_allowed(self, client):
        """허용되지 않는 메소드"""
        response = client.put("/api/v1/predict")
        assert response.status_code == 405


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
