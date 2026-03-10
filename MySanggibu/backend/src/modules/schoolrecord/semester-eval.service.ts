/**
 * Semester Evaluation Service — 학기별 세특 평가 (7등급)
 * 
 * 학기별 세특 텍스트를 분석하여 7등급 소재를 추출합니다.
 * - 학기 단위: 세특만 분석
 * - 종합 단위: 세특 + 창체 + 행특 분석 + 점수 합산 + 조언
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

// ==================== Types ====================

export type CompetencyCategory = 'academic' | 'career' | 'community' | 'other';

export interface EvalMaterialSource {
    type: 'subject' | 'creative' | 'behavior';
    grade: string;
    semester?: string;
    subjectName?: string;
    activityType?: string;
    originalText: string;
}

/** 7등급 소재 */
export interface EvalMaterialItem {
    title: string;
    summary: string;
    category: CompetencyCategory;
    gradeLevel: number;      // 1~7등급 (1=최우수)
    score: number;            // 7~1점 (8-gradeLevel)
    sources: EvalMaterialSource[];
    relatedKeywords: string[]; // 학기 간 연결용 키워드
}

/** 학기별 세특 평가 결과 */
export interface SemesterEvalResult {
    grade: string;
    semester: string;
    materials: EvalMaterialItem[];
    scores: {
        academic: number;
        career: number;
        community: number;
        other: number;
    };
    summary: string;
    analysisDate: string;
}

/** 종합 평가 결과 (1년치) */
export interface ComprehensiveEvalResult {
    grade: string;
    materials: EvalMaterialItem[];
    scores: {
        academic: number;
        career: number;
        community: number;
        other: number;
    };
    totalScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    advice: string[];          // 다음 학기 조언
    annotations: Array<{      // 주석
        category: CompetencyCategory;
        comment: string;
    }>;
    analysisDate: string;
}

// ==================== Request DTOs ====================

export interface SemesterEvalRequestDto {
    grade: string;
    semester: string;
    subjectTexts: Array<{ subjectName: string; text: string }>;
}

export interface ComprehensiveEvalRequestDto {
    grade: string;
    subjectTexts: Array<{ semester: string; subjectName: string; text: string }>;
    creativeTexts: Array<{ activityType: string; text: string }>;
    behaviorTexts: Array<{ text: string }>;
}

// ==================== Service ====================

