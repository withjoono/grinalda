# GitHub Actions 자동 배포 설정 가이드

이 문서는 Hub 프로젝트의 GitHub Actions를 통한 자동 배포 설정 방법을 안내합니다.

## 📋 목차

1. [개요](#개요)
2. [GitHub Secrets 설정](#github-secrets-설정)
3. [GCP 서비스 계정 설정](#gcp-서비스-계정-설정)
4. [Firebase 설정](#firebase-설정)
5. [배포 트리거](#배포-트리거)
6. [문제 해결](#문제-해결)

---

## 🎯 개요

### 배포 아키텍처

**Frontend (Firebase Hosting)**
- `hub.turtleschool.com` - 허브 플랫폼 (전체 서비스)
- `jungsi.turtleschool.com` - 정시 전용 도메인
- `susi.turtleschool.com` - 수시 전용 도메인

**Backend (Cloud Run)**
- `geobukschool-backend` - 허브용 백엔드 (Cloud Run)

### 자동 배포 워크플로우

1. **Backend**: `Hub-Backend/` 폴더의 코드가 `main` 브랜치에 푸시되면 자동으로 Cloud Run에 배포
2. **Frontend**: `Hub-Frontend/` 폴더의 코드가 `main` 브랜치에 푸시되면 자동으로 Firebase Hosting에 배포

---

## 🔐 GitHub Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets를 추가하세요.

### Backend 배포용 Secrets

#### 1. `GCP_SA_KEY`
**설명**: GCP 서비스 계정의 JSON 키

**설정 방법**:
```bash
# GCP 서비스 계정 생성 및 키 다운로드
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer"

# 필요한 권한 부여
gcloud projects add-iam-policy-binding ts-back-nest-479305 \
  --member="serviceAccount:github-actions-deployer@ts-back-nest-479305.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding ts-back-nest-479305 \
  --member="serviceAccount:github-actions-deployer@ts-back-nest-479305.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding ts-back-nest-479305 \
  --member="serviceAccount:github-actions-deployer@ts-back-nest-479305.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding ts-back-nest-479305 \
  --member="serviceAccount:github-actions-deployer@ts-back-nest-479305.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# JSON 키 생성
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions-deployer@ts-back-nest-479305.iam.gserviceaccount.com
```

생성된 `github-actions-key.json` 파일의 전체 내용을 GitHub Secret `GCP_SA_KEY`에 복사하세요.

---

### Frontend 배포용 Secrets

#### 2. `FIREBASE_SERVICE_ACCOUNT`
**설명**: Firebase 배포를 위한 서비스 계정 JSON 키

**설정 방법**:
```bash
# Firebase CLI로 서비스 계정 키 생성
firebase login
firebase projects:list
firebase service-accounts:create github-actions-deployer \
  --project ts-front-479305

# 또는 GCP Console에서:
# IAM & Admin > Service Accounts > Create Service Account
# 이름: firebase-github-deployer
# 역할: Firebase Hosting Admin, Firebase Admin
```

생성된 JSON 키를 GitHub Secret `FIREBASE_SERVICE_ACCOUNT`에 복사하세요.

#### 3. Frontend 환경변수 Secrets

다음 환경변수들을 GitHub Secrets에 추가하세요:

| Secret 이름 | 설명 | 예시 값 |
|------------|------|--------|
| `VITE_API_URL` | Backend API URL | `https://geobukschool-backend-XXXXXXXXXX-an.a.run.app` |
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `ts-front-479305.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `ts-front-479305` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `ts-front-479305.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123456789012:web:XXXXXXXXXXXX` |

**Firebase 설정 값 확인 방법**:
1. Firebase Console (https://console.firebase.google.com/)
2. 프로젝트 선택 (ts-front-479305)
3. 프로젝트 설정 > 일반 > 내 앱 > 웹 앱 구성

---

## 🔧 GCP 서비스 계정 설정

### Secret Manager에 환경변수 저장

Backend에서 사용할 민감한 환경변수들은 GCP Secret Manager에 저장하세요:

```bash
# DATABASE_URL 저장
echo -n "mysql://user:password@/dbname?socket=/cloudsql/ts-back-nest-479305:asia-northeast3:geobuk-db" | \
  gcloud secrets create database-url \
  --data-file=- \
  --replication-policy="automatic" \
  --project=ts-back-nest-479305

# JWT_SECRET 저장
echo -n "your-jwt-secret-key-here" | \
  gcloud secrets create jwt-secret \
  --data-file=- \
  --replication-policy="automatic" \
  --project=ts-back-nest-479305

# AUTH_SECRET 저장 (SSO용)
echo -n "your-auth-secret-key-here" | \
  gcloud secrets create auth-secret \
  --data-file=- \
  --replication-policy="automatic" \
  --project=ts-back-nest-479305

# FIREBASE_SERVICE_ACCOUNT 저장
cat firebase-service-account-key.json | \
  gcloud secrets create firebase-service-account \
  --data-file=- \
  --replication-policy="automatic" \
  --project=ts-back-nest-479305
```

### Cloud Run 서비스 계정에 Secret 접근 권한 부여

```bash
# Cloud Run 서비스 계정 확인
SERVICE_ACCOUNT=$(gcloud run services describe geobukschool-backend \
  --region=asia-northeast3 \
  --format='value(spec.template.spec.serviceAccountName)')

# Secret 접근 권한 부여
for SECRET in database-url jwt-secret auth-secret firebase-service-account; do
  gcloud secrets add-iam-policy-binding $SECRET \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor" \
    --project=ts-back-nest-479305
done
```

---

## 🔥 Firebase 설정

### Firebase Hosting 타겟 설정

```bash
# Firebase 프로젝트 선택
firebase use ts-front-479305

# Hosting 타겟 설정
firebase target:apply hosting hub ts-front-479305

# .firebaserc 파일 확인
cat Hub-Frontend/.firebaserc
```

`.firebaserc` 파일 예시:
```json
{
  "projects": {
    "default": "ts-front-479305"
  },
  "targets": {
    "ts-front-479305": {
      "hosting": {
        "hub": [
          "ts-front-479305"
        ]
      }
    }
  }
}
```

---

## 🚀 배포 트리거

### 자동 배포 조건

#### Backend 자동 배포
- `main` 브랜치에 `Hub-Backend/` 폴더의 코드가 푸시될 때
- Workflow 파일(`.github/workflows/deploy-backend.yml`)이 수정될 때

#### Frontend 자동 배포
- `main` 브랜치에 `Hub-Frontend/` 폴더의 코드가 푸시될 때
- Workflow 파일(`.github/workflows/deploy-frontend.yml`)이 수정될 때

### 수동 배포

GitHub Actions 탭에서 "Run workflow" 버튼을 클릭하여 수동으로 배포할 수 있습니다:

1. GitHub 저장소 페이지 접속
2. Actions 탭 클릭
3. 원하는 워크플로우 선택:
   - "Deploy Backend to Cloud Run"
   - "Deploy Frontend to Firebase Hosting"
4. "Run workflow" 버튼 클릭
5. 브랜치 선택 후 "Run workflow" 확인

### 배포 확인

#### Backend
```bash
# Cloud Run 서비스 URL 확인
gcloud run services describe geobukschool-backend \
  --region=asia-northeast3 \
  --format='value(status.url)'

# 헬스체크
curl https://geobukschool-backend-XXXXXXXXXX-an.a.run.app/health
```

#### Frontend
- Hub: https://hub.turtleschool.com
- Jungsi: https://jungsi.turtleschool.com
- Susi: https://susi.turtleschool.com

---

## 🐛 문제 해결

### Backend 배포 실패

#### 1. Docker 빌드 실패
```bash
# 로컬에서 Docker 빌드 테스트
cd Hub-Backend
docker build -t test-backend .
docker run -p 8080:8080 test-backend
```

#### 2. Cloud Run 배포 권한 부족
```bash
# 서비스 계정 권한 확인
gcloud projects get-iam-policy ts-back-nest-479305 \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:github-actions-deployer@ts-back-nest-479305.iam.gserviceaccount.com"
```

필요한 권한:
- `roles/run.admin`
- `roles/storage.admin`
- `roles/iam.serviceAccountUser`
- `roles/cloudsql.client`

#### 3. Secret Manager 접근 실패
```bash
# Secret 존재 확인
gcloud secrets list --project=ts-back-nest-479305

# Secret 버전 확인
gcloud secrets versions list database-url --project=ts-back-nest-479305

# Secret 접근 권한 확인
gcloud secrets get-iam-policy database-url --project=ts-back-nest-479305
```

### Frontend 배포 실패

#### 1. Firebase 인증 실패
- `FIREBASE_SERVICE_ACCOUNT` Secret이 올바른지 확인
- 서비스 계정에 Firebase Hosting Admin 권한이 있는지 확인

#### 2. 빌드 실패
```bash
# 로컬에서 빌드 테스트
cd Hub-Frontend
npm install
npm run build
```

#### 3. 환경변수 누락
모든 `VITE_*` 환경변수가 GitHub Secrets에 설정되어 있는지 확인:
- `VITE_API_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### GitHub Actions 로그 확인

1. GitHub 저장소 > Actions 탭
2. 실패한 워크플로우 실행 클릭
3. 각 단계의 로그 확인
4. 에러 메시지 분석

---

## 📝 추가 참고사항

### 배포 전 체크리스트

- [ ] 모든 GitHub Secrets가 설정되어 있는지 확인
- [ ] GCP 서비스 계정 권한이 올바른지 확인
- [ ] Firebase Hosting 타겟이 설정되어 있는지 확인
- [ ] Secret Manager에 모든 환경변수가 저장되어 있는지 확인
- [ ] 로컬에서 빌드가 성공하는지 확인
- [ ] Cloud SQL 연결 설정이 올바른지 확인

### 유용한 명령어

```bash
# GitHub Actions workflow 문법 검증
yamllint .github/workflows/deploy-backend.yml
yamllint .github/workflows/deploy-frontend.yml

# 로컬에서 Docker 빌드 및 실행
cd Hub-Backend
docker build -t hub-backend .
docker run -p 8080:8080 --env-file .env hub-backend

# Firebase 로컬 테스트
cd Hub-Frontend
npm run build
firebase serve --only hosting:hub

# Cloud Run 로그 확인
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=geobukschool-backend" \
  --limit 50 \
  --format json
```

---

## 📞 문의

배포 관련 문제가 발생하면:
1. GitHub Actions 로그 확인
2. GCP Console에서 Cloud Run/Firebase 로그 확인
3. 이 문서의 문제 해결 섹션 참고
4. 개발팀에 문의

---

**마지막 업데이트**: 2026-01-20
