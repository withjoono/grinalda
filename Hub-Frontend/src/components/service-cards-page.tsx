import { cn } from "@/lib/utils";
import React from "react";
import { generateSSOUrl, getSSOServiceId } from "@/lib/utils/sso-helper";
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
  X,
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

// ───────────────────────────── 서비스 데이터 (토스 스타일 색상) ─────────────────────────────
interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;       // CSS HEX for icon bg
  features: string[];
  disabled?: boolean;
  isExternal?: boolean;
  allowedRoles?: Array<'student' | 'teacher' | 'parent'>;
}

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  services: ServiceCard[];
  icon: React.ReactNode;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "grade-management",
    title: "성적관리 앱",
    description: "내신, 비교과, 모의고사 성적을 체계적으로 관리하세요",
    icon: <BarChart3 className="w-5 h-5" />,
    services: [
      {
        id: "mysanggibu",
        title: "My 생기부",
        description: "내신·비교과 관리 앱",
        icon: <FileText className="w-5 h-5" />,
        href: MYSANGGIBU_URL,
        color: "#007c77",
        features: ["생기부 항목별 체계적 관리", "AI 기반 생기부 분석", "대학별 유불리 평가"],
        isExternal: true,
      },
      {
        id: "mock-exam",
        title: "Exam Hub",
        description: "모의고사 성적·분석·오답 관리 앱",
        icon: <BarChart3 className="w-5 h-5" />,
        href: MYEXAM_URL,
        color: "#4c1a57",
        features: ["학원시험/내신/모의고사 통합", "성적 추이 분석", "오답 관리"],
        isExternal: true,
      },
    ],
  },
  {
    id: "learning",
    title: "학습관리 앱",
    description: "학습 계획과 경쟁을 통한 효율적인 학습을 도와요",
    icon: <BookOpen className="w-5 h-5" />,
    services: [
      {
        id: "planner",
        title: "Study Planner",
        description: "수험생 전문 학습 플래너",
        icon: <ClipboardList className="w-5 h-5" />,
        href: STUDYPLANNER_URL,
        color: "#3b28cc",
        features: ["장기계획·주간 루틴 자동 생성", "교과서/참고서 분량 자동 생성"],
        isExternal: true,
      },
      {
        id: "class-status",
        title: "Tutor Board",
        description: "수업 현황 관리 앱",
        icon: <BookOpen className="w-5 h-5" />,
        href: TUTORBOARD_URL,
        color: "#230007",
        features: ["수업 계획·진도 관리", "과제/테스트 현황"],
        isExternal: true,
      },
      {
        id: "studyarena",
        title: "Study Arena",
        description: "학습 경쟁으로 동기 부여",
        icon: <Swords className="w-5 h-5" />,
        href: STUDYARENA_URL,
        color: "#a40606",
        features: ["매일 학습 성과 비교", "클래스별 실시간 랭킹"],
        isExternal: true,
      },
    ],
  },
  {
    id: "prediction",
    title: "입시예측 앱",
    description: "AI 기반 수시·정시 예측 분석으로 합격을 앞당기세요",
    icon: <GraduationCap className="w-5 h-5" />,
    services: [
      {
        id: "susi-2027",
        title: "수시 예측 분석",
        description: "AI 사정관의 생기부 평가 및 대학별 유불리 분석",
        icon: <GraduationCap className="w-5 h-5" />,
        href: SUSI_URL,
        color: "#3e5622",
        features: ["AI 사정관 생기부 평가", "대학별 유불리 (특허)", "무료 수시 모의지원"],
        isExternal: true,
      },
      {
        id: "jungsi",
        title: "정시 예측 분석",
        description: "초격차 정시 예측 서비스",
        icon: <Calendar className="w-5 h-5" />,
        href: JUNGSI_URL,
        color: "#f97316",
        features: ["대학별 유불리 (특허)", "모의지원 기반 정시 시뮬레이션", "계정연동 선생님 상담"],
        isExternal: true,
      },
    ],
  },
  {
    id: "user-specific",
    title: "사용자별 앱",
    description: "선생님과 학부모를 위한 전용 앱",
    icon: <Users className="w-5 h-5" />,
    services: [
      {
        id: "teacher-admin",
        title: "선생님용 앱",
        description: "선생님을 위한 학생·수업 관리",
        icon: <Users className="w-5 h-5" />,
        href: TEACHERADMIN_URL,
        color: "#3f8efc",
        features: ["학생 관리", "수업 관리", "학습 현황 모니터링"],
        isExternal: true,
      },
      {
        id: "parent-admin",
        title: "학부모용 앱",
        description: "학부모를 위한 자녀 학습 현황",
        icon: <School className="w-5 h-5" />,
        href: PARENTADMIN_URL,
        color: "#d946ef",
        features: ["자녀 학습 현황", "수업 알림", "성적 리포트"],
        isExternal: true,
      },
    ],
  },
];

