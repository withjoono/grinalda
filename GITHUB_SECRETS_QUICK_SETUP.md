# GitHub Secrets 빠른 설정 가이드

## 🎯 설정할 저장소

1. **Hub**: https://github.com/withjoono/Hub
2. **Jungsi**: https://github.com/withjoono/jungsi

---

## 📋 필요한 Secrets 목록

### ✅ **Hub 프로젝트**

#### Backend 배포용 (1개)
| Secret 이름 | 값 위치 | 설명 |
|------------|---------|------|
| `GCP_SA_KEY` | `Hub-Backend/gcs-service-account-key.json` | GCP 서비스 계정 JSON 전체 |

#### Frontend 배포용 (8개)
| Secret 이름 | 값 위치 | 설명 |
|------------|---------|------|
| `FIREBASE_SERVICE_ACCOUNT` | `Hub-Backend/firebase-service-account-key.json` | Firebase 서비스 계정 JSON 전체 |
| `VITE_API_URL` | Cloud Run URL | Backend API 주소 |
| `VITE_FIREBASE_API_KEY` | Firebase Console | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Console | 예: `ts-front-479305.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Console | 예: `ts-front-479305` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console | 예: `ts-front-479305.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console | 숫자 형식 |
| `VITE_FIREBASE_APP_ID` | Firebase Console | 예: `1:123456789012:web:abc123` |

---

## 🚀 **설정 방법**

### **방법 1: 자동 설정 (GitHub CLI 사용)**

#### 1. GitHub CLI 설치 확인
```bash
gh --version
```

설치되지 않았다면: https://cli.github.com/ 에서 다운로드

#### 2. GitHub 로그인
```bash
gh auth login
```

#### 3. 자동 설정 스크립트 실행
```bash
cd E:\Dev\github\Hub
setup-github-secrets.bat
```

---

### **방법 2: 수동 설정 (웹 브라우저 사용)**

#### 1. GitHub 저장소 Settings 페이지로 이동

**Hub 프로젝트:**
```
https://github.com/withjoono/Hub/settings/secrets/actions
```

**Jungsi 프로젝트:**
```
https://github.com/withjoono/jungsi/settings/secrets/actions
```

#### 2. "New repository secret" 버튼 클릭

#### 3. 각 Secret 추가

##### **GCP_SA_KEY** 추가
1. Name: `GCP_SA_KEY`
2. Value: 
   - `E:\Dev\github\Hub\Hub-Backend\gcs-service-account-key.json` 파일을 메모장으로 열기
   - **전체 내용** 복사 (첫 줄부터 마지막 줄까지)
   - Value 필드에 붙여넣기
3. "Add secret" 클릭

##### **FIREBASE_SERVICE_ACCOUNT** 추가
1. Name: `FIREBASE_SERVICE_ACCOUNT`
2. Value:
   - `E:\Dev\github\Hub\Hub-Backend\firebase-service-account-key.json` 파일을 메모장으로 열기
   - **전체 내용** 복사
   - Value 필드에 붙여넣기
3. "Add secret" 클릭

##### **VITE_API_URL** 추가
1. Name: `VITE_API_URL`
2. Value: Cloud Run Backend URL 확인 방법:
   ```bash
   gcloud run services describe geobukschool-backend --region=asia-northeast3 --format='value(status.url)'
   ```
   또는 GCP Console > Cloud Run에서 URL 복사
3. "Add secret" 클릭

##### **Firebase 환경변수들** 추가

Firebase Console에서 값 확인:
1. https://console.firebase.google.com/ 접속
2. 프로젝트 선택: `ts-front-479305`
3. 프로젝트 설정 (⚙️) > 일반 > 내 앱 > 웹 앱
4. "SDK 설정 및 구성" 아래 값들 복사

각각 추가:
- Name: `VITE_FIREBASE_API_KEY` / Value: Firebase에서 복사한 `apiKey`
- Name: `VITE_FIREBASE_AUTH_DOMAIN` / Value: `authDomain`
- Name: `VITE_FIREBASE_PROJECT_ID` / Value: `projectId` (예: `ts-front-479305`)
- Name: `VITE_FIREBASE_STORAGE_BUCKET` / Value: `storageBucket`
- Name: `VITE_FIREBASE_MESSAGING_SENDER_ID` / Value: `messagingSenderId`
- Name: `VITE_FIREBASE_APP_ID` / Value: `appId`

---

## ✅ **설정 확인**

### 1. Secrets 목록 확인
GitHub 저장소 페이지에서:
```
Settings > Secrets and variables > Actions
```

다음 9개 Secrets가 보여야 합니다:
- [x] GCP_SA_KEY
- [x] FIREBASE_SERVICE_ACCOUNT
- [x] VITE_API_URL
- [x] VITE_FIREBASE_API_KEY
- [x] VITE_FIREBASE_AUTH_DOMAIN
- [x] VITE_FIREBASE_PROJECT_ID
- [x] VITE_FIREBASE_STORAGE_BUCKET
- [x] VITE_FIREBASE_MESSAGING_SENDER_ID
- [x] VITE_FIREBASE_APP_ID

### 2. GitHub Actions 테스트

코드를 수정하고 푸시:
```bash
cd E:\Dev\github\Hub
echo "test" >> README.md
git add README.md
git commit -m "test: GitHub Actions 테스트"
git push origin main
```

GitHub Actions 확인:
```
https://github.com/withjoono/Hub/actions
```

---

## 🔧 **Jungsi 프로젝트도 동일하게 설정**

Jungsi 프로젝트도 같은 방법으로 설정하세요:
- 저장소: https://github.com/withjoono/jungsi
- 동일한 Secrets 추가
- Firebase 프로젝트는 동일하므로 같은 값 사용

---

## 🐛 **문제 해결**

### Secret 값이 잘못된 경우
1. GitHub 저장소 > Settings > Secrets and variables > Actions
2. 잘못된 Secret 옆의 "Update" 버튼 클릭
3. 새로운 값 입력 후 저장

### Firebase 정보를 모를 경우
```bash
# Firebase 프로젝트 목록 확인
firebase projects:list

# 현재 프로젝트 선택
firebase use ts-front-479305

# Firebase 설정 확인
firebase apps:sdkconfig web
```

### Cloud Run URL을 모를 경우
```bash
# GCP 프로젝트 설정
gcloud config set project ts-back-nest-479305

# Cloud Run 서비스 목록
gcloud run services list --region=asia-northeast3

# 특정 서비스 URL 확인
gcloud run services describe geobukschool-backend --region=asia-northeast3 --format='value(status.url)'
```

---

## 📞 **추가 도움말**

설정 중 문제가 발생하면:
1. 에러 메시지 확인
2. GitHub Actions 로그 확인: https://github.com/withjoono/Hub/actions
3. Secret 이름 철자 확인 (대소문자 구분!)
4. JSON 파일 전체가 복사되었는지 확인

---

**마지막 업데이트**: 2026-01-20
