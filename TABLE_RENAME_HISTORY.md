# 데이터베이스 테이블명 변경 이력

## 📋 개요

Hub 프로젝트에서 총 **2번**의 테이블명 체계적 변경이 진행되었습니다.
- **Phase 1**: 레거시 이름 → 도메인별 접두사 (58개 테이블)
- **Phase 2**: 접두사 통일 및 의미 명확화 (18개 테이블)

---

## 🔄 Phase 1: 도메인별 접두사 적용 (2026-01-18 14:38)

**커밋**: `cb3c6c9` - "feat: 테이블명 체계적 변경 (47개 → 58개 테이블)"

### 변경 범위
- **변경된 테이블**: 58개
- **변경된 파일**: 118개
- **업데이트된 @Entity 데코레이터**: 98개
- **업데이트된 SQL 쿼리**: 52개

### 접두사 규칙
| 접두사 | 도메인 | 설명 |
|--------|--------|------|
| `auth_*` | 인증/회원 | 회원 정보, 인증 관련 |
| `sr_*` | 학생부 | School Records |
| `js_*` | 정시/모의고사 | Jungsi (정시), 수능 관련 |
| `payment_*` | 결제 | 결제, 상품, 쿠폰 |
| `board_*` | 게시판 | 커뮤니티, 게시글 |
| `ss_*` | 수시 | Susi (수시), 대학/모집단위 |
| `mt_*` | 멘토링 | Mentoring 시스템 |
| `pl_*` | 플래너 | Planner 시스템 |
| `mc_*` | 내반 | MyClass 시스템 |
| `ar_*` | 경쟁률 | Application Rate |

### 상세 변경 내역

#### 1. 인증/회원 (auth_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `member_tb` | `auth_member` | 회원 기본 정보 |
| `member_interests` | `auth_member_interest` | 수시 관심 대학 |
| `member_upload_file_list_tb` | `auth_member_file` | 업로드 파일 목록 |
| `ts_member_recruitment_unit_combinations` | `auth_member_recruitment_combination` | 수시 원서 조합 |
| `ts_member_regular_combinations` | `auth_member_regular_combination` | 정시 원서 조합 |
| `ts_member_regular_interests` | `auth_member_regular_interest` | 정시 관심 대학 |

#### 2. 학생부 (sr_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `schoolrecord_attendance_detail_tb` | `sr_attendance` | 출결 상세 |
| `schoolrecord_select_subject_tb` | `sr_select_subject` | 선택 과목 |
| `schoolrecord_subject_learning_tb` | `sr_subject_learning` | 교과 세부능력 |
| `schoolrecord_volunteer_tb` | `sr_volunteer` | 봉사활동 |
| `schoolrecord_subject_sports_art_tb` | `sr_sport_art` | 체육/예술 활동 |

#### 3. 정시/모의고사 (js_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `mockexam_raw_score_tb` | `js_sunung_raw_score` | 수능 원점수 |
| `mockexam_raw_to_standard_tb` | `js_raw_to_standard` | 원점수→표준점수 변환 |
| `mockexam_schedule_tb` | `js_pyunggawon_month` | 평가원 모의고사 일정 |
| `mockexam_marks_tb` | `js_pyunggawon_raw_score` | 평가원 모의고사 점수 |
| `mockexam_standard_score_tb` | `js_sunung_standard_score` | 수능 표준점수 |
| `ts_regular_admissions` | `js_admission` | 정시 모집단위 |
| `ts_regular_admission_previous_results` | `js_admission_previous_result` | 정시 전년도 결과 |

#### 4. 결제 (payment_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `pay_service_tb` | `payment_service` | 결제 서비스 |
| `pay_coupon_tb` | `payment_coupon` | 할인 쿠폰 |
| `pay_contract_tb` | `payment_contract` | 구독 계약 |
| `pay_order_tb` | `payment_order` | 주문 내역 |
| `pay_cancel_log_tb` | `payment_cancel_log` | 취소 로그 |
| `pay_product_tb` | `payment_product` | 상품 정보 |
| `pay_service_product_tb` | `payment_service_product` | 서비스-상품 매핑 |

#### 5. 게시판 (board_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `board_tb` | `board_board` | 게시판 정보 |
| `post_tb` | `board_post` | 게시글 |
| `comment_tb` | `board_comment` | 댓글 |

