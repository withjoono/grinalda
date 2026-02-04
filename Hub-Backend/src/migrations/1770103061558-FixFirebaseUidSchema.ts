import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFirebaseUidSchema1770103061558 implements MigrationInterface {
    name = 'FixFirebaseUidSchema1770103061558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_member" ADD "firebase_uid" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "auth_member" ALTER COLUMN "ck_sms" SET DEFAULT b'0'`);
        await queryRunner.query(`ALTER TABLE "auth_member" ALTER COLUMN "ck_sms_agree" SET DEFAULT b'0'`);
        await queryRunner.query(`CREATE INDEX "idx_member_firebase_uid" ON "auth_member" ("firebase_uid") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_member_firebase_uid"`);
        await queryRunner.query(`ALTER TABLE "auth_member" ALTER COLUMN "ck_sms_agree" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "auth_member" ALTER COLUMN "ck_sms" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "auth_member" DROP COLUMN "firebase_uid"`);
    }

}
