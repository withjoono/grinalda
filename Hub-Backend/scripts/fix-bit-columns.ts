// Fix bit(1) columns to boolean for Prisma compatibility  
// Run with: npx ts-node scripts/fix-bit-columns.ts

import { PrismaClient } from '@prisma/client';

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('DATABASE_URL is required');
        process.exit(1);
    }

    const prisma = new PrismaClient({
        datasources: { db: { url: databaseUrl } },
    });

    try {
        console.log('=== Fixing bit columns to boolean ===\n');

        // Fix auth_member.ck_sms
        console.log('1. Fixing auth_member.ck_sms...');
        await prisma.$executeRawUnsafe(`
      ALTER TABLE hub.auth_member 
      ALTER COLUMN ck_sms DROP DEFAULT
    `);
        await prisma.$executeRawUnsafe(`
      ALTER TABLE hub.auth_member 
      ALTER COLUMN ck_sms TYPE boolean 
      USING CASE WHEN ck_sms = B'1' THEN true ELSE false END
    `);
        await prisma.$executeRawUnsafe(`
      ALTER TABLE hub.auth_member 
      ALTER COLUMN ck_sms SET DEFAULT false
    `);
        console.log('  ✅ ck_sms fixed');

        // Fix auth_member.ck_sms_agree
        console.log('2. Fixing auth_member.ck_sms_agree...');
        await prisma.$executeRawUnsafe(`
      ALTER TABLE hub.auth_member 
      ALTER COLUMN ck_sms_agree DROP DEFAULT
    `);
        await prisma.$executeRawUnsafe(`
      ALTER TABLE hub.auth_member 
      ALTER COLUMN ck_sms_agree TYPE boolean 
      USING CASE WHEN ck_sms_agree = B'1' THEN true ELSE false END
    `);
        await prisma.$executeRawUnsafe(`
      ALTER TABLE hub.auth_member 
      ALTER COLUMN ck_sms_agree SET DEFAULT false
    `);
        console.log('  ✅ ck_sms_agree fixed');

        // Fix payment_contract.regular_contract_fl
        console.log('3. Fixing payment_contract.regular_contract_fl...');
        try {
            await prisma.$executeRawUnsafe(`
        ALTER TABLE hub.payment_contract 
        ALTER COLUMN regular_contract_fl DROP DEFAULT
      `);
            await prisma.$executeRawUnsafe(`
        ALTER TABLE hub.payment_contract 
        ALTER COLUMN regular_contract_fl TYPE boolean 
        USING CASE WHEN regular_contract_fl = B'1' THEN true ELSE false END
      `);
            await prisma.$executeRawUnsafe(`
        ALTER TABLE hub.payment_contract 
        ALTER COLUMN regular_contract_fl SET DEFAULT false
      `);
            console.log('  ✅ regular_contract_fl fixed');
        } catch (e: any) {
            console.log('  ⚠️  regular_contract_fl:', e.message?.substring(0, 100));
        }

        // Verify
        console.log('\n=== Verification ===');
        const result: any[] = await prisma.$queryRaw`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_schema='hub' AND table_name='auth_member' 
        AND column_name IN ('ck_sms', 'ck_sms_agree')
    `;
        console.log('auth_member columns:', result);

        console.log('\n✅ All done!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
