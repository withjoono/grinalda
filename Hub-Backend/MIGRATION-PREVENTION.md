# 🛡️ 마이그레이션 문제 재발 방지 가이드

`firebase_uid` 컬럼 누락과 같은 마이그레이션 불일치 문제를 방지하기 위한 종합 가이드입니다.

## 🎯 문제 요약

**증상**: 로그인 시 `column MemberEntity.firebase_uid does not exist` 에러 발생  
**원인**: 마이그레이션이 실행되지 않았거나, 실행 실패 후 기록만 남음  
**영향**: Firebase 인증 완전 불가

## ✅ 재발 방지 솔루션

### 1. 자동 마이그레이션 체크 (추가 완료)

개발 서버 시작 시 자동으로 마이그레이션 상태를 확인합니다.

```json
// package.json
{
  "scripts": {
    "prestart:dev": "npm run build:check && npm run docker:start:all && npm run migration:check"
  }
}
```

**작동 방식**:
- `npm run start:dev` 실행 시 자동으로 `migration:check` 실행
- 대기 중인 마이그레이션이나 스키마 불일치 감지
- 문제 발견 시 개발자에게 경고

### 2. 스키마 검증 스크립트 (추가 완료)

필수 컬럼 존재 여부를 프로그래밍 방식으로 확인:

```bash
# 실행 방법
npm run migration:verify
```

```typescript
// scripts/verify-schema.ts
const REQUIRED_COLUMNS = {
  auth_member: ['firebase_uid', 'email', 'phone', 'role_type'],
};
// 누락된 컬럼 자동 감지 및 보고
```

### 3. Git Hooks로 자동 체크

Pull/Merge 후 자동으로 마이그레이션 확인:

```bash
# .husky/post-merge
#!/bin/sh
echo "🔍 마이그레이션 상태 확인 중..."
npm run migration:check
```

**설정 방법**:
```bash
# Husky가 이미 설치되어 있음
npx husky add .husky/post-merge "npm run migration:check"
chmod +x .husky/post-merge
```

### 4. README에 필수 단계 추가

**Hub-Backend/README.md**에 명확한 안내:

```markdown
## ⚠️ 중요: 최초 설정 및 업데이트 후 필수 단계

``bash
# 1. 저장소 클론 또는 pull 후
git pull origin main

# 2. 의존성 설치
yarn install

# 3. 🚨 마이그레이션 실행 (필수!)
yarn typeorm:run

# 4. 스키마 검증
npm run migration:verify

# 5. 서버 시작
npm run start:dev
``
```

### 5. 애플리케이션 시작 시 필수 컬럼 체크

Backend 시작 시 자동으로 필수 컬럼 존재 확인:

```typescript
// src/main.ts
import { validateSchema } from './utils/schema-validator';

async function bootstrap() {
  // 개발 환경에서만 체크
  if (process.env.NODE_ENV === 'development') {
    await validateSchema();
  }
  
  const app = await NestFactory.create(AppModule);
  // ...
}
```

## 🔄 팀 워크플로우

### PR 생성자 체크리스트

마이그레이션이 포함된 PR 생성 시:

- [ ] 로컬에서 `yarn typeorm:run` 테스트 완료
- [ ] 롤백 테스트: `yarn typeorm:revert` → `yarn typeorm:run`
- [ ] PR 제목에 `[Migration]` 태그 추가
- [ ] PR 설명에 마이그레이션 실행 안내 추가
- [ ] 영향받는 테이블과 컬럼 명시

### PR 리뷰어 체크리스트

- [ ] 마이그레이션 파일 위치 확인: `src/migrations/`
- [ ] up/down 메서드 모두 구현되었는지 확인
- [ ] SQL 문법 검토
- [ ] 대용량 테이블의 경우 인덱스 추가 여부 확인

### 팀원 (PR Merge 후)

```bash
# 1. 최신 코드 받기
git pull origin main

# 2. 의존성 업데이트 (필요시)
yarn install

# 3. 🚨 마이그레이션 실행 (절대 생략 금지!)
yarn typeorm:run

# 4. 검증
npm run migration:verify

# 5. 서버 재시작
npm run start:dev
```

## 🚨 긴급 복구 가이드

### 현재 상황 진단

