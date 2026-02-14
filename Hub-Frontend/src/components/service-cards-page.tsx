import { cn } from "@/lib/utils";
import React from "react";
import { generateSSOUrl, getSSOServiceId } from "@/lib/utils/sso-helper";
import { TextAnimate } from "@/components/ui/text-animate";
import { BorderBeam } from "@/components/ui/border-beam";
import { motion } from "motion/react";
import {
  Calendar,
  BookOpen,
  GraduationCap,
  BarChart3,
  ClipboardList,
  ArrowRight,
  Swords,
  FileText,
  Users,
  School,
  ChevronDown,
  Bell,
  LogOut,
  Menu,
} from "lucide-react";
import { WonCircle } from "./icons";
import { useAuthStore } from "@/stores/client/use-auth-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/custom/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { clearTokens as clearTokenManager } from "@/lib/api/token-manager";
import { useTokenStore } from "@/stores/atoms/tokens";
import { logoutFetch } from "@/stores/server/features/auth/apis";
import { useQuery } from "@tanstack/react-query";
import { USER_API } from "@/stores/server/features/me/apis";

// ───────────────────────────── 외부 URL ─────────────────────────────
const SUSI_URL = import.meta.env.VITE_SUSI_URL || "http://localhost:3001";
const JUNGSI_URL = import.meta.env.VITE_JUNGSI_URL || "http://localhost:3002";
const MYEXAM_URL = import.meta.env.VITE_MYEXAM_URL || "http://localhost:3003";
const STUDYPLANNER_URL = import.meta.env.VITE_STUDYPLANNER_URL || "http://localhost:3004";
const TUTORBOARD_URL = import.meta.env.VITE_TUTORBOARD_URL || "http://localhost:3005";
const STUDYARENA_URL = import.meta.env.VITE_STUDYARENA_URL || "http://localhost:3006";
const MYSANGGIBU_URL = import.meta.env.VITE_MYSANGGIBU_URL || "http://localhost:3007";
const PARENTADMIN_URL = import.meta.env.VITE_PARENTADMIN_URL || "http://localhost:3019";
const TEACHERADMIN_URL = import.meta.env.VITE_TEACHERADMIN_URL || "http://localhost:3020";

