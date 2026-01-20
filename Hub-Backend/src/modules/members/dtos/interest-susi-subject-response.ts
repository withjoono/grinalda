// TODO: 독립 앱으로 분리 - Susi 모듈
// import { ApiProperty } from '@nestjs/swagger';
// import { SuSiSubjectEntity } from 'src/database/entities/susi/susi-subject.entity';

// export class InterestSusiSubjectResponseDto {
//   @ApiProperty()
//   id: number;

//   @ApiProperty()
//   name: string;

//   constructor(entity: SuSiSubjectEntity) {
//     this.id = entity.id;
//     this.name = entity.name;
//   }
// }

// 임시: 독립 앱 분리 후 삭제
export class InterestSusiSubjectResponseDto {}
export type InterestSusiSubjectResponse = InterestSusiSubjectResponseDto;
