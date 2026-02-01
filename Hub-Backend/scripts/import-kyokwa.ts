import * as XLSX from 'xlsx';
import { Pool } from 'pg';
import * as path from 'path';

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'geobukschool_dev',
  user: 'tsuser',
  password: 'tsuser1234',
});

const COLUMN_MAP: Record<string, string> = {
  'ida_id': 'ida_id',
  '대학': 'university_name',
  '대학코드': 'university_code',
  '대학설립형태': 'university_type',
  '전형타입': 'admission_type',
  '전형명': 'admission_name',
  '계열': 'category',
  '모집단위': 'recruitment_unit',
  '지역(광역)': 'region_major',
  '지역(세부)': 'region_detail',
  '일반/특별': 'admission_category',
  '지원자격': 'qualification',
  '전형방법': 'admission_method',
  '최저학력기준': 'minimum_standard',
  '진로 선택 과목 평가 방법': 'career_subject_evaluation',
  '학년별 반영과목 비율': 'subject_reflection_by_grade',
  '모집인원': 'recruitment_count',
  '대계열': 'major_field',
  '중계열': 'mid_field',
  '소계열': 'minor_field',
  '복수\n지원': 'multiple_application',
  '필요\n서류': 'required_documents',
  '학년별반영비율': 'grade_reflection_ratio',
  '반영과목': 'reflected_subjects',
  '진로선택과목': 'career_selection_subjects',
  '선발모형': 'selection_model',
  '선발비율': 'selection_ratio',
  '1단계전형방법': 'stage1_method',
  '2단계전형방법': 'stage2_method',
  '학생부\n(정량)': 'student_record_quantitative',
  '학생부\n(정성)': 'student_record_qualitative',
  '면접': 'interview_ratio',
  '논술': 'essay_ratio',
  '실기': 'practical_ratio',
  '서류': 'document_ratio',
  '기타': 'etc_ratio',
  '기타내역': 'etc_details',
  '학생부\n활용지표': 'student_record_indicator',
  '반영\n학기': 'reflected_semester',
  '1학년': 'grade1_ratio',
  '2학년': 'grade2_ratio',
  '3학년': 'grade3_ratio',
  '1〮2학년': 'grade12_ratio',
  '2〮3학년': 'grade23_ratio',
  '1〮2〮3학년': 'grade123_ratio',
  '1〮3학년': 'grade13_ratio',
  '교과\n비율': 'subject_ratio',
  '비교과\n비율': 'non_subject_ratio',
  '비교과항목': 'non_subject_items',
  '1등급': 'grade1_score',
  '2등급': 'grade2_score',
  '3등급': 'grade3_score',
  '4등급': 'grade4_score',
  '5등급': 'grade5_score',
  '6등급': 'grade6_score',
  '7등급': 'grade7_score',
  '8등급': 'grade8_score',
  '9등급': 'grade9_score',
  '반영 교과(진로선택과목포함)': 'reflected_subjects_detail',
  '진로선택과목 반영 방법': 'career_subject_method',
  '반영여부': 'reflection_yn',
  '전영역\n응시\n여부': 'all_areas_required',
  '필수\n응시\n과목': 'required_subjects',
  '탐구\n반영\n방법': 'inquiry_reflection_method',
};

async function main() {
  const client = await pool.connect();
  
  try {
    console.log('📚 Excel 파일 읽기 중...');
    const filePath = path.join(__dirname, '..', 'uploads', '26_kyokwa_recruitment.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    
    console.log(\`✅ 총 \${rawData.length}개 행 읽기 완료\`);
    
    await client.query('BEGIN');
    
    console.log('🗑️ 기존 데이터 삭제 중...');
    await client.query('DELETE FROM susi_kyokwa_recruitment');
    
    console.log('📝 데이터 삽입 중...');
    let success = 0;
    let fail = 0;
    
    for (let i = 0; i < rawData.length; i++) {
      const row: any = rawData[i];
      
      try {
        const data: any = {};
        for (const [excelCol, dbCol] of Object.entries(COLUMN_MAP)) {
          let value = row[excelCol];
          
          if (value !== undefined && value !== null) {
            if (typeof value === 'string') {
              value = value.trim();
              if (value === '' || value === '-') value = null;
            }
            if ((dbCol.includes('_ratio') || dbCol.includes('_score') || 
                 dbCol === 'recruitment_count' || dbCol === 'reflected_semester') && value !== null) {
              value = parseInt(value as string) || null;
            }
          }
          
          data[dbCol] = value;
        }
        
        if (!data.ida_id) {
          fail++;
          continue;
        }
        
        const cols = Object.keys(data);
        const vals = Object.values(data);
        const placeholders = cols.map((_, idx) => \`$\${idx + 1}\`).join(', ');
        
        const updateCols = cols.filter(c => c !== 'ida_id').map(c => \`\${c} = EXCLUDED.\${c}\`).join(', ');
        
        const query = \`INSERT INTO susi_kyokwa_recruitment (\${cols.join(', ')}) VALUES (\${placeholders}) ON CONFLICT (ida_id) DO UPDATE SET \${updateCols}, updated_at = NOW()\`;
        
        await client.query(query, vals);
        success++;
        
        if ((i + 1) % 500 === 0) {
          console.log(\`  진행: \${i + 1}/\${rawData.length}\`);
        }
      } catch (error: any) {
        fail++;
        if (fail <= 5) {
          console.error(\`행 \${i + 1} 실패:\`, error.message);
        }
      }
    }
    
    await client.query('COMMIT');
    
    console.log(\`\n✅ 완료! 성공: \${success}, 실패: \${fail}\`);
    
    const result = await client.query('SELECT COUNT(*) FROM susi_kyokwa_recruitment');
    console.log(\`📊 테이블 총 행 수: \${result.rows[0].count}\`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 오류:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
