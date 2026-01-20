// TODO: 독립 앱으로 분리 - Susi 모듈
// import { ApiProperty } from '@nestjs/swagger';
// import { SusiPassRecordEntity } from 'src/database/entities/susi/susi-pass-record.entity';

// export class AdminSusiPassRecordResponseDto {
//   @ApiProperty({
//     description: '합불사례 데이터 조회',
//   })
//   list!: SusiPassRecordEntity[];

//   @ApiProperty({
//     description: '전체 Count',
//   })
//   totalCount!: number;
// }

// 임시: 독립 앱 분리 후 삭제
export class AdminSusiPassRecordResponseDto {
  list?: any[];
  totalCount?: number;
}
