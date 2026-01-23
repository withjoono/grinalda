import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

/**
 * Hub 앱 구독 시스템 테이블 생성 마이그레이션
 * - hub_apps: 앱 정의
 * - app_subscriptions: 사용자별 앱 구독 정보
 */
export class AddHubAppsTables1768349500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // hub_apps 테이블 생성
    await queryRunner.createTable(
      new Table({
        name: 'hub_apps',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '50',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'icon_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'app_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'pricing',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'features',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'sort_order',
            type: 'int',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // app_subscriptions 테이블 생성
    await queryRunner.createTable(
      new Table({
        name: 'app_subscriptions',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'member_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'app_id',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'subscription_level',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // app_subscriptions 인덱스 생성
    await queryRunner.createIndex(
      'app_subscriptions',
      new TableIndex({
        name: 'IDX_APP_SUBSCRIPTIONS_MEMBER_ID',
        columnNames: ['member_id'],
      }),
    );

    await queryRunner.createIndex(
      'app_subscriptions',
      new TableIndex({
        name: 'IDX_APP_SUBSCRIPTIONS_APP_ID',
        columnNames: ['app_id'],
      }),
    );

    await queryRunner.createIndex(
      'app_subscriptions',
      new TableIndex({
        name: 'IDX_APP_SUBSCRIPTIONS_ACTIVE',
        columnNames: ['is_active', 'member_id', 'app_id'],
      }),
    );

    // app_subscriptions 외래 키 생성
    await queryRunner.createForeignKey(
      'app_subscriptions',
      new TableForeignKey({
        columnNames: ['member_id'],
        referencedTableName: 'member_tb',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'app_subscriptions',
      new TableForeignKey({
        columnNames: ['app_id'],
        referencedTableName: 'hub_apps',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    console.log('✅ Hub Apps 테이블이 생성되었습니다.');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 외래 키 먼저 삭제
    const subscriptionsTable = await queryRunner.getTable('app_subscriptions');
    if (subscriptionsTable) {
      const foreignKeys = subscriptionsTable.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('app_subscriptions', foreignKey);
      }
    }

    // 테이블 삭제 (역순)
    await queryRunner.dropTable('app_subscriptions', true);
    await queryRunner.dropTable('hub_apps', true);

    console.log('❌ Hub Apps 테이블이 삭제되었습니다.');
  }
}
