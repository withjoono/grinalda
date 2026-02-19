import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SchoolRecordService {
    private readonly logger = new Logger(SchoolRecordService.name);
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getSchoolRecord(memberId: string) {
        const member = await this.prisma.authMember.findUnique({ where: { id: memberId } });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다. (id: ${memberId})`);
        }

        const [subjectLearnings, selectSubjects, attendanceDetails, volunteers, sportArts, creativeActivities, behaviorOpinions] =
            await Promise.all([
                this.getSubjectLearnings(memberId),
                this.getSelectSubjects(memberId),
                this.getAttendanceDetails(memberId),
                this.getVolunteers(memberId),
                this.getSportArts(memberId),
                this.getCreativeActivities(memberId),
                this.getBehaviorOpinions(memberId),
            ]);

        return {
            memberId,
            subjectLearnings,
            selectSubjects,
            attendanceDetails,
            volunteers,
            sportArts,
            creativeActivities,
            behaviorOpinions,
        };
    }

    async getAttendanceDetails(memberId: string) {
        try {
            return await this.prisma.sgbAttendance.findMany({
                where: { member_id: memberId },
            });
        } catch {
            return [];
        }
    }

    async getSelectSubjects(memberId: string) {
        try {
            return await this.prisma.sgbSelectSubject.findMany({
                where: { member_id: memberId },
            });
        } catch {
            return [];
        }
    }

    async getSubjectLearnings(memberId: string) {
        try {
            return await this.prisma.sgbSubjectLearning.findMany({
                where: { member_id: memberId },
            });
        } catch {
            return [];
        }
    }

    async getVolunteers(memberId: string) {
        try {
            return await this.prisma.sgbVolunteer.findMany({
                where: { member_id: memberId },
            });
        } catch {
            return [];
        }
    }

    async getSportArts(memberId: string) {
        return await this.prisma.sgbSportsArt.findMany({
            where: { member_id: memberId },
        });
    }

    async getCreativeActivities(memberId: string) {
        try {
            return await this.prisma.sgbCreativeActivity.findMany({
                where: { member_id: memberId },
            });
        } catch {
            return [];
        }
    }

    async getBehaviorOpinions(memberId: string) {
        try {
            return await this.prisma.sgbBehaviorOpinion.findMany({
                where: { member_id: memberId },
            });
        } catch {
            return [];
        }
    }

    async saveParsedPdfData(
        memberId: string,
        data: {
            subjectLearnings: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; standardDeviation: string; achievement: string;
                studentsNum: string; ranking: string; etc: string; detailAndSpecialty?: string;
            }>;
            selectSubjects: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; achievement: string; studentsNum: string;
                achievementA: string; achievementB: string; achievementC: string; etc: string; detailAndSpecialty?: string;
            }>;
            creativeActivities?: Array<{ grade: string; activityType: string; content: string }>;
            behaviorOpinions?: Array<{ grade: string; content: string }>;
        },
    ): Promise<void> {
        const member = await this.prisma.authMember.findUnique({ where: { id: memberId } });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다.`);
        }

        await this.prisma.$transaction(async (tx) => {
            // 기존 기록 삭제 (재업로드 시)
            await tx.sgbSubjectLearning.deleteMany({ where: { member_id: member.id } });
            await tx.sgbSelectSubject.deleteMany({ where: { member_id: member.id } });
            await tx.sgbCreativeActivity.deleteMany({ where: { member_id: member.id } });
            await tx.sgbBehaviorOpinion.deleteMany({ where: { member_id: member.id } });

            // 일반 교과목 저장
            if (data.subjectLearnings.length > 0) {
                await tx.sgbSubjectLearning.createMany({
                    data: data.subjectLearnings.map((item) => ({
                        member_id: member.id,
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
                        detail_and_specialty: item.detailAndSpecialty || null,
                    })),
                });
            }

            // 진로선택 과목 저장
            if (data.selectSubjects.length > 0) {
                await tx.sgbSelectSubject.createMany({
                    data: data.selectSubjects.map((item) => ({
                        member_id: member.id,
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
                        detail_and_specialty: item.detailAndSpecialty || null,
                    })),
                });
            }

            // 창체 저장
            if (data.creativeActivities && data.creativeActivities.length > 0) {
                await tx.sgbCreativeActivity.createMany({
                    data: data.creativeActivities.map((item) => ({
                        member_id: member.id,
                        grade: item.grade,
                        activity_type: item.activityType,
                        content: item.content,
                    })),
                });
            }

            // 행특 저장
            if (data.behaviorOpinions && data.behaviorOpinions.length > 0) {
                await tx.sgbBehaviorOpinion.createMany({
                    data: data.behaviorOpinions.map((item) => ({
                        member_id: member.id,
                        grade: item.grade,
                        content: item.content,
                    })),
                });
            }
        });

        this.logger.log(
            `Saved PDF parsed data for member ${member.id}: ${data.subjectLearnings.length} subjects, ${data.selectSubjects.length} select subjects, ${data.creativeActivities?.length || 0} creative activities, ${data.behaviorOpinions?.length || 0} behavior opinions`,
        );
    }

    async saveHtmlParsedData(
        memberId: string,
        data: {
            subjectLearnings: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; standardDeviation: string; achievement: string;
                studentsNum: string; ranking: string; etc: string; detailAndSpecialty?: string;
            }>;
            selectSubjects: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; achievement: string; studentsNum: string;
                achievementA: string; achievementB: string; achievementC: string; etc: string; detailAndSpecialty?: string;
            }>;
            volunteers: Array<{
                grade: string; date: string; place: string; activityContent: string;
                activityTime: string; accumulateTime: string;
            }>;
            creativeActivities?: Array<{ grade: string; activityType: string; content: string }>;
            behaviorOpinions?: Array<{ grade: string; content: string }>;
        },
    ): Promise<void> {
        const member = await this.prisma.authMember.findUnique({ where: { id: memberId } });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다.`);
        }

        await this.prisma.$transaction(async (tx) => {
            // 기존 기록 삭제
            await tx.sgbSubjectLearning.deleteMany({ where: { member_id: member.id } });
            await tx.sgbSelectSubject.deleteMany({ where: { member_id: member.id } });
            await tx.sgbVolunteer.deleteMany({ where: { member_id: member.id } });
            await tx.sgbCreativeActivity.deleteMany({ where: { member_id: member.id } });
            await tx.sgbBehaviorOpinion.deleteMany({ where: { member_id: member.id } });

            // 일반 교과목 저장
            if (data.subjectLearnings.length > 0) {
                await tx.sgbSubjectLearning.createMany({
                    data: data.subjectLearnings.map((item) => ({
                        member_id: member.id,
                        grade: item.grade, semester: item.semester,
                        main_subject_code: item.mainSubjectCode, main_subject_name: item.mainSubjectName,
                        subject_code: item.subjectCode, subject_name: item.subjectName,
                        unit: item.unit, raw_score: item.rawScore,
                        sub_subject_average: item.subSubjectAverage, standard_deviation: item.standardDeviation,
                        achievement: item.achievement, students_num: item.studentsNum,
                        ranking: item.ranking, etc: item.etc, detail_and_specialty: item.detailAndSpecialty || null,
                    })),
                });
            }

            // 진로선택 과목 저장
            if (data.selectSubjects.length > 0) {
                await tx.sgbSelectSubject.createMany({
                    data: data.selectSubjects.map((item) => ({
                        member_id: member.id,
                        grade: item.grade, semester: item.semester,
                        main_subject_code: item.mainSubjectCode, main_subject_name: item.mainSubjectName,
                        subject_code: item.subjectCode, subject_name: item.subjectName,
                        unit: item.unit, raw_score: item.rawScore,
                        sub_subject_average: item.subSubjectAverage, achievement: item.achievement,
                        students_num: item.studentsNum,
                        achievementa: item.achievementA, achievementb: item.achievementB,
                        achievementc: item.achievementC, etc: item.etc, detail_and_specialty: item.detailAndSpecialty || null,
                    })),
                });
            }

            // 봉사활동 저장
            if (data.volunteers.length > 0) {
                await tx.sgbVolunteer.createMany({
                    data: data.volunteers.map((item) => ({
                        member_id: member.id,
                        grade: item.grade, date: item.date, place: item.place,
                        activity_content: item.activityContent, activity_time: item.activityTime,
                        accumulate_time: item.accumulateTime,
                    })),
                });
            }

            // 창체 저장
            if (data.creativeActivities && data.creativeActivities.length > 0) {
                await tx.sgbCreativeActivity.createMany({
                    data: data.creativeActivities.map((item) => ({
                        member_id: member.id,
                        grade: item.grade,
                        activity_type: item.activityType,
                        content: item.content,
                    })),
                });
            }

            // 행특 저장
            if (data.behaviorOpinions && data.behaviorOpinions.length > 0) {
                await tx.sgbBehaviorOpinion.createMany({
                    data: data.behaviorOpinions.map((item) => ({
                        member_id: member.id,
                        grade: item.grade,
                        content: item.content,
                    })),
                });
            }
        });

        this.logger.log(`Saved HTML parsed data for member ${member.id}`);
    }

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
                studentsNum: string; ranking: string; etc: string; detailAndSpecialty: string;
            }>;
            selectSubjects: Array<{
                grade: string; semester: string; mainSubjectCode: string; mainSubjectName: string;
                subjectCode: string; subjectName: string; unit: string; rawScore: string;
                subSubjectAverage: string; achievement: string; studentsNum: string;
                achievementa: string; achievementb: string; achievementc: string; etc: string; detailAndSpecialty: string;
            }>;
        },
    ): Promise<void> {
        const member = await this.prisma.authMember.findUnique({ where: { id: memberId } });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다. (id: ${memberId})`);
        }

        await this.prisma.$transaction(async (tx) => {
            // 기존 기록 삭제
            await tx.sgbAttendance.deleteMany({ where: { member_id: member.id } });
            await tx.sgbSubjectLearning.deleteMany({ where: { member_id: member.id } });
            await tx.sgbSelectSubject.deleteMany({ where: { member_id: member.id } });

            // 출결 저장
            if (data.attendances.length > 0) {
                await tx.sgbAttendance.createMany({
                    data: data.attendances.map((a) => ({ ...a, member_id: member.id })),
                });
            }

            // 일반 교과목 저장
            if (data.subjects.length > 0) {
                await tx.sgbSubjectLearning.createMany({
                    data: data.subjects.map((item) => ({
                        member_id: member.id,
                        grade: item.grade, semester: item.semester,
                        main_subject_code: item.mainSubjectCode, main_subject_name: item.mainSubjectName,
                        subject_code: item.subjectCode, subject_name: item.subjectName,
                        unit: item.unit, raw_score: item.rawScore,
                        sub_subject_average: item.subSubjectAverage, standard_deviation: item.standardDeviation,
                        achievement: item.achievement, students_num: item.studentsNum,
                        ranking: item.ranking, etc: item.etc, detail_and_specialty: item.detailAndSpecialty,
                    })),
                });
            }

            // 진로선택 과목 저장
            if (data.selectSubjects.length > 0) {
                await tx.sgbSelectSubject.createMany({
                    data: data.selectSubjects.map((item) => ({
                        member_id: member.id,
                        grade: item.grade, semester: item.semester,
                        main_subject_code: item.mainSubjectCode, main_subject_name: item.mainSubjectName,
                        subject_code: item.subjectCode, subject_name: item.subjectName,
                        unit: item.unit, raw_score: item.rawScore,
                        sub_subject_average: item.subSubjectAverage, achievement: item.achievement,
                        students_num: item.studentsNum,
                        achievementa: item.achievementa, achievementb: item.achievementb,
                        achievementc: item.achievementc, etc: item.etc, detail_and_specialty: item.detailAndSpecialty,
                    })),
                });
            }
        });

        this.logger.log(`Edited life record for member ${member.id}`);
    }

    async deleteSchoolRecord(memberId: string): Promise<void> {
        const member = await this.prisma.authMember.findUnique({ where: { id: memberId } });
        if (!member) {
            throw new NotFoundException(`유저를 찾을 수 없습니다.`);
        }

        await this.prisma.$transaction(async (tx) => {
            await tx.sgbSubjectLearning.deleteMany({ where: { member_id: member.id } });
            await tx.sgbSelectSubject.deleteMany({ where: { member_id: member.id } });
            await tx.sgbAttendance.deleteMany({ where: { member_id: member.id } });
            await tx.sgbVolunteer.deleteMany({ where: { member_id: member.id } });
            await tx.sgbSportsArt.deleteMany({ where: { member_id: member.id } });
            await tx.sgbCreativeActivity.deleteMany({ where: { member_id: member.id } });
            await tx.sgbBehaviorOpinion.deleteMany({ where: { member_id: member.id } });
        });

        this.logger.log(`Deleted all school records for member ${member.id}`);
    }
}