```bash
# 1. 컬럼 존재 여부 확인
docker exec hub-postgres psql -U tsuser -d geobukschool_dev \
  -c "SELECT column_name FROM information_schema.columns \
      WHERE table_name='auth_member' AND column_name='firebase_uid'"

# 2. 마이그레이션 기록 확인  
docker exec hub-postgres psql -U tsuser -d geobukschool_dev \
  -c "SELECT name FROM typeorm_migrations \
      WHERE name LIKE '%Firebase%' ORDER BY id DESC"
```

### 시나리오 1: 컬럼 없음 + 마이그레이션 기록 있음

**원인**: 마이그레이션 실행 실패했지만 기록만 남음

```bash
# 1. 마이그레이션 기록 삭제
docker exec hub-postgres psql -U tsuser -d geobukschool_dev \
  -c "DELETE FROM typeorm_migrations \
      WHERE name='AddFirebaseUidToMember1769513366700'"

# 2. 마이그레이션 재실행
yarn typeorm:run

# 3. 서버 재시작
npm run start:dev
```

### 시나리오 2: 컬럼 없음 + 마이그레이션 기록 없음

**원인**: 마이그레이션이 아예 실행되지 않음

```bash
# 마이그레이션 실행
yarn typeorm:run
npm run start:dev
```

### 시나리오 3: 급하게 수동 수정

```bash
# 직접 컬럼 추가 (응급 조치)
docker exec hub-postgres psql -U tsuser -d geobukschool_dev << 'SQL'
ALTER TABLE auth_member 
ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128);

CREATE INDEX IF NOT EXISTS idx_member_firebase_uid 
ON auth_member(firebase_uid);
SQL

# 서버 재시작
npm run start:dev
```

## 📊 모니터링 & 알림

### 에러 로그 모니터링

```bash
# Firebase 인증 에러 감지
tail -f logs/error/$(date +%Y-%m-%d).log | grep "firebase_uid"
```

### Slack 알림 설정 (옵션)

```javascript
// src/common/filters/http-exception.filter.ts
if (message.includes('column') && message.includes('does not exist')) {
  // Slack webhook으로 긴급 알림
  await this.notifySlack({
    channel: '#backend-alerts',
    text: '🚨 데이터베이스 스키마 불일치 감지!',
    error: message
  });
}
```

## 🎓 교육 자료

### 새 팀원 온보딩 체크리스트

- [ ] TypeORM 마이그레이션 개념 이해
- [ ] 로컬 환경 설정 완료
- [ ] 첫 마이그레이션 생성 및 실행 실습
- [ ] 롤백 테스트 실습
- [ ] 긴급 복구 절차 숙지

### 참고 자료

- [TypeORM Migrations 공식 문서](https://typeorm.io/migrations)
- [Hub Backend CLAUDE.md](./CLAUDE.md)
- [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)

## 🔧 유용한 명령어 모음

```bash
# 현재 마이그레이션 상태
npm run migration:check

# 스키마 검증
npm run migration:verify

# 대기 중인 마이그레이션 실행
yarn typeorm:run

# 마지막 마이그레이션 롤백
yarn typeorm:revert

# 모든 마이그레이션 목록
yarn typeorm migration:show

# 새 마이그레이션 생성
yarn typeorm:generate -n MigrationName

# 빈 마이그레이션 생성
yarn typeorm:create -n MigrationName
```

## ✨ 추가 개선 사항 (향후)

1. **CI/CD 파이프라인 통합**
   ```yaml
   # .github/workflows/test.yml
   - name: Verify migrations
     run: |
       yarn typeorm:run
       npm run migration:verify
   ```

2. **자동 백업**
   - 마이그레이션 실행 전 자동 DB 백업
   - 롤백 시 자동 복구

3. **마이그레이션 테스트 자동화**
   - up/down 사이클 자동 테스트
   - 대용량 더미 데이터로 성능 테스트

4. **문서 자동 생성**
   - 마이그레이션 히스토리 자동 문서화
   - 스키마 변경 로그 자동 추적

## 📞 문제 발생 시 연락처

- **긴급**: Slack #backend-emergency
- **일반**: Slack #backend-dev
- **GitHub Issues**: [이슈 생성](https://github.com/your-org/Hub/issues/new)
