import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentoringService } from './mentoring.service';
import { MentoringController } from './mentoring.controller';
import { MentoringInviteEntity } from 'src/database/entities/mentoring/mentoring-invite.entity';
import { MentoringLinkEntity } from 'src/database/entities/mentoring/mentoring-link.entity';
import { MemberEntity } from 'src/database/entities/member/member.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MentoringInviteEntity,
            MentoringLinkEntity,
            MemberEntity,
        ]),
    ],
    controllers: [MentoringController],
    providers: [MentoringService],
    exports: [MentoringService],
})
export class MentoringModule { }
