import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGetSchoolRecords } from "@/stores/server/features/me/queries";
import { useGetCurrentUser } from "@/stores/server/features/me/queries";
import { ISchoolRecordSubject } from "@/stores/server/features/me/interfaces";

export const Route = createLazyFileRoute("/ms/_layout/setuk")({
    component: SetukPage,
});

// 학년/학기 라벨
const GRADE_SEMESTER_LABELS: Record<string, string> = {
    "1-1": "1학년 1학기",
    "1-2": "1학년 2학기",
    "2-1": "2학년 1학기",
    "2-2": "2학년 2학기",
    "3-1": "3학년 1학기",
    "3-2": "3학년 2학기",
};

// 등급별 색상
function getRankingColor(ranking: string | null): string {
    if (!ranking) return "text-gray-400";
    const r = parseFloat(ranking);
    if (r <= 2) return "text-blue-600";
    if (r <= 4) return "text-green-600";
    if (r <= 6) return "text-yellow-600";
    return "text-red-600";
}

// 등급별 배경 색상
function getRankingBgColor(ranking: string | null): string {
    if (!ranking) return "bg-gray-50 border-gray-200";
    const r = parseFloat(ranking);
    if (r <= 2) return "bg-blue-50 border-blue-200";
    if (r <= 4) return "bg-green-50 border-green-200";
    if (r <= 6) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
}

// 과목 카드 컴포넌트
function SubjectCard({ subject }: { subject: ISchoolRecordSubject }) {
    // 세특 내용 (detailAndSpecialty 필드)
    const setukContent = subject.detailAndSpecialty;

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
            {/* 성적 정보 바 */}
            <div className={cn("border-b px-4 py-3", getRankingBgColor(subject.ranking))}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h4 className="text-sm font-bold text-gray-900">
                            {subject.subjectName || "과목명 없음"}
                        </h4>
                        {subject.mainSubjectName && (
                            <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-gray-500">
                                {subject.mainSubjectName}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        {subject.ranking && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">등급</span>
                                <span className={cn("text-lg font-extrabold", getRankingColor(subject.ranking))}>
                                    {subject.ranking}
                                </span>
                            </div>
                        )}
                        {subject.rawScore && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">원점수</span>
                                <span className="font-semibold text-gray-800">{subject.rawScore}</span>
                            </div>
                        )}
                        {subject.achievement && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">성취도</span>
                                <span className="font-semibold text-gray-800">{subject.achievement}</span>
                            </div>
                        )}
                        {subject.unit && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">단위</span>
                                <span className="font-semibold text-gray-800">{subject.unit}</span>
                            </div>
                        )}
                        {subject.subSubjectAverage && (
                            <div className="hidden items-center gap-1 sm:flex">
                                <span className="text-gray-500">평균</span>
                                <span className="font-semibold text-gray-800">{subject.subSubjectAverage}</span>
                            </div>
                        )}
                        {subject.studentsNum && (
                            <div className="hidden items-center gap-1 sm:flex">
                                <span className="text-gray-500">수강자</span>
                                <span className="font-semibold text-gray-800">{subject.studentsNum}명</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 세특 내용 */}
            <div className="px-4 py-4">
                {setukContent ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                        {setukContent}
                    </p>
                ) : (
                    <p className="text-sm text-gray-400 italic">
                        세특 내용이 아직 입력되지 않았습니다.
                    </p>
                )}
            </div>
        </div>
    );
}

// 학기별 그룹 컴포넌트
function SemesterGroup({
    label,
    subjects,
}: {
    label: string;
    subjects: ISchoolRecordSubject[];
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">{label}</h3>
                <span className="rounded-full bg-olive-100 px-2.5 py-0.5 text-xs font-medium text-olive-700">
                    {subjects.length}과목
                </span>
            </div>
            <div className="space-y-3">
                {subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                ))}
            </div>
        </div>
    );
}

function SetukPage() {
    const { data: user } = useGetCurrentUser();
    const { data: schoolRecords, isLoading } = useGetSchoolRecords();
    const [selectedGrade, setSelectedGrade] = useState<string>("all");

    // 과목 데이터를 학년/학기별로 그룹핑
    const subjects = schoolRecords?.subjects || [];
    const groupedByGradeSemester = subjects.reduce(
        (acc, subject) => {
            const key = `${subject.grade || "?"}-${subject.semester || "?"}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(subject);
            return acc;
        },
        {} as Record<string, ISchoolRecordSubject[]>,
    );

    // 정렬된 키 목록
    const sortedKeys = Object.keys(groupedByGradeSemester).sort();

    // 필터링
    const filteredKeys =
        selectedGrade === "all"
            ? sortedKeys
            : sortedKeys.filter((key) => key.startsWith(selectedGrade));

    // 학년 필터 옵션
    const gradeOptions = [
        { value: "all", label: "전체" },
        { value: "1", label: "1학년" },
        { value: "2", label: "2학년" },
        { value: "3", label: "3학년" },
    ];

    if (!user) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-gray-500">로그인이 필요합니다.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-olive-500 border-t-transparent" />
                    <p className="text-gray-500">세특 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">세부능력 및 특기사항</h2>
                <p className="mt-1 text-sm text-gray-500">
                    생기부에 입력된 세특 내용을 학년/학기별로 확인하세요. 각 과목의 성적이 함께 표시됩니다.
                </p>
            </div>

            {/* 학년 필터 */}
            <div className="flex flex-wrap gap-2">
                {gradeOptions.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setSelectedGrade(opt.value)}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                            selectedGrade === opt.value
                                ? "bg-olive-500 text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* 데이터 표시 */}
            {subjects.length === 0 ? (
                <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                    <div className="text-5xl">📝</div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-700">
                            등록된 세특 데이터가 없습니다
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            마이페이지에서 생기부를 등록하면 세특 내용을 확인할 수 있습니다.
                        </p>
                    </div>
                </div>
            ) : filteredKeys.length === 0 ? (
                <div className="flex min-h-[20vh] items-center justify-center rounded-xl bg-gray-50 p-8">
                    <p className="text-gray-500">선택한 학년의 데이터가 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredKeys.map((key) => (
                        <SemesterGroup
                            key={key}
                            label={GRADE_SEMESTER_LABELS[key] || `${key}`}
                            subjects={groupedByGradeSemester[key]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
