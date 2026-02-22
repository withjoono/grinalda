/**
 * AI-based School Record PDF Parser Service
 *
 * OpenAI GPT를 사용한 PDF 형식 학생부 파싱 서비스
 * 원본: Susi Backend (GB-SchoolRecord-Parser)
 */

import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { PDFParse } = require('pdf-parse');

interface AcademicRecord {
    교과명: string;
    과목명: string;
    단위수: string;
    원점수?: string;
    과목평균?: string;
    표준편차?: string;
    성취도: string;
    수강자수?: string;
    석차등급?: string;
    성취도분포비율A?: string;
    성취도분포비율B?: string;
    성취도분포비율C?: string;
    세부능력및특기사항?: string;
}

/**
 * 교과명(한글) → 교과 코드 매핑
 */
const MAIN_SUBJECT_CODE_MAP: Record<string, string> = {
    국어: 'HH1',
    수학: 'HH2',
    영어: 'HH3',
    '사회(역사/도덕포함)': 'HH4',
    사회: 'HH4',
    과학: 'HH5',
    '기술・가정/제2외국어/한문/교양': 'HH6',
    '기술·가정/제2외국어/한문/교양': 'HH6',
    한국사: 'HH7',
    체육: 'HH8',
    예술: 'HH9',
    과학계열: 'HH10',
    국제계열: 'HH11',
    예술계열: 'HH12',
    외국어계열: 'HH13',
    체육계열: 'HH14',
    건설: 'HH15',
    '경영･금융': 'HH16',
    기계: 'HH17',
    '농림･수산･해양': 'HH18',
    '디자인･문화 콘텐츠': 'HH19',
    '미용･관광･레저': 'HH20',
    '보건･복지': 'HH21',
    '선박 운항': 'HH22',
    '섬유･의류': 'HH23',
    '식품･가공': 'HH24',
    '음식 조리': 'HH25',
    '인쇄･출판･공예': 'HH26',
    재료: 'HH27',
    '전기･전자': 'HH28',
    '정보･통신': 'HH29',
    '화학 공원': 'HH30',
    '환경･안전': 'HH31',
};

/**
 * 과목명(한글) → 과목 코드 매핑
 */
const SUBJECT_CODE_MAP: Record<string, string> = {
    국어: 'KOR001', '화법과 작문': 'KOR002', 독서: 'KOR003', '언어와 매체': 'KOR004',
    문학: 'KOR005', '실용 국어': 'KOR006', '심화 국어': 'KOR007', '고전 읽기': 'KOR008',
    수학: 'MAT001', 수학Ⅰ: 'MAT002', 수학Ⅱ: 'MAT003', 미적분: 'MAT004',
    '확률과 통계': 'MAT005', 기하: 'MAT006', '경제 수학': 'MAT007', '수학과제 탐구': 'MAT008',
    '실용 수학': 'MAT009', '인공지능 수학': 'MAT010',
    영어: 'ENG001', 영어Ⅰ: 'ENG002', 영어Ⅱ: 'ENG003', '영어 회화': 'ENG004',
    '영어 독해와 작문': 'ENG005', '실용 영어': 'ENG006', '영어권 문화': 'ENG007',
    '진로 영어': 'ENG008', '영미 문학 읽기': 'ENG009',
    통합사회: 'SOC001', 한국지리: 'SOC002', 세계지리: 'SOC003', 세계사: 'SOC004',
    동아시아사: 'SOC005', 경제: 'SOC006', '정치와 법': 'SOC007', '사회·문화': 'SOC008',
    사회문화: 'SOC008', '생활과 윤리': 'SOC009', '윤리와 사상': 'SOC010',
    여행지리: 'SOC011', '사회문제 탐구': 'SOC012', '고전과 윤리': 'SOC013',
    통합과학: 'SCI001', 과학탐구실험: 'SCI002', 물리학Ⅰ: 'SCI003', 물리학Ⅱ: 'SCI004',
    화학Ⅰ: 'SCI005', 화학Ⅱ: 'SCI006', 생명과학Ⅰ: 'SCI007', 생명과학Ⅱ: 'SCI008',
    지구과학Ⅰ: 'SCI009', 지구과학Ⅱ: 'SCI010', 융합과학: 'SCI011', 과학사: 'SCI012',
    '생활과 과학': 'SCI013',
    '기술·가정': 'TEC001', 기술가정: 'TEC001', 정보: 'TEC002', '농업 생명 과학': 'TEC003',
    '공학 일반': 'TEC004', '창의 경영': 'TEC005', '해양 문화와 기술': 'TEC006',
    가정과학: 'TEC007', '지식 재산 일반': 'TEC008',
    독일어Ⅰ: 'LAN001', 프랑스어Ⅰ: 'LAN002', 스페인어Ⅰ: 'LAN003', 중국어Ⅰ: 'LAN004',
    일본어Ⅰ: 'LAN005', 러시아어Ⅰ: 'LAN006', 아랍어Ⅰ: 'LAN007', 베트남어Ⅰ: 'LAN008',
    한문Ⅰ: 'LAN009', 한문: 'LAN009', '진로와 직업': 'LAN010', 환경: 'LAN011',
    '실용 경제': 'LAN012', 논리학: 'LAN013', 논술: 'LAN013', 심리학: 'LAN014',
    철학: 'LAN015', 종교학: 'LAN016', 교육학: 'LAN017', 보건: 'LAN018',
    한국사: 'HIS001',
    체육: 'PHY001', '운동과 건강': 'PHY002', '스포츠 생활': 'PHY003', '체육 탐구': 'PHY004',
    음악: 'ART001', 미술: 'ART002', 연극: 'ART003', '음악 연주': 'ART004',
    '음악 감상과 비평': 'ART005', '미술 창작': 'ART006', '미술 감상과 비평': 'ART007',
};

