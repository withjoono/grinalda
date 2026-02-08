import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MemberIdGeneratorService } from './services/member-id-generator.service';
import { MembersController } from './controllers/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/database/entities/member/member.entity';
import { MemberStudentEntity } from 'src/database/entities/member/member-student.entity';
import { MemberTeacherEntity } from 'src/database/entities/member/member-teacher.entity';
import { MemberParentEntity } from 'src/database/entities/member/member-parent.entity';
import { MemberInterestsEntity } from 'src/database/entities/member/member-interests';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberEntity,
      MemberStudentEntity,
      MemberTeacherEntity,
      MemberParentEntity,
      MemberInterestsEntity,
    ]),
    BcryptModule,
  ],
  providers: [
    MembersService,
    MemberIdGeneratorService,
  ],
  controllers: [
    MembersController,
  ],
  exports: [MembersService, MemberIdGeneratorService],
})
export class MembersModule { }
