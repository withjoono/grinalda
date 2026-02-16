
import { Client } from 'pg';

const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'tsuser',
    password: 'tsuser1234',
    database: 'geobukschool_dev',
});

async function checkTables() {
    try {
        await client.connect();
        console.log('Connected to database geobukschool_dev');

        const tableNames = [
            'sgb_attendance',
            'sgb_select_subject',
            'sgb_subject_learning',
            'sgb_volunteer',
            'sgb_sport_art'
        ];

        const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY($1)
    `;

        const res = await client.query(query, [tableNames]);

        const foundTables = res.rows.map(row => row.table_name);
        console.log('Found tables:', foundTables);

        const missingTables = tableNames.filter(name => !foundTables.includes(name));
        if (missingTables.length > 0) {
            console.log('Missing tables:', missingTables);
        } else {
            console.log('All tables found.');
        }

    } catch (err) {
        console.error('Error querying database:', err);
    } finally {
        await client.end();
    }
}

checkTables();