// ───────────────────────────── 역할 기반 필터링 ─────────────────────────────
function getFilteredCategories(memberType?: 'student' | 'teacher' | 'parent'): ServiceCategory[] {
  const role = memberType || 'student';
  return serviceCategories
    .map((cat) => ({
      ...cat,
      services: cat.services.filter((s) => {
        const roles = s.allowedRoles || ['student'];
        return roles.includes(role);
      }),
    }))
    .filter((cat) => cat.services.length > 0);
}

// ═══════════════════════════════════════════════════════════════
// 메인 컴포넌트 — 토스 스타일
// ═══════════════════════════════════════════════════════════════
export function ServiceCardsPage() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: USER_API.fetchCurrentUserAPI,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const userAny = user as any;
  const memberType = userAny?.member_type as 'student' | 'teacher' | 'parent' | undefined;
  const filteredCategories = React.useMemo(() => getFilteredCategories(memberType), [memberType]);

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
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

      {/* ═══════ 소개 배너 ═══════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '48px 24px 0',
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: 20,
          padding: '24px 32px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          textAlign: 'left',
        }}>
          <img
            src="/images/turtle-teacher.png"
            alt="거북쌤"
            style={{ width: 64, height: 64, objectFit: 'contain' }}
          />
          <div>
            <p style={{
              fontSize: 17,
              fontWeight: 500,
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.95)',
              margin: 0,
            }}>
              거북스쿨 앱들은 각각 독립적인 앱이지만,<br />
              서로 연계될때, 더 큰 시너지를 냅니다.
            </p>
            <p style={{
              fontSize: 15,
              fontWeight: 600,
              marginTop: 6,
              color: '#93c5fd',
              letterSpacing: '-0.01em',
              margin: '6px 0 0 0',
            }}>
              한번의 생기부 업로드로 여러가지 서비스를 받으세요
            </p>
          </div>
        </div>
      </motion.div>

      {/* ═══════ Service Grid — 토스 스타일 ═══════ */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>
        {filteredCategories.map((category, ci) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: ci * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            style={{ marginBottom: 56 }}
          >
            {/* 카테고리 헤더 */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--color-text)',
                letterSpacing: '-0.02em',
                marginBottom: 4,
              }}>{category.title}</h2>
              <p style={{
                fontSize: 14,
                color: 'var(--color-text-tertiary)',
              }}>{category.description}</p>
            </div>

            {/* 카드 그리드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}>
              {category.services.map((service) => (
                <ServiceCardItem key={service.id} service={service} />
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

// ═══════════════════════════════════════════════════════════════
// 서비스 카드 — 토스 스타일 (플랫, 미니멀)
// ═══════════════════════════════════════════════════════════════
function ServiceCardItem({ service }: { service: ServiceCard }) {
  const handleSSOClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (service.disabled) return;

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
    <div
      onClick={handleSSOClick}
      style={{
        background: 'var(--color-bg-elevated)',
        borderRadius: 20,
        padding: 24,
        border: '1px solid var(--color-border-light)',
        cursor: service.disabled ? 'not-allowed' : 'pointer',
        opacity: service.disabled ? 0.5 : 1,
        transition: 'all 250ms ease',
        position: 'relative',
      }}
      className="hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      {/* 아이콘 + 타이틀 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: service.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0,
        }}>
          {service.icon}
        </div>
        <div>
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '-0.01em',
          }}>{service.title}</h3>
          <p style={{
            fontSize: 13,
            color: 'var(--color-text-tertiary)',
            marginTop: 2,
          }}>{service.description}</p>
        </div>
      </div>

      {/* 기능 리스트 */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {service.features.map((feature, idx) => (
          <li
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              padding: '4px 0',
            }}
          >
            <span style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: service.color,
              flexShrink: 0,
              opacity: 0.6,
            }} />
            {feature}
          </li>
        ))}
      </ul>

      {/* 바로가기 링크 */}
      {!service.disabled && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 16,
          fontSize: 13,
          fontWeight: 600,
          color: service.color,
        }}>
          바로가기 <ArrowRight style={{ width: 14, height: 14 }} />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 상단 네비게이션 — 토스 스타일 (스크롤 반응 제거, 클린 흰색)
