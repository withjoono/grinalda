import { Module } from '@nestjs/common';
import { KyokwaSubjectsController } from './kyokwa-subjects.controller';
import { KyokwaSubjectsService } from './kyokwa-subjects.service';

@Module({
    controllers: [KyokwaSubjectsController],
    providers: [KyokwaSubjectsService],
})
export class KyokwaSubjectsModule { }
