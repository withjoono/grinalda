"""
ML 모델 정의
XGBoost, LightGBM, CatBoost 앙상블
"""
from typing import Dict, List, Any, Optional, Tuple
from abc import ABC, abstractmethod
import numpy as np
import pandas as pd
from pathlib import Path
import joblib

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)
from sklearn.calibration import CalibratedClassifierCV

import xgboost as xgb
import lightgbm as lgb
import catboost as cb

from src.utils.logger import log


class BaseModel(ABC):
    """기본 모델 클래스"""

    def __init__(self, name: str):
        self.name = name
        self.model = None
        self.is_trained = False
        self.feature_importance_: Optional[Dict[str, float]] = None

    @abstractmethod
    def fit(self, X: pd.DataFrame, y: pd.Series, **kwargs):
        """모델 학습"""
        pass

    @abstractmethod
    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """예측"""
        pass

    @abstractmethod
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """확률 예측"""
        pass

    def save(self, path: str):
        """모델 저장"""
        joblib.dump(self.model, path)
        log.info(f"[{self.name}] 모델 저장: {path}")

    def load(self, path: str):
        """모델 로드"""
        self.model = joblib.load(path)
        self.is_trained = True
        log.info(f"[{self.name}] 모델 로드: {path}")


class XGBoostModel(BaseModel):
    """XGBoost 모델"""

    def __init__(self, params: Optional[Dict] = None):
        super().__init__("XGBoost")
        self.params = params or {
            "objective": "binary:logistic",
            "eval_metric": "auc",
            "max_depth": 6,
            "learning_rate": 0.1,
            "n_estimators": 200,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
            "min_child_weight": 1,
            "gamma": 0,
            "reg_alpha": 0.1,
            "reg_lambda": 1,
            "random_state": 42,
            "n_jobs": -1,
        }
        self.model = xgb.XGBClassifier(**self.params)

    def fit(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        eval_set: Optional[List[Tuple]] = None,
        early_stopping_rounds: int = 20,
        verbose: bool = False,
    ):
        """XGBoost 학습"""
        fit_params = {"verbose": verbose}

        if eval_set:
            fit_params["eval_set"] = eval_set
            fit_params["early_stopping_rounds"] = early_stopping_rounds

        self.model.fit(X, y, **fit_params)
        self.is_trained = True
        self.feature_importance_ = dict(zip(X.columns, self.model.feature_importances_))

        log.info(f"[{self.name}] 학습 완료")

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """예측"""
        return self.model.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """확률 예측"""
        return self.model.predict_proba(X)[:, 1]


class LightGBMModel(BaseModel):
    """LightGBM 모델"""

    def __init__(self, params: Optional[Dict] = None):
        super().__init__("LightGBM")
        self.params = params or {
            "objective": "binary",
            "metric": "auc",
            "boosting_type": "gbdt",
            "max_depth": 6,
            "learning_rate": 0.1,
            "n_estimators": 200,
            "num_leaves": 31,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
            "min_child_samples": 20,
            "reg_alpha": 0.1,
            "reg_lambda": 1,
            "random_state": 42,
            "n_jobs": -1,
            "verbose": -1,
        }
        self.model = lgb.LGBMClassifier(**self.params)

    def fit(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        eval_set: Optional[List[Tuple]] = None,
        early_stopping_rounds: int = 20,
        verbose: bool = False,
    ):
        """LightGBM 학습"""
        callbacks = []
        if not verbose:
            callbacks.append(lgb.log_evaluation(period=0))

        fit_params = {"callbacks": callbacks}

        if eval_set:
            fit_params["eval_set"] = eval_set

        self.model.fit(X, y, **fit_params)
        self.is_trained = True
        self.feature_importance_ = dict(zip(X.columns, self.model.feature_importances_))

        log.info(f"[{self.name}] 학습 완료")

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """예측"""
        return self.model.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """확률 예측"""
        return self.model.predict_proba(X)[:, 1]


