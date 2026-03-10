#!/bin/bash
# 정시 합격 예측 서비스 배포 스크립트 (Linux/Mac)
# 사용법: ./deploy.sh [--project-id <id>] [--region <region>]

set -e

# 기본값 설정
PROJECT_ID=""
REGION="asia-northeast3"
SERVICE_NAME="jungsi-prediction-api"
SKIP_BUILD=false
LOCAL_TEST=false

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 인자 파싱
while [[ $# -gt 0 ]]; do
    case $1 in
        --project-id)
            PROJECT_ID="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --service-name)
            SERVICE_NAME="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --local-test)
            LOCAL_TEST=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}  정시 합격 예측 서비스 배포${NC}"
echo -e "${CYAN}============================================${NC}"

# 프로젝트 ID 확인
if [ -z "$PROJECT_ID" ]; then
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}Error: GCP 프로젝트 ID를 지정해주세요.${NC}"
        echo -e "${YELLOW}사용법: ./deploy.sh --project-id <your-project-id>${NC}"
        exit 1
    fi
fi

echo -e "\n${GREEN}[1/6] 프로젝트 설정 확인${NC}"
echo "  - Project ID: $PROJECT_ID"
echo "  - Region: $REGION"
echo "  - Service: $SERVICE_NAME"

# 로컬 테스트 모드
if [ "$LOCAL_TEST" = true ]; then
    echo -e "\n${YELLOW}[Local Test] Docker로 로컬 테스트 실행${NC}"
    docker build -f Dockerfile.prod -t ${SERVICE_NAME}:local .
    docker run -p 8080:8080 -e PORT=8080 ${SERVICE_NAME}:local
    exit 0
fi

# GCP 프로젝트 설정
echo -e "\n${GREEN}[2/6] GCP 프로젝트 설정${NC}"
gcloud config set project $PROJECT_ID

# API 활성화
echo -e "\n${GREEN}[3/6] 필요한 API 활성화${NC}"
apis=(
    "run.googleapis.com"
    "cloudbuild.googleapis.com"
    "artifactregistry.googleapis.com"
    "secretmanager.googleapis.com"
)
for api in "${apis[@]}"; do
    echo "  - $api 활성화 중..."
    gcloud services enable $api --quiet 2>/dev/null || true
done

# Artifact Registry 저장소 생성
echo -e "\n${GREEN}[4/6] Artifact Registry 설정${NC}"
if ! gcloud artifacts repositories list --location=$REGION --format="value(name)" 2>/dev/null | grep -q "cloud-run"; then
    echo "  - cloud-run 저장소 생성 중..."
    gcloud artifacts repositories create cloud-run \
        --repository-format=docker \
        --location=$REGION \
        --description="Cloud Run Docker images"
fi

# 서비스 계정 생성
echo -e "\n${GREEN}[5/6] 서비스 계정 설정${NC}"
SA_NAME="jungsi-prediction-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

if ! gcloud iam service-accounts list --format="value(email)" 2>/dev/null | grep -q "$SA_NAME"; then
    echo "  - 서비스 계정 생성 중..."
    gcloud iam service-accounts create $SA_NAME \
        --display-name="Jungsi Prediction Service Account"

    # 권한 부여
    roles=(
        "roles/cloudsql.client"
        "roles/secretmanager.secretAccessor"
        "roles/aiplatform.user"
    )
    for role in "${roles[@]}"; do
        gcloud projects add-iam-policy-binding $PROJECT_ID \
            --member="serviceAccount:$SA_EMAIL" \
            --role=$role --quiet 2>/dev/null || true
    done
fi

# Cloud Build로 배포
echo -e "\n${GREEN}[6/6] Cloud Build로 배포${NC}"
if [ "$SKIP_BUILD" = false ]; then
    gcloud builds submit --config=cloudbuild.yaml \
        --substitutions="_SERVICE_NAME=$SERVICE_NAME,_REGION=$REGION"
else
    echo "  - 빌드 스킵, 기존 이미지로 배포"
    gcloud run deploy $SERVICE_NAME \
        --image="${REGION}-docker.pkg.dev/${PROJECT_ID}/cloud-run/${SERVICE_NAME}:latest" \
        --region=$REGION \
        --platform=managed \
        --allow-unauthenticated
fi

# 배포 결과 확인
echo -e "\n${CYAN}============================================${NC}"
echo -e "${GREEN}  배포 완료!${NC}"
echo -e "${CYAN}============================================${NC}"

SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)" 2>/dev/null)
echo -e "\n${YELLOW}서비스 URL: $SERVICE_URL${NC}"
echo "헬스체크: $SERVICE_URL/api/v1/health"
echo "API 문서: $SERVICE_URL/docs"

# 헬스체크 테스트
echo -e "\n${GREEN}헬스체크 테스트 중...${NC}"
sleep 5
if curl -s -f "$SERVICE_URL/api/v1/health" > /dev/null 2>&1; then
    echo -e "${GREEN}Status: healthy${NC}"
else
    echo -e "${YELLOW}Warning: 헬스체크 실패 - 서비스 시작 대기 중일 수 있습니다.${NC}"
fi
