import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMentoringInviteColumns1770400000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // return_url 컬럼 추가 (초대 수락 후 이동할 URL)
        await queryRunner.query(
            `ALTER TABLE "mentoring_temp_code_tb" ADD COLUMN IF NOT EXISTS "return_url" VARCHAR(1000) NULL`,
        );

        // status 컬럼 추가 (pending/accepted/expired)
        await queryRunner.query(
            `ALTER TABLE "mentoring_temp_code_tb" ADD COLUMN IF NOT EXISTS "status" VARCHAR(20) DEFAULT 'pending'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "mentoring_temp_code_tb" DROP COLUMN IF EXISTS "status"`,
        );
        await queryRunner.query(
            `ALTER TABLE "mentoring_temp_code_tb" DROP COLUMN IF EXISTS "return_url"`,
        );
    }
}
