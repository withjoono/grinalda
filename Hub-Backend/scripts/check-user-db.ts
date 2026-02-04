
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.development
dotenv.config({ path: path.resolve(__dirname, '../.env.development') });

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [path.resolve(__dirname, '../src/database/entities/**/*.entity.ts')],
});

async function checkUser() {
    try {
        await dataSource.initialize();
        console.log('Data Source has been initialized!');

        const email = 'withjuno6@naver.com';
        const query = `SELECT * FROM auth_member WHERE email = '${email}'`;
        const result = await dataSource.query(query);

        console.log(`User found:`, result.length);
        if (result.length > 0) {
            console.log('User Details:', JSON.stringify(result[0], null, 2));
        }

    } catch (err) {
        console.error('Error during Data Source initialization', err);
    } finally {
        await dataSource.destroy();
    }
}

checkUser();
