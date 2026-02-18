/**
 * Comprehensive fix: Check ALL columns for ALL tables in the combinations query
 * join chain and add any that are missing from the DB.
 * 
 * Tables in chain:
 * - ss_user_application_combination (id, name, member_id, created_at, updated_at)
 * - ss_recruitment_unit (id, admission_id, general_field_id, minor_field_id, name, recruitment_number, code)
 * - ss_admission (id, name, year, basic_type, university_id, category_id)
 * - ss_university (id, region, name, code, establishment_type)
 * - ss_admission_category (id, name)
 * - ss_general_field (id, name)
 * - ss_recruitment_unit_interview (id, recruitment_unit_id, is_reflected, interview_type, materials_used, interview_process, evaluation_content, interview_date, interview_time)
 */
const { Client } = require('pg');

const EXPECTED_COLUMNS = {
    'ss_university': [
        { name: 'establishment_type', sql: `ADD COLUMN establishment_type varchar(20) DEFAULT ''` },
    ],
    'ss_admission': [
        // basic_type was already added in previous fix, but check anyway
        { name: 'basic_type', sql: `ADD COLUMN basic_type varchar(10) DEFAULT '일반'` },
    ],
    'ss_recruitment_unit': [
        { name: 'code', sql: `ADD COLUMN code varchar(20)` },
    ],
    'ss_recruitment_unit_interview': [
        { name: 'is_reflected', sql: `ADD COLUMN is_reflected boolean DEFAULT false` },
        { name: 'interview_type', sql: `ADD COLUMN interview_type varchar(100)` },
        { name: 'materials_used', sql: `ADD COLUMN materials_used varchar(255)` },
        { name: 'interview_process', sql: `ADD COLUMN interview_process varchar(255)` },
        { name: 'evaluation_content', sql: `ADD COLUMN evaluation_content text` },
        { name: 'interview_date', sql: `ADD COLUMN interview_date varchar(100)` },
        { name: 'interview_time', sql: `ADD COLUMN interview_time varchar(100)` },
    ],
};

async function main() {
    const client = new Client({
        host: '34.64.165.158',
        port: 5432,
        user: 'tsuser',
        password: 'tsuser1234',
        database: 'geobukschool_prod',
        ssl: false,
    });

    await client.connect();
    console.log('✅ Connected to geobukschool_prod');
    await client.query("SET search_path TO mysanggibu,hub,susi,jungsi,public");

    let fixCount = 0;

    for (const [tableName, columns] of Object.entries(EXPECTED_COLUMNS)) {
        console.log(`\n--- Checking ${tableName} ---`);

        // Get table schema
        const tableInfo = await client.query(
            `SELECT table_schema FROM information_schema.tables WHERE table_name = $1`,
            [tableName]
        );

        if (tableInfo.rows.length === 0) {
            console.log(`  ⚠️ Table ${tableName} not found!`);
            continue;
        }
        const schema = tableInfo.rows[0].table_schema;
        console.log(`  Schema: ${schema}`);

        // Get existing columns
        const existingCols = await client.query(
            `SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2`,
            [schema, tableName]
        );
        const existingColNames = new Set(existingCols.rows.map(r => r.column_name));
        console.log(`  Existing columns: ${[...existingColNames].join(', ')}`);

        for (const col of columns) {
            if (!existingColNames.has(col.name)) {
                console.log(`  🔧 Adding missing column: ${col.name}`);
                try {
                    await client.query(`ALTER TABLE "${schema}"."${tableName}" ${col.sql}`);
                    console.log(`  ✅ Added ${col.name}`);
                    fixCount++;
                } catch (err) {
                    console.error(`  ❌ Error adding ${col.name}:`, err.message);
                }
            } else {
                console.log(`  ✅ ${col.name} exists`);
            }
        }
    }

    console.log(`\n=== Summary: ${fixCount} column(s) added ===`);

    // Final verification - show all columns for key tables
    console.log('\n--- Final verification ---');
    for (const tableName of Object.keys(EXPECTED_COLUMNS)) {
        const cols = await client.query(
            `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position`,
            [tableName]
        );
        console.log(`\n${tableName}:`);
        cols.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));
    }

    await client.end();
    console.log('\n✅ Done');
}

main().catch(console.error);
