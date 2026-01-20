import { Injectable } from '@nestjs/common';
// TODO: 독립 앱으로 분리 - Essay 서비스
// import { EssayService } from 'src/modules/essay/essay.service';
import { CommonSearchQueryDto } from 'src/common/dtos/common-search-query.dto';
import { AdminEssayListResponse } from '../dtos/admin-essay-list-response.dto';

@Injectable()
export class AdminEssayService {
  // TODO: 독립 앱으로 분리 - Essay 서비스
  // constructor(private readonly essayService: EssayService) {}

  async getAdminEssayList(
    commonSearchQueryDto: CommonSearchQueryDto,
  ): Promise<AdminEssayListResponse> {
    // TODO: 독립 앱으로 분리 후 API로 호출
    // const { list, totalCount } =
    //   await this.essayService.getEssayListWithLowestGrade(commonSearchQueryDto);
    // return { list, totalCount };
    return { list: [], totalCount: 0 }; // 임시
  }
}
