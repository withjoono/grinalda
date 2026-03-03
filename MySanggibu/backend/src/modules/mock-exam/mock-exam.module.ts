import { Module } from '@nestjs/common';
import { MembersModule } from '../members/members.module';
import { MockExamService } from './mock-exam.service';
import { MockexamController } from './mock-exam.controller';


@Module({
  imports: [
    MembersModule,
  ],
  providers: [MockExamService],
  controllers: [MockexamController],
  exports: [MockExamService],
})
export class MockexamModule { }