// ═══════════════════════════════════════════════════════════════
function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { clearTokens } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: USER_API.fetchCurrentUserAPI,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const userAny = user as any;
  const memberType = userAny?.member_type as 'student' | 'teacher' | 'parent' | undefined;
  const isOfficer = userAny?.role === "officer" || userAny?.role_type === "officer";

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoutClick = async (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await logoutFetch(refreshToken);
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        transition: 'all 200ms ease',
        background: isScrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--color-border-light)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* 로고 */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/images/geobuk-ssam.png" alt="Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <span style={{
            fontWeight: 700,
            fontSize: 17,
            color: isScrolled ? 'var(--color-primary)' : '#fff',
            letterSpacing: '-0.02em',
          }}>거북스쿨</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 4 }}>
          <NavItem title="성적관리 앱" isScrolled={isScrolled}>
            <DropdownItem href={MYSANGGIBU_URL}>My 생기부</DropdownItem>
            <DropdownItem href={MYEXAM_URL}>Exam Hub</DropdownItem>
          </NavItem>
          <NavItem title="학습관리 앱" isScrolled={isScrolled}>
            <DropdownItem href={STUDYPLANNER_URL}>Study Planner</DropdownItem>
            <DropdownItem href={TUTORBOARD_URL}>Tutor Board</DropdownItem>
            <DropdownItem href={STUDYARENA_URL}>Study Arena</DropdownItem>
          </NavItem>
          <NavItem title="입시예측 앱" isScrolled={isScrolled}>
            <DropdownItem href={SUSI_URL}>수시 예측</DropdownItem>
            <DropdownItem href={JUNGSI_URL}>정시 예측</DropdownItem>
          </NavItem>
          <NavItem title="사용자별 앱" isScrolled={isScrolled}>
            <DropdownItem href={TEACHERADMIN_URL}>선생님용 앱</DropdownItem>
            <DropdownItem href={PARENTADMIN_URL}>학부모용 앱</DropdownItem>
          </NavItem>
          <Link
            to="/apps"
            style={{
              padding: '8px 14px',
              fontSize: 14,
              fontWeight: 600,
              color: isScrolled ? '#6b7280' : 'rgba(255,255,255,0.85)',
              textDecoration: 'none',
              borderRadius: 8,
              transition: 'all 200ms ease',
            }}
            className={isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}
          >
            앱 소개관
          </Link>
        </nav>

        {/* 우측 액션 */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 4 }}>
          <Link
            to="/products"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/10")}
            title="이용권 구매"
          >
            <WonCircle className="h-5 w-5" />
          </Link>
          <Link
            to="/notifications"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative", isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/10")}
            title="알림"
          >
            <Bell className="h-5 w-5" />
          </Link>
          <Link
            to="/account-linkage"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white/90 hover:bg-white/10")}
            title="계정연동"
          >
            <Users className="h-5 w-5" />
          </Link>

          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className={cn("gap-2 ml-1", isScrolled ? "text-gray-900" : "text-white hover:bg-white/10 hover:text-white")}>
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={userAny?.profileImage} />
                    <AvatarFallback style={{ fontSize: 12 }}>{userAny?.nickname?.[0]}</AvatarFallback>
                  </Avatar>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{userAny?.nickname}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-2" align="end">
                <div className="space-y-0.5">
                  <Link to="/users/profile" className="flex h-9 w-full items-center rounded-lg px-3 text-sm hover:bg-gray-50 transition-colors">마이 페이지</Link>
                  <Link to="/users/payment" className="flex h-9 w-full items-center rounded-lg px-3 text-sm hover:bg-gray-50 transition-colors">결제내역</Link>
                  {isOfficer && <Link to="/officer/apply" className="flex h-9 w-full items-center rounded-lg px-3 text-sm hover:bg-gray-50 transition-colors">평가자 전용</Link>}
                  <Separator className="my-1" />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="flex h-9 w-full items-center justify-start rounded-lg px-3 text-sm font-normal text-red-500 hover:bg-red-50">
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
            <Link
              to="/auth/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 36,
                padding: '0 20px',
                borderRadius: 9999,
                background: isScrolled ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                border: isScrolled ? 'none' : '1px solid rgba(255,255,255,0.3)',
                transition: 'all 200ms ease',
                marginLeft: 8,
              }}
            >
              로그인
            </Link>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: isScrolled ? 'var(--color-text)' : '#fff',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 56,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fff',
            padding: 24,
            overflowY: 'auto',
            zIndex: 49,
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <MobileNavSection title="성적관리 앱">
              <MobileNavLink href={MYSANGGIBU_URL} onClick={() => setMobileOpen(false)}>My 생기부</MobileNavLink>
              <MobileNavLink href={MYEXAM_URL} onClick={() => setMobileOpen(false)}>Exam Hub</MobileNavLink>
            </MobileNavSection>
            <MobileNavSection title="학습관리 앱">
              <MobileNavLink href={STUDYPLANNER_URL} onClick={() => setMobileOpen(false)}>Study Planner</MobileNavLink>
              <MobileNavLink href={TUTORBOARD_URL} onClick={() => setMobileOpen(false)}>Tutor Board</MobileNavLink>
              <MobileNavLink href={STUDYARENA_URL} onClick={() => setMobileOpen(false)}>Study Arena</MobileNavLink>
            </MobileNavSection>
            <MobileNavSection title="입시예측 앱">
              <MobileNavLink href={SUSI_URL} onClick={() => setMobileOpen(false)}>수시 예측</MobileNavLink>
              <MobileNavLink href={JUNGSI_URL} onClick={() => setMobileOpen(false)}>정시 예측</MobileNavLink>
            </MobileNavSection>
            <div style={{ borderTop: '1px solid var(--color-border-light)', margin: '8px 0', paddingTop: 8 }}>
              <MobileNavLink href="/apps" onClick={() => setMobileOpen(false)}>앱 소개관</MobileNavLink>
              <MobileNavLink href="/products" onClick={() => setMobileOpen(false)}>이용권 구매</MobileNavLink>
              <MobileNavLink href="/notifications" onClick={() => setMobileOpen(false)}>알림 설정</MobileNavLink>
              <MobileNavLink href="/account-linkage" onClick={() => setMobileOpen(false)}>계정연동</MobileNavLink>
            </div>
            {user ? (
              <div style={{ borderTop: '1px solid var(--color-border-light)', margin: '8px 0', paddingTop: 8 }}>
                <MobileNavLink href="/users/profile" onClick={() => setMobileOpen(false)}>마이 페이지</MobileNavLink>
                <MobileNavLink href="/users/payment" onClick={() => setMobileOpen(false)}>결제내역</MobileNavLink>
                <button
                  onClick={() => handleLogoutClick()}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'none',
                    fontSize: 15,
                    color: 'var(--color-error)',
                    cursor: 'pointer',
                  }}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginTop: 8,
                }}
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

