-- 계열 마스터 데이터 시드
-- 대계열 (ss_major_field)
INSERT INTO ss_major_field (name) VALUES
('인문계열'),
('사회계열'),
('교육계열'),
('공학계열'),
('자연계열'),
('의약계열'),
('예체능계열')
ON CONFLICT (name) DO NOTHING;

-- 중계열 (ss_mid_field)
-- 의약계열 하위
INSERT INTO ss_mid_field (name, major_field_id) VALUES
('의학', (SELECT id FROM ss_major_field WHERE name = '의약계열')),
('치의학', (SELECT id FROM ss_major_field WHERE name = '의약계열')),
('한의학', (SELECT id FROM ss_major_field WHERE name = '의약계열')),
('약학', (SELECT id FROM ss_major_field WHERE name = '의약계열')),
('수의학', (SELECT id FROM ss_major_field WHERE name = '의약계열')),
('간호학', (SELECT id FROM ss_major_field WHERE name = '의약계열'))
ON CONFLICT DO NOTHING;

-- 공학계열 하위
INSERT INTO ss_mid_field (name, major_field_id) VALUES
('전기전자공학', (SELECT id FROM ss_major_field WHERE name = '공학계열')),
('컴퓨터공학', (SELECT id FROM ss_major_field WHERE name = '공학계열')),
('기계공학', (SELECT id FROM ss_major_field WHERE name = '공학계열')),
('화학공학', (SELECT id FROM ss_major_field WHERE name = '공학계열')),
('건축공학', (SELECT id FROM ss_major_field WHERE name = '공학계열')),
('산업공학', (SELECT id FROM ss_major_field WHERE name = '공학계열'))
ON CONFLICT DO NOTHING;

-- 자연계열 하위
INSERT INTO ss_mid_field (name, major_field_id) VALUES
('수학', (SELECT id FROM ss_major_field WHERE name = '자연계열')),
('물리학', (SELECT id FROM ss_major_field WHERE name = '자연계열')),
('화학', (SELECT id FROM ss_major_field WHERE name = '자연계열')),
('생명과학', (SELECT id FROM ss_major_field WHERE name = '자연계열')),
('지구과학', (SELECT id FROM ss_major_field WHERE name = '자연계열'))
ON CONFLICT DO NOTHING;

-- 인문계열 하위
INSERT INTO ss_mid_field (name, major_field_id) VALUES
('국어국문학', (SELECT id FROM ss_major_field WHERE name = '인문계열')),
('영어영문학', (SELECT id FROM ss_major_field WHERE name = '인문계열')),
('사학', (SELECT id FROM ss_major_field WHERE name = '인문계열')),
('철학', (SELECT id FROM ss_major_field WHERE name = '인문계열'))
ON CONFLICT DO NOTHING;

-- 사회계열 하위
INSERT INTO ss_mid_field (name, major_field_id) VALUES
('경영학', (SELECT id FROM ss_major_field WHERE name = '사회계열')),
('경제학', (SELECT id FROM ss_major_field WHERE name = '사회계열')),
('법학', (SELECT id FROM ss_major_field WHERE name = '사회계열')),
('행정학', (SELECT id FROM ss_major_field WHERE name = '사회계열')),
('사회학', (SELECT id FROM ss_major_field WHERE name = '사회계열'))
ON CONFLICT DO NOTHING;

-- 교육계열 하위
INSERT INTO ss_mid_field (name, major_field_id) VALUES
('교육학', (SELECT id FROM ss_major_field WHERE name = '교육계열')),
('유아교육', (SELECT id FROM ss_major_field WHERE name = '교육계열')),
('특수교육', (SELECT id FROM ss_major_field WHERE name = '교육계열'))
ON CONFLICT DO NOTHING;

-- 예체능계열 하위
INSERT INTO ss_mid_field (name, major_field_id) VALUES
('미술', (SELECT id FROM ss_major_field WHERE name = '예체능계열')),
('음악', (SELECT id FROM ss_major_field WHERE name = '예체능계열')),
('체육', (SELECT id FROM ss_major_field WHERE name = '예체능계열')),
('디자인', (SELECT id FROM ss_major_field WHERE name = '예체능계열'))
ON CONFLICT DO NOTHING;

-- 소계열 (ss_minor_field) - 주요 예시만 추가
-- 약학 하위
INSERT INTO ss_minor_field (name, mid_field_id) VALUES
('약학', (SELECT id FROM ss_mid_field WHERE name = '약학')),
('제약학', (SELECT id FROM ss_mid_field WHERE name = '약학'))
ON CONFLICT DO NOTHING;

-- 의학 하위
INSERT INTO ss_minor_field (name, mid_field_id) VALUES
('의학', (SELECT id FROM ss_mid_field WHERE name = '의학')),
('의예과', (SELECT id FROM ss_mid_field WHERE name = '의학'))
ON CONFLICT DO NOTHING;

-- 컴퓨터공학 하위
INSERT INTO ss_minor_field (name, mid_field_id) VALUES
('컴퓨터공학', (SELECT id FROM ss_mid_field WHERE name = '컴퓨터공학')),
('소프트웨어', (SELECT id FROM ss_mid_field WHERE name = '컴퓨터공학')),
('인공지능', (SELECT id FROM ss_mid_field WHERE name = '컴퓨터공학'))
ON CONFLICT DO NOTHING;

-- 경영학 하위
INSERT INTO ss_minor_field (name, mid_field_id) VALUES
('경영학', (SELECT id FROM ss_mid_field WHERE name = '경영학')),
('회계학', (SELECT id FROM ss_mid_field WHERE name = '경영학')),
('마케팅', (SELECT id FROM ss_minor_field WHERE name = '경영학'))
ON CONFLICT DO NOTHING;
