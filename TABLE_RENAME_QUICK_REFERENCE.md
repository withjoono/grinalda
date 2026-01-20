# 테이블명 변경 빠른 참조

## 🚀 빠른 검색

### Phase 1 → Phase 2 전체 변경 플로우

```
원본 테이블명 → Phase 1 → Phase 2 (최종)
```

### 자주 찾는 테이블

| 원본 | Phase 1 | Phase 2 (현재) | 설명 |
|------|---------|---------------|------|
| `member_tb` | `auth_member` | **`auth_member`** | 회원 정보 ✓ |
| `member_interests` | `auth_member_interest` | **`ss_user_university_interest`** | 수시 관심대학 |
| `ts_member_regular_interests` | `auth_member_regular_interest` | **`js_user_university_interest`** | 정시 관심대학 |
| `ts_member_recruitment_unit_combinations` | `auth_member_recruitment_combination` | **`ss_user_application_combination`** | 수시 원서조합 |
| `ts_member_regular_combinations` | `auth_member_regular_combination` | **`js_user_application_combination`** | 정시 원서조합 |
| `schoolrecord_attendance_detail_tb` | `sr_attendance` | **`sgb_attendance`** | 출결 |
| `schoolrecord_subject_learning_tb` | `sr_subject_learning` | **`sgb_subject_learning`** | 교과세부 |
| `mentoring_account_link_tb` | `mt_account_link` | **`tr_account_link`** | 멘토링 |
| `pay_contract_tb` | `payment_contract` | **`payment_contract`** | 구독 ✓ |
| `ts_universities` | `ss_university` | **`ss_university`** | 대학정보 ✓ |

**✓ = Phase 2에서 변경 없음**

---

## 📋 접두사별 분류

### `auth_*` - 인증 (2개)
- `auth_member` - 회원
- `auth_member_file` - 업로드파일

### `ss_*` - 수시 대학정보 (16개)
- `ss_university` - 대학
- `ss_admission` - 학부
- `ss_admission_method` - 전형방법
- `ss_recruitment_unit` - 모집단위
- `ss_recruitment_unit_score` - 성적
- `ss_recruitment_unit_interview` - 면접
- 등...

### `ss_user_*` - 수시 사용자 (4개)
- `ss_user_university_interest` - 관심대학
- `ss_user_application_combination` - 원서조합
- `ss_user_recruitment_unit_combination_items` - 원서조합항목
- `ss_admission_subtype_relations` - 전형관계

### `js_*` - 정시 대학정보 (8개)
- `js_admission` - 정시모집
- `js_admission_previous_result` - 전년도결과
- `js_sunung_raw_score` - 수능원점수
- `js_sunung_standard_score` - 수능표준점수
- `js_pyunggawon_month` - 평가원일정
- `js_pyunggawon_raw_score` - 평가원점수
- `js_raw_to_standard` - 변환표
- 등...

### `js_user_*` - 정시 사용자 (6개)
- `js_user_university_interest` - 관심대학
- `js_user_application_combination` - 원서조합
- `js_user_application_combination_items` - 원서조합항목
- `js_user_calculated_scores` - 계산점수
- `js_user_input_scores` - 입력점수
- `js_user_recruitment_scores` - 모집단위점수

### `sgb_*` - 생활기록부 (5개)
- `sgb_attendance` - 출결
- `sgb_select_subject` - 선택과목
- `sgb_subject_learning` - 교과세부
- `sgb_volunteer` - 봉사활동
- `sgb_sport_art` - 체육/예술

### `payment_*` - 결제 (7개)
- `payment_service` - 서비스
- `payment_product` - 상품
- `payment_contract` - 구독계약
- `payment_order` - 주문
- `payment_coupon` - 쿠폰
- `payment_cancel_log` - 취소로그
- `payment_service_product` - 서비스-상품

### `board_*` - 게시판 (3개)
- `board_board` - 게시판
- `board_post` - 게시글
- `board_comment` - 댓글

