
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
    console.log('Connected to Production DB');

    // Check Triggers on auth_member
    const triggers = await dataSource.query(`
    SELECT trigger_name, event_manipulation, action_statement
    FROM information_schema.triggers
    WHERE event_object_table = 'auth_member'
  `);
    console.log('Triggers on auth_member:', triggers);

    // Check Foreign Keys referencing auth_member where column type is bigint
    // This is complex, but let's check basic constraints
    const foreignKeys = await dataSource.query(`
    SELECT 
        tc.table_name, kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        c.data_type AS column_type
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu 
      ON tc.constraint_name = kcu.constraint_name 
    JOIN information_schema.constraint_column_usage AS ccu 
      ON ccu.constraint_name = tc.constraint_name 
    JOIN information_schema.columns AS c
      ON c.table_name = tc.table_name AND c.column_name = kcu.column_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND ccu.table_name = 'auth_member'
  `);

    // Filter for bigint columns referencing auth_member
    const bigintRefs = foreignKeys.filter((fk: any) => fk.column_type === 'bigint');
    console.log('Foreign Keys referencing auth_member with bigint type:', bigintRefs);

    await dataSource.destroy();
}

main().catch(console.error);
