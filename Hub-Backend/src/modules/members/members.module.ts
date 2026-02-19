import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MemberIdGeneratorService } from './services/member-id-generator.service';
import { MembersController } from './controllers/members.controller';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';

@Module({
  imports: [
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
