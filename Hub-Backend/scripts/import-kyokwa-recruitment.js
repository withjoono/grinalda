/**
 * Excel 파일에서 교과 전형 데이터를 읽어 susi_kyokwa_recruitment 테이블에 삽입
 * 실행: node scripts/import-kyokwa-recruitment.js
 */

const XLSX = require('xlsx');
const { Pool } = require('pg');
const path = require('path');

// 데이터베이스 연결 설정
const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'geobukschool_dev',
  user: 'tsuser',
  password: 'tsuser1234',
});

// 컬럼 매핑 (Excel 헤더 -> DB 컬럼명)
const COLUMN_MAPPING = {
  'ida_id': 'ida_id',
  '대학명': 'university_name',
  '대학코드': 'university_code',
  '대학구분': 'university_type',
  '전형구분': 'admission_type',
  '전형명': 'admission_name',
  '모집계열': 'category',
  '모집단위': 'recruitment_unit',
  '지역(광역)': 'region_major',
  '지역(세부)': 'region_detail',
  '전형유형': 'admission_category',
  '지원자격': 'qualification',
  '전형방법': 'admission_method',
  '수능최저': 'minimum_standard',
  '진로선택과목평가': 'career_subject_evaluation',
  '학년별과목반영': 'subject_reflection_by_grade',
  '모집인원': 'recruitment_count',
  '모집계열_대': 'major_field',
  '모집계열_중': 'mid_field',
  '모집계열_소': 'minor_field',
  '복수지원가능여부': 'multiple_application',
  '제출서류': 'required_documents',
  '학년별반영비율': 'grade_reflection_ratio',
  '반영교과': 'reflected_subjects',
  '진로선택과목': 'career_selection_subjects',
  '선발모형': 'selection_model',
  '전형비율': 'selection_ratio',
  '1단계': 'stage1_method',
  '2단계': 'stage2_method',
  '학생부정량': 'student_record_quantitative',
  '학생부정성': 'student_record_qualitative',
  '면접': 'interview_ratio',
  '논술': 'essay_ratio',
  '실기': 'practical_ratio',
  '서류': 'document_ratio',
  '기타': 'etc_ratio',
  '기타세부사항': 'etc_details',
  '학생부지표': 'student_record_indicator',
  '반영학기수': 'reflected_semester',
  '1학년': 'grade1_ratio',
  '2학년': 'grade2_ratio',
  '3학년': 'grade3_ratio',
  '1+2학년': 'grade12_ratio',
  '2+3학년': 'grade23_ratio',
  '1+2+3학년': 'grade123_ratio',
  '1+3학년': 'grade13_ratio',
  '교과': 'subject_ratio',
  '비교과': 'non_subject_ratio',
  '비교과항목': 'non_subject_items',
  '1등급점수': 'grade1_score',
  '2등급점수': 'grade2_score',
  '3등급점수': 'grade3_score',
  '4등급점수': 'grade4_score',
  '5등급점수': 'grade5_score',
  '6등급점수': 'grade6_score',
  '7등급점수': 'grade7_score',
  '8등급점수': 'grade8_score',
  '9등급점수': 'grade9_score',
  '반영교과세부': 'reflected_subjects_detail',
  '진로선택과목평가방법': 'career_subject_method',
  '반영여부': 'reflection_yn',
  '전영역필수': 'all_areas_required',
  '필수과목': 'required_subjects',
  '탐구반영방법': 'inquiry_reflection_method',
};

async function main() {
  const client = await pool.connect();

  try {
    console.log('📚 Excel 파일 읽기 시작...');
    const filePath = path.join(__dirname, '..', 'uploads', '26_kyokwa_recruitment.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(worksheet);
    console.log('✅ 총 ' + rawData.length + '개의 행을 읽었습니다.');

    if (rawData.length === 0) {
      console.log('❌ 데이터가 없습니다.');
      return;
    }

    console.log('\n📋 Excel 파일의 컬럼:');
    console.log(Object.keys(rawData[0]).join(', '));

    await client.query('BEGIN');

    console.log('\n🗑️  기존 데이터 삭제 중...');
    await client.query('DELETE FROM susi_kyokwa_recruitment');
    console.log('✅ 기존 데이터 삭제 완료');

    console.log('\n📝 데이터 삽입 중...');
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];

      try {
        const mappedData = {};
        for (const [excelCol, dbCol] of Object.entries(COLUMN_MAPPING)) {
          let value = row[excelCol];

          if (value !== undefined && value !== null) {
            if (typeof value === 'string') {
              value = value.trim();
              if (value === '' || value === '-') {
                value = null;
              }
            }
            if (dbCol.includes('_ratio') || dbCol.includes('_score') ||
                dbCol === 'recruitment_count' || dbCol === 'reflected_semester') {
              value = value === null ? null : parseInt(value) || null;
            }
          }

          mappedData[dbCol] = value;
        }

        if (!mappedData.ida_id) {
          console.log('⚠️  행 ' + (i + 1) + ': ida_id가 없어 스킵합니다.');
          continue;
        }

        const columns = Object.keys(mappedData);
        const values = Object.values(mappedData);
        const placeholders = columns.map((_, idx) => '$' + (idx + 1)).join(', ');

        const updateCols = columns.filter(col => col !== 'ida_id').map(col => col + ' = EXCLUDED.' + col).join(', ');
        
        const insertQuery = 'INSERT INTO susi_kyokwa_recruitment (' + columns.join(', ') + ') VALUES (' + placeholders + ') ON CONFLICT (ida_id) DO UPDATE SET ' + updateCols + ', updated_at = NOW()';

        await client.query(insertQuery, values);
        insertedCount++;

        if ((i + 1) % 100 === 0) {
          console.log('  진행 중... ' + (i + 1) + '/' + rawData.length);
        }
      } catch (error) {
        errorCount++;
        console.error('❌ 행 ' + (i + 1) + ' 삽입 실패:', error.message);
      }
    }

    await client.query('COMMIT');

    console.log('\n✅ 데이터 삽입 완료!');
    console.log('   성공: ' + insertedCount + '개');
    console.log('   실패: ' + errorCount + '개');

    const countResult = await client.query('SELECT COUNT(*) FROM susi_kyokwa_recruitment');
    console.log('\n📊 테이블 총 데이터 수: ' + countResult.rows[0].count);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 오류 발생:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main()
  .then(() => {
    console.log('\n🎉 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 실패:', error);
    process.exit(1);
  });