@Injectable()
export class SemesterEvalService {
    private readonly logger = new Logger(SemesterEvalService.name);
    private openai: OpenAI | null = null;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
        }
    }

    // ── 학기별 세특 평가 ──

    private buildSemesterPrompt(dto: SemesterEvalRequestDto): string {
        let inputData = '';
        dto.subjectTexts.forEach((s, i) => {
            inputData += `[${i}] ${dto.grade}학년 ${dto.semester}학기 / ${s.subjectName}\n${s.text}\n\n`;
        });

        return `당신은 대한민국 대학 입학 사정관 관점에서 학생의 세부능력 및 특기사항(세특)을 평가하는 전문가입니다.

아래의 ${dto.grade}학년 ${dto.semester}학기 세특 데이터를 분석하여, 핵심 소재를 7등급으로 평가해주세요.

## 7등급 평가 기준
- 1등급(7점): 독보적·차별화된 핵심 소재, 심층적 탐구와 성과
- 2등급(6점): 매우 강한 어필 포인트, 전공 적합성 높음
- 3등급(5점): 강한 어필 포인트, 꾸준한 노력 드러남
- 4등급(4점): 평균 이상, 의미 있는 활동
- 5등급(3점): 보통 수준, 일반적 활동
- 6등급(2점): 약한 소재, 구체성 부족
- 7등급(1점): 형식적·일반적 기술

## 4대 역량 카테고리
- academic: 학업역량 (교과 학습, 탐구, 연구, 실험)
- career: 진로역량 (진로 탐색, 전공 적합성)
- community: 공동체역량 (리더십, 협업, 봉사, 소통)
- other: 기타역량 (창의성, 자기주도성, 독서, 도전)

## 세특 데이터
${inputData}

## 출력 형식 (반드시 JSON으로만 응답)
{
  "materials": [
    {
      "title": "소재 제목",
      "summary": "1-2줄 요약 설명",
      "category": "academic|career|community|other",
      "gradeLevel": 1~7,
      "relatedKeywords": ["키워드1", "키워드2"],
      "sourceIndices": [0, 2]
    }
  ],
  "summary": "이 학기 세특의 전체 한줄 특징 요약"
}

## 주의사항
1. 소재는 3~10개 추출
2. sourceIndices는 위 데이터의 [번호]
3. 각 카테고리 최소 1개 소재
4. relatedKeywords는 학기 간 연결에 사용됨 (예: "리더십", "데이터분석", "환경")`;
    }

    async evaluateSemester(dto: SemesterEvalRequestDto): Promise<SemesterEvalResult> {
        if (!this.openai) {
            throw new Error('OpenAI API key not configured');
        }

        if (dto.subjectTexts.length === 0) {
            throw new Error('세특 데이터가 없습니다.');
        }

        this.logger.log(`[SemesterEval] ${dto.grade}학년 ${dto.semester}학기 분석 시작 (${dto.subjectTexts.length}개 과목)`);

        const prompt = this.buildSemesterPrompt(dto);

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('AI 응답이 비어있습니다.');

        const parsed = JSON.parse(content);

        // sourceIndices → EvalMaterialSource[] 변환
        const materials: EvalMaterialItem[] = (parsed.materials || []).map((m: any) => ({
            title: m.title,
            summary: m.summary,
            category: m.category as CompetencyCategory,
            gradeLevel: Math.max(1, Math.min(7, m.gradeLevel || 4)),
            score: 8 - Math.max(1, Math.min(7, m.gradeLevel || 4)),
            relatedKeywords: m.relatedKeywords || [],
            sources: (m.sourceIndices || []).map((idx: number) => {
                const src = dto.subjectTexts[idx];
                if (!src) return null;
                return {
                    type: 'subject' as const,
                    grade: dto.grade,
                    semester: dto.semester,
                    subjectName: src.subjectName,
                    originalText: src.text,
                };
            }).filter(Boolean),
        }));

        // 영역별 점수 합산
        const scores = { academic: 0, career: 0, community: 0, other: 0 };
        materials.forEach(m => {
            scores[m.category] += m.score;
        });

        return {
            grade: dto.grade,
            semester: dto.semester,
            materials,
            scores,
            summary: parsed.summary || '',
            analysisDate: new Date().toISOString(),
        };
    }

    // ── 종합 평가 (세특 + 창체 + 행특) ──

    private buildComprehensivePrompt(dto: ComprehensiveEvalRequestDto): string {
        let inputData = '';
        let idx = 0;

        if (dto.subjectTexts.length > 0) {
            inputData += '=== 세부능력 및 특기사항 (세특) ===\n';
            for (const s of dto.subjectTexts) {
                inputData += `[${idx}] ${dto.grade}학년 ${s.semester}학기 / ${s.subjectName}\n${s.text}\n\n`;
                idx++;
            }
        }

        if (dto.creativeTexts.length > 0) {
            inputData += '=== 창의적 체험활동 (창체) ===\n';
            for (const c of dto.creativeTexts) {
                inputData += `[${idx}] ${dto.grade}학년 / ${c.activityType}\n${c.text}\n\n`;
                idx++;
            }
        }

        if (dto.behaviorTexts.length > 0) {
            inputData += '=== 행동특성 및 종합의견 (행특) ===\n';
            for (const b of dto.behaviorTexts) {
                inputData += `[${idx}] ${dto.grade}학년\n${b.text}\n\n`;
                idx++;
            }
        }

        return `당신은 대한민국 대학 입학 사정관 관점에서 학생의 생기부를 종합 평가하는 전문가입니다.

아래의 ${dto.grade}학년 전체(세특 + 창체 + 행특) 데이터를 종합 분석하여:
1. 핵심 소재를 7등급으로 평가
2. 4대 역량별 점수와 주석(코멘트)
3. 강점/약점/다음 학기 조언을 제공해주세요.

## 7등급 평가 기준
- 1등급(7점): 독보적·차별화된 핵심 소재, 심층적 탐구와 성과
- 2등급(6점): 매우 강한 어필 포인트, 전공 적합성 높음
- 3등급(5점): 강한 어필 포인트, 꾸준한 노력 드러남
- 4등급(4점): 평균 이상, 의미 있는 활동
- 5등급(3점): 보통 수준, 일반적 활동
- 6등급(2점): 약한 소재, 구체성 부족
- 7등급(1점): 형식적·일반적 기술

## 4대 역량 카테고리
- academic: 학업역량 (교과 학습, 탐구, 연구, 실험)
- career: 진로역량 (진로 탐색, 전공 적합성)
- community: 공동체역량 (리더십, 협업, 봉사, 소통)
- other: 기타역량 (창의성, 자기주도성, 독서, 도전)

## 분석 대상 데이터
${inputData}

## 출력 형식 (반드시 JSON으로만 응답)
{
  "materials": [
    {
      "title": "소재 제목",
      "summary": "1-2줄 요약",
      "category": "academic|career|community|other",
      "gradeLevel": 1~7,
      "relatedKeywords": ["키워드1", "키워드2"],
      "sourceIndices": [0, 3, 5],
      "sourceType": "subject|creative|behavior"
    }
  ],
  "summary": "종합 생기부 한줄 평가",
  "strengths": ["강점1", "강점2"],
  "weaknesses": ["약점1", "약점2"],
  "advice": ["다음 학기 조언1", "조언2", "조언3"],
  "annotations": [
    { "category": "academic", "comment": "학업역량에 대한 종합 평가 코멘트" },
    { "category": "career", "comment": "진로역량에 대한 종합 평가 코멘트" },
    { "category": "community", "comment": "공동체역량에 대한 종합 평가 코멘트" },
    { "category": "other", "comment": "기타역량에 대한 종합 평가 코멘트" }
  ]
}

## 주의사항
1. 소재는 5~15개 추출 (세특, 창체, 행특을 모두 포함)
2. sourceIndices는 위 데이터의 [번호]
3. 각 카테고리 최소 1개 소재
4. annotations는 4대 역량 각각에 대한 종합 평가 주석
5. advice는 학생이 다음 학기에 어떤 활동/노력을 해야하는지 구체적 조언
6. relatedKeywords는 학기 간 연결에 사용됨`;
    }

    async evaluateComprehensive(dto: ComprehensiveEvalRequestDto): Promise<ComprehensiveEvalResult> {
        if (!this.openai) {
            throw new Error('OpenAI API key not configured');
        }

        const totalTexts = dto.subjectTexts.length + dto.creativeTexts.length + dto.behaviorTexts.length;
        if (totalTexts === 0) {
            throw new Error('분석할 데이터가 없습니다.');
        }

        this.logger.log(`[ComprehensiveEval] ${dto.grade}학년 종합 분석 시작 (세특:${dto.subjectTexts.length}, 창체:${dto.creativeTexts.length}, 행특:${dto.behaviorTexts.length})`);

        const prompt = this.buildComprehensivePrompt(dto);

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('AI 응답이 비어있습니다.');

        const parsed = JSON.parse(content);

        // 원문 인덱스 매핑용 배열 구성
        const allSources: EvalMaterialSource[] = [];
        for (const s of dto.subjectTexts) {
            allSources.push({ type: 'subject', grade: dto.grade, semester: s.semester, subjectName: s.subjectName, originalText: s.text });
        }
        for (const c of dto.creativeTexts) {
            allSources.push({ type: 'creative', grade: dto.grade, activityType: c.activityType, originalText: c.text });
        }
        for (const b of dto.behaviorTexts) {
            allSources.push({ type: 'behavior', grade: dto.grade, originalText: b.text });
        }

        const materials: EvalMaterialItem[] = (parsed.materials || []).map((m: any) => ({
            title: m.title,
            summary: m.summary,
            category: m.category as CompetencyCategory,
            gradeLevel: Math.max(1, Math.min(7, m.gradeLevel || 4)),
            score: 8 - Math.max(1, Math.min(7, m.gradeLevel || 4)),
            relatedKeywords: m.relatedKeywords || [],
            sources: (m.sourceIndices || []).map((idx: number) => allSources[idx]).filter(Boolean),
        }));

        const scores = { academic: 0, career: 0, community: 0, other: 0 };
        materials.forEach(m => { scores[m.category] += m.score; });

        const totalScore = scores.academic + scores.career + scores.community + scores.other;

        return {
            grade: dto.grade,
            materials,
            scores,
            totalScore,
            summary: parsed.summary || '',
            strengths: parsed.strengths || [],
            weaknesses: parsed.weaknesses || [],
            advice: parsed.advice || [],
            annotations: (parsed.annotations || []).map((a: any) => ({
                category: a.category as CompetencyCategory,
                comment: a.comment,
            })),
            analysisDate: new Date().toISOString(),
        };
    }
}