// ───────────────────────────── 토스 스타일 Nav 서브 컴포넌트 ─────────────────────────────
function NavItem({ title, children, isScrolled }: { title: string; children: React.ReactNode; isScrolled: boolean }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', cursor: 'pointer', padding: '8px 0' }}>
      <span
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 14,
          fontWeight: 500,
          color: isScrolled ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.9)',
          padding: '6px 12px',
          borderRadius: 8,
          transition: 'all 150ms ease',
          background: open ? (isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)') : 'transparent',
        }}
      >
        {title}
        <ChevronDown className="w-3.5 h-3.5" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }} />
      </span>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            paddingTop: 8,
            zIndex: 50,
          }}
        >
          <div style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            border: '1px solid var(--color-border-light)',
            padding: 6,
            minWidth: 180,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownItem({ href, children }: { href: string; children: React.ReactNode }) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const serviceId = getSSOServiceId(href);
    if (!serviceId) {
      window.open(href, '_blank');
      return;
    }
    try {
      const ssoUrl = await generateSSOUrl(href, serviceId);
      window.open(ssoUrl, '_blank');
    } catch {
      window.open(href, '_blank');
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{
        display: 'block',
        padding: '10px 14px',
        fontSize: 14,
        color: 'var(--color-text-secondary)',
        textDecoration: 'none',
        borderRadius: 8,
        transition: 'all 150ms ease',
        whiteSpace: 'nowrap',
      }}
      className="hover:bg-gray-50 hover:text-gray-900"
    >
      {children}
    </a>
  );
}

function MobileNavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-tertiary)', padding: '4px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        display: 'block',
        padding: '10px 12px',
        fontSize: 15,
        color: 'var(--color-text)',
        textDecoration: 'none',
        borderRadius: 8,
        transition: 'background 150ms ease',
      }}
      className="hover:bg-gray-50"
    >
      {children}
    </a>
  );
}
