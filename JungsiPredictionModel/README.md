# 정시 합격 예측 시스템

머신러닝 + RAG 기반 대학 정시 입시 합격 예측 플랫폼

## 주요 기능

### 1. 실시간 경쟁률 크롤링
- **어디가**: 대입정보포털 공식 데이터
- **진학사**: 모의지원 현황 및 분석
- **유웨이**: 실시간 지원 현황

### 2. ML 앙상블 예측 모델
- **XGBoost**: Gradient Boosting
- **LightGBM**: Leaf-wise 학습
- **CatBoost**: 범주형 변수 처리
- **Stacking**: 메타 학습기 앙상블

### 3. RAG (Retrieval-Augmented Generation)
- Google Cloud Vertex AI 임베딩
- 뉴스 및 커뮤니티 데이터 실시간 수집
- 입시 관련 질의응답

### 4. 예측 기능
- 합격 확률 예측 (신뢰구간 포함)
- 상향/적정/안전 지원 추천
- 최적 지원 조합 제안
- 쏠림 지수 분석

## 빠른 시작 (Cloud Run 배포)

```bash
# 1. GCP 로그인
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. 배포 스크립트 실행
./deploy.sh --project-id YOUR_PROJECT_ID

# 3. 완료! 서비스 URL 확인
# https://jungsi-prediction-api-xxx.run.app/docs
```

> 상세 배포 가이드: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│                     (FastAPI REST)                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Predictor  │  │ RAG Pipeline │  │  Crawler Manager   │ │
│  │  Service    │  │   Service    │  │     Service        │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
├─────────┴─────────────────┴─────────────────────┴───────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Ensemble  │  │  Vector DB  │  │   경쟁률 크롤러     │ │
│  │    Model    │  │  (Vertex)   │  │ (어디가/진학사/유웨이)│ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
├─────────┴─────────────────┴─────────────────────┴───────────┤
│                    PostgreSQL Database                       │
└─────────────────────────────────────────────────────────────┘
```

## 설치 방법

### 요구사항
- Python 3.11+
- PostgreSQL 15+
- (선택) Google Cloud 계정

### 1. 저장소 클론
```bash
git clone https://github.com/your-repo/JungsiPredictionModel.git
cd JungsiPredictionModel
```

### 2. 가상환경 생성
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. 의존성 설치
```bash
pip install -r requirements.txt

# Playwright 브라우저 설치 (크롤링용)
playwright install chromium
```

### 4. 환경변수 설정
```bash
cp .env.example .env
# .env 파일 수정
```

### 5. 데이터베이스 설정
```bash
# PostgreSQL 데이터베이스 생성
createdb jungsi_prediction

# 마이그레이션 실행
alembic upgrade head
```

## 사용 방법

### CLI 명령어

```bash
# API 서버 실행
python main.py api

# 경쟁률 크롤링
python main.py crawl
python main.py crawl --year 2025 --sources adiga jinhak

# RAG 데이터 인덱싱
python main.py index
python main.py index --days 7

# 모델 학습
python main.py train

# 예측 데모
python main.py demo

# RAG 데모
python main.py rag-demo
```

### Docker 실행

```bash
# 전체 스택 실행
docker-compose up -d

# 크롤러 실행
docker-compose --profile crawler up crawler

# RAG 인덱서 실행
docker-compose --profile indexer up indexer
```

## API 엔드포인트

### 합격 예측
```http
POST /api/v1/predict
Content-Type: application/json

{
  "student": {
    "korean_standard": 135,
    "math_standard": 140,
    "english_grade": 2,
    "inquiry1_standard": 68,
    "inquiry2_standard": 65
  },
  "departments": [
    {
      "university": "연세대학교",
      "department": "경영학과"
    }
  ]
}
```

### 빠른 예측
```http
GET /api/v1/predict/quick?korean=135&math=140&english=2&inquiry1=68&inquiry2=65&university=연세대학교&department=경영학과
```

### RAG 질의
```http
POST /api/v1/rag/query
Content-Type: application/json

