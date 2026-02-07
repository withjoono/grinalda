require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const p = require('@prisma/client');
console.log('Module keys:', Object.keys(p));

try {
    const c = new p.PrismaClient();
    console.log('PrismaClient created');
    c.$connect()
        .then(() => { console.log('CONNECTED'); return c.$disconnect(); })
        .catch(e => console.error('Connect error:', e.message));
} catch (e) {
    console.error('Create error:', e.message);
}
