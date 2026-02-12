/**
 * School Record HTML Parser Service
 *
 * NEIS HTML 형식 학생부 파싱 서비스
 * cheerio를 사용하여 HTML을 파싱
 */

import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import {
    SubjectCodeMapping,
    ParsedSubjectLearning,
    ParsedSelectSubject,
    ParsedVolunteer,
    ParsedCreativeActivity,
    ParsedBehaviorOpinion,
    ParsedSchoolRecord,
    DEFAULT_MAIN_SUBJECT_CODE,
    DEFAULT_SUBJECT_CODE_LEARNING,
    DEFAULT_SUBJECT_CODE_SELECT,
} from './schoolrecord-parser.types';

@Injectable()
export class SchoolRecordHtmlParserService {
    private readonly logger = new Logger(SchoolRecordHtmlParserService.name);

    /**
     * HTML에서 모든 학생부 데이터 파싱
     */
    parseAll(
        htmlContent: string,
        subjectCodeMappings: SubjectCodeMapping[] = [],
    ): ParsedSchoolRecord {
        try {
            const $ = cheerio.load(htmlContent);
            const { mainMappingTable, mappingTable } = this.buildMappingTables(subjectCodeMappings);

            const subjectLearnings = this.parseSubjectLearning($, mainMappingTable, mappingTable);
            const selectSubjects = this.parseSelectSubject($, mainMappingTable, mappingTable);
            const volunteers = this.parseVolunteer($);
            const creativeActivities = this.parseCreativeActivities($);
            const behaviorOpinions = this.parseBehaviorOpinions($);

            return { subjectLearnings, selectSubjects, volunteers, creativeActivities, behaviorOpinions };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error('HTML 파싱 오류:', error);
            throw new Error(`나이스 홈페이지에서 다운받은 HTML 양식으로 업로드해주세요. ${message}`);
        }
    }

    /**
     * 과목 코드 매핑 테이블 생성
     */
    private buildMappingTables(subjectCodeMappings: SubjectCodeMapping[]): {
        mainMappingTable: Map<string, string>;
        mappingTable: Map<string, string>;
    } {
        const mainMappingTable = new Map<string, string>();
        const mappingTable = new Map<string, string>();

        for (const item of subjectCodeMappings) {
            const mainKey = item.mainSubjectName.replace(/\s/g, '');
            mainMappingTable.set(mainKey, item.mainSubjectCode.trim());

            const subKey = item.subjectName.replace(/\s/g, '');
            mappingTable.set(subKey, item.subjectCode.trim());
        }

        return { mainMappingTable, mappingTable };
    }