{
  "question": "올해 연세대 경영학과 경쟁률은 어떤가요?",
  "university": "연세대학교"
}
```

### 경쟁률 조회
```http
GET /api/v1/competition?university=연세대학교&department=경영학과&year=2025
```

### 헬스체크
```http
GET /api/v1/health
```

## 프로젝트 구조

```
JungsiPredictionModel/
├── config/
│   └── settings.py          # 설정 관리
├── src/
│   ├── api/
│   │   ├── app.py           # FastAPI 앱
│   │   ├── routes.py        # API 라우트
│   │   └── schemas.py       # Pydantic 스키마
│   ├── crawlers/
│   │   ├── base_crawler.py  # 기본 크롤러
│   │   ├── adiga_crawler.py # 어디가 크롤러
│   │   ├── jinhak_crawler.py# 진학사 크롤러
│   │   ├── uway_crawler.py  # 유웨이 크롤러
│   │   └── crawler_manager.py
│   ├── database/
│   │   ├── connection.py    # DB 연결
│   │   ├── models.py        # SQLAlchemy 모델
│   │   └── repositories.py  # 데이터 레포지토리
│   ├── ml/
│   │   ├── features.py      # 피처 엔지니어링
│   │   ├── models.py        # ML 모델
│   │   ├── predictor.py     # 예측기
│   │   └── trainer.py       # 모델 학습
│   ├── rag/
│   │   ├── embeddings.py    # 임베딩 서비스
│   │   ├── vector_store.py  # 벡터 저장소
│   │   ├── document_processor.py
│   │   ├── news_crawler.py  # 뉴스 크롤러
│   │   ├── community_crawler.py
│   │   └── rag_pipeline.py  # RAG 파이프라인
│   └── utils/
│       └── logger.py        # 로깅
├── alembic/                  # DB 마이그레이션
├── models/                   # 학습된 모델 저장
├── data/                     # 데이터 파일
├── logs/                     # 로그 파일
├── main.py                   # 메인 엔트리포인트
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 피처 목록

### 학생 성적 피처
| 피처 | 설명 |
|------|------|
| korean_standard | 국어 표준점수 |
| math_standard | 수학 표준점수 |
| english_grade | 영어 등급 |
| inquiry1_standard | 탐구1 표준점수 |
| inquiry2_standard | 탐구2 표준점수 |
| total_standard | 총 표준점수 |
| weighted_score | 가중 환산점수 |

### 학과 피처
| 피처 | 설명 |
|------|------|
| university_tier | 대학 티어 (sky/top10/in_seoul/regional) |
| category | 계열 (인문/자연/의약학/예체능) |
| selection_type | 군 (가군/나군/다군) |
| historical_cutoff | 과거 합격선 |

### 실시간 피처
| 피처 | 설명 |
|------|------|
| current_rate | 현재 경쟁률 |
| rate_vs_last_year | 작년 대비 비율 |
| predicted_final_rate | 예상 최종 경쟁률 |
| ssollim_index | 쏠림 지수 |

### RAG 피처
| 피처 | 설명 |
|------|------|
| news_sentiment | 뉴스 감성 점수 |
| community_sentiment | 커뮤니티 감성 점수 |
| attention_score | 관심도 점수 |

## 환경변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| ENV | 환경 (development/production) | development |
| DEBUG | 디버그 모드 | true |
| API_HOST | API 호스트 | 0.0.0.0 |
| API_PORT | API 포트 | 8000 |
| DATABASE_URL | PostgreSQL URL | - |
| GCP_PROJECT_ID | Google Cloud 프로젝트 ID | - |
| GCP_LOCATION | Google Cloud 리전 | us-central1 |

## 개발 가이드

### 테스트 실행
```bash
pytest tests/ -v --cov=src
```

### 코드 포맷팅
```bash
black src/
isort src/
```

### 타입 체크
```bash
mypy src/
```

## 라이선스

MIT License

## 기여

1. Fork 저장소
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성
