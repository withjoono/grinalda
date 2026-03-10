## 로컬 개발 환경 설정 (Windows)

### 1. Python 설치 (https://www.python.org/downloads/)

### 2. 가상환경 생성 및 활성화

python -m venv venv
.\venv\Scripts\activate

### 3. 패키지 설치

pip install -r requirements.txt

### 4. 서버 실행

uvicorn app.main:app --host 0.0.0.0 --port 8000

## EC2 배포

### 1. EC2 기본 설정

```bash
# 시스템 업데이트 및 필수 패키지 설치
sudo apt update
sudo apt upgrade -y
sudo apt install python3-pip python3-venv git libmagic1 -y
```

### 2. 프로젝트 클론 및 환경 설정

```bash
# 프로젝트 클론
git clone [your-repository-url]
cd [repository-name]

# 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate

# 패키지 설치
pip install -r requirements.txt

# .env 파일 생성
cp .env.example .env
# .env 파일 수정
vim .env
```

### 3. 환경 변수 설정

```bash
# nohup을 사용하여 백그라운드에서 실행
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# 실행 중인지 확인
ps aux | grep uvicorn
```

### 서버 중지

```bash
# uvicorn 프로세스 찾기
ps aux | grep uvicorn

# 프로세스 종료 (PID는 위 명령어로 확인한 번호)
kill [PID]
```
