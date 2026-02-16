
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

    const tables = [
        'ss_auth_member', // Susi
        'js_auth_member', // Jungsi
        'pl_auth_member', // Planner
        'eh_auth_member', // ExamHub
        'tb_auth_member', // TutorBoard
        'sa_auth_member', // StudyArena
        'pa_auth_member', // ParentAdmin
        'ta_auth_member', // TeacherAdmin
        'ms_auth_member'  // MySanggibu
    ];

    for (const table of tables) {
        const pkCol = `${table.split('_')[0]}_auth_id`; // e.g., ss_auth_id

        // Check if table exists first
        const tableExists = await dataSource.query(`
      SELECT to_regclass('public.${table}') as exists
    `);

        if (!tableExists[0].exists) {
            console.log(`Table ${table} does NOT exist.`);
            continue;
        }

        // Get column info
        const schema = await dataSource.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = '${table}'
    `);
        console.log(`\n--- Schema for ${table} ---`);
        console.table(schema);

        const idColumn = schema.find((c: any) => c.column_name === pkCol);
        if (idColumn) {
            console.log(`ID Column (${pkCol}) Type: ${idColumn.data_type}`);
        } else {
            console.log(`ID Column (${pkCol}) NOT FOUND!`);
        }
    }

    await dataSource.destroy();
}

main().catch(console.error);
