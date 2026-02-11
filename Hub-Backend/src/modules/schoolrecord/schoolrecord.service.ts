import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolRecordAttendanceDetailEntity } from 'src/database/entities/schoolrecord/schoolrecord-attendance-detail.entity';
import { SchoolRecordSelectSubjectEntity } from 'src/database/entities/schoolrecord/schoolrecord-select-subject.entity';
import { SchoolRecordSubjectLearningEntity } from 'src/database/entities/schoolrecord/schoolrecord-subject-learning.entity';
import { SchoolRecordVolunteerEntity } from 'src/database/entities/schoolrecord/schoolrecord-volunteer.entity';
import { DataSource, EntityManager, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { SchoolrecordSportsArtEntity } from 'src/database/entities/schoolrecord/schoolrecord-sport-art.entity';
import { MemberEntity } from 'src/database/entities/member/member.entity';

@Injectable()
export class SchoolRecordService {
    private readonly logger = new Logger(SchoolRecordService.name);
    constructor(
        @InjectRepository(SchoolRecordAttendanceDetailEntity)
        private attendanceRepository: Repository<SchoolRecordAttendanceDetailEntity>,
        @InjectRepository(SchoolRecordSelectSubjectEntity)
        private selectSubjectRepository: Repository<SchoolRecordSelectSubjectEntity>,
        @InjectRepository(SchoolRecordSubjectLearningEntity)
        private subjectLearningRepository: Repository<SchoolRecordSubjectLearningEntity>,
        @InjectRepository(SchoolRecordVolunteerEntity)
        private volunteerRepository: Repository<SchoolRecordVolunteerEntity>,
        @InjectRepository(SchoolrecordSportsArtEntity)
        private sportArtRepository: Repository<SchoolrecordSportsArtEntity>,
        @InjectRepository(MemberEntity)
        private memberRepository: Repository<MemberEntity>,
        private readonly dataSource: DataSource,
    ) { }

    /**
     * 멤버의 전체 생기부 데이터 조회
     */
    async getSchoolRecord(memberId: string) {
        const member = await this.memberRepository.findOne({
            where: { id: memberId },
        });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다. (id: ${memberId})`);
        }

        const [subjectLearnings, selectSubjects, attendanceDetails, volunteers, sportArts] =
            await Promise.all([
                this.getSubjectLearnings(memberId),
                this.getSelectSubjects(memberId),
                this.getAttendanceDetails(memberId),
                this.getVolunteers(memberId),
                this.getSportArts(memberId),
            ]);

        return {
            memberId,
            subjectLearnings,
            selectSubjects,
            attendanceDetails,
            volunteers,
            sportArts,
        };
    }

    async getAttendanceDetails(memberId: string): Promise<SchoolRecordAttendanceDetailEntity[]> {
        try {
            return await this.attendanceRepository.find({
                where: { member: { id: memberId } },
            });
        } catch {
            return [];
        }
    }

    async getSelectSubjects(memberId: string): Promise<SchoolRecordSelectSubjectEntity[]> {
        try {
            return await this.selectSubjectRepository.find({
                where: { member: { id: memberId } },
            });
        } catch {
            return [];
        }
    }

    async getSubjectLearnings(memberId: string): Promise<SchoolRecordSubjectLearningEntity[]> {
        try {
            return await this.subjectLearningRepository.find({
                where: { member: { id: memberId } },
            });
        } catch {
            return [];
        }
    }

    async getVolunteers(memberId: string): Promise<SchoolRecordVolunteerEntity[]> {
        try {
            return await this.volunteerRepository.find({
                where: { member: { id: memberId } },
            });
        } catch {
            return [];
        }
    }

    async getSportArts(memberId: string): Promise<SchoolrecordSportsArtEntity[]> {
        return await this.sportArtRepository.find({
            where: { member: { id: memberId } },
        });
    }

    /**
     * PDF 파싱 결과를 DB에 저장
     */
    async saveParsedPdfData(
        memberId: string,
        data: {
            subjectLearnings: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; standardDeviation: string; achievement: string;
                studentsNum: string; ranking: string; etc: string;
            }>;
            selectSubjects: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; achievement: string; studentsNum: string;
                achievementA: string; achievementB: string; achievementC: string; etc: string;
            }>;
        },
    ): Promise<void> {
        const member = await this.memberRepository.findOne({
            where: { id: memberId },
        });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다.`);
        }

        await this.dataSource.transaction(async (transactionalEntityManager) => {
            // 기존 기록 삭제 (재업로드 시)
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordSubjectLearningEntity, member.id);
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordSelectSubjectEntity, member.id);

            // 일반 교과목 저장
            if (data.subjectLearnings.length > 0) {
                const subjectLearnings = data.subjectLearnings.map((item) =>
                    this.subjectLearningRepository.create({
                        member,
                        grade: item.grade,
                        semester: item.semester,
                        main_subject_code: item.mainSubjectCode,
                        main_subject_name: item.mainSubjectName,
                        subject_code: item.subjectCode,
                        subject_name: item.subjectName,
                        unit: item.unit,
                        raw_score: item.rawScore,
                        sub_subject_average: item.subSubjectAverage,
                        standard_deviation: item.standardDeviation,
                        achievement: item.achievement,
                        students_num: item.studentsNum,
                        ranking: item.ranking,
                        etc: item.etc,
                    }),
                );
                await transactionalEntityManager.save(SchoolRecordSubjectLearningEntity, subjectLearnings);
            }

            // 진로선택 과목 저장
            if (data.selectSubjects.length > 0) {
                const selectSubjects = data.selectSubjects.map((item) =>
                    this.selectSubjectRepository.create({
                        member,
                        grade: item.grade,
                        semester: item.semester,
                        main_subject_code: item.mainSubjectCode,
                        main_subject_name: item.mainSubjectName,
                        subject_code: item.subjectCode,
                        subject_name: item.subjectName,
                        unit: item.unit,
                        raw_score: item.rawScore,
                        sub_subject_average: item.subSubjectAverage,
                        achievement: item.achievement,
                        students_num: item.studentsNum,
                        achievementa: item.achievementA,
                        achievementb: item.achievementB,
                        achievementc: item.achievementC,
                        etc: item.etc,
                    }),
                );
                await transactionalEntityManager.save(SchoolRecordSelectSubjectEntity, selectSubjects);
            }
        });

        this.logger.log(
            `Saved PDF parsed data for member ${member.id}: ${data.subjectLearnings.length} subjects, ${data.selectSubjects.length} select subjects`,
        );
    }

    /**
     * HTML 파싱 결과를 DB에 저장 (출결, 교과, 진로선택, 봉사)
     */
    async saveHtmlParsedData(
        memberId: string,
        data: {
            subjectLearnings: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; standardDeviation: string; achievement: string;
                studentsNum: string; ranking: string; etc: string;
            }>;
            selectSubjects: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; achievement: string; studentsNum: string;
                achievementA: string; achievementB: string; achievementC: string; etc: string;
            }>;
            volunteers: Array<{
                grade: string; date: string; place: string; activityContent: string;
                activityTime: string; accumulateTime: string;
            }>;
        },
    ): Promise<void> {
        const member = await this.memberRepository.findOne({ where: { id: memberId } });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다.`);
        }

        await this.dataSource.transaction(async (transactionalEntityManager) => {
            // 기존 기록 삭제
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordSubjectLearningEntity, member.id);
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordSelectSubjectEntity, member.id);
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordVolunteerEntity, member.id);

            // 일반 교과목 저장
            if (data.subjectLearnings.length > 0) {
                const entities = data.subjectLearnings.map((item) =>
                    this.subjectLearningRepository.create({
                        member, grade: item.grade, semester: item.semester,
                        main_subject_code: item.mainSubjectCode, main_subject_name: item.mainSubjectName,
                        subject_code: item.subjectCode, subject_name: item.subjectName,
                        unit: item.unit, raw_score: item.rawScore,
                        sub_subject_average: item.subSubjectAverage, standard_deviation: item.standardDeviation,
                        achievement: item.achievement, students_num: item.studentsNum,
                        ranking: item.ranking, etc: item.etc,
                    }),
                );
                await transactionalEntityManager.save(SchoolRecordSubjectLearningEntity, entities);
            }

            // 진로선택 과목 저장
            if (data.selectSubjects.length > 0) {
                const entities = data.selectSubjects.map((item) =>
                    this.selectSubjectRepository.create({
                        member, grade: item.grade, semester: item.semester,
                        main_subject_code: item.mainSubjectCode, main_subject_name: item.mainSubjectName,
                        subject_code: item.subjectCode, subject_name: item.subjectName,
                        unit: item.unit, raw_score: item.rawScore,
                        sub_subject_average: item.subSubjectAverage, achievement: item.achievement,
                        students_num: item.studentsNum,
                        achievementa: item.achievementA, achievementb: item.achievementB,
                        achievementc: item.achievementC, etc: item.etc,
                    }),
                );
                await transactionalEntityManager.save(SchoolRecordSelectSubjectEntity, entities);
            }

            // 봉사활동 저장
            if (data.volunteers.length > 0) {
                const entities = data.volunteers.map((item) =>
                    this.volunteerRepository.create({
                        member, grade: item.grade, date: item.date, place: item.place,
                        activity_content: item.activityContent, activity_time: item.activityTime,
                        accumulate_time: item.accumulateTime,
                    }),
                );
                await transactionalEntityManager.save(SchoolRecordVolunteerEntity, entities);
            }
        });

        this.logger.log(`Saved HTML parsed data for member ${member.id}`);
    }

    /**
     * 수동 생기부 편집 (Susi 프론트엔드의 폼 기반 저장)
     */
    async editLifeRecord(
        memberId: string,
        data: {
            attendances: Array<{
                grade: string;
                absent_disease: number; absent_etc: number; absent_unrecognized: number;
                class_days: number; etc: string;
                late_disease: number; late_etc: number; late_unrecognized: number;
                leave_early_disease: number; leave_early_etc: number; leave_early_unrecognized: number;
                result_disease: number; result_early_etc: number; result_unrecognized: number;
            }>;
            subjects: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; standardDeviation: string; achievement: string;
                studentsNum: string; ranking: string; etc: string;
            }>;
            selectSubjects: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; achievement: string; studentsNum: string;
                achievementa: string; achievementb: string; achievementc: string; etc: string;
            }>;
        },
    ): Promise<void> {
        const member = await this.memberRepository.findOne({ where: { id: memberId } });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다. (id: ${memberId})`);
        }

        await this.dataSource.transaction(async (transactionalEntityManager) => {
            // 기존 기록 삭제
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordAttendanceDetailEntity, member.id);
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordSubjectLearningEntity, member.id);
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordSelectSubjectEntity, member.id);

            // 출결 저장
            if (data.attendances.length > 0) {
                const entities = data.attendances.map((a) => this.attendanceRepository.create({ ...a, member }));
                await transactionalEntityManager.save(SchoolRecordAttendanceDetailEntity, entities);
            }

            // 일반 교과목 저장
            if (data.subjects.length > 0) {
                const entities = data.subjects.map((item) => this.subjectLearningRepository.create({
                    member, grade: item.grade, semester: item.semester,
                    main_subject_code: item.mainSubjectCode, main_subject_name: item.mainSubjectName,
                    subject_code: item.subjectCode, subject_name: item.subjectName,
                    unit: item.unit, raw_score: item.rawScore,
                    sub_subject_average: item.subSubjectAverage, standard_deviation: item.standardDeviation,
                    achievement: item.achievement, students_num: item.studentsNum,
                    ranking: item.ranking, etc: item.etc,
                }));
                await transactionalEntityManager.save(SchoolRecordSubjectLearningEntity, entities);
            }

            // 진로선택 과목 저장
            if (data.selectSubjects.length > 0) {
                const entities = data.selectSubjects.map((item) => this.selectSubjectRepository.create({
                    member, grade: item.grade, semester: item.semester,
                    main_subject_code: item.mainSubjectCode, main_subject_name: item.mainSubjectName,
                    subject_code: item.subjectCode, subject_name: item.subjectName,
                    unit: item.unit, raw_score: item.rawScore,
                    sub_subject_average: item.subSubjectAverage, achievement: item.achievement,
                    students_num: item.studentsNum,
                    achievementa: item.achievementa, achievementb: item.achievementb,
                    achievementc: item.achievementc, etc: item.etc,
                }));
                await transactionalEntityManager.save(SchoolRecordSelectSubjectEntity, entities);
            }
        });

        this.logger.log(`Edited life record for member ${member.id}`);
    }

    /**
     * 생기부 데이터 삭제
     */
    async deleteSchoolRecord(memberId: string): Promise<void> {
        const member = await this.memberRepository.findOne({ where: { id: memberId } });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다.`);
        }

        await this.dataSource.transaction(async (transactionalEntityManager) => {
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordSubjectLearningEntity, member.id);
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordSelectSubjectEntity, member.id);
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordAttendanceDetailEntity, member.id);
            await this.deleteByMemberId(transactionalEntityManager, SchoolRecordVolunteerEntity, member.id);
            await this.deleteByMemberId(transactionalEntityManager, SchoolrecordSportsArtEntity, member.id);
        });

        this.logger.log(`Deleted all school records for member ${member.id}`);
    }

    /**
     * TypeORM 0.3.x 호환 - member_id 기준 삭제 헬퍼
     * EntityManager.delete()가 relation/column 기반 criteria 모두 실패하므로
     * createQueryBuilder를 사용하여 raw SQL column name으로 삭제
     */
    private async deleteByMemberId<T extends ObjectLiteral>(
        em: EntityManager,
        entity: EntityTarget<T>,
        memberId: string,
    ): Promise<void> {
        await em.createQueryBuilder()
            .delete()
            .from(entity)
            .where('member_id = :memberId', { memberId })
            .execute();
    }
}
