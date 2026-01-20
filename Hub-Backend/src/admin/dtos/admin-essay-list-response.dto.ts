// TODO: 독립 앱으로 분리 - Essay 모듈
// import { ApiProperty } from '@nestjs/swagger';
// import { EssayListEntity } from 'src/database/entities/essay/essay-list.entity';
// import { EssayLowestGradeListEntity } from 'src/database/entities/essay/essay-lowest-grade-list.entity';

// export class AdminEssayListResponse {
//   @ApiProperty({
//     description: '논술 통합 DB 목록',
//   })
//   list!: (EssayListEntity & EssayLowestGradeListEntity)[];

//   @ApiProperty({
//     description: '전체 Count',
//   })
//   totalCount!: number;
// }

// 임시: 독립 앱 분리 후 삭제
export class AdminEssayListResponse {
  list?: any[];
  totalCount?: number;
}