// ───────────────────────────── 서비스 데이터 ─────────────────────────────
interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  gradient: string;
  accentColor: string;
  features: string[];
  disabled?: boolean;
  isExternal?: boolean;
}

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  services: ServiceCard[];
  icon: React.ReactNode;
  gradientClass: string;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "grade-management",
    title: "성적 관리용 앱",
    description: "내신, 비교과, 모의고사 성적 관리용 앱",
    icon: <BarChart3 className="w-6 h-6" />,
    gradientClass: "from-sky-500 to-blue-500",
    services: [
      {
        id: "mysanggibu",
        title: "My 생기부 앱",
        description: "내신뿐 아니라, 비교과 관리용 앱",
        icon: <FileText className="w-6 h-6" />,
        href: MYSANGGIBU_URL,
        color: "text-sky-600",
        gradient: "from-sky-500 to-blue-500",
        accentColor: "#0284c7",
        features: [
          "생기부 항목별 체계적 관리",
          "AI 기반 생기부 분석",
          "대학별 유불리 평가",
          "활동 이력 타임라인",
        ],
        isExternal: true,
      },
      {
        id: "mock-exam",
        title: "Exam Hub",
        description: "모의고사 성적, 분석, 오답 등을 관리하는 앱",
        icon: <BarChart3 className="w-6 h-6" />,
        href: MYEXAM_URL,
        color: "text-purple-600",
        gradient: "from-purple-500 to-violet-500",
        accentColor: "#9333ea",
        features: ["학원시험, 내신, 모의고사 통합", "성적 분석", "취약 부분 관리", "오답 관리"],
        isExternal: true,
      },
    ],
  },
  {
    id: "learning",
    title: "학습용 앱",
    description: "학습 관리 및 동기 부여를 위한 앱",
    icon: <BookOpen className="w-6 h-6" />,
    gradientClass: "from-blue-500 to-cyan-500",
    services: [
      {
        id: "planner",
        title: "Study Planner",
        description: "수험생 전문 학습 플래너 앱",
        icon: <ClipboardList className="w-6 h-6" />,
        href: STUDYPLANNER_URL,
        color: "text-blue-600",
        gradient: "from-blue-500 to-cyan-500",
        accentColor: "#2563eb",
        features: ["장기계획과 주간 루틴 자동 계획", "교과서, 참고서 분량 자동 생성"],
        isExternal: true,
      },
      {
        id: "class-status",
        title: "Tutor Board",
        description: "모든 수업 현황을 관리하기 위한 앱",
        icon: <BookOpen className="w-6 h-6" />,
        href: TUTORBOARD_URL,
        color: "text-rose-600",
        gradient: "from-rose-500 to-pink-500",
        accentColor: "#e11d48",
        features: ["수업 계획", "수업 진도", "과제 현황"],
        isExternal: true,
      },
      {
        id: "studyarena",
        title: "Study Arena",
        description: "같은 클래스 학생들끼리 매일 학습 성과 등을 비교하며 학습 경쟁을 유도하는 앱",
        icon: <Swords className="w-6 h-6" />,
        href: STUDYARENA_URL,
        color: "text-red-600",
        gradient: "from-red-500 to-orange-500",
        accentColor: "#dc2626",
        features: [
          "공부 아레나: AI가 평가한 매일 학습 성과 비교",
          "정시 아레나: 모의고사 성적으로 경쟁",
          "클래스별 실시간 랭킹",
          "친구 초대 및 그룹 관리",
        ],
        isExternal: true,
      },
    ],
  },
  {
    id: "prediction",
    title: "수시/정시 예측 앱",
    description: "기존의 정적 예측 서비스들과는 차원이 다른, AI 동적 예측 서비스",
    icon: <GraduationCap className="w-6 h-6" />,
    gradientClass: "from-emerald-500 to-teal-500",
    services: [
      {
        id: "susi-2027",
        title: "수시 예측 분석 앱",
        description: "AI 사정관의 생기부 평가 및 대학별 유불리 분석",
        icon: <GraduationCap className="w-6 h-6" />,
        href: SUSI_URL,
        color: "text-emerald-600",
        gradient: "from-emerald-500 to-teal-500",
        accentColor: "#059669",
        features: [
          "AI 사정관의 생기부 평가",
          "대학별 유불리(특허)",
          "단계별 프로세스식 진행",
          "무료 수시 모의지원 앱",
          "계정연동 선생님 상담",
        ],
        isExternal: true,
      },
      {
        id: "jungsi",
        title: "정시 예측 분석 앱",
        description: "기존 정시 서비스랑은 차원이 다른, 초격차 정시 예측 서비스!",
        icon: <Calendar className="w-6 h-6" />,
        href: JUNGSI_URL,
        color: "text-orange-600",
        gradient: "from-orange-500 to-amber-500",
        accentColor: "#f97316",
        features: [
          "대학별 유불리(특허)",
          "모의지원 상황 기반 정시 시뮬레이션",
          "단계별 프로세스식 진행",
          "정시 모의지원 앱",
          "계정연동으로 선생님과 앱 상담",
        ],
        isExternal: true,
      },
    ],
  },
  {
    id: "user-specific",
    title: "사용자별 앱",
    description: "거북스쿨 앱들을 선생님과 학부모가 공유하기 위한 앱",
    icon: <Users className="w-6 h-6" />,
    gradientClass: "from-purple-500 to-pink-500",
    services: [
      {
        id: "teacher-admin",
        title: "Teacher Admin",
        description: "선생님을 위한 앱",
        icon: <Users className="w-6 h-6" />,
        href: TEACHERADMIN_URL,
        color: "text-emerald-600",
        gradient: "from-emerald-500 to-teal-500",
        accentColor: "#059669",
        features: ["학생 관리", "수업 관리", "학습 현황 모니터링"],
        isExternal: true,
      },
      {
        id: "parent-admin",
        title: "Parent Admin",
        description: "학부모를 위한 앱",
        icon: <School className="w-6 h-6" />,
        href: PARENTADMIN_URL,
        color: "text-pink-600",
        gradient: "from-pink-500 to-rose-500",
        accentColor: "#db2777",
        features: ["자녀 학습 현황", "수업 알림", "성적 리포트"],
        isExternal: true,
      },
    ],
  },
];

