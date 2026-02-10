-- 지역인재 (카테고리 ID: 1)
UPDATE ss_admission_subtype SET category_id = 1 WHERE id IN (11, 12, 13, 14, 15, 16);

-- 특혜지역 (카테고리 ID: 2)
UPDATE ss_admission_subtype SET category_id = 2 WHERE id IN (34, 39, 41);

-- 사회적 배려/저소득 (카테고리 ID: 3)
UPDATE ss_admission_subtype SET category_id = 3 WHERE id IN (21, 22, 29, 30, 44, 46, 51);

-- 특수 교육/학교 배경 (카테고리 ID: 4)
UPDATE ss_admission_subtype SET category_id = 4 WHERE id IN (23, 24, 26, 32, 33, 55);

-- 보훈/공로 (카테고리 ID: 5)
UPDATE ss_admission_subtype SET category_id = 5 WHERE id IN (25, 36, 38, 40, 43);

-- 직업/공무원/특정 역할 (카테고리 ID: 6)
UPDATE ss_admission_subtype SET category_id = 6 WHERE id IN (27, 28, 31, 42, 47, 48, 52, 54, 56);

-- 특기/자격/실적 (카테고리 ID: 7)
UPDATE ss_admission_subtype SET category_id = 7 WHERE id IN (20, 45, 49, 50, 53);

-- 기타 (카테고리 ID: 8)
UPDATE ss_admission_subtype SET category_id = 8 WHERE id IN (35, 37);
