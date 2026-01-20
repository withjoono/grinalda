// TODO: 독립 앱으로 분리 - Susi 모듈
// import { ApiProperty } from '@nestjs/swagger';
// import { SusiComprehensiveEntity } from 'src/database/entities/susi/susi-comprehensive.entity';

// export class InterestSusiComprehensiveResponseDto {
//   @ApiProperty()
//   id: number;

//   @ApiProperty()
//   name: string;

//   constructor(entity: SusiComprehensiveEntity) {
//     this.id = entity.id;
//     this.name = entity.name;
//   }
// }

// 임시: 독립 앱 분리 후 삭제
export class InterestSusiComprehensiveResponseDto {}
export type InterestSusiComprehensiveResponse = InterestSusiComprehensiveResponseDto;