// ───────────────────────────── 메인 컴포넌트 ─────────────────────────────
export function ServiceCardsPage() {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-white relative">
      <Header />
      {/* ═══════════════════ HERO SECTION (Full Screen) ═══════════════════ */}
      <section className="relative min-h-screen flex items-center justify-end z-10 overflow-hidden px-10 md:px-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/hero-blob.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Overlay for readability (Optional, light) */}
        <div className="absolute inset-0 z-0 bg-black/20" />

        <div className="container mx-auto px-4 text-right relative z-10 flex flex-col items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-end"
          >
            {/* 거북이 로고 제거됨 */}

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
              거북쌤에게 물어보세요
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl ml-auto mb-10 leading-relaxed font-medium drop-shadow-md">
              <span className="font-semibold text-white">RAG 기반 AI 검색</span>으로 학교생활기록부, 입시 요강,
              <br className="hidden md:block" />
              학습 자료를 깊이 있게 분석하고 답변해 드립니다.
            </p>

            {/* 검색창 */}
            <div className="w-full max-w-xl relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="AI 거북쌤의 상담은 3월부터 시작합니다"
                  className="w-full px-8 py-5 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white/50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-xl text-lg"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md group-hover:scale-105">
                  <img src="/images/geobuk-ssam.png" alt="Search" className="w-6 h-6 object-contain filter brightness-0 invert" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ SERVICE GRID ═══════════════════ */}
      <div className="container mx-auto px-4 py-20 relative z-10" id="service-grid">
        {serviceCategories.map((category, index) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-32 last:mb-0"
          >
            <div className="flex items-center gap-4 mb-10 pl-2">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${category.gradientClass} text-white shadow-lg`}>
                {category.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{category.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.services.map((service) => (
                <ServiceCardItem key={service.title} service={service} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* ═══════════════════ FOOTER MESSAGE WITH CHARACTER ═══════════════════ */}
      <section className="bg-gray-50 py-24 relative overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Character Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 blur-[80px] opacity-20 rounded-full" />
              <img src="/images/geobuk-ssam.png" alt="거북쌤" className="relative w-48 md:w-64 lg:w-80 drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" />
            </div>
          </motion.div>

          {/* Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 relative max-w-3xl"
          >
            {/* Tail of speech bubble (Left for desktop, Top for mobile) */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 lg:top-1/2 lg:-left-4 lg:translate-x-0 lg:-translate-y-1/2 w-8 h-8 bg-white transform rotate-45 border-l border-t lg:border-t-0 lg:border-l lg:border-b border-gray-100 z-0" />

            <div className="relative z-10 space-y-6 text-gray-700 leading-relaxed text-lg break-keep">
              <p className="font-bold text-2xl text-gray-900 mb-4">
                입시전문가이자, 1인 AI / IT 개발자 '거북쌤' 입니다.
              </p>
              <p>
                학생마다의 DB인 <span className="font-bold text-blue-600">'RAG'</span>와 AI 학습을 통해(파인튜닝),<br className="hidden md:block" />
                그 어떤 선생님, 그 어떤 학원보다<br className="hidden md:block" />
                <span className="font-bold text-blue-600">상상이상의 도움</span>을 줄 수 있는 것이,<br className="hidden md:block" />
                현재 무섭게 발전하는 <span className="font-bold text-blue-600">'AI'</span> 입니다.
              </p>
              <p>
                이런 AI의 도움을 받기 위해서는<br />
                <span className="font-semibold text-gray-900 bg-yellow-100 px-1">학생에 대한 데이터가 필요합니다.</span>
              </p>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-base">
                <p className="mb-2">
                  위의 앱들은 당장 유용하고 필요한 기능도 제공하지만,<br />
                  위의 앱들을 이용할수록,<br />
                  위의 앱들의 본연의 기능 뿐만 아니라,
                </p>
                <p className="font-bold text-indigo-600 text-lg mt-4">
                  향후, '상상 그 이상의 유익한 도움'을 제공드림을 약속드립니다.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer 여백 */}
      <div className="pb-8" />
    </div>
  );
}

// ───────────────────────────── 서비스 카드 서브 컴포넌트 ─────────────────────────────
function ServiceCardItem({
  service,
  isDisabled,
}: {
  service: ServiceCard;
  isDisabled?: boolean;
}) {
  const handleSSOClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isDisabled) return;

    if (service.isExternal) {
      const serviceId = getSSOServiceId(service.href);
      if (!serviceId) {
        window.open(service.href, "_blank");
        return;
      }
      try {
        const ssoUrl = await generateSSOUrl(service.href, serviceId);
        window.open(ssoUrl, "_blank");
      } catch (error) {
        console.error("SSO URL 생성 실패:", error);
        window.open(service.href, "_blank");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div
        onClick={handleSSOClick}
        className={cn(
          "group relative flex flex-col rounded-2xl overflow-hidden",
          "bg-white border border-gray-100",
          "transition-all duration-300",
          isDisabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        )}
      >
        {isDisabled && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5">
            <span className="px-3 py-1 bg-gray-800 text-white text-xs font-medium rounded-full">
              곧 오픈
            </span>
          </div>
        )}

        {/* 카드 헤더 */}
        <div
          className={cn(
            "relative px-5 py-5 text-white bg-gradient-to-r",
            service.gradient
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold">{service.title}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              {service.icon}
            </div>
          </div>
          <p className="mt-2 text-white/90 text-sm line-clamp-2">
            {service.description}
          </p>
        </div>

        {/* 카드 바디 */}
        <div className="px-5 py-4 flex-1">
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: service.accentColor }}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* 카드 푸터 */}
        <div className="px-5 py-3 border-t border-gray-100">
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              isDisabled ? "text-gray-400" : service.color,
              !isDisabled && "group-hover:gap-3 transition-all"
            )}
          >
            {isDisabled ? "곧 오픈" : "바로가기"}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 호버 시 Border Beam 효과 */}
        {!isDisabled && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <BorderBeam
              size={80}
              duration={5}
              colorFrom={service.accentColor}
              colorTo="#6366f1"
              borderWidth={2}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
// ───────────────────────────── 상단 네비게이션 컴포넌트 ─────────────────────────────
function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { clearTokens } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: USER_API.fetchCurrentUserAPI,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IUser 타입 불일치(role vs role_type, profileImage 부재)로 인해 any로 캐스팅하여 처리
  const userAny = user as any;
  const isOfficer = userAny?.role === "officer" || userAny?.role_type === "officer";
  const handleLogoutClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutFetch(refreshToken);
      }
    } catch (error) {
      console.warn('Logout API failed:', error);
    }
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    });
    useAuthStore.persist.clearStorage();
    useTokenStore.persist.clearStorage();
    localStorage.clear();
    sessionStorage.clear();
    clearTokens();
    clearTokenManager();
    useTokenStore.getState().clearTokens();
    queryClient.clear();
    window.location.href = '/auth/login';
  };



  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <img src="/images/geobuk-ssam.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className={cn("font-bold text-xl", isScrolled ? "text-gray-900" : "text-white")}>
            Geobuk School
          </span>
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8">
          <NavItem title="성적 관리용 앱" isScrolled={isScrolled}>
            <DropdownItem href={MYSANGGIBU_URL}>My 생기부</DropdownItem>
            <DropdownItem href={MYEXAM_URL}>Exam Hub</DropdownItem>
          </NavItem>

          <NavItem title="학습용 앱" isScrolled={isScrolled}>
            <DropdownItem href={STUDYPLANNER_URL}>Study Planner</DropdownItem>
            <DropdownItem href={TUTORBOARD_URL}>Tutor Board</DropdownItem>
            <DropdownItem href={STUDYARENA_URL}>Study Arena</DropdownItem>
          </NavItem>

          <NavItem title="입시 예측 앱" isScrolled={isScrolled}>
            <DropdownItem href={SUSI_URL}>수시 예측</DropdownItem>
            <DropdownItem href={JUNGSI_URL}>정시 예측</DropdownItem>
          </NavItem>

          <NavItem title="사용자별 앱" isScrolled={isScrolled}>
            <DropdownItem href={TEACHERADMIN_URL}>Teacher Admin</DropdownItem>
            <DropdownItem href={PARENTADMIN_URL}>Parent Admin</DropdownItem>
          </NavItem>
        </nav>

        {/* 우측 아이콘 메뉴 (결제, 알림, 계정연동, 로그인/프로필) */}
        <div className="hidden md:flex items-center gap-2">
          {/* 이용권 구매 */}
          <Link
            to="/products"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), isScrolled ? "text-blue-600 hover:bg-blue-50" : "text-white/90 hover:bg-white/10 hover:text-white")}
            title="이용권 구매"
          >
            <WonCircle className="h-6 w-6" />
          </Link>
          {/* 알림 */}
          <Link
            to="/notifications"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative", isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/10 hover:text-white")}
            title="알림 설정"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Link>
          {/* 계정연동 */}
          <Link
            to="/account-linkage"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/10 hover:text-white")}
            title="계정연동"
          >
            <Users className="h-5 w-5" />
          </Link>

          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className={cn("gap-2", isScrolled ? "text-gray-900" : "text-white hover:bg-white/10 hover:text-white")}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAny?.profileImage} />
                    <AvatarFallback>{userAny?.nickname?.[0]}</AvatarFallback>
                  </Avatar>
                  <span>{userAny?.nickname} 님</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="space-y-1">
                  <Link to="/users/profile" className="flex h-9 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100">마이 페이지</Link>
                  <Link to="/users/payment" className="flex h-9 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100">결제내역</Link>
                  {isOfficer && <Link to="/officer/apply" className="flex h-9 w-full items-center rounded-md px-2 text-sm hover:bg-gray-100">평가자 전용 페이지</Link>}
                  <Separator className="my-1" />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="flex h-9 w-full items-center justify-start rounded-md px-2 text-sm font-normal text-red-500 hover:bg-red-50 hover:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" /> 로그아웃
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>로그아웃</DialogTitle>
                        <DialogDescription>정말 로그아웃 하시겠습니까?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline">취소</Button></DialogClose>
                        <Button onClick={handleLogoutClick}>확인</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Link to="/auth/login" className={cn(buttonVariants({ size: "sm" }), "rounded-full bg-blue-600 hover:bg-blue-700 text-white ml-2")}>
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({
  title,
  children,
  isScrolled,
}: {
  title: string;
  children: React.ReactNode;
  isScrolled: boolean;
}) {
  return (
    <div className="relative group cursor-pointer py-2">
      <span
        className={cn(
          "font-medium transition-colors flex items-center gap-1",
          isScrolled ? "text-gray-700 hover:text-blue-600" : "text-white/90 hover:text-white"
        )}
      >
        {title}
        <ChevronDown className="w-4 h-4" />
      </span>

      {/* 드롭다운 메뉴 */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[160px] flex flex-col gap-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function DropdownItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors whitespace-nowrap"
    >
      {children}
    </a>
  );
}
