import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    earlyAccess: true,
    schema: path.join(__dirname, 'prisma', 'schema.prisma'),

    migrate: {
        async resolve({ datasourceUrl }) {
            return { url: getDatabaseUrl() };
        },
    },
});

function getDatabaseUrl(): string {
    // DATABASE_URL이 설정되어 있으면 사용
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }

    // 개별 DB_* 변수로 구성
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = process.env.DB_PORT || '5432';
    const user = process.env.DB_USER || 'tsuser';
    const password = process.env.DB_PASSWORD || 'tsuser1234';
    const database = process.env.DB_NAME || 'geobukschool_dev';
    const schema = process.env.DB_SCHEMA || 'hub';

    return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=${schema}`;
}
