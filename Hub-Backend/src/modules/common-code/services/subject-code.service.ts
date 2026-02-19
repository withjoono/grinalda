import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

@Injectable()
export class SubjectCodesService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findAll() {
    return await this.prisma.subjectCodeList.findMany();
  }

  async syncDatabaseWithExcel(filePath: string): Promise<void> {
    try {
      // 엑셀 파일 읽기
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 'A',
      });

      await this.prisma.$transaction(async (tx) => {
        // 기존 데이터 삭제
        await tx.subjectCodeList.deleteMany();

        // 청크 단위로 저장
        const CHUNK_SIZE = 300;
        let chunk = [];

        for (let i = 1; i < sheet.length; i++) {
          const row = sheet[i] as any;

          chunk.push({
            main_subject_code: row['B'],
            main_subject_name: row['A'].replace(/\s+/g, ''),
            subject_code: row['G'],
            subject_name: row['E'].replace(/\s+/g, ''),
            type: row['I'] === '석차등급' ? 0 : 1,
            course_type: this.getCourseType(row['C']),
            is_required: row['H'] === '0',
          });

          if (chunk.length === CHUNK_SIZE || i === sheet.length - 1) {
            await tx.subjectCodeList.createMany({ data: chunk });
            chunk = [];
          }
        }
      });
    } catch (error) {
      console.error('데이터 동기화 중 오류 발생:', error);
      throw error;
    } finally {
      // 파일 삭제
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        }
      });
    }
  }

  private getCourseType(typeString: string): number {
    switch (typeString) {
      case '공통과목':
        return 0;
      case '일반선택':
        return 1;
      case '진로선택':
        return 2;
      case '전문 교과Ⅰ':
        return 3;
      case '전문 교과Ⅱ':
        return 4;
      default:
        return 0;
    }
  }
}
