const { Client } = require('pg');

async function main() {
    const c = new Client({
        host: '127.0.0.1',
        port: 15432,
        user: 'tsuser',
        password: 'tsuser1234',
        database: 'geobukschool_prod'
    });

    await c.connect();
    console.log('Connected to geobukschool_prod');

    // Get current tables
    const existing = await c.query(`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`);
    const tableNames = existing.rows.map(r => r.tablename);
    console.log('\nCurrent tables:', tableNames.join(', '));

    // Phase 2 renames - do each one individually (no big transaction)
    const phase2Renames = [
        ['mt_account_link', 'tr_account_link'],
        ['mt_admin_class', 'tr_admin_class'],
        ['mt_temp_code', 'tr_temp_code'],
        ['auth_member_interest', 'ss_user_university_interest'],
        ['auth_member_recruitment_combination', 'ss_user_application_combination'],
        ['auth_member_regular_combination', 'js_user_application_combination'],
        ['auth_member_regular_interest', 'js_user_university_interest'],
        ['sr_attendance', 'sgb_attendance'],
        ['sr_select_subject', 'sgb_select_subject'],
        ['sr_sport_art', 'sgb_sport_art'],
        ['sr_subject_learning', 'sgb_subject_learning'],
        ['sr_volunteer', 'sgb_volunteer'],
        ['ts_member_jungsi_calculated_scores', 'js_user_calculated_scores'],
        ['ts_member_jungsi_input_scores', 'js_user_input_scores'],
        ['ts_member_jungsi_recruitment_scores', 'js_user_recruitment_scores'],
        ['ts_admission_subtype_relations', 'ss_admission_subtype_relations'],
        ['ts_member_recruitment_unit_combination_items', 'ss_user_recruitment_unit_combination_items'],
        ['ts_member_regular_combination_items', 'js_user_application_combination_items'],
    ];

    console.log('\n📋 Phase 2: Renaming individually...');
    const tableSet = new Set(tableNames);

    for (const [from, to] of phase2Renames) {
        if (tableSet.has(to)) {
            console.log(`  ⏭️  ${to} already exists`);
            continue;
        }
        if (!tableSet.has(from)) {
            console.log(`  ⚠️  ${from} not found (and ${to} doesn't exist either)`);
            continue;
        }
        try {
            await c.query(`ALTER TABLE "${from}" RENAME TO "${to}"`);
            console.log(`  ✅ ${from} → ${to}`);
            tableSet.delete(from);
            tableSet.add(to);
        } catch (err) {
            console.error(`  ❌ Failed: ${from} → ${to}: ${err.message}`);
        }
    }

    // Sequences (individually, ignore errors)
    const phase2Sequences = [
        ['mt_account_link_member_id_seq', 'tr_account_link_member_id_seq'],
        ['mt_admin_class_member_id_seq', 'tr_admin_class_member_id_seq'],
        ['mt_temp_code_member_id_seq', 'tr_temp_code_member_id_seq'],
        ['auth_member_interest_id_seq', 'ss_user_university_interest_id_seq'],
        ['auth_member_recruitment_combination_id_seq', 'ss_user_application_combination_id_seq'],
        ['auth_member_regular_combination_id_seq', 'js_user_application_combination_id_seq'],
        ['auth_member_regular_interest_id_seq', 'js_user_university_interest_id_seq'],
        ['sr_attendance_id_seq', 'sgb_attendance_id_seq'],
        ['sr_select_subject_id_seq', 'sgb_select_subject_id_seq'],
        ['sr_sport_art_id_seq', 'sgb_sport_art_id_seq'],
        ['sr_subject_learning_id_seq', 'sgb_subject_learning_id_seq'],
        ['sr_volunteer_id_seq', 'sgb_volunteer_id_seq'],
        ['ts_member_jungsi_calculated_scores_id_seq', 'js_user_calculated_scores_id_seq'],
        ['ts_member_jungsi_input_scores_id_seq', 'js_user_input_scores_id_seq'],
        ['ts_member_jungsi_recruitment_scores_id_seq', 'js_user_recruitment_scores_id_seq'],
    ];

    for (const [from, to] of phase2Sequences) {
        try {
            await c.query(`ALTER SEQUENCE IF EXISTS "${from}" RENAME TO "${to}"`);
        } catch (e) { /* ok */ }
    }

    // Verify
    const after = await c.query(`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`);
    console.log(`\n📋 Final state (${after.rows.length} tables):`);
    after.rows.forEach(r => console.log(`  - ${r.tablename}`));
    console.log(`\nauth_member: ${after.rows.some(r => r.tablename === 'auth_member')}`);

    await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
