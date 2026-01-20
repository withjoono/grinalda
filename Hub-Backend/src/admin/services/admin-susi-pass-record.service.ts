import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonSearchQueryDto } from 'src/common/dtos/common-search-query.dto';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { CommonSearchUtils } from 'src/common/utils/common-search.utils';
import * as fs from 'fs';
import * as path from 'path';
// TODO: 독립 앱으로 분리 - Susi 엔티티
// import { SusiPassRecordEntity } from 'src/database/entities/susi/susi-pass-record.entity';

@Injectable()
export class AdminSusiPassRecordService {
  // TODO: 독립 앱으로 분리 - Susi Repository
  // constructor(
  //   @InjectRepository(SusiPassRecordEntity)
  //   private readonly susiPassRecordRepository: Repository<SusiPassRecordEntity>,
  // ) {}

  // 합불 사례 전체조회 (admin)
  async getAdminRankingPassFail(commonSearchQueryDto: CommonSearchQueryDto) {
    // TODO: 독립 앱으로 분리 후 API로 호출
    return {
      list: [],
      totalCount: 0,
    };
  }

  async uploadFile(file: Express.Multer.File): Promise<void> {
    // TODO: 독립 앱으로 분리 - Susi Excel 업로드 기능
    console.log('uploadFile is not available in Hub mode');
  }
}
