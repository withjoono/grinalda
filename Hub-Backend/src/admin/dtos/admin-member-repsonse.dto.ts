import { ApiProperty } from '@nestjs/swagger';

export class AdminMemberResponseDto {
  @ApiProperty({
    description: '모든 유저 목록',
  })
  list!: any[];

  @ApiProperty({
    description: '전체 Count',
  })
  totalCount!: number;
}
