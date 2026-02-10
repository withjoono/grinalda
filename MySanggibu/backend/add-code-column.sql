-- AdmissionSubtypeEntity에 code 컬럼 추가
-- 이미 존재하면 무시
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ss_admission_subtype'
        AND column_name = 'code'
    ) THEN
        ALTER TABLE ss_admission_subtype
        ADD COLUMN code VARCHAR(10) NULL;

        COMMENT ON COLUMN ss_admission_subtype.code IS '전형 코드 (Excel 파일의 특별전형 코드)';

        RAISE NOTICE 'Column "code" added successfully';
    ELSE
        RAISE NOTICE 'Column "code" already exists';
    END IF;
END $$;

-- category_id 컬럼도 추가 (엔티티에 정의되어 있음)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ss_admission_subtype'
        AND column_name = 'category_id'
    ) THEN
        ALTER TABLE ss_admission_subtype
        ADD COLUMN category_id INTEGER NULL;

        COMMENT ON COLUMN ss_admission_subtype.category_id IS '카테고리 ID';

        -- Foreign key 추가
        ALTER TABLE ss_admission_subtype
        ADD CONSTRAINT fk_admission_subtype_category
        FOREIGN KEY (category_id)
        REFERENCES ss_admission_subtype_category(id);

        RAISE NOTICE 'Column "category_id" added successfully';
    ELSE
        RAISE NOTICE 'Column "category_id" already exists';
    END IF;
END $$;
