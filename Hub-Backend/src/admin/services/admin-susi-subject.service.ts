import { Injectable } from '@nestjs/common';
import { CommonSearchQueryDto } from 'src/common/dtos/common-search-query.dto';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { AdminSusiSubjectResponseDto } from '../dtos/admin-susi-subject-response.dto';
import {
  convertExcelDate,
  convertExcelTime,
  isExcelDate,
  isExcelTime,
} from 'src/common/utils/excel-utils';
// TODO: 독립 앱으로 분리 - Susi 서비스
// import { SuSiSubjectEntity } from 'src/database/entities/susi/susi-subject.entity';
// import { SusiSubjectService } from 'src/modules/susi/services/susi-subject.service';
import { subjectExcelFieldMapping } from '../excel-mapper/subject-excel-field-mapper';

@Injectable()
export class AdminSusiSubjectService {
  // TODO: 독립 앱으로 분리 - Susi 서비스
  // constructor(private readonly susiSubjectService: SusiSubjectService) {}

  async getAdminSusiSubjectList(
    commonSearchQueryDto: CommonSearchQueryDto,
  ): Promise<AdminSusiSubjectResponseDto> {
    // TODO: 독립 앱으로 분리 후 API로 호출
    // const { list, totalCount } =
    //   await this.susiSubjectService.getAllSusiSubject(commonSearchQueryDto);
    // return { list, totalCount };
    return { list: [], totalCount: 0 }; // 임시
  }

  async syncDatabaseWithExcel(filePath: string): Promise<void> {
    // TODO: 독립 앱으로 분리 - Susi Excel 동기화 기능
    // 원본 코드는 주석 처리됨
    console.log('syncDatabaseWithExcel is not available in Hub mode');
    // 파일 삭제만 수행
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
    }
  }
}
