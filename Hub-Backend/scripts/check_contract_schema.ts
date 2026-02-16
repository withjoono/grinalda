
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

    // Check payment_contract schema 
    const schema = await dataSource.query(`
    SELECT column_name, data_type, character_maximum_length 
    FROM information_schema.columns 
    WHERE table_name = 'payment_contract' AND column_name = 'member_id'
  `);
    console.log('payment_contract.member_id schema:', schema);

    await dataSource.destroy();
}

main().catch(console.error);