function getSubjectCode(subjectName: string): string {
    if (!subjectName) return 'DEFAULT';
    if (SUBJECT_CODE_MAP[subjectName]) return SUBJECT_CODE_MAP[subjectName];
    const normalizedName = subjectName.replace(/\s+/g, ' ').trim();
    if (SUBJECT_CODE_MAP[normalizedName]) return SUBJECT_CODE_MAP[normalizedName];
    const noSpaceName = subjectName.replace(/\s+/g, '');
    for (const [key, code] of Object.entries(SUBJECT_CODE_MAP)) {
        if (key.replace(/\s+/g, '') === noSpaceName) return code;
    }
    return 'DEFAULT';
}

function getMainSubjectCode(mainSubjectName: string): string {
    if (!mainSubjectName) return 'DEFAULT';
    if (MAIN_SUBJECT_CODE_MAP[mainSubjectName]) return MAIN_SUBJECT_CODE_MAP[mainSubjectName];
    const normalizedName = mainSubjectName.replace(/[・·]/g, '·').replace(/\s+/g, '').trim();
    for (const [key, code] of Object.entries(MAIN_SUBJECT_CODE_MAP)) {
        const normalizedKey = key.replace(/[・·]/g, '·').replace(/\s+/g, '').trim();
        if (normalizedName === normalizedKey || normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
            return code;
        }
    }
    return 'DEFAULT';
}

interface SemesterData {
    일반: AcademicRecord[];
    진로선택: AcademicRecord[];
    체육예술: AcademicRecord[];
}

interface YearData {
    '1학기': SemesterData;
    '2학기': SemesterData;
}

interface ParsedAcademicRecords {
    academic_records: {
        [year: string]: YearData;
    };
    creative_activities?: {
        [year: string]: Array<{
            활동유형: string;
            특기사항: string;
        }>;
    };
    behavior_opinions?: {
        [year: string]: string;
    };
}

