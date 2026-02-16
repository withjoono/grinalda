
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '..', '.env.production') });

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const dataSource = new DataSource({
    type: 'postgres',
    ...dbConfig,
    entities: [],
    synchronize: false,
    logging: true,
});

async function main() {
    await dataSource.initialize();
    console.log('Connected to Production DB');

    const migrationsToSync = [
        { timestamp: 1769513366700, name: 'AddFirebaseUidToMember1769513366700' },
        { timestamp: 1770103061558, name: 'FixFirebaseUidSchema1770103061558' },
        { timestamp: 1770116083157, name: 'RestoreFirebaseUid1770116083157' }
    ];

    for (const m of migrationsToSync) {
        const existing = await dataSource.query(
            `SELECT id FROM typeorm_migrations WHERE timestamp = $1`,
            [m.timestamp.toString()] // timestamp column is often bigint or varchar
        );

        if (existing.length === 0) {
            console.log(`Syncing migration: ${m.name}`);
            await dataSource.query(
                `INSERT INTO typeorm_migrations ("timestamp", "name") VALUES ($1, $2)`,
                [m.timestamp.toString(), m.name]
            );
        } else {
            console.log(`Migration already synced: ${m.name}`);
        }
    }

    console.log('Migration sync complete.');
    await dataSource.destroy();
}

main().catch(console.error);
