@echo off
echo ========================================
echo GitHub Secrets 설정 스크립트
echo ========================================
echo.

REM Hub 프로젝트 Secrets 설정
echo [1/2] Hub 프로젝트 Secrets 설정 중...
cd /d E:\Dev\github\Hub

REM GCP 서비스 계정 키
echo - GCP_SA_KEY 설정 중...
gh secret set GCP_SA_KEY < Hub-Backend\gcs-service-account-key.json --repo withjoono/Hub

REM Firebase 서비스 계정 키
echo - FIREBASE_SERVICE_ACCOUNT 설정 중...
gh secret set FIREBASE_SERVICE_ACCOUNT < Hub-Backend\firebase-service-account-key.json --repo withjoono/Hub

REM Backend API URL (Cloud Run URL로 변경 필요)
echo - VITE_API_URL 설정 중...
gh secret set VITE_API_URL --body "https://geobukschool-backend-XXXXXXXXXX-an.a.run.app" --repo withjoono/Hub

echo.
echo ========================================
echo Firebase 환경변수를 입력하세요
echo ========================================
echo Firebase Console에서 확인하세요:
echo https://console.firebase.google.com/project/ts-front-479305/settings/general/
echo.

set /p FIREBASE_API_KEY="VITE_FIREBASE_API_KEY: "
gh secret set VITE_FIREBASE_API_KEY --body "%FIREBASE_API_KEY%" --repo withjoono/Hub

set /p FIREBASE_AUTH_DOMAIN="VITE_FIREBASE_AUTH_DOMAIN (예: ts-front-479305.firebaseapp.com): "
gh secret set VITE_FIREBASE_AUTH_DOMAIN --body "%FIREBASE_AUTH_DOMAIN%" --repo withjoono/Hub

gh secret set VITE_FIREBASE_PROJECT_ID --body "ts-front-479305" --repo withjoono/Hub

set /p FIREBASE_STORAGE_BUCKET="VITE_FIREBASE_STORAGE_BUCKET (예: ts-front-479305.appspot.com): "
gh secret set VITE_FIREBASE_STORAGE_BUCKET --body "%FIREBASE_STORAGE_BUCKET%" --repo withjoono/Hub

set /p FIREBASE_SENDER_ID="VITE_FIREBASE_MESSAGING_SENDER_ID: "
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID --body "%FIREBASE_SENDER_ID%" --repo withjoono/Hub

set /p FIREBASE_APP_ID="VITE_FIREBASE_APP_ID: "
gh secret set VITE_FIREBASE_APP_ID --body "%FIREBASE_APP_ID%" --repo withjoono/Hub

echo.
echo ========================================
echo ✅ Hub 프로젝트 Secrets 설정 완료!
echo ========================================
echo.

echo [2/2] Jungsi 프로젝트 Secrets 설정 중...
cd /d E:\Dev\github\Jungsi

REM Jungsi도 동일한 방법으로 설정
echo Jungsi 프로젝트도 같은 방법으로 설정하시겠습니까? (Y/N)
set /p SETUP_JUNGSI=""

if /i "%SETUP_JUNGSI%"=="Y" (
    echo Jungsi 프로젝트 Secrets 설정 중...
    REM 여기에 Jungsi 프로젝트 secrets 설정 추가
    echo Jungsi 프로젝트는 수동으로 설정해주세요.
)

echo.
echo ========================================
echo 모든 설정이 완료되었습니다!
echo ========================================
echo.
echo GitHub Actions에서 확인하세요:
echo - Hub: https://github.com/withjoono/Hub/settings/secrets/actions
echo - Jungsi: https://github.com/withjoono/jungsi/settings/secrets/actions
echo.
pause
