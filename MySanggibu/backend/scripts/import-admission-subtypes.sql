-- 특별전형 카테고리 및 서브타입 데이터 임포트
-- 실행: psql -U tsuser -d geobukschool_dev -f scripts/import-admission-subtypes.sql

-- 1. 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS ss_admission_subtype_category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_order INT DEFAULT 0
);

-- 2. 서브타입 테이블에 category_id 컬럼 추가 (없으면)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ss_admission_subtype' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE ss_admission_subtype ADD COLUMN category_id INT REFERENCES ss_admission_subtype_category(id);
  END IF;
END $$;

-- 3. 카테고리 데이터 삽입
INSERT INTO ss_admission_subtype_category (id, name, display_order) VALUES
  (1, '지역인재', 1),
  (2, '특혜지역', 2),
  (3, '사회적 배려/저소득', 3),
  (4, '특수 교육/학교 배경', 4),
  (5, '보훈/공로', 5),
  (6, '직업/공무원/특정 역할', 6),
  (7, '특기/자격/실적', 7),
  (8, '기타', 8)
ON CONFLICT (name) DO UPDATE SET display_order = EXCLUDED.display_order;

-- 시퀀스 재설정
SELECT setval('ss_admission_subtype_category_id_seq', 8, true);

-- 4. 서브타입 데이터 삽입 및 카테고리 매핑
-- Excel 데이터 기반

-- 지역인재 (categoryId: 1)
INSERT INTO ss_admission_subtype (id, name, category_id) VALUES
  (11, '지역인재-강원', 1),
  (12, '지역인재-대경', 1),
  (13, '지역인재-부울경', 1),
  (14, '지역인재-제주', 1),
  (15, '지역인재-충청', 1),
  (16, '지역인재-호남', 1)
ON CONFLICT (name) DO UPDATE SET category_id = EXCLUDED.category_id;

-- 특혜지역 (categoryId: 2)
INSERT INTO ss_admission_subtype (id, name, category_id) VALUES
  (21, '농어촌', 2),
  (34, '도서벽지근무', 2),
  (39, '북한', 2),
  (41, '서해5도', 2)
ON CONFLICT (name) DO UPDATE SET category_id = EXCLUDED.category_id;

-- 사회적 배려/저소득 (categoryId: 3)
INSERT INTO ss_admission_subtype (id, name, category_id) VALUES
  (22, '저소득', 3),
  (29, '다문화', 3),
  (30, '다자녀', 3),
  (44, '소년소녀가장', 3),
  (46, '위탁,아동복지,입양', 3),
  (51, '조손,장애부모', 3)
ON CONFLICT (name) DO UPDATE SET category_id = EXCLUDED.category_id;

-- 특수 교육/학교 배경 (categoryId: 4)
INSERT INTO ss_admission_subtype (id, name, category_id) VALUES
  (23, '특성화고졸', 4),
  (24, '특성화고졸재직', 4),
  (26, '특수교육', 4),
  (32, '농생명고', 4),
  (33, '대안학교졸(예정)자', 4),
  (55, '해외고', 4)
ON CONFLICT (name) DO UPDATE SET category_id = EXCLUDED.category_id;

-- 보훈/공로 (categoryId: 5)
INSERT INTO ss_admission_subtype (id, name, category_id) VALUES
  (25, '보훈,유공', 5),
  (36, '민주화', 5),
  (38, '봉사', 5),
  (40, '사회봉사자', 5),
  (43, '선효행', 5)
ON CONFLICT (name) DO UPDATE SET category_id = EXCLUDED.category_id;

-- 직업/공무원/특정 역할 (categoryId: 6)
INSERT INTO ss_admission_subtype (id, name, category_id) VALUES
  (27, '군인,경찰', 6),
  (28, '집배원,소방관,미화원,교도관', 6),
  (31, '교직원', 6),
  (42, '선교,목회', 6),
  (47, '임관', 6),
  (48, '임원', 6),
  (52, '종교', 6),
  (54, '해녀', 6),
  (56, '선원[자녀]', 6)
ON CONFLICT (name) DO UPDATE SET category_id = EXCLUDED.category_id;

-- 특기/자격/실적 (categoryId: 7)
INSERT INTO ss_admission_subtype (id, name, category_id) VALUES
  (20, '특기자', 7),
  (45, '어학', 7),
  (49, '입상', 7),
  (50, '자격증', 7),
  (53, '창업', 7)
ON CONFLICT (name) DO UPDATE SET category_id = EXCLUDED.category_id;

-- 기타 (categoryId: 8)
INSERT INTO ss_admission_subtype (id, name, category_id) VALUES
  (35, '만학도', 8),
  (37, '병결', 8)
ON CONFLICT (name) DO UPDATE SET category_id = EXCLUDED.category_id;

-- 5. 기존 데이터 중 카테고리가 없는 것들 업데이트
UPDATE ss_admission_subtype SET category_id =
  CASE
    WHEN name LIKE '지역인재%' THEN 1
    WHEN name IN ('농어촌', '도서벽지근무', '북한', '서해5도') THEN 2
    WHEN name IN ('저소득', '다문화', '다자녀', '소년소녀가장', '위탁,아동복지,입양', '조손,장애부모') THEN 3
    WHEN name IN ('특성화고졸', '특성화고졸재직', '특수교육', '농생명고', '대안학교졸(예정)자', '해외고') THEN 4
    WHEN name IN ('보훈,유공', '민주화', '봉사', '사회봉사자', '선효행') THEN 5
    WHEN name IN ('군인,경찰', '집배원,소방관,미화원,교도관', '교직원', '선교,목회', '임관', '임원', '종교', '해녀', '선원[자녀]') THEN 6
    WHEN name IN ('특기자', '어학', '입상', '자격증', '창업') THEN 7
    ELSE 8
  END
WHERE category_id IS NULL;

-- 확인
SELECT c.name as category, array_agg(s.name ORDER BY s.id) as subtypes
FROM ss_admission_subtype_category c
LEFT JOIN ss_admission_subtype s ON s.category_id = c.id
GROUP BY c.id, c.name, c.display_order
ORDER BY c.display_order;
