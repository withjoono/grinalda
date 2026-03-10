"""
예측기 테스트
"""
import pytest
import sys
from pathlib import Path

# 프로젝트 루트 추가
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.ml.features import StudentScore, DepartmentInfo, FeatureEngineer
from src.ml.models import XGBoostModel, LightGBMModel, CatBoostModel, EnsembleModel
from src.ml.predictor import AdmissionPredictor


class TestStudentScore:
    """StudentScore 테스트"""

    def test_create_student_score(self):
        """학생 성적 생성"""
        student = StudentScore(
            korean_standard=135,
            math_standard=140,
            english_grade=2,
            inquiry1_standard=68,
            inquiry2_standard=65,
        )
        assert student.korean_standard == 135
        assert student.math_standard == 140
        assert student.english_grade == 2

    def test_total_score_calculation(self):
        """총점 계산"""
        student = StudentScore(
            korean_standard=135,
            math_standard=140,
            english_grade=2,
            inquiry1_standard=68,
            inquiry2_standard=65,
        )
        # 국어 + 수학 + 탐구1 + 탐구2
        expected_total = 135 + 140 + 68 + 65
        assert student.total_standard == expected_total


class TestDepartmentInfo:
    """DepartmentInfo 테스트"""

    def test_create_department_info(self):
        """학과 정보 생성"""
        dept = DepartmentInfo(
            university="연세대학교",
            department="경영학과",
            tier="sky",
            category="인문",
        )
        assert dept.university == "연세대학교"
        assert dept.department == "경영학과"
        assert dept.tier == "sky"


class TestFeatureEngineer:
    """FeatureEngineer 테스트"""

    def test_create_features(self):
        """피처 생성"""
        engineer = FeatureEngineer()

        student = StudentScore(
            korean_standard=135,
            math_standard=140,
            english_grade=2,
            inquiry1_standard=68,
            inquiry2_standard=65,
        )

        dept = DepartmentInfo(
            university="연세대학교",
            department="경영학과",
            tier="sky",
            category="인문",
        )

        features = engineer.create_features(student, dept)
        assert len(features) > 0
        assert "korean_standard" in features
        assert "math_standard" in features


class TestModels:
    """ML 모델 테스트"""

    @pytest.fixture
    def sample_data(self):
        """샘플 데이터"""
        import pandas as pd
        import numpy as np

        np.random.seed(42)
        n_samples = 100

        X = pd.DataFrame({
            "korean_standard": np.random.randint(100, 150, n_samples),
            "math_standard": np.random.randint(100, 150, n_samples),
            "english_grade": np.random.randint(1, 5, n_samples),
            "inquiry1_standard": np.random.randint(50, 70, n_samples),
            "inquiry2_standard": np.random.randint(50, 70, n_samples),
            "total_standard": np.random.randint(350, 450, n_samples),
            "tier_encoded": np.random.randint(0, 4, n_samples),
            "category_encoded": np.random.randint(0, 4, n_samples),
        })
        y = pd.Series(np.random.randint(0, 2, n_samples))

        return X, y

    def test_xgboost_model(self, sample_data):
        """XGBoost 모델 테스트"""
        X, y = sample_data
        model = XGBoostModel()
        model.fit(X, y)
        assert model.is_trained

        proba = model.predict_proba(X)
        assert len(proba) == len(X)
        assert all(0 <= p <= 1 for p in proba)

    def test_lightgbm_model(self, sample_data):
        """LightGBM 모델 테스트"""
        X, y = sample_data
        model = LightGBMModel()
        model.fit(X, y)
        assert model.is_trained

    def test_catboost_model(self, sample_data):
        """CatBoost 모델 테스트"""
        X, y = sample_data
        model = CatBoostModel()
        model.fit(X, y)
        assert model.is_trained

    def test_ensemble_model(self, sample_data):
        """앙상블 모델 테스트"""
        X, y = sample_data
        model = EnsembleModel()
        model.fit(X, y)
        assert model.is_trained

        # 예측 테스트
        proba = model.predict_proba(X)
        assert len(proba) == len(X)

        # 평가 테스트
        metrics = model.evaluate(X, y)
        assert "accuracy" in metrics
        assert "roc_auc" in metrics


class TestAdmissionPredictor:
    """AdmissionPredictor 테스트"""

    def test_predict_single(self):
        """단일 예측"""
        predictor = AdmissionPredictor()

        student = StudentScore(
            korean_standard=135,
            math_standard=140,
            english_grade=2,
            inquiry1_standard=68,
            inquiry2_standard=65,
        )

        dept = DepartmentInfo(
            university="연세대학교",
            department="경영학과",
            tier="sky",
            category="인문",
        )

        result = predictor.predict(student, dept)

        assert result.university == "연세대학교"
        assert result.department == "경영학과"
        assert 0 <= result.probability <= 1
        assert result.recommendation in ["상향", "적정", "안전", "매우안전"]

    def test_predict_multiple(self):
        """다중 예측"""
        predictor = AdmissionPredictor()

        student = StudentScore(
            korean_standard=135,
            math_standard=140,
            english_grade=2,
            inquiry1_standard=68,
            inquiry2_standard=65,
        )

        departments = [
            DepartmentInfo(university="연세대학교", department="경영학과"),
            DepartmentInfo(university="고려대학교", department="경영학과"),
            DepartmentInfo(university="성균관대학교", department="경영학과"),
        ]

        results = predictor.predict_multiple(student, departments)

        assert len(results) == 3
        # 확률 순으로 정렬되어 있어야 함
        for i in range(len(results) - 1):
            assert results[i].probability >= results[i + 1].probability

    def test_suggest_optimal_choices(self):
        """최적 조합 추천"""
        predictor = AdmissionPredictor()

        student = StudentScore(
            korean_standard=135,
            math_standard=140,
            english_grade=2,
            inquiry1_standard=68,
            inquiry2_standard=65,
        )

        departments = [
            DepartmentInfo(university="연세대학교", department="경영학과"),
            DepartmentInfo(university="고려대학교", department="경영학과"),
            DepartmentInfo(university="성균관대학교", department="경영학과"),
            DepartmentInfo(university="한양대학교", department="경영학과"),
            DepartmentInfo(university="중앙대학교", department="경영학과"),
        ]

        result = predictor.suggest_optimal_choices(student, departments)

        assert "전략" in result
        assert "추천_조합" in result
        assert "상향" in result
        assert "적정" in result
        assert "안전" in result


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