    private findDetailAndSpecialtyMap($: cheerio.CheerioAPI): Map<string, string> {
        const map = new Map<string, string>();

        $('table').each((_, table) => {
            const headers = $(table).find('thead th').map((_, th) => $(th).text().trim()).get();
            // "과목" 및 "세부능력 및 특기사항" 헤더가 있는지 확인
            const hasSubject = headers.some(h => h.includes('과목'));
            const hasDetail = headers.some(h => h.includes('세부능력') && h.includes('특기사항'));

            if (hasSubject && hasDetail) {
                // 이 테이블은 세특 테이블임
                // 학년/학기 정보를 찾아야 함. 보통 테이블 근처나 상위 div id에서 유추...하거나
                // 단순히 과목명으로 매핑 시도. 하지만 학년/학기는 필수임.
                // NEIS HTML 구조상 세특 테이블이 학년별로 분리되어 있는지, 통으로 있는지 확인 필요.
                // 보통 학년별 테이블이 분리됨.
                // 상위 div id 확인: pr_id_... 

                const parentId = $(table).closest('div[id^="pr_id_"]').attr('id');
                // ID로 학년 유추는 `possibleIds`와 매핑해야하므로 복잡.
                // 대신, 행별로 파싱하면서 매핑에 추가. 키: "과목명" (동일 과목명이 학년/학기 다를 수 있음 -> 문제)
                // 따라서, Context 검색 필요.

                // 간단히: 현재 파싱 중인 grade loop 내에서 호출하는 것이 나음?
                // 아니면 여기서 모든 세특을 긁어모으되, "학기" 컬럼이 있으면 사용.
                // 세특 테이블 컬럼: [학기, 과목, 세부능력 및 특기사항] 인 경우가 많음.

                const hasSemester = headers.some(h => h.includes('학기'));

                $(table).find('tbody tr').each((__, tr) => {
                    const tds = $(tr).children('td');
                    if (tds.length < 2) return;

                    let semester = '';
                    let subjectName = '';
                    let content = '';

                    if (hasSemester && tds.length >= 3) {
                        semester = $(tds.get(0)).text().trim();
                        subjectName = $(tds.get(1)).text().trim().replace(/\s/g, '');
                        content = $(tds.get(2)).text().trim();
                    } else {
                        // 학기가 없으면... 순서대로? 혹은 이전 로직 의존?
                        // 대부분의 NEIS HTML 세특 테이블은 [학기, 과목, 내용] 또는 [과목, 내용] (학기 정보 상위 표시)
                        subjectName = $(tds.get(0)).text().trim().replace(/\s/g, '');
                        content = $(tds.get(1)).text().trim();
                    }

                    if (subjectName && content) {
                        // 키 생성: 과목명 (학기 정보가 없으면 중복 문제 발생 가능하나, 우선 과목명으로 매핑)
                        // 학기가 있으면: `${semester}-${subjectName}`
                        const key = semester ? `${semester}-${subjectName}` : subjectName;
                        // 이미 있으면 이어붙이기 (혹시 1학기, 2학기 나눠진 경우)
                        if (map.has(key)) {
                            map.set(key, map.get(key) + '\n' + content);
                        } else {
                            map.set(key, content);
                        }
                    }
                });
            }
        });

        return map;
    }

