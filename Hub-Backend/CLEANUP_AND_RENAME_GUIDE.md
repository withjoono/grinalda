# 🧹 거북스쿨 테이블 정리 및 변경 가이드 (최종)

## 📊 작업 개요

1. ❌ **미사용 테이블 11개 삭제**
2. ✅ **사용 중인 테이블 47개 이름 변경**
3. 📦 **레거시 코드 아카이브**

---

## Phase 1: 미사용 테이블 삭제 (11개)

### 삭제 대상
```
✅ officer_evaluation_tb              (교관 평가)
✅ officer_evaluation_comment_tb       (평가 댓글)
✅ officer_evaluation_score_tb         (평가 점수)
✅ officer_evaluation_survey_tb        (평가 설문)
✅ officer_list_tb                     (교관 목록)
✅ officer_ticket_tb                   (교관 티켓)
✅ susi_comprehensive_tb               (수시 종합 - 레거시)
✅ susi_pass_record_tb                 (수시 합격기록 - 레거시)
✅ susi_subject_tb                     (수시 과목 - 레거시)
✅ essay_list_tb                       (논술 목록)
✅ essay_lowest_grade_list_tb          (논술 최저등급)
```

### 실행 단계

#### 1.1 DB 백업 (필수!)
```bash
# PostgreSQL 백업
pg_dump -U username -d database_name > backup_before_cleanup_$(date +%Y%m%d_%H%M%S).sql

# 백업 검증
ls -lh backup_*.sql
```

#### 1.2 테이블 삭제 SQL 실행
```bash
# DBeaver 또는 psql에서 실행
psql -U username -d database_name -f migrations/drop-unused-tables.sql

# 또는 DBeaver에서 migrations/drop-unused-tables.sql 열어서 실행
```

#### 1.3 레거시 코드 아카이브
```bash
# Windows (PowerShell)
cd GB-Back-Nest
.\scripts\archive-original.ps1

# Linux/Mac
cd GB-Back-Nest
chmod +x scripts/archive-original.sh
./scripts/archive-original.sh
```

#### 1.4 코드 정리 (이미 완료)
```
✅ app.module.ts에서 EssayModule import 제거됨
```

---

## Phase 2: 테이블명 변경 (47개)

### 최종 매핑표

#### 📁 auth_* (회원 관련) - 6개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| member_tb | auth_member | 회원 정보 |
| member_interests | auth_member_interest | 회원 관심사 |
| member_upload_file_list | auth_member_file | 회원 업로드 파일 |
| ts_member_recruitment_unit_combinations | auth_member_recruitment_combination | 수시 조합 |
| ts_member_regular_combinations | auth_member_regular_combination | 정시 조합 |
| member_regular_interests | auth_member_regular_interest | 정시 관심 |

#### 📁 sr_* (학생부 관련) - 5개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| schoolrecord_attendance_detail_tb | sr_attendance | 출결 |
| schoolrecord_select_subject_tb | sr_select_subject | 선택과목 |
| schoolrecord_subject_learning_tb | sr_subject_learning | 교과학습 |
| schoolrecord_volunteer_tb | sr_volunteer | 봉사활동 |
| schoolrecord_subject_sports_art_tb | sr_sport_art | 체육/예술 |

#### 📁 js_* (정시/수능 관련) - 7개 ⭐ **변경됨**
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| mockexam_raw_score_tb | js_sunung_raw_score | 수능 원점수 |
| mockexam_raw_to_standard_tb | js_raw_to_standard | 원점수→표준점수 변환 |
| mockexam_schedule_tb | js_pyunggawon_month | 평가원 일정 선택 |
| mockexam_marks_tb | js_pyunggawon_raw_score | 평가원 원점수 |
| mockexam_standard_score_tb | js_sunung_standard_score | 수능 표준점수 |
| ts_regular_admissions | js_admission | 정시 입학 정보 |
| ts_regular_admission_previous_results | js_admission_previous_result | 정시 전년도 결과 |

#### 📁 payment_* (결제 관련) - 7개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| pay_service_tb | payment_service | 서비스 |
| pay_coupon_tb | payment_coupon | 쿠폰 |
| pay_contract_tb | payment_contract | 계약 |
| pay_order_tb | payment_order | 주문 |
| pay_cancel_log_tb | payment_cancel_log | 취소 로그 |
| pay_product_tb | payment_product | 상품 |
| pay_service_product_tb | payment_service_product | 서비스-상품 |

#### 📁 common_* (공통 코드) - 1개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| subject_code_list | common_subject_code | 교과 코드 |

#### 📁 board_* (게시판 관련) - 3개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| board_tb | board_board | 게시판 |
| post_tb | board_post | 게시글 |
| comment_tb | board_comment | 댓글 |

#### 📁 ss_* (수시 전형 관련) - 15개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| ts_admission_categories | ss_admission_category | 중심전형분류 |
| ts_admission_methods | ss_admission_method | 입학전형 방법 |
| ts_admission_subtypes | ss_admission_subtype | 전형 세부유형 |
| ts_admissions | ss_admission | 입학전형 정보 |
| ts_general_fields | ss_general_field | 대계열 |
| ts_major_fields | ss_major_field | 대분류 |
| ts_mid_fields | ss_mid_field | 중분류 |
| ts_minor_fields | ss_minor_field | 소분류 |
| ts_recruitment_units | ss_recruitment_unit | 모집단위 |
| ts_recruitment_unit_scores | ss_recruitment_unit_score | 모집단위 점수 |
| ts_recruitment_unit_interviews | ss_recruitment_unit_interview | 모집단위 면접 |
| ts_recruitment_unit_minimum_grades | ss_recruitment_unit_minimum_grade | 최저학력기준 |
| ts_recruitment_unit_previous_results | ss_recruitment_unit_previous_result | 전년도 결과 |
| ts_recruitment_unit_pass_fail_records | ss_recruitment_unit_pass_fail_record | 합불 기록 |
| ts_universities | ss_university | 대학 정보 |

