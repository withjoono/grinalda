import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('✅ Prisma Client 연결 성공');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
