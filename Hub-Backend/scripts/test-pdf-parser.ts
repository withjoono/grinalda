/**
 * PDF 파서 테스트 스크립트 (텍스트 추출 + 세특/창체/행특 섹션 검증)
 * 
 * 사용법: npx ts-node scripts/test-pdf-parser.ts <pdf파일경로>
 * 
 * 주의: 신상정보 출력 금지 - 학년/과목/점수/세특만 출력
 */

import * as fs from 'fs';
import * as path from 'path';

// pdf-parse를 직접 사용 (서비스 외부에서)
async function main() {
    const pdfPath = process.argv[2];
    if (!pdfPath) {
        console.error('Usage: npx ts-node scripts/test-pdf-parser.ts <pdf_path>');
        process.exit(1);
    }

    const fullPath = path.resolve(pdfPath);
    if (!fs.existsSync(fullPath)) {
        console.error(`File not found: ${fullPath}`);
        process.exit(1);
    }

    console.log(`\n📄 PDF 파일: ${path.basename(fullPath)}`);
    console.log('='.repeat(60));

    const pdfBuffer = fs.readFileSync(fullPath);

    // pdf-parse로 텍스트 추출
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(pdfBuffer);
    const rawText = pdfData.text;

    console.log(`\n📊 PDF 통계:`);
    console.log(`   - 페이지 수: ${pdfData.numpages}`);
    console.log(`   - 전체 텍스트 길이: ${rawText.length} 글자`);

    // [학년] 마커 검색
    const yearPattern = /\[(\d)학년\]/g;
    const yearMatches = [...rawText.matchAll(yearPattern)];
    console.log(`\n🎓 학년 마커 발견: ${yearMatches.length}개`);
    yearMatches.forEach(m => console.log(`   - [${m[1]}학년] at position ${m.index}`));

    // 주요 섹션 마커 검색 (개인정보 제외)
    const sectionMarkers = [
        '세 부 능 력 및 특 기 사 항',
        '세부능력및특기사항',
        '세부능력 및 특기사항',
        '창의적',
        '체험활동',
        '행동특성',
        '종합의견',
        '진로 선택 과목',
        '진로선택과목',
        '체육ㆍ예술',
        '체육·예술',
        '교과학습발달상황',
    ];

    console.log(`\n📋 섹션 마커 검색 결과:`);
    for (const marker of sectionMarkers) {
        const positions: number[] = [];
        let searchPos = 0;
        while (true) {
            const idx = rawText.indexOf(marker, searchPos);
            if (idx === -1) break;
            positions.push(idx);
            searchPos = idx + marker.length;
        }
        if (positions.length > 0) {
            console.log(`   ✅ "${marker}": ${positions.length}개 (positions: ${positions.join(', ')})`);
        } else {
            console.log(`   ❌ "${marker}": 없음`);
        }
    }

    // splitByYear 로직 시뮬레이션 (개인정보 제거)
    console.log(`\n🔍 학년별 섹션 분석 (개인정보 제외):`);
    const yearStarts: Array<{ pos: number; year: string }> = [];
    let match: RegExpExecArray | null;
    const yearPat = /\[(\d)학년\]/g;
    while ((match = yearPat.exec(rawText)) !== null) {
        yearStarts.push({ pos: match.index, year: match[1] });
    }

    for (let i = 0; i < yearStarts.length; i++) {
        const startPos = yearStarts[i].pos;
        const nextPos = i + 1 < yearStarts.length ? yearStarts[i + 1].pos : rawText.length;
        const yearContent = rawText.substring(startPos, nextPos).trim();
        const year = yearStarts[i].year;

        console.log(`\n   === ${year}학년 (${yearContent.length} 글자) ===`);

        // 각 섹션 추출 시뮬레이션
        const sections: Record<string, string> = {};

        // 세특 섹션
        const setukIdx = yearContent.indexOf('세 부 능 력 및 특 기 사 항');
        if (setukIdx !== -1) {
            const setukContent = yearContent.substring(setukIdx + '세 부 능 력 및 특 기 사 항'.length).trim();
            // 첫 500자만 (개인정보 제거를 위해 과목명/점수만)
            sections['세특'] = setukContent.substring(0, 500);
        }

        // 창체 섹션
        const changIdx = yearContent.indexOf('창의적');
        const haengIdx = yearContent.indexOf('행동특성');
        if (changIdx !== -1) {
            const endIdx = haengIdx !== -1 ? haengIdx : yearContent.length;
            sections['창체'] = yearContent.substring(changIdx, endIdx).substring(0, 500);
        }

        // 행특 섹션
        if (haengIdx !== -1) {
            sections['행특'] = yearContent.substring(haengIdx).substring(0, 500);
        }

        for (const [sectionName, content] of Object.entries(sections)) {
            if (content.trim()) {
                console.log(`   📌 ${sectionName} 섹션 발견 (${content.length} 글자 미리보기):`);
                // 줄바꿈 기준으로 첫 5줄만 (개인정보 가능성 줄임)
                const lines = content.split('\n').filter(l => l.trim()).slice(0, 5);
                lines.forEach(line => {
                    // 이름, 번호 등 개인정보 패턴 제거
                    const sanitized = line
                        .replace(/이름\s*\S+/g, '이름 [삭제됨]')
                        .replace(/번호\s*\d+/g, '번호 [삭제됨]')
                        .replace(/반\s*\d+/g, '반 [삭제됨]')
                        .replace(/\d{4}년\s*\d{1,2}월\s*\d{1,2}일/g, '[날짜 삭제됨]')
                        .trim();
                    if (sanitized) console.log(`      "${sanitized.substring(0, 100)}${sanitized.length > 100 ? '...' : ''}"`);
                });
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ 분석 완료');
}

main().catch(console.error);