#### 📁 mt_* (멘토링 관련) - 3개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| mentoring_temp_code_tb | mt_temp_code | 임시 코드 |
| mentoring_account_link_tb | mt_account_link | 계정 연동 |
| mentoring_admin_class_tb | mt_admin_class | 관리자 클래스 |

#### 📁 pl_* (플래너 관련) - 6개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| planner_plan_tb | pl_plan | 학습계획 |
| planner_item_tb | pl_item | 일정 아이템 |
| planner_routine_tb | pl_routine | 루틴 |
| planner_class_tb | pl_class | 플래너 클래스 |
| planner_management_tb | pl_management | 멤버십 |
| planner_notice_tb | pl_notice | 공지사항 |

#### 📁 mc_* (마이클래스 관련) - 4개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| myclass_health_record_tb | mc_health_record | 건강 기록 |
| myclass_consultation_tb | mc_consultation | 상담 기록 |
| myclass_attendance_tb | mc_attendance | 출결 기록 |
| myclass_test_tb | mc_test | 테스트 기록 |

#### 📁 ar_* (경쟁률 관련) - 2개
| 현재 테이블명 | 새 테이블명 | 설명 |
|--------------|------------|------|
| application_rates | ar_rate | 경쟁률 데이터 |
| application_rate_history | ar_history | 경쟁률 히스토리 |

---

## 📊 통계

| 접두사 | 서비스명 | 개수 |
|--------|---------|------|
| auth_* | 회원 | 6 |
| sr_* | 학생부 | 5 |
| **js_*** | **정시/수능** | **7** |
| payment_* | 결제 | 7 |
| common_* | 공통코드 | 1 |
| board_* | 게시판 | 3 |
| ss_* | 수시 | 15 |
| mt_* | 멘토링 | 3 |
| pl_* | 플래너 | 6 |
| mc_* | 마이클래스 | 4 |
| ar_* | 경쟁률 | 2 |
| **합계** | | **47개** |

---

## 🚀 실행 순서

### Step 1: Phase 1 완료 확인
```bash
# 삭제 완료 확인
psql -U user -d db -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname='public';"

# GB-Back-Nest-Original 아카이브 확인
ls -lh GB-Back-Nest-Original_*.zip  # Windows
ls -lh GB-Back-Nest-Original_*.tar.gz  # Linux/Mac
```

### Step 2: 매핑표 기반 스크립트 재생성
```bash
# 새 매핑표로 마이그레이션 SQL 재생성
npx ts-node scripts/generate-migration-sql.ts
```

### Step 3: 코드 변경 (DRY RUN)
```bash
# 미리보기
npx ts-node scripts/rename-tables.ts --dry-run
```

### Step 4: 코드 변경 (실제)
```bash
# 백업하면서 변경
npx ts-node scripts/rename-tables.ts --backup

# 빌드 테스트
npm run build
```

### Step 5: DB 마이그레이션
```bash
# 1. 외래키 확인
# migrations/rename-tables-migration.sql의 STEP 1 쿼리 실행

# 2. 마이그레이션 실행
psql -U user -d db -f migrations/rename-tables-migration.sql
```

### Step 6: 테스트
```bash
# 앱 실행
npm run start:dev

# 기능 테스트 진행
```

---

## 📝 체크리스트

### Phase 1: 삭제
- [ ] DB 백업 완료
- [ ] 11개 테이블 삭제 SQL 실행
- [ ] 삭제 확인 (테이블 존재하지 않음)
- [ ] GB-Back-Nest-Original 아카이브
- [ ] app.module.ts EssayModule 제거 확인
- [ ] Git 커밋

### Phase 2: 변경
- [ ] 새 매핑표 검토 (table-rename-mapping-clean.json)
- [ ] 마이그레이션 SQL 재생성
- [ ] 코드 변경 DRY RUN 확인
- [ ] 코드 변경 실제 실행
- [ ] 빌드 성공 확인
- [ ] 외래키 확인 및 재생성 SQL 작성
- [ ] DB 마이그레이션 실행
- [ ] 애플리케이션 테스트
- [ ] Git 커밋

---

## 🎯 주요 변경 사항

### 1. 모의고사 → 정시/수능
기존에 `mockexam_*` (모의고사)로 분류되었던 테이블들이 실제로는 **정시 수능 데이터**였습니다.

**변경 전**:
```
mockexam_raw_score_tb         → me_raw_score
mockexam_standard_score_tb    → me_standard_score
```

**변경 후**:
```
mockexam_raw_score_tb         → js_sunung_raw_score (수능 원점수)
mockexam_standard_score_tb    → js_sunung_standard_score (수능 표준점수)
mockexam_schedule_tb          → js_pyunggawon_month (평가원 일정)
mockexam_marks_tb             → js_pyunggawon_raw_score (평가원 원점수)
```

### 2. 플래너 접두사
`sp_*` (Study Planner) 대신 `pl_*` (Planner)로 단순화

### 3. 학생부 접두사
`sr_*` (School Record)로 명확화

---

**작성일**: 2026-01-17
**최종 수정**: 2026-01-17 (모의고사 → 정시/수능 변경 반영)