    /**
     * 교과학습발달상황 (일반교과목) 파싱
     */
    private parseSubjectLearning(
        $: cheerio.CheerioAPI,
        mainMappingTable: Map<string, string>,
        mappingTable: Map<string, string>,
    ): ParsedSubjectLearning[] {
        const result: ParsedSubjectLearning[] = [];

        // 세특 매핑 맵 생성 (전역 검색)
        // 주의: 학년별 루프 안에서 돌리면 더 정확할 수 있지만, findDetailAndSpecialtyMap은 전체를 훑음.
        // 여기서는 간단히 전체 훑은 맵을 사용하되, 키 매칭을 최대한 시도.
        const detailMap = this.findDetailAndSpecialtyMap($);

        // 가능한 요소 ID 목록 시도
        const possibleIds = [
            ['pr_id_17', 'pr_id_21', 'pr_id_25'],
            ['pr_id_43', 'pr_id_47', 'pr_id_51'],
            ['pr_id_69', 'pr_id_73', 'pr_id_77'],
        ];

        let idList: string[] = [];
        for (const ids of possibleIds) {
            if ($(`#${ids[0]}`).length > 0) {
                idList = ids;
                break;
            }
        }

        if (idList.length === 0) {
            this.logger.warn('교과학습발달상황 테이블을 찾을 수 없습니다');
            return result;
        }

        let grade = 1;
        for (const id of idList) {
            const div = $(`#${id}`);
            const tbody = div.find('tbody');

            tbody.find('tr').each((_, tr) => {
                const tds = $(tr).children('td');

                tds.each((__, td) => {
                    const children = $(td).children();
                    const semester = $(children.get(0)).text().trim();

                    if (!semester) return;

                    const mainSubjectNameRaw = $(children.get(1)).text().trim();
                    const mainSubjectName = mainSubjectNameRaw.replace(/\s/g, '');
                    const mainSubjectCode =
                        mainMappingTable.get(mainSubjectName) || DEFAULT_MAIN_SUBJECT_CODE;

                    const subjectNameRaw = $(children.get(2)).text().trim();
                    const subjectName = subjectNameRaw.replace(/\s/g, '');
                    const subjectCode = mappingTable.get(subjectName) || DEFAULT_SUBJECT_CODE_LEARNING;

                    const unit = $(children.get(3)).text().trim();

                    // 원점수/과목평균(표준편차) 형식 파싱: 65/66.6(18.1)
                    const scoreText = $(children.get(4)).text().trim();
                    let rawScore = '';
                    let subSubjectAverage = '';
                    let standardDeviation = '';

                    if (scoreText) {
                        const parts = scoreText.split('/');
                        if (parts.length >= 2) {
                            rawScore = parts[0];
                            const avgParts = parts[1].split('(');
                            subSubjectAverage = avgParts[0];
                            if (avgParts.length >= 2) {
                                standardDeviation = avgParts[1].replace(')', '');
                            }
                        }
                    }

                    // 성취도(수강자수) 형식 파싱: B(324) 또는 P
                    const achievementText = $(children.get(5)).text().trim();
                    let achievement = 'P';
                    let studentsNum = '';

                    if (achievementText !== 'P') {
                        const achParts = achievementText.split('(');
                        achievement = achParts[0];
                        if (achParts.length >= 2) {
                            studentsNum = achParts[1].replace(')', '');
                        }
                    }

                    const ranking = $(children.get(6)).text().trim();
                    const etc = $(children.get(7)).text().trim();

                    // 세특 매핑
                    // 1. `${semester}-${subjectName}` 
                    // 2. `subjectName` (학기 정보 없는 경우 대비)
                    const detailAndSpecialty = detailMap.get(`${semester}-${subjectName}`) || detailMap.get(subjectName);

                    result.push({
                        grade: String(grade),
                        semester,
                        mainSubjectCode,
                        mainSubjectName,
                        subjectCode,
                        subjectName,
                        unit,
                        rawScore,
                        subSubjectAverage,
                        standardDeviation,
                        achievement,
                        studentsNum,
                        ranking,
                        etc,
                        detailAndSpecialty, // 추가됨
                    });
                });
            });

            grade++;
        }

        return result;
    }