#### 6. 수시 (ss_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `ts_admission_categories` | `ss_admission_category` | 전형 카테고리 |
| `ts_admission_methods` | `ss_admission_method` | 전형 방법 |
| `ts_admission_subtypes` | `ss_admission_subtype` | 전형 세부유형 |
| `ts_admissions` | `ss_admission` | 학부(단과대) |
| `ts_general_fields` | `ss_general_field` | 대계열 |
| `ts_major_fields` | `ss_major_field` | 중계열 |
| `ts_mid_fields` | `ss_mid_field` | 소계열 |
| `ts_minor_fields` | `ss_minor_field` | 세계열 |
| `ts_recruitment_units` | `ss_recruitment_unit` | 모집단위 |
| `ts_recruitment_unit_scores` | `ss_recruitment_unit_score` | 모집단위 성적 |
| `ts_recruitment_unit_interviews` | `ss_recruitment_unit_interview` | 면접 정보 |
| `ts_recruitment_unit_minimum_grades` | `ss_recruitment_unit_minimum_grade` | 최저등급 |
| `ts_recruitment_unit_previous_results` | `ss_recruitment_unit_previous_result` | 전년도 결과 |
| `ts_recruitment_unit_pass_fail_records` | `ss_recruitment_unit_pass_fail_record` | 합불 사례 |
| `ts_universities` | `ss_university` | 대학 정보 |

#### 7. 멘토링 (mt_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `mentoring_temp_code_tb` | `mt_temp_code` | 임시 코드 |
| `mentoring_account_link_tb` | `mt_account_link` | 계정 연결 |
| `mentoring_admin_class_tb` | `mt_admin_class` | 관리자 반 |

#### 8. 플래너 (pl_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `planner_plan_tb` | `pl_plan` | 플랜 |
| `planner_item_tb` | `pl_item` | 플랜 항목 |
| `planner_routine_tb` | `pl_routine` | 루틴 |
| `planner_class_tb` | `pl_class` | 반 정보 |
| `planner_management_tb` | `pl_management` | 플래너 관리 |
| `planner_notice_tb` | `pl_notice` | 공지사항 |

#### 9. 내반 (mc_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `myclass_health_record_tb` | `mc_health_record` | 건강 기록 |
| `myclass_consultation_tb` | `mc_consultation` | 상담 내역 |
| `myclass_attendance_tb` | `mc_attendance` | 출석 체크 |
| `myclass_test_tb` | `mc_test` | 시험 기록 |

#### 10. 경쟁률 (ar_*)
| 이전 이름 | Phase 1 이름 | 설명 |
|-----------|-------------|------|
| `application_rates` | `ar_rate` | 경쟁률 |
| `application_rate_history` | `ar_history` | 경쟁률 히스토리 |

---

## 🎯 Phase 2: 의미 명확화 및 통일 (2026-01-18 19:18)

**커밋**: `48a96ac` - "feat: Rename tables Phase 2 - Unified naming convention"

### 변경 범위
- **변경된 테이블**: 18개
- **변경된 파일**: 12개 엔티티
- **도메인**: 멘토링, 사용자 관심사, 학생부, 정시

### 새로운 접두사 규칙
| 접두사 | 의미 | 설명 |
|--------|------|------|
| `tr_*` | Tutorial/Training | 멘토링 시스템 (mt_* 대체) |
| `ss_user_*` | Susi User | 수시 전형 사용자 데이터 |
| `js_user_*` | Jungsi User | 정시 전형 사용자 데이터 |
| `sgb_*` | Saenggibu (생기부) | 학생부 기록 (sr_* 대체) |

### 상세 변경 내역

#### 1. 멘토링 (mt_* → tr_*)
| Phase 1 이름 | Phase 2 이름 | 설명 |
|-------------|-------------|------|
| `mt_account_link` | `tr_account_link` | 계정 연결 |
| `mt_admin_class` | `tr_admin_class` | 관리자 반 |
| `mt_temp_code` | `tr_temp_code` | 임시 코드 |

**변경 이유**: "Mentoring"보다 "Training/Tutorial"이 시스템 성격을 더 명확히 표현

#### 2. 수시 사용자 관심사 (auth_* → ss_user_*)
| Phase 1 이름 | Phase 2 이름 | 설명 |
|-------------|-------------|------|
| `auth_member_interest` | `ss_user_university_interest` | 수시 관심 대학 |
| `auth_member_recruitment_combination` | `ss_user_application_combination` | 수시 원서 조합 |

**변경 이유**:
- `auth_*`는 인증 도메인과 혼동
- 사용자 데이터임을 명확히 표현 (`user_*`)
- 수시 전형 데이터임을 명시 (`ss_*`)

#### 3. 정시 사용자 관심사 (auth_* → js_user_*)
| Phase 1 이름 | Phase 2 이름 | 설명 |
|-------------|-------------|------|
| `auth_member_regular_combination` | `js_user_application_combination` | 정시 원서 조합 |
| `auth_member_regular_interest` | `js_user_university_interest` | 정시 관심 대학 |

**변경 이유**: 정시 전형 사용자 데이터임을 명확히 표현

