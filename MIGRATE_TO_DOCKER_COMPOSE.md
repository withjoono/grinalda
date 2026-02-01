# 기존 Docker 컨테이너에서 Docker Compose로 마이그레이션

## 현재 상태

현재 실행 중인 레거시 컨테이너:
- `geobuk-postgres` (PostgreSQL 14) - 포트 5432
- `geobuk-redis` (Redis 7) - 포트 6379

## 마이그레이션 목표

Docker Compose로 관리되는 새로운 컨테이너:
- `hub-postgres` (PostgreSQL 14) - 포트 5432
- `hub-redis` (Redis 7) - 포트 6379

## 마이그레이션 단계

### 옵션 1: 데이터 보존 (권장)

데이터를 유지하면서 안전하게 마이그레이션합니다.

#### 1. 현재 서버 중지

```bash
stop-dev-improved.bat
```

#### 2. 데이터베이스 백업

```bash
# PostgreSQL 백업
docker exec geobuk-postgres pg_dump -U tsuser geobukschool_dev > backup.sql

# Redis 백업 (필요시)
docker exec geobuk-redis redis-cli SAVE
docker cp geobuk-redis:/data/dump.rdb ./redis_backup.rdb
```

#### 3. 기존 컨테이너 중지 및 제거

```bash
docker stop geobuk-postgres geobuk-redis
docker rm geobuk-postgres geobuk-redis
```

#### 4. 불필요한 레거시 컨테이너 정리

```bash
# 다른 충돌 가능한 컨테이너 확인
docker ps -a | findstr redis

# 정리 (선택사항)
docker rm -f redis hub-redis gb-redis-local
```

#### 5. Docker Compose로 새 컨테이너 시작

```bash
docker-compose up -d
```

#### 6. 서비스 헬스체크 대기

```bash
# PostgreSQL 준비 확인
docker-compose exec postgres pg_isready -U tsuser

# Redis 준비 확인
docker-compose exec redis redis-cli ping
```

#### 7. 데이터 복원

```bash
# PostgreSQL 복원
docker-compose exec -T postgres psql -U tsuser -d geobukschool_dev < backup.sql

# Redis 복원 (필요시)
docker cp ./redis_backup.rdb hub-redis:/data/dump.rdb
docker-compose restart redis
```

#### 8. 마이그레이션 실행 (Backend)

```bash
cd Hub-Backend
yarn typeorm:run
```

#### 9. 전체 개발 환경 시작

```bash
start-dev-improved.bat
```

#### 10. 동작 확인

```bash
# Frontend 접속
http://localhost:3000

# Backend API 확인
http://localhost:4000/swagger

# 데이터베이스 연결 확인
docker-compose exec postgres psql -U tsuser -d geobukschool_dev -c "SELECT COUNT(*) FROM information_schema.tables;"
```

---

### 옵션 2: 클린 스타트 (빠른 방법)

데이터를 버리고 처음부터 시작합니다.

#### 1. 모든 서버 중지

```bash
stop-dev-improved.bat
```

#### 2. 기존 컨테이너 완전 제거

```bash
docker-clean.bat
```

또는 수동으로:
```bash
docker stop geobuk-postgres geobuk-redis redis hub-redis gb-redis-local
docker rm geobuk-postgres geobuk-redis redis hub-redis gb-redis-local
docker volume prune -f
```

#### 3. Docker Compose 시작

```bash
docker-compose up -d
```

#### 4. 데이터베이스 마이그레이션

```bash
cd Hub-Backend
yarn typeorm:run
```

#### 5. 개발 환경 시작

```bash
start-dev-improved.bat
```

---

### 옵션 3: 병행 운영 (테스트용)

기존 컨테이너를 유지하면서 새 Docker Compose 환경을 다른 포트로 테스트합니다.

#### 1. docker-compose.yml 포트 변경

```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # 5432 → 5433
  redis:
    ports:
      - "6380:6379"  # 6379 → 6380
```

#### 2. Backend .env 파일 수정

```env
DB_PORT=5433
REDIS_PORT=6380
```

#### 3. Docker Compose 시작

```bash
docker-compose up -d
```

#### 4. 테스트 후 마이그레이션 결정