    /**
     * 진로선택과목 파싱
     */
    private parseSelectSubject(
        $: cheerio.CheerioAPI,
        mainMappingTable: Map<string, string>,
        mappingTable: Map<string, string>,
    ): ParsedSelectSubject[] {
        const result: ParsedSelectSubject[] = [];

        const detailMap = this.findDetailAndSpecialtyMap($);

        // 가능한 요소 ID 목록 시도
        const possibleIds = [
            ['pr_id_31', 'pr_id_33', 'pr_id_35'],
            ['pr_id_57', 'pr_id_59', 'pr_id_61'],
            ['pr_id_83', 'pr_id_85', 'pr_id_87'],
        ];

        let idList: string[] = [];
        for (const ids of possibleIds) {
            if ($(`#${ids[0]}`).length > 0) {
                idList = ids;
                break;
            }
        }

        if (idList.length === 0) {
            this.logger.warn('진로선택과목 테이블을 찾을 수 없습니다');
            return result;
        }

        let grade = 1;
        for (const id of idList) {
            const div = $(`#${id}`);
            const tbody = div.find('tbody');

            tbody.find('tr').each((_, tr) => {
                const tds = $(tr).children('td');

                tds.each((__, td) => {
                    const children = $(td).children();
                    const semester = $(children.get(0)).text().trim();

                    if (!semester) return;

                    const mainSubjectNameRaw = $(children.get(1)).text().trim();
                    const mainSubjectName = mainSubjectNameRaw.replace(/\s/g, '');
                    const mainSubjectCode =
                        mainMappingTable.get(mainSubjectName) || DEFAULT_MAIN_SUBJECT_CODE;

                    const subjectNameRaw = $(children.get(2)).text().trim();
                    const subjectName = subjectNameRaw.replace(/\s/g, '');
                    const subjectCode = mappingTable.get(subjectName) || DEFAULT_SUBJECT_CODE_SELECT;

                    const unit = $(children.get(3)).text().trim();

                    // 원점수/과목평균 형식 파싱: 65/66.6
                    const scoreText = $(children.get(4)).text().trim();
                    let rawScore = '';
                    let subSubjectAverage = '';

                    if (scoreText) {
                        const parts = scoreText.split('/');
                        if (parts.length >= 2) {
                            rawScore = parts[0];
                            subSubjectAverage = parts[1];
                        }
                    }

                    // 성취도(수강자수) 형식 파싱: B(324)
                    const achievementText = $(children.get(5)).text().trim();
                    const achParts = achievementText.split('(');
                    const achievement = achParts[0];
                    const studentsNum = achParts.length >= 2 ? achParts[1].replace(')', '') : '';

                    // 성취도별 분포비율 형식 파싱: A(24.1) B(44.9) C(31.0)
                    const distributionText = $(children.get(6)).text().trim();
                    const distributionParts = distributionText.split(' ');

                    let achievementA = '';
                    let achievementB = '';
                    let achievementC = '';

                    if (distributionParts.length >= 3) {
                        achievementA = this.extractPercentage(distributionParts[0]);
                        achievementB = this.extractPercentage(distributionParts[1]);
                        achievementC = this.extractPercentage(distributionParts[2]);
                    }

                    const etc = $(children.get(7)).text().trim();

                    const detailAndSpecialty = detailMap.get(`${semester}-${subjectName}`) || detailMap.get(subjectName);

                    result.push({
                        grade: String(grade),
                        semester,
                        mainSubjectCode,
                        mainSubjectName,
                        subjectCode,
                        subjectName,
                        unit,
                        rawScore,
                        subSubjectAverage,
                        achievement,
                        studentsNum,
                        achievementA,
                        achievementB,
                        achievementC,
                        etc,
                        detailAndSpecialty, // 추가됨
                    });
                });
            });

            grade++;
        }

        return result;
    }

    /**
     * 봉사활동실적 파싱
     */
    private parseVolunteer($: cheerio.CheerioAPI): ParsedVolunteer[] {
        const result: ParsedVolunteer[] = [];

        // 가능한 요소 ID 목록 시도
        const possibleIds = ['pr_id_16', 'pr_id_42', 'pr_id_68'];
        let div: ReturnType<cheerio.CheerioAPI> | null = null;

        for (const id of possibleIds) {
            const element = $(`#${id}`);
            if (element.length > 0) {
                div = element;
                break;
            }
        }

        if (!div) {
            this.logger.warn('봉사활동실적 테이블을 찾을 수 없습니다');
            return result;
        }

        const tbody = div.find('tbody');
        let currentGrade = '';

        tbody.find('tr').each((_, tr) => {
            const tds = $(tr).children('td');

            tds.each((__, td) => {
                const children = $(td).children();
                const childCount = children.length;

                if (childCount === 6) {
                    currentGrade = $(children.get(0)).text().trim();
                    const date = $(children.get(1)).text().trim();
                    const place = $(children.get(2)).text().trim();
                    const activityContent = $(children.get(3)).text().trim();
                    const activityTime = $(children.get(4)).text().trim();
                    const accumulateTime = $(children.get(5)).text().trim();

                    result.push({
                        grade: currentGrade,
                        date,
                        place,
                        activityContent,
                        activityTime,
                        accumulateTime,
                    });
                } else if (childCount === 5) {
                    const date = $(children.get(0)).text().trim();
                    const place = $(children.get(1)).text().trim();
                    const activityContent = $(children.get(2)).text().trim();
                    const activityTime = $(children.get(3)).text().trim();
                    const accumulateTime = $(children.get(4)).text().trim();

                    result.push({
                        grade: currentGrade,
                        date,
                        place,
                        activityContent,
                        activityTime,
                        accumulateTime,
                    });
                }
            });
        });

        return result;
    }

