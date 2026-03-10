"""
모델 트레이너
ML 모델 학습 및 평가
"""
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path
import json
from datetime import datetime

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, roc_curve, auc
import joblib

from .features import FeatureEngineer, create_sample_data
from .models import EnsembleModel, XGBoostModel, LightGBMModel, CatBoostModel
from src.utils.logger import log


class ModelTrainer:
    """
    모델 트레이너

    데이터 준비, 모델 학습, 평가, 저장을 담당합니다.
    """

    def __init__(
        self,
        model_dir: str = "models",
        experiment_name: Optional[str] = None,
    ):
        self.model_dir = Path(model_dir)
        self.model_dir.mkdir(parents=True, exist_ok=True)

        self.experiment_name = experiment_name or datetime.now().strftime("%Y%m%d_%H%M%S")
        self.experiment_dir = self.model_dir / self.experiment_name
        self.experiment_dir.mkdir(exist_ok=True)

        self.feature_engineer = FeatureEngineer()
        self.model: Optional[EnsembleModel] = None

        # 학습 결과 저장
        self.training_history: Dict[str, Any] = {}
        self.evaluation_results: Dict[str, Any] = {}

    def prepare_data(
        self,
        records: List[Dict[str, Any]],
        test_size: float = 0.2,
        val_size: float = 0.1,
        random_state: int = 42,
    ) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, pd.Series]:
        """
        학습 데이터 준비

        Args:
            records: 과거 합격/불합격 기록
            test_size: 테스트 세트 비율
            val_size: 검증 세트 비율
            random_state: 랜덤 시드

        Returns:
            (X_train, X_val, X_test, y_train, y_val, y_test)
        """
        log.info(f"데이터 준비 중... ({len(records)}개 레코드)")

        # 피처 생성
        X, y = self.feature_engineer.prepare_training_data(records)

        # Train/Test 분리
        X_temp, X_test, y_temp, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )

        # Train/Val 분리
        val_ratio = val_size / (1 - test_size)
        X_train, X_val, y_train, y_val = train_test_split(
            X_temp, y_temp, test_size=val_ratio, random_state=random_state, stratify=y_temp
        )

        log.info(f"데이터 분리 완료: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)}")

        # 데이터 통계 저장
        self.training_history["data_stats"] = {
            "total_samples": len(records),
            "train_samples": len(X_train),
            "val_samples": len(X_val),
            "test_samples": len(X_test),
            "feature_count": len(X.columns),
            "positive_ratio": float(y.mean()),
        }

        return X_train, X_val, X_test, y_train, y_val, y_test

    def train(
        self,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        X_val: Optional[pd.DataFrame] = None,
        y_val: Optional[pd.Series] = None,
        use_stacking: bool = False,
        calibrate: bool = True,
    ) -> EnsembleModel:
        """
        모델 학습

        Args:
            X_train: 학습 피처
            y_train: 학습 라벨
            X_val: 검증 피처
            y_val: 검증 라벨
            use_stacking: 스태킹 사용 여부
            calibrate: 확률 캘리브레이션 여부

        Returns:
            학습된 앙상블 모델
        """
        log.info("모델 학습 시작")
        start_time = datetime.now()

        # 앙상블 모델 생성
        self.model = EnsembleModel(use_stacking=use_stacking)

        # 학습
        self.model.fit(
            X_train, y_train,
            X_val=X_val, y_val=y_val,
            calibrate=calibrate,
        )

        training_time = (datetime.now() - start_time).total_seconds()
        log.info(f"모델 학습 완료 (소요시간: {training_time:.2f}초)")

        # 학습 이력 저장
        self.training_history["training"] = {
            "use_stacking": use_stacking,
            "calibrate": calibrate,
            "training_time_seconds": training_time,
            "timestamp": datetime.now().isoformat(),
        }

        return self.model

    def evaluate(
        self,
        X_test: pd.DataFrame,
        y_test: pd.Series,
    ) -> Dict[str, Any]:
        """
        모델 평가

        Args:
            X_test: 테스트 피처
            y_test: 테스트 라벨

        Returns:
            평가 결과
        """
        if not self.model or not self.model.is_trained:
            raise ValueError("학습된 모델이 없습니다.")

        log.info("모델 평가 중...")

        # 기본 메트릭
        metrics = self.model.evaluate(X_test, y_test)

        # 상세 분류 리포트
        y_pred = self.model.predict(X_test)
        y_proba = self.model.predict_proba(X_test)

        report = classification_report(y_test, y_pred, output_dict=True)

        # ROC 커브
        fpr, tpr, thresholds = roc_curve(y_test, y_proba)
        roc_auc = auc(fpr, tpr)

        # 결과 저장
        self.evaluation_results = {
            "metrics": metrics,
            "classification_report": report,
            "roc_auc": roc_auc,
            "roc_curve": {
                "fpr": fpr.tolist(),
                "tpr": tpr.tolist(),
                "thresholds": thresholds.tolist(),
            },
        }

        log.info(f"평가 완료 - AUC: {roc_auc:.4f}, Accuracy: {metrics['accuracy']:.4f}")

        return self.evaluation_results

    def cross_validate(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        n_folds: int = 5,
    ) -> Dict[str, Any]:
        """
        교차 검증

        Args:
            X: 피처
            y: 라벨
            n_folds: 폴드 수

        Returns:
            교차 검증 결과
        """
        log.info(f"{n_folds}-Fold 교차 검증 시작")

        kfold = StratifiedKFold(n_splits=n_folds, shuffle=True, random_state=42)

        cv_results = {
            "xgboost": [],
            "lightgbm": [],
            "catboost": [],
        }

        for fold, (train_idx, val_idx) in enumerate(kfold.split(X, y)):
            X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
            y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

            # 각 모델 학습 및 평가
            for model_name, model_class in [
                ("xgboost", XGBoostModel),
                ("lightgbm", LightGBMModel),
                ("catboost", CatBoostModel),
            ]:
                model = model_class()
                model.fit(X_train, y_train)
                proba = model.predict_proba(X_val)
                from sklearn.metrics import roc_auc_score
                auc_score = roc_auc_score(y_val, proba)
                cv_results[model_name].append(auc_score)

            log.info(f"Fold {fold + 1}/{n_folds} 완료")

        # 결과 요약
        cv_summary = {}
        for model_name, scores in cv_results.items():
            cv_summary[model_name] = {
                "mean_auc": float(np.mean(scores)),
                "std_auc": float(np.std(scores)),
                "scores": scores,
            }

        log.info("교차 검증 완료")
        for name, result in cv_summary.items():
            log.info(f"  {name}: AUC = {result['mean_auc']:.4f} (+/- {result['std_auc']:.4f})")

        return cv_summary

    def tune_hyperparameters(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        n_trials: int = 50,
    ) -> Dict[str, Any]:
        """
        하이퍼파라미터 튜닝 (Optuna 사용)

        Args:
            X: 피처
            y: 라벨
            n_trials: 시도 횟수

        Returns:
            최적 파라미터
        """
        try:
            import optuna
            from optuna.samplers import TPESampler
        except ImportError:
            log.warning("Optuna가 설치되지 않았습니다. 기본 파라미터를 사용합니다.")
            return {}

        log.info(f"하이퍼파라미터 튜닝 시작 ({n_trials} trials)")

        def objective(trial):
            params = {
                "max_depth": trial.suggest_int("max_depth", 3, 10),
                "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
                "n_estimators": trial.suggest_int("n_estimators", 100, 500),
                "subsample": trial.suggest_float("subsample", 0.6, 1.0),
                "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
                "min_child_weight": trial.suggest_int("min_child_weight", 1, 10),
                "reg_alpha": trial.suggest_float("reg_alpha", 1e-8, 10.0, log=True),
                "reg_lambda": trial.suggest_float("reg_lambda", 1e-8, 10.0, log=True),
            }

            model = XGBoostModel(params)

            # 교차 검증
            kfold = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
            scores = []

            for train_idx, val_idx in kfold.split(X, y):
                X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
                y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

                model.fit(X_train, y_train)
                proba = model.predict_proba(X_val)
                from sklearn.metrics import roc_auc_score
                scores.append(roc_auc_score(y_val, proba))

            return np.mean(scores)

        sampler = TPESampler(seed=42)
        study = optuna.create_study(direction="maximize", sampler=sampler)
        study.optimize(objective, n_trials=n_trials, show_progress_bar=True)

        best_params = study.best_params
        best_score = study.best_value

        log.info(f"최적 파라미터 찾음 (AUC: {best_score:.4f})")
        log.info(f"Best params: {best_params}")

        return {
            "best_params": best_params,
            "best_score": best_score,
        }

    def save(self, filename: str = "model"):
        """
        모델 및 메타데이터 저장

        Args:
            filename: 파일명 (확장자 제외)
        """
        if not self.model:
            raise ValueError("저장할 모델이 없습니다.")

        # 모델 저장
        model_path = self.experiment_dir / filename
        self.model.save(str(model_path))

        # 메타데이터 저장
        metadata = {
            "experiment_name": self.experiment_name,
            "training_history": self.training_history,
            "evaluation_results": self.evaluation_results,
            "feature_names": self.feature_engineer.get_feature_names(),
            "feature_importance": self.model.get_feature_importance(),
            "saved_at": datetime.now().isoformat(),
        }

        metadata_path = self.experiment_dir / "metadata.json"
        with open(metadata_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2, default=str)

        log.info(f"모델 저장 완료: {self.experiment_dir}")

    def load(self, experiment_name: str, filename: str = "model"):
        """
        모델 로드

        Args:
            experiment_name: 실험 이름
            filename: 파일명
        """
        experiment_dir = self.model_dir / experiment_name
        model_path = experiment_dir / filename

        self.model = EnsembleModel()
        self.model.load(str(model_path))

        # 메타데이터 로드
        metadata_path = experiment_dir / "metadata.json"
        if metadata_path.exists():
            with open(metadata_path, "r", encoding="utf-8") as f:
                metadata = json.load(f)
            self.training_history = metadata.get("training_history", {})
            self.evaluation_results = metadata.get("evaluation_results", {})

        self.experiment_name = experiment_name
        log.info(f"모델 로드 완료: {experiment_dir}")

    def run_full_pipeline(
        self,
        records: List[Dict[str, Any]],
        use_sample_data: bool = False,
    ) -> Dict[str, Any]:
        """
        전체 학습 파이프라인 실행

        Args:
            records: 학습 데이터
            use_sample_data: 샘플 데이터 사용 여부 (테스트용)

        Returns:
            학습 결과
        """
        log.info("=== 전체 학습 파이프라인 시작 ===")

        # 샘플 데이터 사용
        if use_sample_data or not records:
            log.info("샘플 데이터 생성 중...")
            records = create_sample_data(n_samples=2000)

        # 1. 데이터 준비
        X_train, X_val, X_test, y_train, y_val, y_test = self.prepare_data(records)

        # 2. 교차 검증
        cv_results = self.cross_validate(pd.concat([X_train, X_val]), pd.concat([y_train, y_val]))

        # 3. 모델 학습
        self.train(X_train, y_train, X_val, y_val)

        # 4. 평가
        eval_results = self.evaluate(X_test, y_test)

        # 5. 저장
        self.save()

        # 결과 요약
        summary = {
            "experiment_name": self.experiment_name,
            "data_stats": self.training_history.get("data_stats", {}),
            "cv_results": cv_results,
            "test_results": eval_results["metrics"],
            "feature_importance_top10": dict(
                list(self.model.get_feature_importance().items())[:10]
            ),
        }

        log.info("=== 학습 파이프라인 완료 ===")
        log.info(f"테스트 AUC: {eval_results['metrics']['roc_auc']:.4f}")
        log.info(f"테스트 Accuracy: {eval_results['metrics']['accuracy']:.4f}")

        return summary


# 테스트
def test_trainer():
    """트레이너 테스트"""
    trainer = ModelTrainer(experiment_name="test_run")
    results = trainer.run_full_pipeline([], use_sample_data=True)
    print("학습 결과:", json.dumps(results, indent=2, default=str))


if __name__ == "__main__":
    test_trainer()
