import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOAuthClients1768349255200 implements MigrationInterface {
  name = 'SeedOAuthClients1768349255200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Susi OAuth 클라이언트
    await queryRunner.query(`
      INSERT INTO "oauth_clients" ("clientId", "clientSecret", "clientName", "redirectUris", "allowedScopes", "isActive")
      VALUES (
        'susi-app',
        'susi-secret-change-in-production',
        'Susi Application',
        ARRAY['http://localhost:4001/auth/oauth/callback', 'http://localhost:3001/auth/oauth/callback'],
        ARRAY['openid', 'profile', 'email'],
        true
      )
      ON CONFLICT ("clientId") DO UPDATE SET
        "clientSecret" = EXCLUDED."clientSecret",
        "clientName" = EXCLUDED."clientName",
        "redirectUris" = EXCLUDED."redirectUris",
        "allowedScopes" = EXCLUDED."allowedScopes",
        "isActive" = EXCLUDED."isActive"
    `);

    // Jungsi OAuth 클라이언트
    await queryRunner.query(`
      INSERT INTO "oauth_clients" ("clientId", "clientSecret", "clientName", "redirectUris", "allowedScopes", "isActive")
      VALUES (
        'jungsi-app',
        'jungsi-secret-change-in-production',
        'Jungsi Application',
        ARRAY['http://localhost:4002/auth/oauth/callback', 'http://localhost:3002/auth/oauth/callback'],
        ARRAY['openid', 'profile', 'email'],
        true
      )
      ON CONFLICT ("clientId") DO UPDATE SET
        "clientSecret" = EXCLUDED."clientSecret",
        "clientName" = EXCLUDED."clientName",
        "redirectUris" = EXCLUDED."redirectUris",
        "allowedScopes" = EXCLUDED."allowedScopes",
        "isActive" = EXCLUDED."isActive"
    `);

    // ExamHub OAuth 클라이언트
    await queryRunner.query(`
      INSERT INTO "oauth_clients" ("clientId", "clientSecret", "clientName", "redirectUris", "allowedScopes", "isActive")
      VALUES (
        'examhub-app',
        'examhub-secret-change-in-production',
        'ExamHub Application',
        ARRAY['http://localhost:4003/auth/oauth/callback', 'http://localhost:3003/auth/oauth/callback'],
        ARRAY['openid', 'profile', 'email'],
        true
      )
      ON CONFLICT ("clientId") DO UPDATE SET
        "clientSecret" = EXCLUDED."clientSecret",
        "clientName" = EXCLUDED."clientName",
        "redirectUris" = EXCLUDED."redirectUris",
        "allowedScopes" = EXCLUDED."allowedScopes",
        "isActive" = EXCLUDED."isActive"
    `);

    // StudyPlanner OAuth 클라이언트
    await queryRunner.query(`
      INSERT INTO "oauth_clients" ("clientId", "clientSecret", "clientName", "redirectUris", "allowedScopes", "isActive")
      VALUES (
        'studyplanner-app',
        'studyplanner-secret-change-in-production',
        'StudyPlanner Application',
        ARRAY['http://localhost:4004/auth/oauth/callback', 'http://localhost:3004/auth/oauth/callback'],
        ARRAY['openid', 'profile', 'email'],
        true
      )
      ON CONFLICT ("clientId") DO UPDATE SET
        "clientSecret" = EXCLUDED."clientSecret",
        "clientName" = EXCLUDED."clientName",
        "redirectUris" = EXCLUDED."redirectUris",
        "allowedScopes" = EXCLUDED."allowedScopes",
        "isActive" = EXCLUDED."isActive"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "oauth_clients" WHERE "clientId" IN ('susi-app', 'jungsi-app', 'examhub-app', 'studyplanner-app')`);
  }
}