#### 4. 학생부 (sr_* → sgb_*)
| Phase 1 이름 | Phase 2 이름 | 설명 |
|-------------|-------------|------|
| `sr_attendance` | `sgb_attendance` | 출결 상세 |
| `sr_select_subject` | `sgb_select_subject` | 선택 과목 |
| `sr_sport_art` | `sgb_sport_art` | 체육/예술 활동 |
| `sr_subject_learning` | `sgb_subject_learning` | 교과 세부능력 |
| `sr_volunteer` | `sgb_volunteer` | 봉사활동 |

**변경 이유**:
- "School Records"보다 한국 교육 시스템의 "생활기록부"를 더 명확히 표현
- `sgb_*` (Saenggibu)가 도메인 전문가에게 직관적

#### 5. 정시 사용자 점수 (ts_* → js_user_*)
| Phase 1 이름 | Phase 2 이름 | 설명 |
|-------------|-------------|------|
| `ts_member_jungsi_calculated_scores` | `js_user_calculated_scores` | 정시 계산 점수 |
| `ts_member_jungsi_input_scores` | `js_user_input_scores` | 정시 입력 점수 |
| `ts_member_jungsi_recruitment_scores` | `js_user_recruitment_scores` | 정시 모집단위별 점수 |

**변경 이유**:
- `ts_member_jungsi_*` 중복 표현 제거
- 사용자 데이터임을 명확히

#### 6. 조인 테이블 (ts_* → ss_*/js_*)
| Phase 1 이름 | Phase 2 이름 | 설명 |
|-------------|-------------|------|
| `ts_admission_subtype_relations` | `ss_admission_subtype_relations` | 수시 전형 세부유형 관계 |
| `ts_member_recruitment_unit_combination_items` | `ss_user_recruitment_unit_combination_items` | 수시 원서 조합 항목 |
| `ts_member_regular_combination_items` | `js_user_application_combination_items` | 정시 원서 조합 항목 |

**변경 이유**: 수시/정시 구분 명확화

---

## 📊 최종 현황 (Phase 2 완료 후)

### 접두사별 테이블 분포

| 접두사 | 테이블 수 | 도메인 | 예시 |
|--------|----------|--------|------|
| `auth_*` | 2 | 인증 | `auth_member`, `auth_member_file` |
| `sgb_*` | 5 | 학생부 | `sgb_attendance`, `sgb_volunteer` |
| `js_*` | 8 | 정시 | `js_admission`, `js_sunung_raw_score` |
| `js_user_*` | 6 | 정시 사용자 | `js_user_calculated_scores` |
| `ss_*` | 16 | 수시 | `ss_university`, `ss_recruitment_unit` |
| `ss_user_*` | 4 | 수시 사용자 | `ss_user_university_interest` |
| `payment_*` | 7 | 결제 | `payment_service`, `payment_order` |
| `board_*` | 3 | 게시판 | `board_post`, `board_comment` |
| `tr_*` | 3 | 멘토링 | `tr_account_link`, `tr_admin_class` |
| `pl_*` | 6 | 플래너 | `pl_plan`, `pl_item` |
| `mc_*` | 4 | 내반 | `mc_health_record`, `mc_attendance` |
| **총계** | **64개** | | |

---

## 🔍 명명 규칙 가이드

### 도메인 접두사
1. **시스템 도메인**: `auth_`, `payment_`, `board_`, `tr_`, `pl_`, `mc_`
2. **전형 구분**: `ss_` (수시), `js_` (정시)
3. **사용자 데이터**: `ss_user_*`, `js_user_*`
4. **한국 특화**: `sgb_*` (생활기록부)

### 테이블 이름 구성
```
[접두사]_[주체]_[설명]

예시:
- ss_user_university_interest (수시 사용자 대학 관심사)
- js_user_calculated_scores (정시 사용자 계산 점수)
- sgb_subject_learning (생기부 교과 세부능력)
```

---

## ⚠️ 주의사항

### 마이그레이션 파일
- **Phase 1**: `migrations/rename-tables-migration.sql`
- **Phase 2**: `migrations/rename-tables-phase2-migration.sql`
- **롤백 파일**: 각 마이그레이션마다 `-rollback.sql` 제공

### 코드 영향 범위
- **엔티티 파일**: `@Entity()` 데코레이터의 테이블명
- **쿼리 빌더**: 모든 하드코딩된 테이블명
- **Raw SQL**: 스크립트 및 마이그레이션 파일

### 시퀀스 업데이트
Phase 2에서 테이블명 변경 시 PostgreSQL 시퀀스도 함께 업데이트:
```sql
ALTER SEQUENCE sr_attendance_id_seq RENAME TO sgb_attendance_id_seq;
```

---

## 📚 참고 자료

- **Git 커밋**:
  - Phase 1: `cb3c6c9` (2026-01-18 14:38)
  - Phase 2: `48a96ac` (2026-01-18 19:18)

- **백업**:
  - Phase 2 이전: `backup_before_phase2_20260118_191639.backup`

- **매핑 파일**:
  - Phase 2: `table-rename-mapping-phase2.json`
