import { cn } from "@/lib/utils";
import { generateSSOUrl, getSSOServiceId } from "@/lib/utils/sso-helper";
import {
  Calendar,
  BookOpen,
  GraduationCap,
  BarChart3,
  ClipboardList,
  ArrowRight,
  Share2,
  Swords,
  FileText
} from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgGradient: string;
  features: string[];
  disabled?: boolean;
  isExternal?: boolean;
}

// 외부 서비스 URL
const SUSI_URL = import.meta.env.VITE_SUSI_URL || "http://localhost:3001";
const JUNGSI_URL = import.meta.env.VITE_JUNGSI_URL || "http://localhost:3002";
const MYEXAM_URL = import.meta.env.VITE_MYEXAM_URL || "http://localhost:3003";
const STUDYPLANNER_URL = import.meta.env.VITE_STUDYPLANNER_URL || "http://localhost:3004";
const TUTORBOARD_URL = import.meta.env.VITE_TUTORBOARD_URL || "http://localhost:3005";
const STUDYARENA_URL = import.meta.env.VITE_STUDYARENA_URL || "http://localhost:3006";
const MYSANGGIBU_URL = import.meta.env.VITE_MYSANGGIBU_URL || "http://localhost:3007";
const PARENTADMIN_URL = import.meta.env.VITE_PARENTADMIN_URL || "http://localhost:3019";
const TEACHERADMIN_URL = import.meta.env.VITE_TEACHERADMIN_URL || "http://localhost:3020";

// 모든 서비스 (카테고리 없이 플랫하게)
const allServices: ServiceCard[] = [
  {
    id: "jungsi",
    title: "정시 예측 분석",
    price: "유료",
    description: "기존 정시 서비스랑은 차원이 다른, 초격차 정시 예측 서비스!",
    icon: <Calendar className="w-6 h-6" />,
    href: JUNGSI_URL,
    color: "text-orange-500",
    bgGradient: "from-orange-500 to-orange-600",
    features: [
      "대학별 유불리(특허)",
      "모의지원 상황 기반 정시 시뮬레이션",
      "단계별 프로세스식 진행",
      "정시 모의지원 앱",
      "계정연동으로 선생님과 앱 상담"
    ],
    isExternal: true,
  },
  {
    id: "mock-exam",
    title: "Exam Hub",
    price: "무료",
    description: "내가 푼, 쪽지 시험의 단 한 문제도 이제는 버리는 일이 없도록!",
    icon: <BarChart3 className="w-6 h-6" />,
    href: MYEXAM_URL,
    color: "text-grape-500",
    bgGradient: "from-grape-500 to-grape-600",
    features: [
      "학원시험, 내신, 모의고사, 사설모의 모든 시험의",
      "성적 분석",
      "취약 부분 관리",
      "오답 관리"
    ],
    isExternal: true,
  },
  {
    id: "planner",
    title: "플래너",
    price: "무료",
    description: "제대로 만든 수험생 전용 학습 플래너",
    icon: <ClipboardList className="w-6 h-6" />,
    href: STUDYPLANNER_URL,
    color: "text-ultrasonic-500",
    bgGradient: "from-ultrasonic-500 to-ultrasonic-600",
    features: [
      "장기계획과 주간 루틴 자동 계획",
      "교과서, 참고서 분량 자동 생성"
    ],
    disabled: false,
    isExternal: true,
  },
  {
    id: "class-status",
    title: "수업현황앱(TutorBoard)",
    price: "무료",
    description: "학원 수업이든 학교 수업이든 모든 수업 계획과 현황을 이곳에!",
    icon: <BookOpen className="w-6 h-6" />,
    href: TUTORBOARD_URL,
    color: "text-wine-500",
    bgGradient: "from-wine-500 to-wine-600",
    features: [
      "수업 계획",
      "수업 진도",
      "과제 현황"
    ],
    isExternal: true,
  },
  {
    id: "susi-2027",
    title: "2027 수시 예측 분석",
    price: "유료",
    description: "수시 예측 분석 서비스를 겨울방학때부터!",
    icon: <GraduationCap className="w-6 h-6" />,
    href: SUSI_URL,
    color: "text-olive-500",
    bgGradient: "from-olive-500 to-olive-600",
    features: [
      "AI 사정관의 생기부 평가",
      "대학별 유불리(특허)",
      "단계별 프로세스식 진행",
      "무료 수시 모의지원 앱",
      "계정연동 선생님 상담"
    ],
    isExternal: true,
  },
  {
    id: "studyarena",
    title: "StudyArena",
    price: "무료",
    description: "클래스 친구들과 매일 학습 성과를 비교하고, 서로 경쟁하며 성장하세요!",
    icon: <Swords className="w-6 h-6" />,
    href: STUDYARENA_URL,
    color: "text-inferno-500",
    bgGradient: "from-inferno-500 to-inferno-600",
    features: [
      "공부 아레나: AI가 평가한 매일 학습 성과 비교",
      "정시 아레나: 모의고사 성적으로 경쟁",
      "클래스별 실시간 랭킹",
      "친구 초대 및 그룹 관리"
    ],
    isExternal: true,
  },
  {
    id: "mysanggibu",
    title: "MySanggibu",
    price: "무료",
    description: "생활기록부를 체계적으로 관리하고, AI 분석으로 강점을 파악하세요!",
    icon: <FileText className="w-6 h-6" />,
    href: MYSANGGIBU_URL,
    color: "text-ocean-500",
    bgGradient: "from-ocean-500 to-ocean-600",
    features: [
      "생기부 항목별 체계적 관리",
      "AI 기반 생기부 분석",
      "대학별 유불리 평가",
      "활동 이력 타임라인"
    ],
    isExternal: true,
  },
];

