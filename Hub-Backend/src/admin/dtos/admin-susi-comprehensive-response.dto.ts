// TODO: 독립 앱으로 분리 - Susi 모듈
// import { ApiProperty } from '@nestjs/swagger';
// import { SusiComprehensiveEntity } from 'src/database/entities/susi/susi-comprehensive.entity';

// export class AdminSusiComprehensiveResponseDto {
//   @ApiProperty({
//     description: '수시 학종 통합DB 목록',
//   })
//   list!: SusiComprehensiveEntity[];

//   @ApiProperty({
//     description: '전체 Count',
//   })
//   totalCount!: number;
// }

// 임시: 독립 앱 분리 후 삭제
export class AdminSusiComprehensiveResponseDto {
  list?: any[];
  totalCount?: number;
}
