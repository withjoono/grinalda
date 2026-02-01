# Docker Compose 사용 가이드

## 개요

Docker Compose를 사용하여 Hub 프로젝트의 모든 인프라 서비스(PostgreSQL, Redis)를 한 번에 관리합니다.

## 주요 파일

```
Hub/
├── docker-compose.yml           # 메인 설정 파일
├── docker-compose.dev.yml       # 개발 환경 오버라이드
├── .env.docker                  # 환경 변수
├── docker-start.bat            # 시작 스크립트
├── docker-stop.bat             # 중지 스크립트
└── docker-clean.bat            # 완전 초기화 스크립트
```

## 빠른 시작

### 1. Docker Compose 서비스만 시작

```bash
# 간단한 시작
docker-compose up -d

# 또는 배치 파일 사용
docker-start.bat
```

### 2. 전체 개발 환경 시작 (권장)

```bash
# Backend + Frontend + Docker 모두 시작
start-dev-improved.bat
```

이 스크립트는 자동으로 Docker Compose를 감지하고 시작합니다.

## 기본 명령어

### 시작 및 중지

```bash
# 서비스 시작 (백그라운드)
docker-compose up -d

# 서비스 중지 (컨테이너 제거, 볼륨 유지)
docker-compose down

# 서비스 중지 (볼륨까지 제거)
docker-compose down -v
```

### 상태 확인

```bash
# 실행 중인 서비스 확인
docker-compose ps

# 서비스 로그 확인
docker-compose logs

# 특정 서비스 로그 실시간 확인
docker-compose logs -f postgres
docker-compose logs -f redis

# 서비스 헬스체크 상태
docker-compose ps
```

### 서비스 관리

```bash
# 특정 서비스만 재시작
docker-compose restart postgres
docker-compose restart redis

# 서비스 중지 (컨테이너 유지)
docker-compose stop

# 서비스 시작 (이미 생성된 컨테이너)
docker-compose start

# 설정 파일 검증
docker-compose config
```

## 서비스 정보

### PostgreSQL

```yaml
컨테이너명: hub-postgres
포트: 5432
사용자: tsuser
비밀번호: tsuser1234
데이터베이스: geobukschool_dev
```

**접속 방법:**
```bash
# Docker 외부에서
psql -h localhost -p 5432 -U tsuser -d geobukschool_dev

# Docker 내부에서
docker-compose exec postgres psql -U tsuser -d geobukschool_dev

# pgAdmin 사용 (docker-compose.dev.yml 활성화 시)
# http://localhost:5050
```

### Redis

```yaml
컨테이너명: hub-redis
포트: 6379
영속성: AOF 활성화
```

**접속 방법:**
```bash
# Docker 외부에서
redis-cli -h localhost -p 6379

# Docker 내부에서
docker-compose exec redis redis-cli

# Redis Commander 사용 (docker-compose.dev.yml 활성화 시)
# http://localhost:8081
```

## 데이터 영속성

### 볼륨 관리

```bash
# 볼륨 목록 확인
docker volume ls | findstr hub

# 볼륨 상세 정보
docker volume inspect hub_postgres_data
docker volume inspect hub_redis_data

# 볼륨 백업
docker run --rm -v hub_postgres_data:/data -v ${PWD}:/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# 볼륨 복원
docker run --rm -v hub_postgres_data:/data -v ${PWD}:/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

### 데이터 마이그레이션 (레거시 → Compose)

기존 `geobuk-postgres` 컨테이너에서 새로운 `hub-postgres`로 데이터 이전:

```bash
# 1. 기존 데이터 백업
docker exec geobuk-postgres pg_dump -U tsuser geobukschool_dev > backup.sql

# 2. 새 컨테이너 시작
docker-compose up -d

# 3. 데이터 복원
docker-compose exec -T postgres psql -U tsuser -d geobukschool_dev < backup.sql

# 4. 기존 컨테이너 정리
docker stop geobuk-postgres
docker rm geobuk-postgres
```

## 개발 환경 모드

### 기본 모드 (프로덕션 유사)

```bash
docker-compose up -d
```

### 개발 모드 (GUI 툴 포함)

```bash
# pgAdmin + Redis Commander 포함
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

개발 모드 추가 서비스:
- **pgAdmin**: http://localhost:5050 (admin@hub.local / admin)
- **Redis Commander**: http://localhost:8081

## 트러블슈팅

### 포트 충돌

```bash
# 포트 사용 프로세스 확인
netstat -ano | findstr :5432
netstat -ano | findstr :6379

# 충돌하는 컨테이너 중지
docker ps | findstr 5432
docker stop [CONTAINER_ID]
```

### 컨테이너 시작 실패

```bash
# 로그 확인
docker-compose logs postgres
docker-compose logs redis

# 컨테이너 재생성
docker-compose down
docker-compose up -d --force-recreate
```

### 네트워크 문제

```bash
# 네트워크 확인
docker network ls | findstr hub

# 네트워크 재생성
docker-compose down
docker network rm hub-network
docker-compose up -d
```

### 볼륨 권한 문제

```bash
# 볼륨 권한 확인
docker-compose exec postgres ls -la /var/lib/postgresql/data

# 볼륨 재생성 (데이터 삭제됨!)
docker-compose down -v
docker-compose up -d
```

### 완전 초기화

```bash
# 모든 것 제거하고 처음부터 시작
docker-clean.bat

# 또는 수동으로
docker-compose down -v
docker volume prune -f
docker-compose up -d
```

## 환경 변수 설정

### .env.docker 파일 수정

```bash
# PostgreSQL 설정 변경
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
```

변경 후 재시작:
```bash
docker-compose down
docker-compose up -d
```

## 성능 최적화

### PostgreSQL 튜닝

`docker-compose.yml`에 성능 설정 추가:
```yaml
services:
  postgres:
    command:
      - "postgres"
      - "-c"
      - "max_connections=200"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "effective_cache_size=1GB"
```

### Redis 메모리 제한

```yaml
services:
  redis:
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

## CI/CD 통합

### GitHub Actions

```yaml
# .github/workflows/test.yml
- name: Start services
  run: docker-compose up -d

- name: Wait for services
  run: |
    timeout 30 bash -c 'until docker-compose exec -T postgres pg_isready; do sleep 1; done'

- name: Run tests
  run: npm test

- name: Cleanup
  run: docker-compose down -v
```

## 모니터링

### 리소스 사용량 확인

```bash
# 컨테이너별 리소스 사용량
docker stats hub-postgres hub-redis

# 볼륨 크기 확인
docker system df -v | findstr hub
```

### 헬스체크

```bash
# PostgreSQL 헬스체크
docker-compose exec postgres pg_isready -U tsuser

# Redis 헬스체크
docker-compose exec redis redis-cli ping
```

## 베스트 프랙티스

1. **개발 시작 시**: `start-dev-improved.bat` 사용 (Docker + Backend + Frontend 모두 시작)
2. **Docker만 재시작**: `docker-compose restart`
3. **서비스 중지 시**: 볼륨은 유지 (`docker-compose down`)
4. **완전 초기화**: `docker-clean.bat` 사용
5. **로그 모니터링**: `docker-compose logs -f` 사용

## 다음 단계

1. Docker Compose 서비스 시작: `docker-start.bat`
2. 전체 개발 환경 시작: `start-dev-improved.bat`
3. 브라우저에서 확인: http://localhost:3000

## 참고 자료

- [Docker Compose 공식 문서](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