export function ServiceCardsPage() {
  // 개발 환경에서는 disabled 무시 (로컬에서 모든 서비스 접근 가능)
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">


      {/* 거북쌤 소개 섹션 */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl mx-auto">
          {/* 거북쌤 이미지 */}
          <div className="flex-shrink-0">
            <img
              src="/images/geobuk-ssam.png"
              alt="거북쌤"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>

          {/* 말풍선 */}
          <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 max-w-xl">
            {/* 말풍선 꼬리 (모바일: 위쪽, 데스크탑: 왼쪽) */}
            <div className="hidden md:block absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white drop-shadow-sm" />
            <div className="md:hidden absolute top-0 left-1/2 -translate-y-2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white drop-shadow-sm" />

            <p className="text-gray-700 text-sm md:text-base leading-loose">
              입시전문가이자, 1인 AI / IT 개발자 <span className="font-bold text-blue-600">'거북쌤'</span> 입니다.
              <br /><br />
              학생마다의 디비인 RAG와 AI 학습을 통해(파인튜닝),
              <br />
              그 어떤 선생님, 그 어떤 학원보다
              <br />
              <span className="font-semibold">상상이상의 도움을 줄 수 있는 것</span>이,
              <br />
              현재 무섭게 발전하는 <span className="font-bold text-blue-600">'AI'</span> 입니다.
              <br /><br />
              이런 AI의 도움을 받기 위해서는
              <br />
              학생에 대한 데이터가 필요합니다.
              <br /><br />
              아래 앱들은 당장 유용하고 필요한 기능도 제공하지만,
              <br />
              아래 앱들을 이용할수록,
              <br />
              아래 앱들의 본연의 기능 뿐만 아니라,
              <br /><br />
              향후, <span className="font-semibold">'상상 그 이상의 유익한 도움'</span>을 제공드림을 약속드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* Service Cards Grid - 카테고리 없이 플랫하게 */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allServices.map((service) => {
            // 프로덕션에서만 disabled 적용, 개발 환경에서는 모두 활성화
            const isDisabled = service.disabled && !isDev;

            const cardContent = (
              <>
                {isDisabled && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5">
                    <span className="px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded-full">
                      곧 오픈
                    </span>
                  </div>
                )}

                {/* Card Header with Gradient */}
                <div className={cn(
                  "relative px-5 py-6 text-white",
                  "bg-gradient-to-r",
                  service.bgGradient
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">
                          {service.price}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold">{service.title}</h3>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      {service.icon}
                    </div>
                  </div>
                  <p className="mt-3 text-white/90 text-sm line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Card Body */}
                <div className="px-5 py-4 flex-1">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className={cn("mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0", service.color.replace('text-', 'bg-'))} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t border-gray-100">
                  <div className={cn(
                    "flex items-center gap-2 text-sm font-semibold",
                    isDisabled ? "text-gray-400" : service.color,
                    !isDisabled && "group-hover:gap-3 transition-all"
                  )}>
                    {isDisabled ? "곧 오픈" : "바로가기"}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </>
            );

            if (isDisabled) {
              return (
                <div
                  key={service.id}
                  className={cn(
                    "group relative flex flex-col rounded-2xl overflow-hidden",
                    "bg-white border border-gray-100",
                    "shadow-sm transition-all duration-300",
                    "opacity-70 cursor-not-allowed"
                  )}
                >
                  {cardContent}
                </div>
              );
            }

            const cardClassName = cn(
              "group relative flex flex-col rounded-2xl overflow-hidden",
              "bg-white border border-gray-100",
              "shadow-sm transition-all duration-300",
              "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            );

            // 외부 링크인 경우 (SSO 코드를 URL에 포함하여 안전하게 자동 로그인)
            if (service.isExternal) {
              const handleSSOClick = async (e: React.MouseEvent<HTMLDivElement>) => {
                e.preventDefault();
                const serviceId = getSSOServiceId(service.href);
                if (!serviceId) {
                  window.open(service.href, '_blank');
                  return;
                }

                try {
                  const ssoUrl = await generateSSOUrl(service.href, serviceId);
                  window.open(ssoUrl, '_blank');
                } catch (error) {
                  console.error('SSO URL 생성 실패:', error);
                  window.open(service.href, '_blank');
                }
              };

              return (
                <div
                  key={service.id}
                  onClick={handleSSOClick}
                  className={cardClassName}
                >
                  {cardContent}
                </div>
              );
            }

            // 내부 링크는 제거되었으므로 disabled 처리
            return (
              <div
                key={service.id}
                className={cn(
                  "group relative flex flex-col rounded-2xl overflow-hidden",
                  "bg-white border border-gray-100",
                  "shadow-sm transition-all duration-300",
                  "opacity-70 cursor-not-allowed"
                )}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>

      {/* 학부모/선생님용 앱 */}
      <div className="container mx-auto px-4 pb-8">
        <div className="border-t border-gray-200 pt-8 mb-5">
          <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1"><Share2 className="w-4 h-4" /> 계정 연계 앱</p>
          <p className="text-xs text-gray-400">학부모와 선생님을 위한 전용 앱</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {/* 학부모용 앱 */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-rose-50 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => window.open(PARENTADMIN_URL, '_blank')}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md">
                <span className="text-xl text-white">👨‍👩‍👧</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-800">학부모용 앱</p>
                <p className="text-xs text-gray-500 mt-0.5">자녀 학습 현황 · 수업 알림</p>
              </div>
              <ArrowRight className="w-5 h-5 text-pink-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
            {/* 장식 원 */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-pink-100/50 group-hover:scale-110 transition-transform" />
          </div>

          {/* 선생님용 앱 */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => window.open(TEACHERADMIN_URL, '_blank')}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                <span className="text-xl text-white">👨‍🏫</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-800">선생님용 앱</p>
                <p className="text-xs text-gray-500 mt-0.5">수업 관리 · 학생 현황</p>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
            {/* 장식 원 */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-emerald-100/50 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Footer padding */}
      <div className="pb-16" />
    </div>
  );
}