class CatBoostModel(BaseModel):
    """CatBoost 모델"""

    def __init__(self, params: Optional[Dict] = None):
        super().__init__("CatBoost")
        self.params = params or {
            "loss_function": "Logloss",
            "eval_metric": "AUC",
            "iterations": 200,
            "depth": 6,
            "learning_rate": 0.1,
            "l2_leaf_reg": 3,
            "random_seed": 42,
            "verbose": False,
        }
        self.model = cb.CatBoostClassifier(**self.params)

    def fit(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        eval_set: Optional[List[Tuple]] = None,
        early_stopping_rounds: int = 20,
        verbose: bool = False,
    ):
        """CatBoost 학습"""
        fit_params = {"verbose": verbose}

        if eval_set:
            fit_params["eval_set"] = eval_set
            fit_params["early_stopping_rounds"] = early_stopping_rounds

        self.model.fit(X, y, **fit_params)
        self.is_trained = True
        self.feature_importance_ = dict(zip(X.columns, self.model.feature_importances_))

        log.info(f"[{self.name}] 학습 완료")

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """예측"""
        return self.model.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """확률 예측"""
        return self.model.predict_proba(X)[:, 1]


class EnsembleModel:
    """
    앙상블 모델

    XGBoost, LightGBM, CatBoost의 예측을 결합합니다.
    """

    def __init__(
        self,
        weights: Optional[Dict[str, float]] = None,
        use_stacking: bool = False,
    ):
        self.models = {
            "xgboost": XGBoostModel(),
            "lightgbm": LightGBMModel(),
            "catboost": CatBoostModel(),
        }
        self.weights = weights or {
            "xgboost": 0.35,
            "lightgbm": 0.35,
            "catboost": 0.30,
        }
        self.use_stacking = use_stacking
        self.meta_model = None  # 스태킹용 메타 모델
        self.is_trained = False
        self.calibrated_models = {}

    def fit(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        X_val: Optional[pd.DataFrame] = None,
        y_val: Optional[pd.Series] = None,
        calibrate: bool = True,
    ):
        """
        앙상블 학습

        Args:
            X: 학습 피처
            y: 학습 라벨
            X_val: 검증 피처
            y_val: 검증 라벨
            calibrate: 확률 캘리브레이션 여부
        """
        log.info("앙상블 모델 학습 시작")

        eval_set = None
        if X_val is not None and y_val is not None:
            eval_set = [(X_val, y_val)]

        # 개별 모델 학습
        for name, model in self.models.items():
            log.info(f"[{name}] 학습 중...")
            model.fit(X, y, eval_set=eval_set)

            # 확률 캘리브레이션
            if calibrate and X_val is not None:
                log.info(f"[{name}] 캘리브레이션 중...")
                calibrated = CalibratedClassifierCV(model.model, method="isotonic", cv="prefit")
                calibrated.fit(X_val, y_val)
                self.calibrated_models[name] = calibrated

        # 스태킹 메타 모델
        if self.use_stacking and X_val is not None:
            self._train_meta_model(X, y, X_val, y_val)

        self.is_trained = True
        log.info("앙상블 모델 학습 완료")

    def _train_meta_model(
        self,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        X_val: pd.DataFrame,
        y_val: pd.Series,
    ):
        """스태킹 메타 모델 학습"""
        # 기본 모델의 예측값을 피처로 사용
        meta_features_train = self._get_meta_features(X_train)
        meta_features_val = self._get_meta_features(X_val)

        # 간단한 로지스틱 회귀 메타 모델
        from sklearn.linear_model import LogisticRegression
        self.meta_model = LogisticRegression(random_state=42)
        self.meta_model.fit(meta_features_train, y_train)

        log.info("스태킹 메타 모델 학습 완료")

    def _get_meta_features(self, X: pd.DataFrame) -> np.ndarray:
        """메타 피처 생성 (기본 모델 예측값)"""
        meta_features = []
        for name, model in self.models.items():
            proba = model.predict_proba(X)
            meta_features.append(proba)
        return np.column_stack(meta_features)

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """앙상블 예측"""
        proba = self.predict_proba(X)
        return (proba >= 0.5).astype(int)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """
        앙상블 확률 예측

        가중 평균 또는 스태킹 방식으로 결합
        """
        if self.use_stacking and self.meta_model:
            meta_features = self._get_meta_features(X)
            return self.meta_model.predict_proba(meta_features)[:, 1]
        else:
            # 가중 평균
            weighted_proba = np.zeros(len(X))
            for name, model in self.models.items():
                if name in self.calibrated_models:
                    proba = self.calibrated_models[name].predict_proba(X)[:, 1]
                else:
                    proba = model.predict_proba(X)
                weighted_proba += self.weights[name] * proba
            return weighted_proba

    def predict_with_confidence(
        self,
        X: pd.DataFrame,
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        신뢰구간이 포함된 예측

        Returns:
            (예측값, 하위 신뢰구간, 상위 신뢰구간)
        """
        # 각 모델의 예측 수집
        predictions = []
        for name, model in self.models.items():
            proba = model.predict_proba(X)
            predictions.append(proba)

        predictions = np.array(predictions)

        mean_proba = np.mean(predictions, axis=0)
        std_proba = np.std(predictions, axis=0)

        lower = np.clip(mean_proba - 1.96 * std_proba, 0, 1)
        upper = np.clip(mean_proba + 1.96 * std_proba, 0, 1)

        return mean_proba, lower, upper

    def evaluate(
        self,
        X: pd.DataFrame,
        y: pd.Series,
    ) -> Dict[str, float]:
        """
        모델 평가

        Args:
            X: 테스트 피처
            y: 테스트 라벨

        Returns:
            평가 지표
        """
        y_pred = self.predict(X)
        y_proba = self.predict_proba(X)

        metrics = {
            "accuracy": accuracy_score(y, y_pred),
            "precision": precision_score(y, y_pred, zero_division=0),
            "recall": recall_score(y, y_pred, zero_division=0),
            "f1": f1_score(y, y_pred, zero_division=0),
            "roc_auc": roc_auc_score(y, y_proba),
        }

        # 개별 모델 평가
        for name, model in self.models.items():
            model_proba = model.predict_proba(X)
            metrics[f"{name}_auc"] = roc_auc_score(y, model_proba)

        return metrics

    def get_feature_importance(self) -> Dict[str, float]:
        """피처 중요도 (앙상블 평균)"""
        if not self.is_trained:
            return {}

        importance = {}
        for name, model in self.models.items():
            if model.feature_importance_:
                for feature, imp in model.feature_importance_.items():
                    if feature not in importance:
                        importance[feature] = 0
                    importance[feature] += imp * self.weights[name]

        # 정렬
        importance = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
        return importance

    def save(self, path: str):
        """앙상블 모델 저장"""
        path = Path(path)
        path.mkdir(parents=True, exist_ok=True)

        for name, model in self.models.items():
            model.save(str(path / f"{name}.joblib"))

        if self.meta_model:
            joblib.dump(self.meta_model, path / "meta_model.joblib")

        # 메타데이터
        metadata = {
            "weights": self.weights,
            "use_stacking": self.use_stacking,
        }
        joblib.dump(metadata, path / "metadata.joblib")

        log.info(f"앙상블 모델 저장: {path}")

    def load(self, path: str):
        """앙상블 모델 로드"""
        path = Path(path)

        for name, model in self.models.items():
            model.load(str(path / f"{name}.joblib"))

        meta_path = path / "meta_model.joblib"
        if meta_path.exists():
            self.meta_model = joblib.load(meta_path)

        metadata_path = path / "metadata.joblib"
        if metadata_path.exists():
            metadata = joblib.load(metadata_path)
            self.weights = metadata.get("weights", self.weights)
            self.use_stacking = metadata.get("use_stacking", False)

        self.is_trained = True
        log.info(f"앙상블 모델 로드: {path}")
