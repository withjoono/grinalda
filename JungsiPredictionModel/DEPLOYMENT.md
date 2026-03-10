# 배포 가이드

정시 합격 예측 서비스 독립 배포 가이드

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │ Cloud Run   │    │ Cloud SQL   │    │ Vertex AI       │ │
│  │ (API 서버)   │───▶│ (PostgreSQL)│    │ (Embeddings)    │ │
│  └──────┬──────┘    └─────────────┘    └─────────────────┘ │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────┐    ┌─────────────┐                        │
│  │ Artifact    │    │ Secret      │                        │
│  │ Registry    │    │ Manager     │                        │
│  └─────────────┘    └─────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## 사전 요구사항

1. **GCP 계정** 및 프로젝트
2. **gcloud CLI** 설치
3. **Docker** 설치 (로컬 테스트용)

## 빠른 배포 (5분)

### 1. 프로젝트 설정

```bash
# GCP 로그인
gcloud auth login

# 프로젝트 설정
gcloud config set project YOUR_PROJECT_ID
```

### 2. 자동 배포 스크립트 실행

**Windows:**
```powershell
.\deploy.ps1 -ProjectId YOUR_PROJECT_ID
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh --project-id YOUR_PROJECT_ID
```

### 3. 완료!

배포 완료 후 출력되는 URL로 접속:
- API 문서: `https://YOUR_SERVICE_URL/docs`
- 헬스체크: `https://YOUR_SERVICE_URL/api/v1/health`

---

## 수동 배포 (상세)

### Step 1: API 활성화

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  aiplatform.googleapis.com
```

### Step 2: Artifact Registry 저장소 생성

```bash
gcloud artifacts repositories create cloud-run \
  --repository-format=docker \
  --location=asia-northeast3 \
  --description="Cloud Run Docker images"
```

### Step 3: Docker 이미지 빌드 및 푸시

```bash
# Docker 인증
gcloud auth configure-docker asia-northeast3-docker.pkg.dev

# 빌드
docker build -f Dockerfile.prod -t asia-northeast3-docker.pkg.dev/PROJECT_ID/cloud-run/jungsi-prediction-api:latest .

# 푸시
docker push asia-northeast3-docker.pkg.dev/PROJECT_ID/cloud-run/jungsi-prediction-api:latest
```

### Step 4: Cloud Run 배포

```bash
gcloud run deploy jungsi-prediction-api \
  --image=asia-northeast3-docker.pkg.dev/PROJECT_ID/cloud-run/jungsi-prediction-api:latest \
  --region=asia-northeast3 \
  --platform=managed \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=0 \
  --max-instances=10 \
  --allow-unauthenticated
```

---

## 환경별 설정

### Development (로컬)

```bash
# 로컬 테스트
docker build -f Dockerfile.prod -t jungsi-api:local .
docker run -p 8080:8080 -e PORT=8080 jungsi-api:local
```

### Staging

```bash
./deploy.sh --project-id PROJECT_ID --service-name jungsi-prediction-api-staging
```

### Production

```bash
./deploy.sh --project-id PROJECT_ID --service-name jungsi-prediction-api
```

---

## 데이터베이스 연결 (Cloud SQL)

### 1. Cloud SQL 인스턴스 생성

```bash
gcloud sql instances create jungsi-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-northeast3

# 데이터베이스 생성
gcloud sql databases create jungsi_prediction --instance=jungsi-db

# 사용자 생성
gcloud sql users create jungsi \
  --instance=jungsi-db \
  --password=YOUR_PASSWORD
```

### 2. Cloud Run 연결

```bash
gcloud run services update jungsi-prediction-api \
  --add-cloudsql-instances=PROJECT_ID:asia-northeast3:jungsi-db \
  --set-env-vars="DATABASE_URL=postgresql+asyncpg://jungsi:PASSWORD@/jungsi_prediction?host=/cloudsql/PROJECT_ID:asia-northeast3:jungsi-db"
```

---

## Secret Manager 설정

### 1. 시크릿 생성

```bash
# 데이터베이스 URL
echo -n "postgresql+asyncpg://user:pass@/db" | \
  gcloud secrets create database-url --data-file=-

# API 키 (필요시)
echo -n "your-api-key" | \
  gcloud secrets create api-key --data-file=-
```

### 2. Cloud Run에서 시크릿 사용

```bash
gcloud run services update jungsi-prediction-api \
  --set-secrets="DATABASE_URL=database-url:latest"
```

---

## CI/CD 설정

### Option 1: Cloud Build (GCP 네이티브)

`cloudbuild.yaml` 파일이 이미 구성되어 있습니다.

```bash
# 트리거 생성
gcloud builds triggers create github \
  --repo-name=JungsiPredictionModel \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Option 2: GitHub Actions

1. GitHub 저장소 Settings > Secrets에 추가:
   - `GCP_PROJECT_ID`: 프로젝트 ID
   - `WIF_PROVIDER`: Workload Identity Provider
   - `WIF_SERVICE_ACCOUNT`: 서비스 계정

2. Workload Identity Federation 설정:

```bash
# Workload Identity Pool 생성
gcloud iam workload-identity-pools create github-pool \
  --location=global \
  --display-name="GitHub Pool"

# Provider 생성
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location=global \
  --workload-identity-pool=github-pool \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

---

## 기존 백엔드 연동

### API 호출 예시

**Node.js/JavaScript:**
```javascript
const response = await fetch('https://jungsi-prediction-api-xxx.run.app/api/v1/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student: {
      korean_standard: 135,
      math_standard: 140,
      english_grade: 2,
      inquiry1_standard: 68,
      inquiry2_standard: 65
    },
    departments: [
      { university: '연세대학교', department: '경영학과' }
    ]
  })
});
const result = await response.json();
```

**Java/Spring:**
```java
RestTemplate restTemplate = new RestTemplate();
String url = "https://jungsi-prediction-api-xxx.run.app/api/v1/predict";

Map<String, Object> request = Map.of(
    "student", Map.of(
        "korean_standard", 135,
        "math_standard", 140,
        "english_grade", 2,
        "inquiry1_standard", 68,
        "inquiry2_standard", 65
    ),
    "departments", List.of(
        Map.of("university", "연세대학교", "department", "경영학과")
    )
);

ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
```

---

## 모니터링

### Cloud Run 대시보드

```bash
# 로그 보기
gcloud run services logs read jungsi-prediction-api --region=asia-northeast3

# 메트릭 보기
gcloud run services describe jungsi-prediction-api --region=asia-northeast3
```

### 알림 설정

Cloud Console > Cloud Run > 서비스 > Metrics 탭에서 알림 정책 설정

---

## 비용 최적화

| 설정 | 권장값 | 설명 |
|------|--------|------|
| min-instances | 0 | 트래픽 없을 때 비용 0 |
| max-instances | 10 | 급증 대응 |
| cpu | 2 | ML 연산용 |
| memory | 2Gi | 모델 로드용 |
| concurrency | 80 | 동시 요청 수 |

**예상 월 비용** (서울 리전):
- 트래픽 적음: $5-10/월
- 입시 시즌: $50-100/월

---

## 문제 해결

### Cold Start 느림

```bash
# 최소 인스턴스 1개 유지
gcloud run services update jungsi-prediction-api \
  --min-instances=1
```

### 메모리 부족

```bash
# 메모리 증가
gcloud run services update jungsi-prediction-api \
  --memory=4Gi
```

### 타임아웃

```bash
# 타임아웃 증가
gcloud run services update jungsi-prediction-api \
  --timeout=600
```
