import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPaymentContractMemberId1771140000000 implements MigrationInterface {
    name = 'FixPaymentContractMemberId1771140000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Change member_id in payment_contract to varchar(30)
        // This table was missed in the previous migration (FixMemberIdType)

        const tableName = 'payment_contract';
        const columnName = 'member_id';

        if (await queryRunner.hasTable(tableName)) {
            // Check if column exists
            const table = await queryRunner.getTable(tableName);
            const column = table?.findColumnByName(columnName);

            if (column) {
                // Drop any existing FKs on this column just in case
                const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf(columnName) !== -1);
                if (foreignKey) {
                    await queryRunner.dropForeignKey(tableName, foreignKey);
                }

                // Alter column type
                await queryRunner.query(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" TYPE varchar(30)`);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Cannot revert safely without data loss risk
    }
}
