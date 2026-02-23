import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { USER_API } from "@/stores/server/features/me/apis";
import { EVALUATION_APIS } from "@/stores/server/features/susi/evaluation/apis";
import { INTEREST_UNIV_API } from "@/stores/server/features/susi/interest-univ/apis";
import { COMBINATION_API } from "@/stores/server/features/combination/apis";
import { cn } from "@/lib/utils";
import {
  FileText,
  BarChart3,
  Target,
  ClipboardList,
  FileCheck,
  Palette,
  BookOpen,
  GraduationCap,
  PenTool,
  Building2,
  Crosshair,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
  ChevronRight,
  Upload,
  TrendingUp,
  Star,
  Ticket,
} from "lucide-react";

export const Route = createLazyFileRoute("/ms/dashboard")({
  component: DashboardPage,
});

/* ─── 서비스 바로가기 데이터 ─── */
interface ServiceItem {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const serviceGroups: {
  label: string;
  labelColor: string;
  items: ServiceItem[];
}[] = [
    {
      label: "입력과 평가",
      labelColor: "text-blue-600",
      items: [
        {
          icon: FileText,
          title: "생기부 입력",
          description: "PDF 업로드로 데이터를 자동 파싱",
          href: "/ms/school-record",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-100",
        },
      ],
    },
    {
      label: "교과",
      labelColor: "text-emerald-600",
      items: [
        {
          icon: BarChart3,
          title: "성적 분석",
          description: "교과 성적 트렌드와 등급 분석",
          href: "/ms/performance",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-100",
        },
      ],
    },
    {
      label: "비교과",
      labelColor: "text-purple-600",
      items: [
        {
          icon: Target,
          title: "계열 적합성 진단",
          description: "나에게 적합한 계열 분석",
          href: "/ms/compatibility",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-100",
        },
        {
          icon: ClipboardList,
          title: "평가 신청",
          description: "AI/사정관 평가 신청",
          href: "/ms/request",
          color: "text-violet-600",
          bgColor: "bg-violet-50",
          borderColor: "border-violet-100",
        },
        {
          icon: FileCheck,
          title: "평가 내역",
          description: "생기부 평가 결과 확인",
          href: "/ms/evaluation-list",
          color: "text-fuchsia-600",
          bgColor: "bg-fuchsia-50",
          borderColor: "border-fuchsia-100",
        },
        {
          icon: BookOpen,
          title: "세특",
          description: "세부능력 및 특기사항 관리",
          href: "/ms/setuk",
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-100",
        },
        {
          icon: Palette,
          title: "창체 및 행특",
          description: "창의적 체험활동 · 행동특성",
          href: "/ms/creative-activity",
          color: "text-pink-600",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-100",
        },
      ],
    },
    {
      label: "전형탐색",
      labelColor: "text-rose-600",
      items: [
        {
          icon: BookOpen,
          title: "교과 전형",
          description: "교과 전형 탐색 및 분석",
          href: "/ms/subject",
          color: "text-rose-600",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-100",
        },
        {
          icon: GraduationCap,
          title: "학종 전형",
          description: "학생부종합 전형 탐색",
          href: "/ms/comprehensive",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-100",
        },
        {
          icon: PenTool,
          title: "논술 전형",
          description: "논술 전형 탐색 및 분석",
          href: "/ms/nonsul",
          color: "text-teal-600",
          bgColor: "bg-teal-50",
          borderColor: "border-teal-100",
        },
      ],
    },
    {
      label: "전략과 지원",
      labelColor: "text-indigo-600",
      items: [
        {
          icon: Target,
          title: "목표대학 설정",
          description: "목표 대학 · 계열별 모집단위 설정",
          href: "/ms/target-university",
          color: "text-rose-600",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-100",
        },
        {
          icon: Building2,
          title: "관심대학",
          description: "관심대학 저장 및 비교",
          href: "/ms/interest",
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-100",
        },
        {
          icon: Crosshair,
          title: "모의지원",
          description: "수시 모의지원 조합 관리",
          href: "/ms/combination",
          color: "text-sky-600",
          bgColor: "bg-sky-50",
          borderColor: "border-sky-100",
        },
      ],
    },
  ];

/* ─── 시작 가이드 단계 ─── */
const guideSteps = [
  {
    step: 1,
    title: "생기부 입력",
    description: "생기부 PDF를 업로드하여 데이터를 자동으로 파싱합니다.",
    href: "/ms/school-record",
    icon: Upload,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    step: 2,
    title: "성적 분석 확인",
    description: "입력된 성적을 분석하고 트렌드를 확인합니다.",
    href: "/ms/performance",
    icon: TrendingUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    step: 3,
    title: "전형 탐색",
    description: "나에게 맞는 전형을 탐색하고 관심대학을 저장합니다.",
    href: "/ms/subject",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

/* ─── 인사말 생성 ─── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "새벽에도 열공 중이시군요 🌙";
  if (hour < 12) return "좋은 아침이에요 ☀️";
  if (hour < 18) return "좋은 오후에요 🌤️";
  return "좋은 저녁이에요 🌆";
}

function getMajorLabel(major: string): string {
  if (major === "0" || major === "문과") return "문과";
  if (major === "1" || major === "이과") return "이과";
  return major || "미설정";
}

/* ─── Dashboard Component ─── */
function DashboardPage() {
  /* 사용자 정보 */
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: USER_API.fetchCurrentUserAPI,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /* 생기부 데이터 상태 */
  const { data: schoolRecords } = useQuery({
    queryKey: ["schoolRecords", user?.id],
    queryFn: () => USER_API.fetchAllSchoolRecordsAPI(user!.id),
    enabled: !!user?.id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /* 관심대학 (교과 + 학종) */
  const { data: interestSubject } = useQuery({
    queryKey: ["interestSusiSubject", user?.id],
    queryFn: () => INTEREST_UNIV_API.fetchInterestSusiSubjectAPI(user!.id),
    enabled: !!user?.id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: interestComprehensive } = useQuery({
    queryKey: ["interestSusiComprehensive", user?.id],
    queryFn: () =>
      INTEREST_UNIV_API.fetchInterestSusiComprehensiveAPI(user!.id),
    enabled: !!user?.id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /* 모의지원 조합 */
  const { data: combinations } = useQuery({
    queryKey: ["combinations", user?.id],
    queryFn: () => COMBINATION_API.fetchCombinationsAPI(user!.id),
    enabled: !!user?.id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /* 평가 티켓 */
  const { data: ticketData } = useQuery({
    queryKey: ["ticketCount"],
    queryFn: EVALUATION_APIS.fetchTicketCountAPI,
    enabled: !!user,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /* 파생 데이터 */
  const hasSchoolRecord =
    schoolRecords &&
    ((schoolRecords.subjectLearnings?.length ?? 0) > 0 ||
      (schoolRecords.selectSubjects?.length ?? 0) > 0);

  const subjectCount = schoolRecords?.subjectLearnings?.length ?? 0;
  const interestCount =
    (interestSubject?.length ?? 0) + (interestComprehensive?.length ?? 0);
  const combinationCount = combinations?.length ?? 0;
  const ticketCount = ticketData?.count ?? 0;

  // 학년/학기 계산
  const uniqueGradeSemesters = new Set(
    schoolRecords?.subjectLearnings?.map(
      (s) => `${s.grade}-${s.semester}`
    ) ?? []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50/60 via-white to-amber-50/40">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12">
        {/* ═══════ 1. 환영 섹션 ═══════ */}
        <section className="mb-10">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-olive-600 via-olive-500 to-amber-500 p-6 shadow-lg sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-olive-100">
                  {getGreeting()}
                </p>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  {user?.nickname ?? "사용자"}님, 환영합니다!
                </h1>
                {user && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {user.graduateYear}년 졸업
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {getMajorLabel(user.major)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  to="/ms/school-record"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-olive-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <FileText className="h-4 w-4" />
                  생기부 입력
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ 2. 진행 상태 카드 ═══════ */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            나의 현황
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {/* 생기부 상태 */}
            <Link
              to="/ms/school-record"
              className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-500" />
              </div>
              <p className="text-xs font-medium text-gray-500">생기부 입력</p>
              {hasSchoolRecord ? (
                <>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {uniqueGradeSemesters.size}
                    <span className="ml-1 text-sm font-medium text-gray-400">
                      학기
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">
                    <CheckCircle2 className="mr-1 inline h-3 w-3" />
                    과목 {subjectCount}개 입력됨
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-2xl font-bold text-gray-300">—</p>
                  <p className="mt-1 text-xs text-gray-400">
                    아직 입력한 데이터가 없습니다
                  </p>
                </>
              )}
            </Link>

            {/* 관심대학 */}
            <Link
              to="/ms/interest"
              className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-indigo-50 p-2">
                  <Star className="h-5 w-5 text-indigo-600" />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-500" />
              </div>
              <p className="text-xs font-medium text-gray-500">관심대학</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {interestCount}
                <span className="ml-1 text-sm font-medium text-gray-400">
                  개
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {interestCount > 0 ? "교과 + 학종 전형" : "대학을 탐색하고 저장하세요"}
              </p>
            </Link>

            {/* 모의지원 */}
            <Link
              to="/ms/combination"
              className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-sky-50 p-2">
                  <Crosshair className="h-5 w-5 text-sky-600" />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-500" />
              </div>
              <p className="text-xs font-medium text-gray-500">모의지원</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {combinationCount}
                <span className="ml-1 text-sm font-medium text-gray-400">
                  조합
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {combinationCount > 0
                  ? "지원 조합을 확인해 보세요"
                  : "모의지원 조합을 만들어 보세요"}
              </p>
            </Link>

            {/* 평가 티켓 */}
            <Link
              to="/ms/request"
              className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-amber-50 p-2">
                  <Ticket className="h-5 w-5 text-amber-600" />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-500" />
              </div>
              <p className="text-xs font-medium text-gray-500">평가 티켓</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {ticketCount}
                <span className="ml-1 text-sm font-medium text-gray-400">
                  장
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {ticketCount > 0
                  ? "AI/사정관 평가를 신청하세요"
                  : "이용권을 구매하여 평가를 받아보세요"}
              </p>
            </Link>
          </div>
        </section>

        {/* ═══════ 3. 빠른 시작 가이드 (생기부 미입력 시) ═══════ */}
        {!hasSchoolRecord && (
          <section className="mb-10">
            <div className="overflow-hidden rounded-2xl border border-olive-100 bg-gradient-to-r from-olive-50 to-amber-50">
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-olive-100 p-2.5">
                    <Sparkles className="h-5 w-5 text-olive-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      시작 가이드
                    </h2>
                    <p className="text-sm text-gray-500">
                      3단계로 수시 대입 전략을 시작하세요
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {guideSteps.map((step, idx) => (
                    <Link
                      key={step.step}
                      to={step.href}
                      className="group relative flex flex-col rounded-xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white",
                            idx === 0
                              ? "bg-blue-500"
                              : idx === 1
                                ? "bg-emerald-500"
                                : "bg-purple-500"
                          )}
                        >
                          {step.step}
                        </span>
                        <div className={cn("rounded-lg p-1.5", step.bgColor)}>
                          <step.icon className={cn("h-4 w-4", step.color)} />
                        </div>
                      </div>
                      <h3 className="mb-1 text-sm font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="flex-1 text-xs leading-relaxed text-gray-500">
                        {step.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-olive-600 transition-all group-hover:gap-2">
                        시작하기
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════ 4. 서비스 바로가기 ═══════ */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            서비스 바로가기
          </h2>

          <div className="space-y-8">
            {serviceGroups.map((group) => (
              <div key={group.label}>
                <h3
                  className={cn(
                    "mb-3 flex items-center gap-2 text-sm font-semibold",
                    group.labelColor
                  )}
                >
                  <Circle className="h-2 w-2 fill-current" />
                  {group.label}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "group flex flex-col rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                        item.borderColor
                      )}
                    >
                      <div
                        className={cn(
                          "mb-3 inline-flex self-start rounded-lg p-2.5",
                          item.bgColor
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", item.color)} />
                      </div>
                      <h4 className="mb-1 text-sm font-bold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="flex-1 text-xs leading-relaxed text-gray-500">
                        {item.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400 transition-all group-hover:gap-2 group-hover:text-gray-600">
                        바로가기
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 여백 */}
        <div className="pb-8" />
      </div>
    </div>
  );
}