### `tr_*` - 멘토링/튜토리얼 (3개)
- `tr_account_link` - 계정연결
- `tr_admin_class` - 관리자반
- `tr_temp_code` - 임시코드

### `pl_*` - 플래너 (6개)
- `pl_plan` - 플랜
- `pl_item` - 항목
- `pl_routine` - 루틴
- `pl_class` - 반
- `pl_management` - 관리
- `pl_notice` - 공지

### `mc_*` - 내반 (4개)
- `mc_health_record` - 건강기록
- `mc_consultation` - 상담
- `mc_attendance` - 출석
- `mc_test` - 시험

---

## 🔍 역방향 검색 (현재 → 원본)

### Phase 2 → 원본

| 현재 테이블명 | 원본 테이블명 |
|--------------|--------------|
| `ss_user_university_interest` | `member_interests` |
| `js_user_university_interest` | `ts_member_regular_interests` |
| `ss_user_application_combination` | `ts_member_recruitment_unit_combinations` |
| `js_user_application_combination` | `ts_member_regular_combinations` |
| `sgb_attendance` | `schoolrecord_attendance_detail_tb` |
| `sgb_select_subject` | `schoolrecord_select_subject_tb` |
| `sgb_sport_art` | `schoolrecord_subject_sports_art_tb` |
| `sgb_subject_learning` | `schoolrecord_subject_learning_tb` |
| `sgb_volunteer` | `schoolrecord_volunteer_tb` |
| `tr_account_link` | `mentoring_account_link_tb` |
| `tr_admin_class` | `mentoring_admin_class_tb` |
| `tr_temp_code` | `mentoring_temp_code_tb` |

---

## 🎯 Phase 2에서 변경된 테이블만 (18개)

### 변경 패턴 요약

| 변경 전 접두사 | 변경 후 접두사 | 테이블 수 | 변경 이유 |
|--------------|--------------|----------|-----------|
| `mt_*` | `tr_*` | 3 | Tutorial/Training이 더 명확 |
| `auth_member_*` | `ss_user_*` / `js_user_*` | 4 | 전형별 사용자 데이터 구분 |
| `sr_*` | `sgb_*` | 5 | 한국 교육 용어 (생활기록부) |
| `ts_member_jungsi_*` | `js_user_*` | 3 | 중복 제거 및 간소화 |
| `ts_*` | `ss_*` / `js_*` | 3 | 전형별 조인테이블 구분 |

---

## 💡 검색 팁

### 1. 원본 테이블명으로 찾기
```sql
-- 예: member_interests 찾기
-- Phase 1: auth_member_interest
-- Phase 2: ss_user_university_interest (최종)
```

### 2. 키워드로 찾기
- **"관심대학"** → `*_university_interest`
- **"원서조합"** → `*_application_combination`
- **"학생부"** → `sgb_*`
- **"수시"** → `ss_*`
- **"정시"** → `js_*`
- **"결제"** → `payment_*`

### 3. 도메인으로 찾기
- **사용자 데이터**: `ss_user_*`, `js_user_*`
- **대학 데이터**: `ss_*` (수시), `js_*` (정시)
- **학생부**: `sgb_*`
- **시스템**: `auth_*`, `payment_*`, `board_*`, `tr_*`, `pl_*`, `mc_*`

---

## ⚡ SQL 마이그레이션 파일

```bash
# Phase 1 적용
Hub-Backend/migrations/rename-tables-migration.sql

# Phase 1 롤백
Hub-Backend/migrations/rename-tables-rollback.sql

# Phase 2 적용
Hub-Backend/migrations/rename-tables-phase2-migration.sql

# Phase 2 롤백
Hub-Backend/migrations/rename-tables-phase2-rollback.sql
```

---

## 📅 변경 일자

- **Phase 1**: 2026-01-18 14:38 (커밋 `cb3c6c9`)
- **Phase 2**: 2026-01-18 19:18 (커밋 `48a96ac`)

**상세 문서**: `TABLE_RENAME_HISTORY.md` 참조
