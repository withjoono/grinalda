# 정시 합격 예측 서비스 배포 스크립트 (Windows PowerShell)
# 사용법: .\deploy.ps1 [-ProjectId <project-id>] [-Region <region>]

param(
    [string]$ProjectId = "",
    [string]$Region = "asia-northeast3",
    [string]$ServiceName = "jungsi-prediction-api",
    [switch]$SkipBuild,
    [switch]$LocalTest
)

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  정시 합격 예측 서비스 배포" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# 프로젝트 ID 확인
if ([string]::IsNullOrEmpty($ProjectId)) {
    $ProjectId = gcloud config get-value project 2>$null
    if ([string]::IsNullOrEmpty($ProjectId)) {
        Write-Host "Error: GCP 프로젝트 ID를 지정해주세요." -ForegroundColor Red
        Write-Host "사용법: .\deploy.ps1 -ProjectId <your-project-id>" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "`n[1/6] 프로젝트 설정 확인" -ForegroundColor Green
Write-Host "  - Project ID: $ProjectId"
Write-Host "  - Region: $Region"
Write-Host "  - Service: $ServiceName"

# 로컬 테스트 모드
if ($LocalTest) {
    Write-Host "`n[Local Test] Docker로 로컬 테스트 실행" -ForegroundColor Yellow
    docker build -f Dockerfile.prod -t ${ServiceName}:local .
    docker run -p 8080:8080 -e PORT=8080 ${ServiceName}:local
    exit 0
}

# GCP 프로젝트 설정
Write-Host "`n[2/6] GCP 프로젝트 설정" -ForegroundColor Green
gcloud config set project $ProjectId

# API 활성화
Write-Host "`n[3/6] 필요한 API 활성화" -ForegroundColor Green
$apis = @(
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com"
)
foreach ($api in $apis) {
    Write-Host "  - $api 활성화 중..."
    gcloud services enable $api --quiet 2>$null
}

# Artifact Registry 저장소 생성
Write-Host "`n[4/6] Artifact Registry 설정" -ForegroundColor Green
$repoExists = gcloud artifacts repositories list --location=$Region --format="value(name)" 2>$null | Select-String "cloud-run"
if (-not $repoExists) {
    Write-Host "  - cloud-run 저장소 생성 중..."
    gcloud artifacts repositories create cloud-run `
        --repository-format=docker `
        --location=$Region `
        --description="Cloud Run Docker images"
}

# 서비스 계정 생성
Write-Host "`n[5/6] 서비스 계정 설정" -ForegroundColor Green
$saName = "jungsi-prediction-sa"
$saEmail = "${saName}@${ProjectId}.iam.gserviceaccount.com"

$saExists = gcloud iam service-accounts list --format="value(email)" 2>$null | Select-String $saName
if (-not $saExists) {
    Write-Host "  - 서비스 계정 생성 중..."
    gcloud iam service-accounts create $saName `
        --display-name="Jungsi Prediction Service Account"

    # 권한 부여
    $roles = @(
        "roles/cloudsql.client",
        "roles/secretmanager.secretAccessor",
        "roles/aiplatform.user"
    )
    foreach ($role in $roles) {
        gcloud projects add-iam-policy-binding $ProjectId `
            --member="serviceAccount:$saEmail" `
            --role=$role --quiet 2>$null
    }
}

# Cloud Build로 배포
Write-Host "`n[6/6] Cloud Build로 배포" -ForegroundColor Green
if (-not $SkipBuild) {
    gcloud builds submit --config=cloudbuild.yaml `
        --substitutions="_SERVICE_NAME=$ServiceName,_REGION=$Region"
} else {
    Write-Host "  - 빌드 스킵, 기존 이미지로 배포"
    gcloud run deploy $ServiceName `
        --image="${Region}-docker.pkg.dev/${ProjectId}/cloud-run/${ServiceName}:latest" `
        --region=$Region `
        --platform=managed `
        --allow-unauthenticated
}

# 배포 결과 확인
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  배포 완료!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

$serviceUrl = gcloud run services describe $ServiceName --region=$Region --format="value(status.url)" 2>$null
Write-Host "`n서비스 URL: $serviceUrl" -ForegroundColor Yellow
Write-Host "헬스체크: $serviceUrl/api/v1/health"
Write-Host "API 문서: $serviceUrl/docs"

# 헬스체크 테스트
Write-Host "`n헬스체크 테스트 중..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/api/v1/health" -Method Get -TimeoutSec 30
    Write-Host "Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "Warning: 헬스체크 실패 - 서비스 시작 대기 중일 수 있습니다." -ForegroundColor Yellow
}