@Injectable()
export class AiPdfParserService {
    private readonly logger = new Logger(AiPdfParserService.name);
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
            this.logger.log('OpenAI client initialized');
        } else {
            this.logger.warn('OPENAI_API_KEY not configured - AI parsing disabled');
        }
    }

    async extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
        try {
            const parser = new PDFParse({ verbosity: 0, data: pdfBuffer });
            await parser.load();
            const result = await parser.getText();
            return result.text;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`PDF 파일 처리 중 오류 발생: ${message}`);
        }
    }

    /**
     * 한글 마커를 유연한 정규식 패턴으로 변환
     * PDF 텍스트 추출 시 글자 사이 공백이 다양하게 들어갈 수 있으므로
     * 각 글자 사이에 \s* 를 넣어 유연하게 매칭
     * 예: '세 부 능 력 및 특 기 사 항' → 세\s*부\s*능\s*력\s*및\s*특\s*기\s*사\s*항
     */
    private markerToFlexPattern(marker: string): string {
        // 마커에서 공백을 모두 제거하고 각 글자 사이에 \s*를 삽입
        const chars = marker.replace(/\s+/g, '').split('');
        return chars.map(c => this.escapeRegex(c)).join('\\s*');
    }

    private extractSection(text: string, startMarker: string, endMarker: string): string {
        try {
            let pattern: RegExp;
            if (startMarker === '^' && endMarker === '$') {
                // 전체 텍스트
                return text.trim();
            }

            const startPattern = startMarker === '^' ? '' : this.markerToFlexPattern(startMarker);
            const endPattern = endMarker === '$' ? '' : this.markerToFlexPattern(endMarker);

            if (startMarker === '^') {
                pattern = new RegExp(`(.*?)${endPattern}`, 's');
            } else if (endMarker === '$') {
                pattern = new RegExp(
                    `${startPattern}(.*)$`,
                    's',
                );
            } else {
                pattern = new RegExp(
                    `${startPattern}(.*?)${endPattern}`,
                    's',
                );
            }
            const match = text.match(pattern);
            if (match) {
                let content = match[1].trim();
                content = content.replace(
                    /반\s*\d+\s*번호\d+이름\s*[\w\s]+\s*[\w\s]+교\s*\d+\/\d+\s*\d+년\s*\d+월\s*\d+일/g,
                    '',
                );
                content = content.replace(/\n+/g, '\n');
                return content;
            }
            return '';
        } catch {
            return '';
        }
    }

    private escapeRegex(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private processSemesterData(text: string): { '1학기': string; '2학기': string } {
        const semesters = { '1학기': '', '2학기': '' };
        let currentSemester: '1학기' | '2학기' | null = null;
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.startsWith('1')) {
                currentSemester = '1학기';
                semesters['1학기'] += line.substring(1) + '\n';
            } else if (line.startsWith('2')) {
                currentSemester = '2학기';
                semesters['2학기'] += line.substring(1) + '\n';
            } else if (currentSemester && line.trim()) {
                semesters[currentSemester] += line + '\n';
            }
        }
        return semesters;
    }

    splitByYear(
        text: string,
    ): Array<{ year: string; content: Record<string, { '1학기': string; '2학기': string }>; setukRawText: string }> {
        const yearPattern = /\[(\d)학년\]/g;
        const yearStarts: Array<{ pos: number; year: string }> = [];
        let match: RegExpExecArray | null;
        while ((match = yearPattern.exec(text)) !== null) {
            yearStarts.push({ pos: match.index, year: match[1] });
        }
        if (yearStarts.length === 0) {
            throw new Error('학년별 정보를 찾을 수 없습니다');
        }
        const yearChunks: Array<{
            year: string;
            content: Record<string, { '1학기': string; '2학기': string }>;
            setukRawText: string;
        }> = [];
        for (let i = 0; i < yearStarts.length; i++) {
            const startPos = yearStarts[i].pos;
            const nextPos = i + 1 < yearStarts.length ? yearStarts[i + 1].pos : text.length;
            const yearContent = text.substring(startPos, nextPos).trim();
            const year = yearStarts[i].year;

            // 세특 섹션 원본 텍스트 추출 (GPT 없이 직접 파싱용)
            // 세특은 '창의적' 전까지만 가져감 (그 이후는 창체/행특)
            let setukRawText = this.extractSection(yearContent, '세부능력및특기사항', '창의적');
            if (!setukRawText.trim()) {
                // 창의적체험활동이 없는 경우 행동특성까지 시도
                setukRawText = this.extractSection(yearContent, '세부능력및특기사항', '행동특성');
            }
            if (!setukRawText.trim()) {
                // 둘 다 없으면 끝까지
                setukRawText = this.extractSection(yearContent, '세부능력및특기사항', '$');
            }

            const sections = {
                일반: this.extractSection(yearContent, '^', '세부능력및특기사항'),
                진로선택: this.extractSection(yearContent, '진로선택과목', '세부능력및특기사항'),
                체육예술: this.extractSection(yearContent, '체육ㆍ예술', '세부능력및특기사항'),
                // 세특/창체/행특은 GPT로 보내지 않음 - 모두 직접 파싱
            };

            this.logger.log(`[${year}학년] 섹션 추출 결과:`);
            this.logger.log(`[SECTION_DEBUG] year=${year} ilban=${sections.일반.length} jinro=${sections.진로선택.length} pe=${sections.체육예술.length} setuk=${setukRawText.length}`);
            for (const [name, content] of Object.entries(sections)) {
                this.logger.log(`  ${name}: ${content ? `${content.length}자 - ${content.substring(0, 80)}...` : '(비어있음)'}`);
            }
            this.logger.log(`  세특(직접파싱): ${setukRawText ? setukRawText.length + '자' : '(비어있음)'}`);

            const processedSections: Record<string, { '1학기': string; '2학기': string }> = {};
            for (const [sectionName, sectionContent] of Object.entries(sections)) {
                if (sectionContent.trim()) {
                    processedSections[sectionName] = this.processSemesterData(sectionContent);
                }
            }
            if (Object.keys(processedSections).length > 0) {
                yearChunks.push({ year: `${year}학년`, content: processedSections, setukRawText });
            }
        }
        return yearChunks;
    }

    /**
     * 세특 섹션 텍스트에서 직접 [과목명, 세특내용]을 추출
     * GPT 없이 정규식으로 파싱 → 토큰 한도 없이 전체 내용 보존
     * 
     * 실제 PDF 형식: "과목명 세특: 세특내용..." 또는 "과목명: 세특내용..."
     * 세특 텍스트에는 학기 번호가 없음 → 과목명으로만 매칭
     * @returns Map<과목명, 세특내용>
     */
    private parseSetukFromText(
        setukText: string,
        knownSubjects: string[],
    ): Map<string, string> {
        const result = new Map<string, string>();
        if (!setukText || !setukText.trim()) return result;

        // 과목명을 유연하게 매칭하기 위해 공백 제거 후 정규식 패턴 생성
        // 길이가 긴 과목부터 먼저 매칭 ("영어 독해와 작문"이 "영어"보다 우선)
        const sortedSubjects = [...new Set(knownSubjects)]
            .filter(s => s && s.length > 0)
            .sort((a, b) => b.length - a.length);

        if (sortedSubjects.length === 0) return result;

        // 각 과목명을 유연하게 매칭하는 패턴 (글자 사이 공백 허용)
        const subjectPatterns = sortedSubjects.map(s => {
            const chars = s.replace(/\s+/g, '').split('');
            return chars.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*');
        });
        const subjectAlternation = subjectPatterns.join('|');

        // 패턴: 과목명 + 선택적 "세특" + 콜론(:) + 공백 + 세특내용
        // 또는: 줄 시작에서 과목명 + 콜론(:)
        const entryPattern = new RegExp(
            `(${subjectAlternation})(?:\\s*세특)?\\s*:\\s*`,
            'g',
        );

        const entries: Array<{ subjectName: string; startIdx: number; matchIdx: number }> = [];
        let m: RegExpExecArray | null;
        while ((m = entryPattern.exec(setukText)) !== null) {
            // 원본 과목명 복원 (공백 제거)
            const rawMatch = m[1];
            const normalizedMatch = rawMatch.replace(/\s+/g, '');
            // knownSubjects에서 가장 일치하는 과목명 찾기
            const matchedSubject = sortedSubjects.find(
                s => s.replace(/\s+/g, '') === normalizedMatch,
            ) || normalizedMatch;

            entries.push({
                subjectName: matchedSubject,
                startIdx: m.index + m[0].length,
                matchIdx: m.index,
            });
        }

        this.logger.log(`  세특 직접파싱: ${entries.length}개 과목명 경계 발견`);

        // 각 엔트리의 세특 텍스트 추출 (다음 엔트리의 과목명 시작까지)
        for (let i = 0; i < entries.length; i++) {
            const endIdx = i + 1 < entries.length
                ? entries[i + 1].matchIdx
                : setukText.length;
            const content = setukText.substring(entries[i].startIdx, endIdx).trim();
            // 과목명으로만 키 설정 (학기 정보 없음)
            const key = entries[i].subjectName;
            result.set(key, content);
            this.logger.log(`  세특 직접파싱: ${key} = ${content.substring(0, 60)}... (${content.length}자)`);
        }

        return result;
    }

    /**
     * 전체 PDF 텍스트에서 창의적체험활동 직접 추출
     * 학년별로 추출: [N학년] 블록과 무관하게 전체 텍스트에서 찾음
     */
    private parseChangcheFromText(fullText: string): Array<{ grade: string; activityType: string; content: string }> {
        const results: Array<{ grade: string; activityType: string; content: string }> = [];

        // 전체 텍스트에서 '창의적 체험활동상황' 섹션 추출
        const changcheSection = this.extractSection(fullText, '창의적', '행동특성');
        if (!changcheSection.trim()) {
            this.logger.log('[CHANGCHE] changche section not found in full text');
            return results;
        }
        this.logger.log(`[CHANGCHE] found section: ${changcheSection.length} chars`);
        this.logger.log(`[CHANGCHE] first 200 chars: ${changcheSection.substring(0, 200)}`);

        // 학년별로 분리 시도: [N학년] 패턴
        const yearPattern = /\[(\d)학년\]/g;
        const yearBlocks: Array<{ year: string; startIdx: number }> = [];
        let m: RegExpExecArray | null;
        while ((m = yearPattern.exec(changcheSection)) !== null) {
            yearBlocks.push({ year: m[1], startIdx: m.index + m[0].length });
        }

        const processBlock = (blockText: string, grade: string) => {
            const activityTypes = ['자치활동', '동아리활동', '봉사활동', '진로활동'];
            // 활동유형 경계 찾기
            const boundaries: Array<{ type: string; idx: number }> = [];
            for (const actType of activityTypes) {
                const flexPattern = this.markerToFlexPattern(actType);
                const pat = new RegExp(flexPattern, 'g');
                let am: RegExpExecArray | null;
                while ((am = pat.exec(blockText)) !== null) {
                    boundaries.push({ type: actType, idx: am.index + am[0].length });
                }
            }
            boundaries.sort((a, b) => a.idx - b.idx);

            if (boundaries.length > 0) {
                for (let i = 0; i < boundaries.length; i++) {
                    const endIdx = i + 1 < boundaries.length ? boundaries[i + 1].idx - boundaries[i + 1].type.length - 2 : blockText.length;
                    const content = blockText.substring(boundaries[i].idx, endIdx).replace(/^[\s:]+/, '').trim();
                    if (content) {
                        results.push({ grade, activityType: boundaries[i].type, content });
                        this.logger.log(`[CHANGCHE] grade=${grade} ${boundaries[i].type}: ${content.substring(0, 60)}... (${content.length} chars)`);
                    }
                }
            } else {
                // 활동유형이 없으면 전체를 하나로
                const content = blockText.trim();
                if (content) {
                    results.push({ grade, activityType: '자치활동', content });
                    this.logger.log(`[CHANGCHE] grade=${grade} fallback: ${content.substring(0, 60)}... (${content.length} chars)`);
                }
            }
        };

        if (yearBlocks.length > 0) {
            for (let i = 0; i < yearBlocks.length; i++) {
                const endIdx = i + 1 < yearBlocks.length ? yearBlocks[i + 1].startIdx - `[${yearBlocks[i + 1].year}학년]`.length : changcheSection.length;
                const blockText = changcheSection.substring(yearBlocks[i].startIdx, endIdx);
                processBlock(blockText, yearBlocks[i].year);
            }
        } else {
            // 학년 패턴 없으면 전체를 1학년으로 처리
            processBlock(changcheSection, '1');
        }

        return results;
    }

    /**
     * 전체 PDF 텍스트에서 행동특성및종합의견 직접 추출
     */
    private parseHaengtteukFromText(fullText: string): Array<{ grade: string; content: string }> {
        const results: Array<{ grade: string; content: string }> = [];

        // 전체 텍스트에서 '행동특성 및 종합의견' 섹션 추출 (맨 마지막 섹션)
        const haengtteukSection = this.extractSection(fullText, '행동특성', '$');
        if (!haengtteukSection.trim()) {
            this.logger.log('[HAENGTTEUK] section not found in full text');
            return results;
        }
        this.logger.log(`[HAENGTTEUK] found section: ${haengtteukSection.length} chars`);
        this.logger.log(`[HAENGTTEUK] first 200 chars: ${haengtteukSection.substring(0, 200)}`);

        // 학년별로 분리: [N학년] 패턴
        const yearPattern = /\[(\d)학년\]/g;
        const yearStarts: Array<{ pos: number; year: string }> = [];
        let hm: RegExpExecArray | null;
        while ((hm = yearPattern.exec(haengtteukSection)) !== null) {
            yearStarts.push({ pos: hm.index + hm[0].length, year: hm[1] });
        }

        if (yearStarts.length > 0) {
            for (let i = 0; i < yearStarts.length; i++) {
                const endPos = i + 1 < yearStarts.length ? yearStarts[i + 1].pos - `[${yearStarts[i + 1].year}학년]`.length : haengtteukSection.length;
                const content = haengtteukSection.substring(yearStarts[i].pos, endPos).trim();
                if (content) {
                    results.push({ grade: yearStarts[i].year, content });
                    this.logger.log(`[HAENGTTEUK] grade=${yearStarts[i].year}: ${content.substring(0, 60)}... (${content.length} chars)`);
                }
            }
        } else {
            // 학년 패턴이 없으면 전체를 하나로 처리
            const content = haengtteukSection.trim();
            if (content) {
                results.push({ grade: '1', content });
                this.logger.log(`[HAENGTTEUK] single block: ${content.substring(0, 60)}... (${content.length} chars)`);
            }
        }

        return results;
    }

    private async processChunk(chunk: {
        year: string;
        content: Record<string, { '1학기': string; '2학기': string }>;
    }): Promise<Partial<ParsedAcademicRecords> | null> {
        if (!this.openai) {
            throw new Error('OpenAI API가 설정되지 않았습니다. OPENAI_API_KEY를 확인해주세요.');
        }
        const prompt = this.buildPrompt(chunk.year, chunk.content);
        try {
            this.logger.log(`[${chunk.year}] GPT 요청 (성적 데이터만, 세특 제외)`);
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 8192,
                temperature: 0,
                response_format: { type: 'json_object' },
            });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                this.logger.warn(`${chunk.year} 응답 없음`);
                return null;
            }
            try {
                return JSON.parse(content);
            } catch (je) {
                this.logger.error(`${chunk.year} JSON 파싱 오류: ${je}`);
                return null;
            }
        } catch (error) {
            this.logger.error(`${chunk.year} 처리 중 오류: ${error}`);
            return null;
        }
    }

    private buildPrompt(
        year: string,
        content: Record<string, { '1학기': string; '2학기': string }>,
    ): string {
        return `다음 ${year} 생활기록부의 성적 정보를 JSON 형식으로 반환해주세요.

아래는 과목 분류 기준입니다:
1. 일반 과목: 텍스트의 "일반" 섹션에 있는 과목
2. 진로선택 과목: 텍스트의 "진로선택" 섹션에 있는 과목
3. 체육예술 과목: 텍스트의 "체육예술" 섹션에 있는 과목

중요: 세부능력및특기사항, 창의적체험활동, 행동특성은 별도로 처리하므로 포함하지 마세요.

반드시 아래 형식의 JSON으로만 응답해주세요:
{
    "academic_records": {
        "${year}": {
            "1학기": {
                "일반": [{"교과명": "string", "과목명": "string", "단위수": "string", "원점수": "string", "과목평균": "string", "표준편차": "string", "성취도": "string", "수강자수": "string", "석차등급": "string"}],
                "진로선택": [{"교과명": "string", "과목명": "string", "단위수": "string", "원점수": "string", "과목평균": "string", "성취도": "string", "수강자수": "string", "석차등급": "string", "성취도분포비율A": "string", "성취도분포비율B": "string", "성취도분포비율C": "string"}],
                "체육예술": [{"교과명": "string", "과목명": "string", "단위수": "string", "성취도": "string"}]
            },
            "2학기": {"일반": [], "진로선택": [], "체육예술": []}
        }
    }
}

주의사항:
1. 값은 모두 문자열로 반환 (예: 11.2 -> "11.2")
2. 값이 없는 경우 null로 반환
3. 원점수/과목평균(표준편차) 91/75.1(10.2) → 원점수 91, 과목평균 75.1, 표준편차 10.2
4. 성취도(수강자수) A(112) → 성취도 A, 수강자수 112
5. 성취도별분포비율 A(19.6) B(61.6) C(18.8) → 각각 분리
6. 교과명과 과목명에 '\\n'이 포함될 수 있음
7. 교과는 반드시 다음 배열 중 하나: ["국어", "수학", "영어", "사회(역사/도덕포함)", "과학", "기술・가정/제2외국어/한문/교양", "한국사", "체육", "예술", ...]
8. 입력 수와 출력 수는 동일해야 합니다.
9. "성취도"와 "석차등급"은 "P"일 수 있으며 원점수/과목평균/표준편차/수강자수는 존재하지 않을 수 있습니다.

텍스트:
${JSON.stringify(content)}`;
    }

    private mergeResults(
        results: Array<Partial<ParsedAcademicRecords> | null>,
    ): ParsedAcademicRecords {
        const merged: ParsedAcademicRecords = { academic_records: {} };
        for (const result of results) {
            if (!result) continue;

            // 성적 데이터 머지
            if (result.academic_records) {
                for (const [grade, gradeData] of Object.entries(result.academic_records)) {
                    if (!merged.academic_records[grade]) {
                        merged.academic_records[grade] = gradeData;
                    }
                }
            }

            // 창체 데이터 머지
            if (result.creative_activities) {
                if (!merged.creative_activities) merged.creative_activities = {};
                for (const [yearKey, activities] of Object.entries(result.creative_activities)) {
                    if (!merged.creative_activities[yearKey]) {
                        merged.creative_activities[yearKey] = activities;
                    } else {
                        merged.creative_activities[yearKey].push(...activities);
                    }
                }
            }

            // 행특 데이터 머지
            if (result.behavior_opinions) {
                if (!merged.behavior_opinions) merged.behavior_opinions = {};
                for (const [yearKey, content] of Object.entries(result.behavior_opinions)) {
                    if (!merged.behavior_opinions[yearKey]) {
                        merged.behavior_opinions[yearKey] = content;
                    }
                }
            }
        }
        return merged;
    }

    async parseGrades(pdfBuffer: Buffer): Promise<{ aiResult: ParsedAcademicRecords; setukMaps: Map<string, Map<string, string>>; fullText: string }> {
        const text = await this.extractTextFromPdf(pdfBuffer);
        const chunks = this.splitByYear(text);
        this.logger.log(`PDF 파싱 시작: ${chunks.length}개 학년 발견`);
        this.logger.log(`[FULL_TEXT_DEBUG] total length=${text.length}, has changche=${text.includes('창의적') || text.includes('창 의 적')}, has haengtteuk=${text.includes('행동특성') || text.includes('행 동 특 성')}`);

        // GPT로 성적 데이터 파싱 (세특 제외)
        const results = await Promise.all(chunks.map((chunk) => this.processChunk(chunk)));
        const validResults = results.filter((r) => r !== null);
        if (validResults.length === 0) {
            throw new Error('성적 정보 추출 실패');
        }
        this.logger.log(`PDF 파싱 완료: ${validResults.length}개 학년 처리됨`);
        const aiResult = this.mergeResults(validResults);

        // 세특 직접 파싱: 각 학년별로 과목명을 수집하고 세특 텍스트에서 직접 추출
        const setukMaps = new Map<string, Map<string, string>>(); // key: "학년"
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const yearKey = chunk.year.replace('학년', '');
            const gptResult = validResults[i];

            // GPT 결과에서 과목명 수집
            const knownSubjects: string[] = [];
            if (gptResult?.academic_records) {
                for (const yearData of Object.values(gptResult.academic_records)) {
                    for (const semData of Object.values(yearData)) {
                        if (semData.일반) knownSubjects.push(...semData.일반.map(r => r.과목명));
                        if (semData.진로선택) knownSubjects.push(...semData.진로선택.map(r => r.과목명));
                        if (semData.체육예술) knownSubjects.push(...semData.체육예술.map(r => r.과목명));
                    }
                }
            }

            if (chunk.setukRawText && knownSubjects.length > 0) {
                this.logger.log(`[${chunk.year}] 세특 직접 파싱 시작 - ${knownSubjects.length}개 과목`);
                this.logger.log(`[${chunk.year}] 과목 목록: ${JSON.stringify(knownSubjects)}`);
                // 디버그: 세특 rawText 전체를 500자씩 로깅
                const rawLen = chunk.setukRawText.length;
                this.logger.log(`[${chunk.year}] 세특 rawText 길이: ${rawLen}자`);
                for (let ci = 0; ci < Math.min(rawLen, 2000); ci += 500) {
                    this.logger.log(`[${chunk.year}] 세특 rawText[${ci}-${ci + 500}]: ${chunk.setukRawText.substring(ci, ci + 500)}`);
                }
                const setukMap = this.parseSetukFromText(chunk.setukRawText, knownSubjects);
                setukMaps.set(yearKey, setukMap);
                this.logger.log(`[${chunk.year}] 세특 직접 파싱 완료 - ${setukMap.size}개 매핑`);
            } else {
                this.logger.log(`[${chunk.year}] 세특 파싱 스킵: rawText=${!!chunk.setukRawText}, subjects=${knownSubjects.length}`);
            }
        }

        return { aiResult, setukMaps, fullText: text };
    }

    async parse(pdfBuffer: Buffer): Promise<{
        subjectLearnings: Array<{
            grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
            subjectCode: string; subjectName: string; unit: string; rawScore: string;
            subSubjectAverage: string; standardDeviation: string; achievement: string;
            studentsNum: string; ranking: string; etc: string; detailAndSpecialty: string;
        }>;
        selectSubjects: Array<{
            grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
            subjectCode: string; subjectName: string; unit: string; rawScore: string;
            subSubjectAverage: string; achievement: string; studentsNum: string;
            achievementA: string; achievementB: string; achievementC: string; etc: string; detailAndSpecialty: string;
        }>;
        creativeActivities: Array<{ grade: string; activityType: string; content: string }>;
        behaviorOpinions: Array<{ grade: string; content: string }>;
    }> {
        const { aiResult, setukMaps, fullText } = await this.parseGrades(pdfBuffer);
        const legacy = this.convertToLegacyFormat(aiResult, setukMaps);

        // 창체/행특 직접 파싱 (전체 텍스트에서)
        const creativeActivities = this.parseChangcheFromText(fullText);
        const behaviorOpinions = this.parseHaengtteukFromText(fullText);
        this.logger.log(`[DIRECT_PARSE] creative_activities=${creativeActivities.length}, behavior_opinions=${behaviorOpinions.length}`);

        return {
            ...legacy,
            creativeActivities: legacy.creativeActivities.length > 0 ? legacy.creativeActivities : creativeActivities,
            behaviorOpinions: legacy.behaviorOpinions.length > 0 ? legacy.behaviorOpinions : behaviorOpinions,
        };
    }

    private convertToLegacyFormat(aiResult: ParsedAcademicRecords, setukMaps: Map<string, Map<string, string>> = new Map()) {
        const subjectLearnings: Array<{
            grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
            subjectCode: string; subjectName: string; unit: string; rawScore: string;
            subSubjectAverage: string; standardDeviation: string; achievement: string;
            studentsNum: string; ranking: string; etc: string; detailAndSpecialty: string;
        }> = [];
        const selectSubjects: Array<{
            grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
            subjectCode: string; subjectName: string; unit: string; rawScore: string;
            subSubjectAverage: string; achievement: string; studentsNum: string;
            achievementA: string; achievementB: string; achievementC: string; etc: string; detailAndSpecialty: string;
        }> = [];
        const creativeActivities: Array<{ grade: string; activityType: string; content: string }> = [];
        const behaviorOpinions: Array<{ grade: string; content: string }> = [];

        // 세특 매핑 헬퍼: setukMaps에서 학년+과목명으로 세특 내용 검색
        // 세특 텍스트에 학기 구분이 없으므로, 과목명으로만 매칭
        const findSetuk = (grade: string, _semester: string, subjectName: string): string => {
            const yearMap = setukMaps.get(grade);
            if (!yearMap) return '';
            // 정확히 매칭
            if (yearMap.has(subjectName)) return yearMap.get(subjectName)!;
            // 공백 제거 후 매칭 시도
            const normalized = subjectName.replace(/\s+/g, '');
            for (const [k, v] of yearMap.entries()) {
                if (k.replace(/\s+/g, '') === normalized) return v;
            }
            return '';
        };

        for (const [yearKey, yearData] of Object.entries(aiResult.academic_records)) {
            const grade = yearKey.replace('학년', '');
            for (const [semesterKey, semesterData] of Object.entries(yearData)) {
                const semester = semesterKey.replace('학기', '');

                if (semesterData.일반) {
                    for (const record of semesterData.일반) {
                        const mainSubjectName = record.교과명 || '';
                        const subjectName = record.과목명 || '';
                        subjectLearnings.push({
                            grade, semester,
                            mainSubjectCode: getMainSubjectCode(mainSubjectName), mainSubjectName,
                            subjectCode: getSubjectCode(subjectName), subjectName,
                            unit: record.단위수 || '', rawScore: record.원점수 || '',
                            subSubjectAverage: record.과목평균 || '', standardDeviation: record.표준편차 || '',
                            achievement: record.성취도 || '', studentsNum: record.수강자수 || '',
                            ranking: record.석차등급 || '', etc: '',
                            detailAndSpecialty: findSetuk(grade, semester, subjectName),
                        });
                    }
                }

                if (semesterData.체육예술) {
                    for (const record of semesterData.체육예술) {
                        const mainSubjectName = record.교과명 || '';
                        const subjectName = record.과목명 || '';
                        subjectLearnings.push({
                            grade, semester,
                            mainSubjectCode: getMainSubjectCode(mainSubjectName), mainSubjectName,
                            subjectCode: getSubjectCode(subjectName), subjectName,
                            unit: record.단위수 || '', rawScore: '', subSubjectAverage: '',
                            standardDeviation: '', achievement: record.성취도 || 'P',
                            studentsNum: '', ranking: '', etc: '',
                            detailAndSpecialty: findSetuk(grade, semester, subjectName),
                        });
                    }
                }

                if (semesterData.진로선택) {
                    for (const record of semesterData.진로선택) {
                        const mainSubjectName = record.교과명 || '';
                        const subjectName = record.과목명 || '';
                        selectSubjects.push({
                            grade, semester,
                            mainSubjectCode: getMainSubjectCode(mainSubjectName), mainSubjectName,
                            subjectCode: getSubjectCode(subjectName), subjectName,
                            unit: record.단위수 || '', rawScore: record.원점수 || '',
                            subSubjectAverage: record.과목평균 || '', achievement: record.성취도 || '',
                            studentsNum: record.수강자수 || '',
                            achievementA: record.성취도분포비율A || '',
                            achievementB: record.성취도분포비율B || '',
                            achievementC: record.성취도분포비율C || '', etc: '',
                            detailAndSpecialty: findSetuk(grade, semester, subjectName),
                        });
                    }
                }
            }
        }

        // 창체 파싱
        if (aiResult.creative_activities) {
            for (const [yearKey, activities] of Object.entries(aiResult.creative_activities)) {
                const grade = yearKey.replace('학년', '');
                for (const activity of activities) {
                    creativeActivities.push({
                        grade,
                        activityType: activity.활동유형 || '',
                        content: activity.특기사항 || '',
                    });
                }
            }
        }

        // 행특 파싱
        if (aiResult.behavior_opinions) {
            for (const [yearKey, content] of Object.entries(aiResult.behavior_opinions)) {
                const grade = yearKey.replace('학년', '');
                if (content) {
                    behaviorOpinions.push({ grade, content });
                }
            }
        }

        return { subjectLearnings, selectSubjects, creativeActivities, behaviorOpinions };
    }
}
