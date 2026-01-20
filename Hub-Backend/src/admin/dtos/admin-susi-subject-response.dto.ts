// TODO: 독립 앱으로 분리 - Susi 모듈
// import { ApiProperty } from '@nestjs/swagger';
// import { SuSiSubjectEntity } from 'src/database/entities/susi/susi-subject.entity';

// export class AdminSusiSubjectResponseDto {
//   @ApiProperty({
//     description: '수시 교과 통합DB 목록',
//   })
//   list!: SuSiSubjectEntity[];

//   @ApiProperty({
//     description: '전체 Count',
//   })
//   totalCount!: number;
// }

// 임시: 독립 앱 분리 후 삭제
export class AdminSusiSubjectResponseDto {
  list?: any[];
  totalCount?: number;
}
