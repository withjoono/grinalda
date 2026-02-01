import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOAuthTables1768349255190 implements MigrationInterface {
  name = 'AddOAuthTables1768349255190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oauth_clients" ("id" SERIAL NOT NULL, "clientId" character varying(255) NOT NULL, "clientSecret" character varying(255), "clientName" character varying(255) NOT NULL, "redirectUris" text array NOT NULL, "allowedScopes" character varying(255) array NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b0c094fe1ef0a6c4af8f2b10be7" UNIQUE ("clientId"), CONSTRAINT "PK_c4759172d3431bae6f04e678e0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "oauth_authorization_codes" ("id" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "clientId" character varying(255) NOT NULL, "memberId" bigint NOT NULL, "redirectUri" text NOT NULL, "scope" character varying(255) array NOT NULL, "codeChallenge" character varying(255), "codeChallengeMethod" character varying(10), "expiresAt" TIMESTAMP NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fb91ab932cfbd694061501cc20f" UNIQUE ("code"), CONSTRAINT "PK_441350d3fce3606534fbb2c1197" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb91ab932cfbd694061501cc20" ON "oauth_authorization_codes" ("code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_760f15e47e8123be2c67eb8ac5" ON "oauth_authorization_codes" ("expiresAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "mentoring_invite_tb" ("id" SERIAL NOT NULL, "teacher_id" bigint NOT NULL, "invite_code" character varying(32) NOT NULL, "class_id" character varying(100), "class_name" character varying(100), "invite_type" character varying(20) NOT NULL DEFAULT 'student', "use_count" integer NOT NULL DEFAULT '0', "max_use_count" integer NOT NULL DEFAULT '100', "is_active" boolean NOT NULL DEFAULT true, "expire_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_22772dcddd707b19c7de994652c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_80cb5f7e2ae06aada8c52f06e4" ON "mentoring_invite_tb" ("teacher_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bd98d837af95941091b26a262b" ON "mentoring_invite_tb" ("invite_code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_53633640066bfdd28a3c8d6171" ON "mentoring_invite_tb" ("expire_at") `,
    );
    await queryRunner.query(`ALTER TABLE "auth_member" ALTER COLUMN "ck_sms" SET DEFAULT b'0'`);
    await queryRunner.query(`ALTER TABLE "auth_member" ALTER COLUMN "ck_sms_agree" SET DEFAULT b'0'`);
    await queryRunner.query(
      `ALTER TABLE "oauth_authorization_codes" ADD CONSTRAINT "FK_64d965bd072ea24fb6da55468cd" FOREIGN KEY ("clientId") REFERENCES "oauth_clients"("clientId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oauth_authorization_codes" ADD CONSTRAINT "FK_bb52972ac16d079e6a01bd8a0d9" FOREIGN KEY ("memberId") REFERENCES "auth_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mentoring_invite_tb" ADD CONSTRAINT "FK_80cb5f7e2ae06aada8c52f06e41" FOREIGN KEY ("teacher_id") REFERENCES "auth_member"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mentoring_invite_tb" DROP CONSTRAINT "FK_80cb5f7e2ae06aada8c52f06e41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oauth_authorization_codes" DROP CONSTRAINT "FK_bb52972ac16d079e6a01bd8a0d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oauth_authorization_codes" DROP CONSTRAINT "FK_64d965bd072ea24fb6da55468cd"`,
    );
    await queryRunner.query(`ALTER TABLE "auth_member" ALTER COLUMN "ck_sms_agree" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "auth_member" ALTER COLUMN "ck_sms" SET DEFAULT '0'`);
    await queryRunner.query(`DROP INDEX "public"."IDX_53633640066bfdd28a3c8d6171"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bd98d837af95941091b26a262b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_80cb5f7e2ae06aada8c52f06e4"`);
    await queryRunner.query(`DROP TABLE "mentoring_invite_tb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_760f15e47e8123be2c67eb8ac5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fb91ab932cfbd694061501cc20"`);
    await queryRunner.query(`DROP TABLE "oauth_authorization_codes"`);
    await queryRunner.query(`DROP TABLE "oauth_clients"`);
  }
}