    /**
     * "A(24.1)" 형식에서 백분율 추출
     */
    private extractPercentage(text: string): string {
        const match = text.match(/\(([^)]+)\)/);
        return match ? match[1] : '';
    }

    /**
     * 창의적 체험활동상황 파싱
     * NEIS HTML 테이블에서 "창의적 체험활동상황" 섹션을 찾아
     * 학년, 활동유형(자치활동/동아리활동/봉사활동/진로활동), 특기사항을 파싱
     */
    private parseCreativeActivities($: cheerio.CheerioAPI): ParsedCreativeActivity[] {
        const result: ParsedCreativeActivity[] = [];

        $('table').each((_, table) => {
            const caption = $(table).find('caption').text().trim();
            const headerText = $(table).find('thead').text().trim();
            const fullText = caption + ' ' + headerText;

            // "창의적 체험활동상황" 테이블 식별
            if (!fullText.includes('창의적') && !fullText.includes('체험활동')) {
                return; // continue
            }

            const headers = $(table).find('thead th').map((_, th) => $(th).text().trim()).get();
            // 활동 유형과 특기사항 컬럼 인덱스 찾기
            const hasActivityType = headers.some(h => h.includes('영역') || h.includes('활동'));
            const hasContent = headers.some(h => h.includes('특기사항') || h.includes('내용'));

            if (!hasActivityType && !hasContent) return;

            let currentGrade = '';

            $(table).find('tbody tr').each((__, tr) => {
                const tds = $(tr).children('td');
                if (tds.length < 2) return;

                // 학년이 포함된 경우 (보통 rowspan으로 학년이 첫 번째 컬럼)
                const cells = tds.map((___, td) => $(td).text().trim()).get();

                if (tds.length >= 3) {
                    // [학년, 활동유형, 특기사항]
                    const gradeText = cells[0];
                    if (/^\d$/.test(gradeText)) {
                        currentGrade = gradeText;
                    }
                    const activityType = cells[cells.length - 2] || '';
                    const content = cells[cells.length - 1] || '';

                    if (content) {
                        result.push({
                            grade: currentGrade || gradeText,
                            activityType: activityType.replace(/\s/g, ''),
                            content,
                        });
                    }
                } else if (tds.length === 2) {
                    // [활동유형, 특기사항] (학년은 이전 행에서 rowspan으로)
                    const activityType = cells[0] || '';
                    const content = cells[1] || '';

                    if (content) {
                        result.push({
                            grade: currentGrade,
                            activityType: activityType.replace(/\s/g, ''),
                            content,
                        });
                    }
                }
            });
        });

        return result;
    }

    /**
     * 행동특성 및 종합의견 파싱
     * NEIS HTML에서 "행동특성 및 종합의견" 섹션을 찾아 학년별 내용을 파싱
     */
    private parseBehaviorOpinions($: cheerio.CheerioAPI): ParsedBehaviorOpinion[] {
        const result: ParsedBehaviorOpinion[] = [];

        $('table').each((_, table) => {
            const caption = $(table).find('caption').text().trim();
            const headerText = $(table).find('thead').text().trim();
            const fullText = caption + ' ' + headerText;

            // "행동특성 및 종합의견" 테이블 식별
            if (!fullText.includes('행동특성') && !fullText.includes('종합의견')) {
                return; // continue
            }

            $(table).find('tbody tr').each((__, tr) => {
                const tds = $(tr).children('td');
                if (tds.length < 2) return;

                const cells = tds.map((___, td) => $(td).text().trim()).get();

                // [학년, 내용] 형태
                const grade = cells[0] || '';
                const content = cells[cells.length - 1] || '';

                if (/^\d$/.test(grade) && content) {
                    result.push({ grade, content });
                }
            });
        });

        return result;
    }
}
