
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
    logging: false,
});

async function main() {
    await dataSource.initialize();
    console.log(`Connected to Production DB: ${dbConfig.database}`);

    const tables = await dataSource.query(`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

    console.log('--- Tables in Public Schema ---');
    console.table(tables);

    await dataSource.destroy();
}

main().catch(console.error);