테스트가 완료되면 옵션 1 또는 2로 최종 마이그레이션.

---

## 마이그레이션 후 확인 사항

### 1. 컨테이너 상태

```bash
docker-compose ps
```

예상 출력:
```
NAME          IMAGE          STATUS         PORTS
hub-postgres  postgres:14    Up (healthy)   0.0.0.0:5432->5432/tcp
hub-redis     redis:7-alpine Up (healthy)   0.0.0.0:6379->6379/tcp
```

### 2. 데이터베이스 연결

```bash
# psql 접속 테스트
docker-compose exec postgres psql -U tsuser -d geobukschool_dev

# 테이블 확인
\dt

# 종료
\q
```

### 3. Redis 연결

```bash
# Redis CLI 테스트
docker-compose exec redis redis-cli

# 정보 확인
INFO

# 종료
EXIT
```

### 4. Backend 연결 테스트

```bash
cd Hub-Backend
yarn start:dev
```

로그에서 확인:
- `Database connection established`
- `Redis connected`

### 5. Frontend 연결 테스트

```bash
# 브라우저에서 접속
http://localhost:3000

# 로그인 테스트
# API 호출 테스트
```

---

## 트러블슈팅

### 데이터베이스 접속 실패

```bash
# 연결 정보 확인
docker-compose exec postgres env | grep POSTGRES

# 로그 확인
docker-compose logs postgres

# 재시작
docker-compose restart postgres
```

### Redis 접속 실패

```bash
# Redis 상태 확인
docker-compose exec redis redis-cli INFO

# 로그 확인
docker-compose logs redis

# 재시작
docker-compose restart redis
```

### 포트 충돌

```bash
# 5432 포트 사용 확인
netstat -ano | findstr :5432

# 프로세스 종료
taskkill /F /PID [PID번호]

# 또는 기존 컨테이너 중지
docker stop geobuk-postgres
```

### 볼륨 권한 문제

```bash
# Windows에서는 일반적으로 문제 없음
# 문제 발생 시 볼륨 재생성
docker-compose down -v
docker-compose up -d
```

---

## 롤백 방법

마이그레이션에 문제가 있을 경우 기존 환경으로 복귀:

### 1. Docker Compose 중지

```bash
docker-compose down -v
```

### 2. 기존 컨테이너 재시작

```bash
docker start geobuk-postgres geobuk-redis
```

### 3. 데이터 복원 (백업이 있는 경우)

```bash
# PostgreSQL 복원
docker exec -i geobuk-postgres psql -U tsuser -d geobukschool_dev < backup.sql
```

### 4. 서버 시작

```bash
start-dev-improved.bat
```

---

## 마이그레이션 체크리스트

- [ ] 현재 서버 중지
- [ ] 데이터베이스 백업 (옵션 1)
- [ ] 기존 컨테이너 중지 및 제거
- [ ] Docker Compose 설정 확인 (`docker-compose config`)
- [ ] Docker Compose 시작 (`docker-compose up -d`)
- [ ] 헬스체크 확인 (`docker-compose ps`)
- [ ] 데이터 복원 (옵션 1)
- [ ] 마이그레이션 실행 (`yarn typeorm:run`)
- [ ] Backend 시작 테스트
- [ ] Frontend 시작 테스트
- [ ] 로그인/API 테스트
- [ ] 백업 파일 정리

---

## 다음 단계

마이그레이션 완료 후:

1. **개발 워크플로우 변경**
   - `start-dev-improved.bat` 사용 (Docker Compose 자동 감지)
   - `docker-compose` 명령어로 서비스 관리

2. **문서 참고**
   - [Docker Compose 사용 가이드](./DOCKER_COMPOSE_GUIDE.md)
   - [개발 환경 설정](./DEVELOPMENT_SETUP_CHECKLIST.md)

3. **팀원 공유**
   - Docker Compose 설정 공유
   - 새로운 시작 절차 안내

---

## 질문 및 지원

문제가 발생하면:
1. 로그 확인: `docker-compose logs -f`
2. 상태 확인: `docker-compose ps`
3. 완전 초기화: `docker-clean.bat`
4. 문서 참고: `DOCKER_COMPOSE_GUIDE.md`
