
import { DataSource } from 'typeorm';
import * as XLSX from 'xlsx';
import * as path from 'path';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
config({ path: join(__dirname, '..', envFile) });

// Parse Database URL if available
let dbConfig: any = {};
if (process.env.DATABASE_URL) {
    const parsed = new URL(process.env.DATABASE_URL);
    dbConfig = {
        host: parsed.hostname,
        port: parseInt(parsed.port || '5432', 10),
        username: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname.slice(1),
    };
} else {
    dbConfig = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };
}

const dataSource = new DataSource({
    type: 'postgres',
    ...dbConfig,
    entities: [],
    synchronize: false,
    logging: false,
});

async function main() {
    await dataSource.initialize();
    console.log('Database connected');

    const filePath = path.join(__dirname, '../uploads/2015n2022_kyokwa_subject.xlsx');
    console.log(`Reading Excel file: ${filePath}`);
    const workbook = XLSX.readFile(filePath);

    // --- Process 2022 Sheet ---
    console.log('Processing 2022 Sheet...');
    const sheet2022 = workbook.Sheets['2022'];
    // Get data as array of arrays, header: 1
    const data2022 = XLSX.utils.sheet_to_json(sheet2022, { header: 1 }) as any[][];

    // First row is header, skip it
    const rows2022 = data2022.slice(1);

    // Create table hub_2022_kyokwa_subject
    await dataSource.query(`
    CREATE TABLE IF NOT EXISTS hub_2022_kyokwa_subject (
      id varchar(20) PRIMARY KEY,
      kyokwa varchar(50),
      kyokwa_code varchar(10),
      classification varchar(50),
      classification_code integer,
      subject_name varchar(100),
      subject_code integer,
      evaluation_method varchar(50)
    );
  `);
    // Truncate to avoid duplicates on re-run
    await dataSource.query(`TRUNCATE TABLE hub_2022_kyokwa_subject`);

    let count2022 = 0;
    for (const row of rows2022) {
        // Check if row is empty or doesn't have ID
        if (!row[0]) continue;

        await dataSource.query(`
      INSERT INTO hub_2022_kyokwa_subject (
        id, kyokwa, kyokwa_code, classification, classification_code, subject_name, subject_code, evaluation_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
            row[0], // ID
            row[1], // 교과
            String(row[2]), // 교과코드 (ensure string)
            row[3], // 과목분류
            parseInt(String(row[4] || 0), 10), // 과목분류코드
            row[5], // 과목
            parseInt(String(row[6] || 0), 10), // 과목코드
            row[7]  // 성취평가,성적
        ]);
        count2022++;
    }
    console.log(`Inserted ${count2022} rows into hub_2022_kyokwa_subject`);


    // --- Process 2015 Sheet ---
    console.log('Processing 2015 Sheet...');
    const sheet2015 = workbook.Sheets['2015'];
    const data2015 = XLSX.utils.sheet_to_json(sheet2015, { header: 1 }) as any[][];
    const rows2015 = data2015.slice(1);

    // Create table hub_2015_kyokwa_subject
    await dataSource.query(`
    CREATE TABLE IF NOT EXISTS hub_2015_kyokwa_subject (
      id varchar(20) PRIMARY KEY,
      kyokwa varchar(50),
      kyokwa_code varchar(10),
      classification varchar(50),
      classification_code integer,
      subject_name varchar(100),
      subject_code integer,
      evaluation_method varchar(50)
    );
  `);
    // Truncate
    await dataSource.query(`TRUNCATE TABLE hub_2015_kyokwa_subject`);

    let count2015 = 0;
    for (const row of rows2015) {
        if (!row[0]) continue;

        await dataSource.query(`
      INSERT INTO hub_2015_kyokwa_subject (
        id, kyokwa, kyokwa_code, classification, classification_code, subject_name, subject_code, evaluation_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
            row[0],
            row[1],
            String(row[2]),
            row[3],
            parseInt(String(row[4] || 0), 10),
            row[5],
            parseInt(String(row[6] || 0), 10),
            row[7]
        ]);
        count2015++;
    }
    console.log(`Inserted ${count2015} rows into hub_2015_kyokwa_subject`);

    await dataSource.destroy();
}

main().catch(error => {
    console.error('Fatal Error:', error);
    process.exit(1);
});
